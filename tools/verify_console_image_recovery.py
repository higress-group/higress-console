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
    parser.add_argument("--operation", required=True)
    parser.add_argument("--version", required=True)
    parser.add_argument("--image-repository", required=True)
    parser.add_argument("--source-commit", required=True)
    parser.add_argument("--higress-commit", required=True)
    parser.add_argument("--manifest-original-console-commit", required=True)
    parser.add_argument("--manifest-old-digest", required=True)
    parser.add_argument("--expected-old-digest", required=True)
    parser.add_argument("--expected-new-digest", default="")
    parser.add_argument("--current-digest", required=True)
    parser.add_argument("--candidate-digest", default="")
    parser.add_argument("--source-is-merged", choices=["true", "false"], required=True)
    args = parser.parse_args()
    try:
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
