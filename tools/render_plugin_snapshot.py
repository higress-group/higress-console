#!/usr/bin/env python3
# Copyright 2026 alibaba
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Project reviewed Console plugin resources from immutable Higress inputs."""
import argparse
import hashlib
import json
import pathlib
import re
import sys


HIGRESS_REPOSITORY = "higress-group/higress"
ALLOWED_REPOSITORIES = {HIGRESS_REPOSITORY, "higress-group/higress-console"}
ALLOWED_TARGETS = {"spec.yaml", "README.md", "README_EN.md", "icon.png"}
REQUIRED_TARGETS = {"spec.yaml", "README.md", "README_EN.md"}
COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")
SHA_RE = re.compile(r"^[0-9a-f]{64}$")
SAFE_ID_RE = re.compile(r"^[a-z0-9]+(?:[a-z0-9._-]*[a-z0-9])?$")
ORIGINAL_CONSOLE_COMMIT = "36aa9c67fb0057164dab9b1fe687b38fe5b8a022"
ORIGINAL_IMAGE_DIGEST = "sha256:c8cb47ad0a550e58df4cfee57f2f358eb0b1635a0812c77e04388dfb17bbebb6"


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def sha256(raw):
    return hashlib.sha256(raw).hexdigest()


def safe_relative(path):
    if not isinstance(path, str) or not path or "\\" in path:
        return False
    value = pathlib.PurePosixPath(path)
    return not value.is_absolute() and path == str(value) and ".." not in value.parts and "." not in value.parts


def replace_version(spec, version):
    updated, count = re.subn(r"(?m)^(  version:)\s*[^\n]+$", r"\1 " + version, spec, count=1)
    if count != 1:
        raise ValueError("missing unique info.version")
    return updated


def validate_recovery_manifest_contract(manifest):
    if (manifest.get("schemaVersion") != 1 or manifest.get("gatewayVersion") != "2.2.4" or
            manifest.get("imageRepository") != "higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/console" or
            manifest.get("originalConsoleCommit") != ORIGINAL_CONSOLE_COMMIT or
            manifest.get("originalImageDigest") != ORIGINAL_IMAGE_DIGEST or
            manifest.get("requiredSourceBranch") != "main"):
        raise ValueError("recovery manifest is restricted to the fixed original higress/console:2.2.4 image")


def validate_spec(spec, resource):
    if len(re.findall(r"(?m)^  name:\s*" + re.escape(resource) + r"\s*$", spec)) != 1:
        raise ValueError(resource + " reviewed spec identity mismatch")
    if len(re.findall(r"(?m)^  version:\s*\S+\s*$", spec)) != 1:
        raise ValueError(resource + " reviewed spec version is missing or ambiguous")
    if "openAPIV3Schema:" not in spec or not re.search(r"(?m)^      type:\s*object\s*$", spec):
        raise ValueError(resource + " reviewed spec lacks an object configuration schema")


def render_bundle_bytes(raw, target, resource, version):
    if target == "spec.yaml":
        text = raw.decode("utf-8")
        validate_spec(text, resource)
        return replace_version(text, version).encode("utf-8")
    if target in {"README.md", "README_EN.md"}:
        # Console keeps generated classpath resources diff-clean even when an
        # immutable reviewed source document contains trailing whitespace.
        text = raw.decode("utf-8")
        return ("\n".join(line.rstrip() for line in text.splitlines()).rstrip("\n") + "\n").encode("utf-8")
    return raw


def source_commit(bundle, higress_commit):
    repository = bundle.get("repository")
    if repository not in ALLOWED_REPOSITORIES:
        raise ValueError("unsupported marketplace source repository")
    commit = bundle.get("sourceCommit")
    if repository == HIGRESS_REPOSITORY:
        if commit:
            raise ValueError("Higress marketplace source must use the exact dispatch commit")
        commit = higress_commit
    if not COMMIT_RE.fullmatch(commit or ""):
        raise ValueError("marketplace source commit must be immutable")
    return repository, commit


def source_root(bundle_cache, repository, commit):
    if bundle_cache is None:
        raise ValueError("marketplace bundle cache is required")
    root = bundle_cache / repository.replace("/", "__") / commit
    if not root.is_dir():
        raise ValueError("marketplace source cache is missing for " + repository + "@" + commit)
    return root


def reviewed_source_path(root, source):
    """Resolve one reviewed file without following any bundle-local symlink."""
    if root.is_symlink():
        raise ValueError("marketplace source root must not be a symlink")
    try:
        exact_root = root.resolve(strict=True)
    except OSError as error:
        raise ValueError("marketplace source root is unavailable") from error
    candidate = root
    for part in pathlib.PurePosixPath(source).parts:
        candidate = candidate / part
        if candidate.is_symlink():
            raise ValueError("marketplace source path must not contain symlinks: " + source)
    try:
        resolved = candidate.resolve(strict=True)
        resolved.relative_to(exact_root)
    except (OSError, ValueError) as error:
        raise ValueError("marketplace source path escapes its exact bundle root: " + source) from error
    if not resolved.is_file():
        raise ValueError("marketplace source file is missing: " + source)
    return resolved


def bundle_sources(document, higress_commit):
    result = set()
    for plugin in document.get("plugins", []):
        mapping = plugin.get("consumers", {}).get("console") or plugin.get("console")
        if not mapping:
            continue
        bundle = mapping.get("marketplace")
        if not bundle:
            raise ValueError(plugin.get("logicalId", "plugin") + " lacks reviewed marketplace bundle")
        result.add(source_commit(bundle, higress_commit))
    return sorted(result)


def validate_and_copy_bundle(destination, mapping, version, bundle_cache, higress_commit):
    bundle = mapping.get("marketplace")
    if not bundle:
        raise ValueError(mapping.get("resourceDir", "plugin") + " lacks reviewed marketplace bundle")
    repository, commit = source_commit(bundle, higress_commit)
    root = source_root(bundle_cache, repository, commit)
    files = bundle.get("files")
    if not isinstance(files, list) or not files:
        raise ValueError("marketplace bundle has no files")
    seen = set()
    copied = []
    for item in files:
        source = item.get("sourcePath")
        target = item.get("targetPath")
        expected = item.get("sha256")
        if not safe_relative(source) or target not in ALLOWED_TARGETS or target in seen or not SHA_RE.fullmatch(expected or ""):
            raise ValueError("unsafe, duplicate, or malformed marketplace bundle file")
        seen.add(target)
        source_path = reviewed_source_path(root, source)
        raw = source_path.read_bytes()
        if sha256(raw) != expected:
            raise ValueError("marketplace source hash mismatch: " + source)
        raw = render_bundle_bytes(raw, target, mapping["resourceDir"], version)
        (destination / target).write_bytes(raw)
        copied.append({"sourcePath": source, "targetPath": target, "sourceSha256": expected,
                       "destinationSha256": sha256(raw)})
    missing = REQUIRED_TARGETS - seen
    if missing:
        raise ValueError("marketplace bundle lacks required files: " + ", ".join(sorted(missing)))
    return {"repository": repository, "sourceCommit": commit, "files": copied}


def upsert_property(properties, key, replacement):
    pattern = re.compile(r"(?m)^" + re.escape(key) + r"=.+$")
    updated, count = pattern.subn(replacement, properties, count=1)
    if count:
        return updated
    if properties and not properties.endswith("\n"):
        properties += "\n"
    return properties + key + "=" + replacement.split("=", 1)[1] + "\n"


def project_plugins(root, plugins, lock, bundle_cache, higress_commit):
    plugins_root = root / "backend/sdk/src/main/resources/plugins"
    properties_path = plugins_root / "plugins.properties"
    properties = properties_path.read_text(encoding="utf-8")
    mappings = []
    seen_keys, seen_resources = set(), set()
    for plugin in plugins:
        mapping = plugin.get("consumers", {}).get("console") or plugin.get("console")
        if not mapping:
            continue
        key, resource = mapping.get("propertyKey"), mapping.get("resourceDir")
        if (not SAFE_ID_RE.fullmatch(key or "") or not SAFE_ID_RE.fullmatch(resource or "") or
                mapping.get("urlForm") != "oci"):
            raise ValueError("missing or unsafe Console mapping")
        if key in seen_keys:
            raise ValueError("duplicate Console propertyKey: " + key)
        if resource in seen_resources:
            raise ValueError("duplicate Console resourceDir: " + resource)
        seen_keys.add(key)
        seen_resources.add(resource)
        mappings.append((plugin, mapping, key, resource))
    for plugin, mapping, key, resource in mappings:
        version, oci, digest = plugin.get("version"), plugin.get("ociRef"), plugin.get("digest")
        if (not version or not oci or not re.fullmatch(r"sha256:[0-9a-f]{64}", digest or "")):
            raise ValueError("missing or ambiguous Console mapping")
        if not oci.endswith(":" + version):
            raise ValueError(key + " OCI tag/version drift")
        destination = plugins_root / resource
        destination.mkdir(parents=True, exist_ok=True)
        marketplace = validate_and_copy_bundle(destination, mapping, version, bundle_cache, higress_commit)
        properties = upsert_property(properties, key, key + "=oci://" + oci)
        lock["plugins"][key] = {"resourceDir": resource, "version": version, "ociRef": "oci://" + oci,
                                "digest": digest, "marketplace": marketplace}
    properties_path.write_text(properties, encoding="utf-8")


def render(root, snapshot_path, expected_sha256, plugin_server_commit=None, plugin_server_image=None,
           base_sha=None, bundle_cache=None, higress_commit=None):
    raw = snapshot_path.read_bytes()
    if sha256(raw) != expected_sha256:
        raise ValueError("snapshot SHA-256 mismatch")
    snapshot = json.loads(raw)
    if snapshot.get("schemaVersion") != 1:
        raise ValueError("unsupported snapshot schema")
    if not COMMIT_RE.fullmatch(higress_commit or ""):
        raise ValueError("exact Higress bundle commit is required")
    lock = {"schemaVersion": 2, "snapshotSha256": expected_sha256, "sourceCommit": snapshot.get("sourceCommit"),
            "bundleHigressCommit": higress_commit, "pluginServerCommit": plugin_server_commit,
            "pluginServerImage": plugin_server_image, "baseSha": base_sha, "plugins": {}}
    project_plugins(root, snapshot.get("plugins", []), lock, bundle_cache, higress_commit)
    lock_path = root / "backend/sdk/src/main/resources/plugins/plugin-snapshot.lock.json"
    lock_path.write_text(json.dumps(lock, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def render_recovery(root, manifest_path, expected_sha256, bundle_cache, higress_commit):
    raw = manifest_path.read_bytes()
    if sha256(raw) != expected_sha256:
        raise ValueError("recovery manifest SHA-256 mismatch")
    manifest = json.loads(raw)
    validate_recovery_manifest_contract(manifest)
    lock_path = root / "backend/sdk/src/main/resources/plugins/plugin-snapshot.lock.json"
    lock = load(lock_path)
    if lock.get("snapshotSha256") != manifest.get("snapshotSha256"):
        raise ValueError("recovery manifest does not match the unchanged Console snapshot lock")
    lock["schemaVersion"] = 2
    lock["marketplaceRecovery"] = {
        "gatewayVersion": "2.2.4", "manifestSha256": expected_sha256,
        "higressCommit": higress_commit, "imageRepository": manifest["imageRepository"],
        "originalConsoleCommit": manifest["originalConsoleCommit"],
        "originalImageDigest": manifest["originalImageDigest"],
    }
    lock.setdefault("plugins", {})
    project_plugins(root, manifest.get("plugins", []), lock, bundle_cache, higress_commit)
    lock_path.write_text(json.dumps(lock, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def validate_recovery_source(root, manifest, bundle_cache, higress_commit):
    """Prove merged Console bytes match the reviewed recovery manifest without mutation."""
    validate_recovery_manifest_contract(manifest)
    plugins_root = root / "backend/sdk/src/main/resources/plugins"
    properties = (plugins_root / "plugins.properties").read_text(encoding="utf-8").splitlines()
    property_map = dict(line.split("=", 1) for line in properties if line and not line.startswith("#"))
    inventory = []
    mappings = []
    seen_keys, seen_resources = set(), set()
    for plugin in manifest.get("plugins", []):
        mapping = plugin.get("console") or {}
        key, resource = mapping.get("propertyKey"), mapping.get("resourceDir")
        if not SAFE_ID_RE.fullmatch(key or "") or not SAFE_ID_RE.fullmatch(resource or ""):
            raise ValueError("recovery contains an unsafe Console mapping")
        if key in seen_keys or resource in seen_resources:
            raise ValueError("recovery contains duplicate Console propertyKey or resourceDir")
        seen_keys.add(key)
        seen_resources.add(resource)
        mappings.append((plugin, mapping, key, resource))
    for plugin, mapping, key, resource in mappings:
        if property_map.get(key) != "oci://" + plugin.get("ociRef", ""):
            raise ValueError(key + " merged properties do not match recovery artifact")
        destination = plugins_root / resource
        bundle = mapping.get("marketplace")
        repository, commit = source_commit(bundle, higress_commit)
        source = source_root(bundle_cache, repository, commit)
        targets = set()
        for item in bundle.get("files", []):
            if not safe_relative(item.get("sourcePath")) or item.get("targetPath") not in ALLOWED_TARGETS:
                raise ValueError(key + " recovery bundle contains unsafe paths")
            raw = reviewed_source_path(source, item["sourcePath"]).read_bytes()
            if sha256(raw) != item.get("sha256"):
                raise ValueError(key + " recovery source hash mismatch")
            raw = render_bundle_bytes(raw, item["targetPath"], resource, plugin["version"])
            target = destination / item["targetPath"]
            if not target.is_file() or target.read_bytes() != raw:
                raise ValueError(key + " merged marketplace resource differs from reviewed source")
            targets.add(item["targetPath"])
        if not REQUIRED_TARGETS.issubset(targets):
            raise ValueError(key + " recovery bundle lacks required localized resources")
        inventory.append({"logicalId": plugin["logicalId"], "version": plugin["version"],
                          "digest": plugin["digest"], "resourceDir": resource})
    return sha256((json.dumps(inventory, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8"))


def validate_rendered(root):
    plugins_root = root / "backend/sdk/src/main/resources/plugins"
    lock = load(plugins_root / "plugin-snapshot.lock.json")
    properties = {}
    for line in (plugins_root / "plugins.properties").read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#"):
            key, value = line.split("=", 1)
            if key in properties:
                raise ValueError(key + " appears more than once in plugins.properties")
            properties[key] = value
    resources = set()
    for key, item in lock.get("plugins", {}).items():
        if properties.get(key) != item["ociRef"]:
            raise ValueError(key + " properties/lock OCI mismatch")
        if item["resourceDir"] in resources:
            raise ValueError("duplicate Console resourceDir in lock: " + item["resourceDir"])
        resources.add(item["resourceDir"])
        resource = plugins_root / item["resourceDir"]
        spec = resource / "spec.yaml"
        if not spec.is_file() or not re.search(r"(?m)^  version:\s*" + re.escape(item["version"]) + r"\s*$", spec.read_text(encoding="utf-8")):
            raise ValueError(key + " lock version is absent from its plugin spec")
        marketplace = item.get("marketplace")
        if marketplace:
            for file in marketplace.get("files", []):
                target = resource / file["targetPath"]
                if not target.is_file() or sha256(target.read_bytes()) != file["destinationSha256"]:
                    raise ValueError(key + " rendered marketplace file hash mismatch")
    return lock


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--snapshot")
    parser.add_argument("--recovery-manifest")
    parser.add_argument("--sha256", required=True)
    parser.add_argument("--higress-commit", required=True)
    parser.add_argument("--bundle-cache")
    parser.add_argument("--plugin-server-commit")
    parser.add_argument("--plugin-server-image")
    parser.add_argument("--base-sha")
    parser.add_argument("--print-bundle-sources", action="store_true")
    parser.add_argument("--validate-recovery-source", action="store_true")
    parser.add_argument("--validate-rendered", action="store_true")
    args = parser.parse_args()
    try:
        if bool(args.snapshot) == bool(args.recovery_manifest):
            raise ValueError("select exactly one snapshot or recovery manifest")
        document_path = pathlib.Path(args.snapshot or args.recovery_manifest)
        document = load(document_path)
        if sha256(document_path.read_bytes()) != args.sha256:
            raise ValueError("input document SHA-256 mismatch")
        if args.print_bundle_sources:
            for repository, commit in bundle_sources(document, args.higress_commit):
                print(repository + "\t" + commit)
            return 0
        root = pathlib.Path(args.root)
        cache = pathlib.Path(args.bundle_cache) if args.bundle_cache else None
        if args.validate_recovery_source:
            if not args.recovery_manifest:
                raise ValueError("recovery source validation requires --recovery-manifest")
            print(validate_recovery_source(root, document, cache, args.higress_commit))
            return 0
        if args.snapshot:
            render(root, document_path, args.sha256, args.plugin_server_commit, args.plugin_server_image,
                   args.base_sha, cache, args.higress_commit)
        else:
            render_recovery(root, document_path, args.sha256, cache, args.higress_commit)
        if args.validate_rendered:
            validate_rendered(root)
    except (OSError, ValueError, KeyError, json.JSONDecodeError, UnicodeDecodeError) as error:
        print("snapshot render failed: " + str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
