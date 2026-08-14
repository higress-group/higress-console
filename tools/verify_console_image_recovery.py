#!/usr/bin/env python3
# Copyright 2026 alibaba
# Licensed under the Apache License, Version 2.0.

"""Fail-closed contract checks for the one-time Console 2.2.4 image repair."""
import argparse
import json
import re
import sys


IMAGE_REPOSITORY = "higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/console"
ORIGINAL_CONSOLE_COMMIT = "36aa9c67fb0057164dab9b1fe687b38fe5b8a022"
ORIGINAL_IMAGE_DIGEST = "sha256:c8cb47ad0a550e58df4cfee57f2f358eb0b1635a0812c77e04388dfb17bbebb6"
DIGEST_RE = re.compile(r"^sha256:[0-9a-f]{64}$")
COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")
ATTESTATION_MEDIA_TYPE = "application/vnd.oci.image.manifest.v1+json"


def validate_platform_index(document):
    manifests = document.get("manifests")
    if not isinstance(manifests, list):
        raise ValueError("candidate is not an OCI image index")
    runnable, extras = [], []
    for descriptor in manifests:
        if not isinstance(descriptor, dict) or not DIGEST_RE.fullmatch(descriptor.get("digest", "")):
            raise ValueError("candidate index contains an invalid descriptor")
        platform = descriptor.get("platform") or {}
        if platform.get("os") == "linux" and platform.get("architecture") in {"amd64", "arm64"}:
            runnable.append(descriptor)
        else:
            extras.append(descriptor)
    platforms = sorted((item["platform"]["os"], item["platform"]["architecture"]) for item in runnable)
    if platforms != [("linux", "amd64"), ("linux", "arm64")]:
        raise ValueError("candidate requires exactly one linux/amd64 and one linux/arm64 manifest")
    runnable_digests = [item["digest"] for item in runnable]
    if len(set(runnable_digests)) != 2:
        raise ValueError("candidate runnable manifests must have distinct digests")
    if extras:
        if len(extras) != 2:
            raise ValueError("candidate index contains unsupported extra manifests")
        references = []
        for descriptor in extras:
            platform = descriptor.get("platform") or {}
            annotations = descriptor.get("annotations") or {}
            if (descriptor.get("mediaType") != ATTESTATION_MEDIA_TYPE or
                    platform.get("os") != "unknown" or platform.get("architecture") != "unknown" or
                    annotations.get("vnd.docker.reference.type") != "attestation-manifest" or
                    not DIGEST_RE.fullmatch(annotations.get("vnd.docker.reference.digest", ""))):
                raise ValueError("candidate index contains a non-attestation extra manifest")
            references.append(annotations["vnd.docker.reference.digest"])
        extra_digests = [descriptor["digest"] for descriptor in extras]
        if len(set(extra_digests)) != 2 or set(extra_digests) & set(runnable_digests):
            raise ValueError("candidate attestations must be distinct from each other and runnable manifests")
        if sorted(references) != sorted(runnable_digests):
            raise ValueError("candidate attestations must map one-to-one to runnable manifests")
    by_arch = {item["platform"]["architecture"]: item["digest"] for item in runnable}
    return [by_arch["amd64"], by_arch["arm64"]]


def validate(operation, version, image_repository, source_commit, higress_commit,
             manifest_original_console_commit, manifest_old_digest,
             expected_old_digest, expected_new_digest, current_digest,
             candidate_digest, source_is_merged):
    if operation not in {"build-candidate", "replace"}:
        raise ValueError("unsupported recovery operation")
    if version != "2.2.4" or image_repository != IMAGE_REPOSITORY:
        raise ValueError("recovery is restricted to higress/console:2.2.4")
    if not COMMIT_RE.fullmatch(source_commit or "") or not COMMIT_RE.fullmatch(higress_commit or ""):
        raise ValueError("exact lowercase source commits are required")
    if not source_is_merged:
        raise ValueError("Console recovery source must already be merged into main")
    if manifest_original_console_commit != ORIGINAL_CONSOLE_COMMIT:
        raise ValueError("recovery manifest does not bind the fixed original Console commit")
    if manifest_old_digest != ORIGINAL_IMAGE_DIGEST:
        raise ValueError("recovery manifest does not bind the fixed original image digest")
    for name, value in (("manifest old", manifest_old_digest), ("expected old", expected_old_digest),
                        ("current", current_digest)):
        if not DIGEST_RE.fullmatch(value or ""):
            raise ValueError(name + " digest is invalid")
    if expected_old_digest != manifest_old_digest:
        raise ValueError("operator expected-old digest differs from the fixed recovery manifest")
    if operation == "build-candidate":
        if expected_new_digest or candidate_digest:
            raise ValueError("candidate build must not pre-authorize a replacement digest")
        if current_digest != expected_old_digest:
            raise ValueError("stale current digest; candidate build refused")
        return "build"
    if not DIGEST_RE.fullmatch(expected_new_digest or "") or not DIGEST_RE.fullmatch(candidate_digest or ""):
        raise ValueError("replacement requires an exact candidate/new digest")
    if candidate_digest != expected_new_digest:
        raise ValueError("candidate digest differs from the explicitly approved new digest")
    if current_digest == expected_new_digest:
        return "already-replaced"
    if current_digest != expected_old_digest:
        raise ValueError("stale current digest; replacement refused")
    if expected_new_digest == expected_old_digest:
        raise ValueError("replacement digest must differ from the old digest")
    return "replace"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--index-file")
    parser.add_argument("--operation")
    parser.add_argument("--version")
    parser.add_argument("--image-repository")
    parser.add_argument("--source-commit")
    parser.add_argument("--higress-commit")
    parser.add_argument("--manifest-original-console-commit")
    parser.add_argument("--manifest-old-digest")
    parser.add_argument("--expected-old-digest")
    parser.add_argument("--expected-new-digest", default="")
    parser.add_argument("--current-digest")
    parser.add_argument("--candidate-digest", default="")
    parser.add_argument("--source-is-merged", choices=["true", "false"], required=True)
    args = parser.parse_args()
    try:
        if args.index_file:
            with open(args.index_file, encoding="utf-8") as file:
                for digest in validate_platform_index(json.load(file)):
                    print(digest)
            return 0
        mode = validate(args.operation, args.version, args.image_repository, args.source_commit,
                        args.higress_commit, args.manifest_original_console_commit, args.manifest_old_digest,
                        args.expected_old_digest, args.expected_new_digest,
                        args.current_digest, args.candidate_digest, args.source_is_merged == "true")
        print(json.dumps({"mode": mode}, sort_keys=True))
    except ValueError as error:
        print("Console image recovery rejected: " + str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
