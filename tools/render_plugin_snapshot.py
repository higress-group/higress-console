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

"""Render only explicitly Console-managed plugin versions from a Higress snapshot."""
import argparse
import hashlib
import json
import pathlib
import re
import sys


def load(path):
    return json.loads(path.read_text(encoding="utf-8"))


def replace_version(spec, version):
    updated, count = re.subn(r"(?m)^(  version:)\s*[^\n]+$", r"\1 " + version, spec, count=1)
    if count != 1:
        raise ValueError("missing unique info.version")
    return updated


def render(root, snapshot_path, expected_sha256, plugin_server_commit=None, plugin_server_image=None, base_sha=None):
    raw = snapshot_path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != expected_sha256:
        raise ValueError("snapshot SHA-256 mismatch")
    snapshot = json.loads(raw)
    if snapshot.get("schemaVersion") != 1:
        raise ValueError("unsupported snapshot schema")
    properties_path = root / "backend/sdk/src/main/resources/plugins/plugins.properties"
    original_properties = properties_path.read_text(encoding="utf-8")
    properties = original_properties
    lock = {"schemaVersion": 1, "snapshotSha256": expected_sha256, "sourceCommit": snapshot.get("sourceCommit"),
            "pluginServerCommit": plugin_server_commit, "pluginServerImage": plugin_server_image, "baseSha": base_sha, "plugins": {}}
    seen = set()
    for plugin in snapshot.get("plugins", []):
        mapping = plugin.get("consumers", {}).get("console")
        if not mapping:
            continue
        key, resource = mapping.get("propertyKey"), mapping.get("resourceDir")
        version, oci, digest = plugin.get("version"), plugin.get("ociRef"), plugin.get("digest")
        if not key or not resource or not version or not oci or not digest or key in seen:
            raise ValueError("missing or ambiguous Console mapping")
        seen.add(key)
        if not oci.endswith(":" + version):
            raise ValueError(key + " OCI tag/version drift")
        pattern = re.compile(r"(?m)^" + re.escape(key) + r"=.+$")
        replacement = key + "=oci://" + oci
        properties, count = pattern.subn(replacement, properties, count=1)
        if count != 1:
            raise ValueError(key + " missing from plugins.properties")
        spec_path = root / "backend/sdk/src/main/resources/plugins" / resource / "spec.yaml"
        if not spec_path.is_file():
            raise ValueError(key + " missing reviewed Console resource")
        spec_path.write_text(replace_version(spec_path.read_text(encoding="utf-8"), version), encoding="utf-8")
        lock["plugins"][key] = {"resourceDir": resource, "version": version, "ociRef": "oci://" + oci, "digest": digest}
    properties_path.write_text(properties, encoding="utf-8")
    lock_path = root / "backend/sdk/src/main/resources/plugins/plugin-snapshot.lock.json"
    lock_path.write_text(json.dumps(lock, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def validate_rendered(root):
    plugins_root = root / "backend/sdk/src/main/resources/plugins"
    lock = load(plugins_root / "plugin-snapshot.lock.json")
    properties = {}
    for line in (plugins_root / "plugins.properties").read_text(encoding="utf-8").splitlines():
        if line and not line.startswith("#"):
            key, value = line.split("=", 1)
            properties[key] = value
    for key, item in lock.get("plugins", {}).items():
        if properties.get(key) != item["ociRef"]:
            raise ValueError(key + " properties/lock OCI mismatch")
        spec = plugins_root / item["resourceDir"] / "spec.yaml"
        if not spec.is_file() or not re.search(r"(?m)^  version:\s*" + re.escape(item["version"]) + r"\s*$", spec.read_text(encoding="utf-8")):
            raise ValueError(key + " lock version is absent from its plugin spec")
    return lock


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--snapshot", required=True)
    parser.add_argument("--sha256", required=True)
    parser.add_argument("--plugin-server-commit")
    parser.add_argument("--plugin-server-image")
    parser.add_argument("--base-sha")
    parser.add_argument("--validate-rendered", action="store_true")
    args = parser.parse_args()
    try:
        root = pathlib.Path(args.root)
        render(root, pathlib.Path(args.snapshot), args.sha256, args.plugin_server_commit, args.plugin_server_image, args.base_sha)
        if args.validate_rendered:
            validate_rendered(root)
    except (OSError, ValueError, json.JSONDecodeError) as error:
        print("snapshot render failed: " + str(error), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
