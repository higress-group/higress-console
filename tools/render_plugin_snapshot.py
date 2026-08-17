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
import os
import pathlib
import re
import stat
import sys


HIGRESS_REPOSITORY = "higress-group/higress"
ALLOWED_REPOSITORIES = {HIGRESS_REPOSITORY, "higress-group/higress-console"}
ALLOWED_TARGETS = {"spec.yaml", "README.md", "README_EN.md", "icon.png"}
REQUIRED_TARGETS = {"spec.yaml", "README.md", "README_EN.md"}
COMMIT_RE = re.compile(r"^[0-9a-f]{40}$")
SHA_RE = re.compile(r"^[0-9a-f]{64}$")
DIGEST_RE = re.compile(r"^sha256:[0-9a-f]{64}$")
VERSION_RE = re.compile(r"^[0-9]+\.[0-9]+\.[0-9]+$")
SAFE_ID_RE = re.compile(r"^[a-z0-9]+(?:[a-z0-9._-]*[a-z0-9])?$")
CONSOLE_IMAGE_REPOSITORY = "higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/console"
PLUGIN_RESOURCE_PARTS = ("backend", "sdk", "src", "main", "resources", "plugins")
DIRECTORY_OPEN_FLAGS = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW


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


def validate_recovery_manifest_contract(manifest, expected_version=None):
    version = manifest.get("gatewayVersion")
    if manifest.get("schemaVersion") != 1:
        raise ValueError("unsupported recovery manifest schema")
    if not VERSION_RE.fullmatch(version or "") or (expected_version and version != expected_version):
        raise ValueError("recovery manifest gateway version is invalid or unexpected")
    if manifest.get("snapshotPath") != "plugins/release/snapshots/" + version + ".json":
        raise ValueError("recovery manifest snapshot path does not match its gateway version")
    if not SHA_RE.fullmatch(manifest.get("snapshotSha256", "")):
        raise ValueError("recovery manifest snapshot SHA-256 is invalid")
    if manifest.get("imageRepository") != CONSOLE_IMAGE_REPOSITORY:
        raise ValueError("recovery manifest targets an unsupported image repository")
    if not COMMIT_RE.fullmatch(manifest.get("originalConsoleCommit", "")):
        raise ValueError("recovery manifest original Console commit is invalid")
    if not DIGEST_RE.fullmatch(manifest.get("originalImageDigest", "")):
        raise ValueError("recovery manifest original image digest is invalid")
    if manifest.get("requiredSourceBranch") != "main":
        raise ValueError("recovery manifest must require the canonical main branch")
    if not isinstance(manifest.get("plugins"), list):
        raise ValueError("recovery manifest plugins must be a list")
    return version


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


class PluginResourceStore:
    """Access Console plugin resources without following repository-local symlinks."""

    def __init__(self, root):
        root = pathlib.Path(root)
        if root.is_symlink():
            raise ValueError("Console repository root must not be a symlink")
        try:
            self.exact_root = root.resolve(strict=True)
        except OSError as error:
            raise ValueError("Console repository root is unavailable") from error
        if not self.exact_root.is_dir():
            raise ValueError("Console repository root is not a directory")
        current_fd = os.open(self.exact_root, DIRECTORY_OPEN_FLAGS)
        try:
            current_path = self.exact_root
            for part in PLUGIN_RESOURCE_PARTS:
                self._require_directory(current_fd, part, "Console plugin resource path")
                next_fd = os.open(part, DIRECTORY_OPEN_FLAGS, dir_fd=current_fd)
                os.close(current_fd)
                current_fd = next_fd
                current_path = current_path / part
                self._prove_directory_fd(current_fd, current_path, "Console plugin resource path")
        except Exception:
            os.close(current_fd)
            raise
        self.plugins_root = self.exact_root.joinpath(*PLUGIN_RESOURCE_PARTS)
        self.plugins_fd = current_fd

    @staticmethod
    def _require_directory(parent_fd, name, description):
        info = os.stat(name, dir_fd=parent_fd, follow_symlinks=False)
        if stat.S_ISLNK(info.st_mode):
            raise ValueError(description + " must not contain symlinks: " + name)
        if not stat.S_ISDIR(info.st_mode):
            raise ValueError(description + " is not a directory: " + name)

    @staticmethod
    def _prove_directory_fd(directory_fd, expected, description):
        try:
            resolved = pathlib.Path("/proc/self/fd/" + str(directory_fd)).resolve(strict=True)
        except OSError as error:
            raise ValueError(description + " cannot be resolved") from error
        if resolved != expected:
            raise ValueError(description + " escaped its exact repository root")

    @staticmethod
    def _require_regular(parent_fd, name, description, missing_ok=False):
        try:
            info = os.stat(name, dir_fd=parent_fd, follow_symlinks=False)
        except FileNotFoundError:
            if missing_ok:
                return False
            raise ValueError(description + " is missing: " + name)
        if stat.S_ISLNK(info.st_mode):
            raise ValueError(description + " must not be a symlink: " + name)
        if not stat.S_ISREG(info.st_mode):
            raise ValueError(description + " is not a regular file: " + name)
        return True

    def close(self):
        if self.plugins_fd is not None:
            os.close(self.plugins_fd)
            self.plugins_fd = None

    def __enter__(self):
        return self

    def __exit__(self, _type, _value, _traceback):
        self.close()

    def preflight_file(self, name):
        self._require_regular(self.plugins_fd, name, "Console plugin metadata")

    def _open_regular(self, parent_fd, name, flags, description, missing_ok=False):
        self._require_regular(parent_fd, name, description, missing_ok=missing_ok)
        try:
            file_fd = os.open(name, flags | os.O_NOFOLLOW, 0o644, dir_fd=parent_fd)
        except OSError as error:
            raise ValueError(description + " could not be opened safely: " + name) from error
        if not stat.S_ISREG(os.fstat(file_fd).st_mode):
            os.close(file_fd)
            raise ValueError(description + " changed from a regular file: " + name)
        return file_fd

    def read_bytes(self, name):
        file_fd = self._open_regular(self.plugins_fd, name, os.O_RDONLY, "Console plugin metadata")
        with os.fdopen(file_fd, "rb") as file:
            return file.read()

    def read_text(self, name):
        return self.read_bytes(name).decode("utf-8")

    def write_bytes(self, name, raw):
        file_fd = self._open_regular(self.plugins_fd, name, os.O_WRONLY | os.O_TRUNC,
                                     "Console plugin metadata")
        with os.fdopen(file_fd, "wb") as file:
            file.write(raw)

    def write_text(self, name, value):
        self.write_bytes(name, value.encode("utf-8"))

    def _open_resource(self, resource, create=False):
        try:
            self._require_directory(self.plugins_fd, resource, "Console plugin resource directory")
        except FileNotFoundError:
            if not create:
                raise ValueError("Console plugin resource directory is missing: " + resource)
            os.mkdir(resource, dir_fd=self.plugins_fd)
            self._require_directory(self.plugins_fd, resource, "Console plugin resource directory")
        try:
            resource_fd = os.open(resource, DIRECTORY_OPEN_FLAGS, dir_fd=self.plugins_fd)
        except OSError as error:
            raise ValueError("Console plugin resource directory could not be opened safely: " + resource) from error
        try:
            self._prove_directory_fd(resource_fd, self.plugins_root / resource,
                                     "Console plugin resource directory")
        except Exception:
            os.close(resource_fd)
            raise
        return resource_fd

    def prepare_resource(self, resource):
        resource_fd = self._open_resource(resource, create=True)
        os.close(resource_fd)

    def preflight_resource_file(self, resource, target):
        resource_fd = self._open_resource(resource)
        try:
            self._require_regular(resource_fd, target, "Console plugin target", missing_ok=True)
        finally:
            os.close(resource_fd)

    def write_resource_bytes(self, resource, target, raw):
        resource_fd = self._open_resource(resource)
        try:
            file_fd = self._open_regular(resource_fd, target, os.O_WRONLY | os.O_CREAT | os.O_TRUNC,
                                         "Console plugin target", missing_ok=True)
            with os.fdopen(file_fd, "wb") as file:
                file.write(raw)
        finally:
            os.close(resource_fd)

    def read_resource_bytes(self, resource, target):
        resource_fd = self._open_resource(resource)
        try:
            file_fd = self._open_regular(resource_fd, target, os.O_RDONLY, "Console plugin target")
            with os.fdopen(file_fd, "rb") as file:
                return file.read()
        finally:
            os.close(resource_fd)


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


def validate_and_copy_bundle(store, mapping, version, bundle_cache, higress_commit):
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
    rendered = []
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
        rendered.append((target, raw))
        copied.append({"sourcePath": source, "targetPath": target, "sourceSha256": expected,
                       "destinationSha256": sha256(raw)})
    missing = REQUIRED_TARGETS - seen
    if missing:
        raise ValueError("marketplace bundle lacks required files: " + ", ".join(sorted(missing)))
    resource = mapping["resourceDir"]
    store.prepare_resource(resource)
    for target, _raw in rendered:
        store.preflight_resource_file(resource, target)
    for target, raw in rendered:
        store.write_resource_bytes(resource, target, raw)
    return {"repository": repository, "sourceCommit": commit, "files": copied}


def upsert_property(properties, key, replacement):
    pattern = re.compile(r"(?m)^" + re.escape(key) + r"=.+$")
    updated, count = pattern.subn(replacement, properties, count=1)
    if count:
        return updated
    if properties and not properties.endswith("\n"):
        properties += "\n"
    return properties + key + "=" + replacement.split("=", 1)[1] + "\n"


def project_plugins(store, plugins, lock, bundle_cache, higress_commit):
    properties = store.read_text("plugins.properties")
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
        marketplace = validate_and_copy_bundle(store, mapping, version, bundle_cache, higress_commit)
        properties = upsert_property(properties, key, key + "=oci://" + oci)
        lock["plugins"][key] = {"resourceDir": resource, "version": version, "ociRef": "oci://" + oci,
                                "digest": digest, "marketplace": marketplace}
    store.write_text("plugins.properties", properties)


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
    with PluginResourceStore(root) as store:
        store.preflight_file("plugins.properties")
        store.preflight_file("plugin-snapshot.lock.json")
        project_plugins(store, snapshot.get("plugins", []), lock, bundle_cache, higress_commit)
        store.write_text("plugin-snapshot.lock.json", json.dumps(lock, indent=2, sort_keys=True) + "\n")


def render_recovery(root, manifest_path, expected_sha256, bundle_cache, higress_commit):
    raw = manifest_path.read_bytes()
    if sha256(raw) != expected_sha256:
        raise ValueError("recovery manifest SHA-256 mismatch")
    manifest = json.loads(raw)
    version = validate_recovery_manifest_contract(manifest)
    with PluginResourceStore(root) as store:
        store.preflight_file("plugins.properties")
        store.preflight_file("plugin-snapshot.lock.json")
        lock = json.loads(store.read_text("plugin-snapshot.lock.json"))
        if lock.get("snapshotSha256") != manifest.get("snapshotSha256"):
            raise ValueError("recovery manifest does not match the unchanged Console snapshot lock")
        lock["schemaVersion"] = 2
        lock["marketplaceRecovery"] = {
            "gatewayVersion": version, "manifestSha256": expected_sha256,
            "higressCommit": higress_commit, "imageRepository": manifest["imageRepository"],
            "originalConsoleCommit": manifest["originalConsoleCommit"],
            "originalImageDigest": manifest["originalImageDigest"],
        }
        lock.setdefault("plugins", {})
        project_plugins(store, manifest.get("plugins", []), lock, bundle_cache, higress_commit)
        store.write_text("plugin-snapshot.lock.json", json.dumps(lock, indent=2, sort_keys=True) + "\n")


def validate_recovery_source(root, manifest, bundle_cache, higress_commit, expected_version=None):
    """Prove merged Console bytes match the reviewed recovery manifest without mutation."""
    validate_recovery_manifest_contract(manifest, expected_version)
    with PluginResourceStore(root) as store:
        lock = json.loads(store.read_text("plugin-snapshot.lock.json"))
        if lock.get("snapshotSha256") != manifest.get("snapshotSha256"):
            raise ValueError("recovery manifest does not match the merged Console snapshot lock")
        properties = store.read_text("plugins.properties").splitlines()
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
            if (not VERSION_RE.fullmatch(plugin.get("version", "")) or
                    not DIGEST_RE.fullmatch(plugin.get("digest", "")) or
                    not plugin.get("ociRef", "").endswith(":" + plugin.get("version", ""))):
                raise ValueError(key + " recovery plugin identity is malformed")
            if property_map.get(key) != "oci://" + plugin.get("ociRef", ""):
                raise ValueError(key + " merged properties do not match recovery artifact")
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
                if store.read_resource_bytes(resource, item["targetPath"]) != raw:
                    raise ValueError(key + " merged marketplace resource differs from reviewed source")
                targets.add(item["targetPath"])
            if not REQUIRED_TARGETS.issubset(targets):
                raise ValueError(key + " recovery bundle lacks required localized resources")
            inventory.append({"logicalId": plugin["logicalId"], "version": plugin["version"],
                              "digest": plugin["digest"], "resourceDir": resource})
    return sha256((json.dumps(inventory, sort_keys=True, separators=(",", ":")) + "\n").encode("utf-8"))


def validate_rendered(root):
    with PluginResourceStore(root) as store:
        lock = json.loads(store.read_text("plugin-snapshot.lock.json"))
        properties = {}
        for line in store.read_text("plugins.properties").splitlines():
            if line and not line.startswith("#"):
                key, value = line.split("=", 1)
                if key in properties:
                    raise ValueError(key + " appears more than once in plugins.properties")
                properties[key] = value
        resources = set()
        for key, item in lock.get("plugins", {}).items():
            resource = item.get("resourceDir")
            if not SAFE_ID_RE.fullmatch(resource or ""):
                raise ValueError(key + " lock resourceDir is unsafe")
            if properties.get(key) != item["ociRef"]:
                raise ValueError(key + " properties/lock OCI mismatch")
            if resource in resources:
                raise ValueError("duplicate Console resourceDir in lock: " + resource)
            resources.add(resource)
            spec = store.read_resource_bytes(resource, "spec.yaml").decode("utf-8")
            if not re.search(r"(?m)^  version:\s*" + re.escape(item["version"]) + r"\s*$", spec):
                raise ValueError(key + " lock version is absent from its plugin spec")
            marketplace = item.get("marketplace")
            if marketplace:
                for file in marketplace.get("files", []):
                    target = file.get("targetPath")
                    if target not in ALLOWED_TARGETS:
                        raise ValueError(key + " rendered marketplace target is unsafe")
                    if sha256(store.read_resource_bytes(resource, target)) != file["destinationSha256"]:
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
    parser.add_argument("--expected-version")
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
            print(validate_recovery_source(root, document, cache, args.higress_commit,
                                           args.expected_version))
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
