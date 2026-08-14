# Copyright 2026 Alibaba Group Holding Limited
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

import hashlib
import importlib.util
import json
import pathlib
import shutil
import tempfile
import unittest


ROOT = pathlib.Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("renderer", ROOT / "tools/render_plugin_snapshot.py")
renderer = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(renderer)
HIGRESS_COMMIT = "a" * 40
CONSOLE_COMMIT = "b" * 40


class RenderTest(unittest.TestCase):
    def workspace(self, temp):
        work = pathlib.Path(temp) / "console"
        shutil.copytree(ROOT / "backend/sdk/src/main/resources/plugins",
                        work / "backend/sdk/src/main/resources/plugins")
        return work

    def cache_bundle(self, temp, repository, commit, resource="new-plugin", *, spec_name=None):
        cache = pathlib.Path(temp) / "cache"
        source = cache / repository.replace("/", "__") / commit / "market" / resource
        source.mkdir(parents=True, exist_ok=True)
        files = {
            "spec.yaml": "apiVersion: 1.0.0\ninfo:\n  name: %s\n  version: 1.0.0\nspec:\n  configSchema:\n    openAPIV3Schema:\n      type: object\n" % (spec_name or resource),
            "README.md": "# 新插件\n",
            "README_EN.md": "# New plugin\n",
        }
        manifest = []
        for target, content in files.items():
            path = source / target
            path.write_text(content, encoding="utf-8")
            manifest.append({"sourcePath": "market/%s/%s" % (resource, target), "targetPath": target,
                             "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
        return cache, {"repository": repository,
                       **({} if repository == renderer.HIGRESS_REPOSITORY else {"sourceCommit": commit}),
                       "files": manifest}

    def plugin(self, bundle, name="new-plugin", version="1.0.0"):
        return {"logicalId": name, "version": version,
                "ociRef": "registry.example/plugins/%s:%s" % (name, version),
                "digest": "sha256:" + "c" * 64,
                "consumers": {"console": {"propertyKey": name, "resourceDir": name,
                                             "urlForm": "oci", "marketplace": bundle}}}

    def write_document(self, temp, plugins, source_commit=None):
        path = pathlib.Path(temp) / "snapshot.json"
        path.write_text(json.dumps({"schemaVersion": 1, "sourceCommit": source_commit or HIGRESS_COMMIT,
                                    "plugins": plugins}), encoding="utf-8")
        return path

    def test_new_stable_plugin_is_created_and_identical_rerun_is_byte_stable(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            path = self.write_document(temp, [self.plugin(bundle)])
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            renderer.render(work, path, digest, bundle_cache=cache, higress_commit=HIGRESS_COMMIT)
            first = tree_hash(work / "backend/sdk/src/main/resources/plugins")
            renderer.render(work, path, digest, bundle_cache=cache, higress_commit=HIGRESS_COMMIT)
            second = tree_hash(work / "backend/sdk/src/main/resources/plugins")
            self.assertEqual(first, second)
            props = (work / "backend/sdk/src/main/resources/plugins/plugins.properties").read_text()
            self.assertEqual(props.count("new-plugin="), 1)
            resource = work / "backend/sdk/src/main/resources/plugins/new-plugin"
            self.assertTrue(resource.is_dir())
            self.assertFalse(resource.is_symlink())
            self.assertTrue((resource / "README_EN.md").is_file())
            lock = renderer.validate_rendered(work)
            self.assertEqual(lock["plugins"]["new-plugin"]["marketplace"]["sourceCommit"], HIGRESS_COMMIT)

    def test_reviewed_markdown_is_projected_without_trailing_whitespace(self):
        raw = b"line with spaces  \n\n\n"
        self.assertEqual(renderer.render_bundle_bytes(raw, "README.md", "demo", "1.0.0"),
                         b"line with spaces\n")

    def test_updates_existing_plugin_and_preserves_unmanaged_content(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT,
                                               resource="json-converter")
            plugin = self.plugin(bundle, "json-converter", "2.1.0")
            plugin["ociRef"] = "registry.example/plugins/jsonrpc-converter:2.1.0"
            path = self.write_document(temp, [plugin])
            renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(), "d" * 40,
                            "registry.example/plugin-server@sha256:" + "e" * 64, "f" * 40,
                            cache, HIGRESS_COMMIT)
            props = (work / "backend/sdk/src/main/resources/plugins/plugins.properties").read_text()
            self.assertIn("json-converter=oci://registry.example/plugins/jsonrpc-converter:2.1.0", props)
            self.assertIn("basic-auth=oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/basic-auth:2.0.0", props)
            self.assertIn("  version: 2.1.0", (work / "backend/sdk/src/main/resources/plugins/json-converter/spec.yaml").read_text())

    def test_alpha_and_release_ineligible_entries_without_console_mapping_stay_absent(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            hidden = [{"logicalId": "alpha-plugin", "version": "1.0.0-alpha", "releaseEligible": True},
                      {"logicalId": "test-plugin", "version": "1.0.0", "releaseEligible": False}]
            path = self.write_document(temp, [self.plugin(bundle)] + hidden)
            renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(),
                            bundle_cache=cache, higress_commit=HIGRESS_COMMIT)
            props = (work / "backend/sdk/src/main/resources/plugins/plugins.properties").read_text()
            self.assertNotIn("alpha-plugin=", props)
            self.assertNotIn("test-plugin=", props)

    def test_rejects_missing_malformed_unsafe_and_identity_drift_bundles(self):
        with tempfile.TemporaryDirectory() as temp:
            cache, original = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            cases = {}
            missing = json.loads(json.dumps(original)); missing["files"] = missing["files"][:-1]; cases["lacks required"] = missing
            malformed = json.loads(json.dumps(original)); malformed["files"][0]["sha256"] = "d" * 64; cases["hash mismatch"] = malformed
            unsafe = json.loads(json.dumps(original)); unsafe["files"][0]["sourcePath"] = "../spec.yaml"; cases["unsafe"] = unsafe
            _, identity = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT,
                                            resource="identity", spec_name="other")
            cases["identity mismatch"] = identity
            for expected, bundle in cases.items():
                with self.subTest(expected=expected):
                    work = self.workspace(tempfile.mkdtemp(dir=temp))
                    path = self.write_document(tempfile.mkdtemp(dir=temp), [self.plugin(bundle, "identity" if expected == "identity mismatch" else "new-plugin")])
                    with self.assertRaisesRegex(ValueError, expected):
                        renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(),
                                        bundle_cache=cache, higress_commit=HIGRESS_COMMIT)

    def test_rejects_duplicate_resource_directory_before_writing(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, first = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT,
                                              resource="shared")
            _, second = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT,
                                           resource="other")
            one = self.plugin(first, "one")
            one["consumers"]["console"]["resourceDir"] = "shared"
            two = self.plugin(second, "two")
            two["consumers"]["console"]["resourceDir"] = "shared"
            path = self.write_document(temp, [one, two])
            before = tree_hash(work / "backend/sdk/src/main/resources/plugins")
            with self.assertRaisesRegex(ValueError, "duplicate Console resourceDir"):
                renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(),
                                bundle_cache=cache, higress_commit=HIGRESS_COMMIT)
            self.assertEqual(before, tree_hash(work / "backend/sdk/src/main/resources/plugins"))

    def test_rejects_symlinked_bundle_source_even_when_hash_matches(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            readme = cache / renderer.HIGRESS_REPOSITORY.replace("/", "__") / HIGRESS_COMMIT / "market/new-plugin/README.md"
            outside = pathlib.Path(temp) / "outside.md"
            outside.write_bytes(readme.read_bytes())
            readme.unlink()
            readme.symlink_to(outside)
            path = self.write_document(temp, [self.plugin(bundle)])
            with self.assertRaisesRegex(ValueError, "symlink"):
                renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(),
                                bundle_cache=cache, higress_commit=HIGRESS_COMMIT)

    def test_rejects_symlinked_plugin_root_and_metadata_files(self):
        with tempfile.TemporaryDirectory() as temp:
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            path = self.write_document(temp, [self.plugin(bundle)])
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            for index, name in enumerate(("plugins-root", "plugins.properties", "plugin-snapshot.lock.json")):
                with self.subTest(name=name):
                    work = self.workspace(tempfile.mkdtemp(dir=temp))
                    plugins = work / "backend/sdk/src/main/resources/plugins"
                    if name == "plugins-root":
                        outside = pathlib.Path(temp) / ("outside-" + str(index))
                        shutil.copytree(plugins, outside)
                        shutil.rmtree(plugins)
                        plugins.symlink_to(outside, target_is_directory=True)
                    else:
                        target = plugins / name
                        outside = pathlib.Path(temp) / ("outside-" + str(index))
                        outside.write_bytes(target.read_bytes())
                        target.unlink()
                        target.symlink_to(outside)
                    before = outside.read_bytes() if outside.is_file() else tree_hash(outside)
                    with self.assertRaisesRegex(ValueError, "symlink"):
                        renderer.render(work, path, digest, bundle_cache=cache, higress_commit=HIGRESS_COMMIT)
                    after = outside.read_bytes() if outside.is_file() else tree_hash(outside)
                    self.assertEqual(before, after)

    def test_rejects_symlinked_target_resource_directory(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            plugins = work / "backend/sdk/src/main/resources/plugins"
            outside = pathlib.Path(temp) / "outside-resource"
            outside.mkdir()
            sentinel = outside / "sentinel"
            sentinel.write_text("unchanged", encoding="utf-8")
            (plugins / "new-plugin").symlink_to(outside, target_is_directory=True)
            path = self.write_document(temp, [self.plugin(bundle)])
            with self.assertRaisesRegex(ValueError, "symlink"):
                renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(),
                                bundle_cache=cache, higress_commit=HIGRESS_COMMIT)
            self.assertEqual(sentinel.read_text(encoding="utf-8"), "unchanged")
            self.assertEqual(sorted(item.name for item in outside.iterdir()), ["sentinel"])

    def test_rejects_symlinked_target_file_before_writing_bundle(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            resource = work / "backend/sdk/src/main/resources/plugins/new-plugin"
            resource.mkdir()
            outside = pathlib.Path(temp) / "outside-readme.md"
            outside.write_text("unchanged\n", encoding="utf-8")
            (resource / "README.md").symlink_to(outside)
            path = self.write_document(temp, [self.plugin(bundle)])
            with self.assertRaisesRegex(ValueError, "symlink"):
                renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(),
                                bundle_cache=cache, higress_commit=HIGRESS_COMMIT)
            self.assertEqual(outside.read_text(encoding="utf-8"), "unchanged\n")
            self.assertFalse((resource / "spec.yaml").exists())
            self.assertFalse((resource / "README_EN.md").exists())

    def test_external_bundle_requires_exact_commit_and_sources_are_listed(self):
        with tempfile.TemporaryDirectory() as temp:
            _, bundle = self.cache_bundle(temp, "higress-group/higress-console", CONSOLE_COMMIT)
            path = self.write_document(temp, [self.plugin(bundle)])
            self.assertEqual(renderer.bundle_sources(json.loads(path.read_text()), HIGRESS_COMMIT),
                             [("higress-group/higress-console", CONSOLE_COMMIT)])
            del bundle["sourceCommit"]
            with self.assertRaisesRegex(ValueError, "immutable"):
                renderer.bundle_sources({"plugins": [self.plugin(bundle)]}, HIGRESS_COMMIT)

    def test_recovery_is_exactly_224_and_binds_existing_snapshot_lock(self):
        with tempfile.TemporaryDirectory() as temp:
            work = self.workspace(temp)
            cache, bundle = self.cache_bundle(temp, renderer.HIGRESS_REPOSITORY, HIGRESS_COMMIT)
            current = json.loads((work / "backend/sdk/src/main/resources/plugins/plugin-snapshot.lock.json").read_text())
            manifest = {"schemaVersion": 1, "gatewayVersion": "2.2.4",
                        "snapshotSha256": current["snapshotSha256"],
                        "imageRepository": "higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/console",
                        "originalConsoleCommit": renderer.ORIGINAL_CONSOLE_COMMIT,
                        "originalImageDigest": renderer.ORIGINAL_IMAGE_DIGEST,
                        "requiredSourceBranch": "main",
                        "plugins": [dict(self.plugin(bundle), console=self.plugin(bundle)["consumers"]["console"])]}
            manifest["plugins"][0].pop("consumers")
            path = pathlib.Path(temp) / "recovery.json"; path.write_text(json.dumps(manifest))
            digest = hashlib.sha256(path.read_bytes()).hexdigest()
            renderer.render_recovery(work, path, digest, cache, HIGRESS_COMMIT)
            self.assertEqual(renderer.validate_rendered(work)["marketplaceRecovery"]["gatewayVersion"], "2.2.4")
            manifest["gatewayVersion"] = "2.2.5"; path.write_text(json.dumps(manifest))
            with self.assertRaisesRegex(ValueError, "restricted"):
                renderer.render_recovery(work, path, hashlib.sha256(path.read_bytes()).hexdigest(), cache, HIGRESS_COMMIT)
            manifest["gatewayVersion"] = "2.2.4"
            manifest["originalImageDigest"] = "sha256:" + "0" * 64
            path.write_text(json.dumps(manifest))
            with self.assertRaisesRegex(ValueError, "fixed original"):
                renderer.render_recovery(work, path, hashlib.sha256(path.read_bytes()).hexdigest(), cache, HIGRESS_COMMIT)

    def test_real_224_marketplace_inventory_contains_all_recovered_plugins(self):
        expected = {"ai-context-limit", "gw-error-format", "hmac-auth-apisix", "log-request-response",
                    "mcp-router", "nginx-rewrite-compatible", "response-cache", "simple-jwt-auth"}
        plugins_root = ROOT / "backend/sdk/src/main/resources/plugins"
        properties = (plugins_root / "plugins.properties").read_text(encoding="utf-8")
        lock = renderer.validate_rendered(ROOT)
        self.assertEqual(lock["snapshotSha256"],
                         "09bc798df37e50dae2e684947885c31eb756636c76a98761a9a980fc031e3a1a")
        self.assertEqual(lock["marketplaceRecovery"]["gatewayVersion"], "2.2.4")
        for plugin in expected:
            self.assertIn(plugin + "=oci://", properties)
            self.assertIn(plugin, lock["plugins"])
            self.assertTrue((plugins_root / plugin / "spec.yaml").is_file())
            self.assertTrue((plugins_root / plugin / "README.md").is_file())
            self.assertTrue((plugins_root / plugin / "README_EN.md").is_file())
        hmac_spec = (plugins_root / "hmac-auth-apisix/spec.yaml").read_text(encoding="utf-8")
        self.assertIn("        clock_skew:\n          type: integer\n          minimum: 0\n          default: 300", hmac_spec)

    def test_rejects_wrong_snapshot_hash(self):
        with tempfile.TemporaryDirectory() as temp:
            path = pathlib.Path(temp) / "snapshot.json"; path.write_text("{}")
            with self.assertRaisesRegex(ValueError, "SHA"):
                renderer.render(ROOT, path, "a" * 64, bundle_cache=pathlib.Path(temp),
                                higress_commit=HIGRESS_COMMIT)


def tree_hash(root):
    digest = hashlib.sha256()
    for path in sorted(p for p in root.rglob("*") if p.is_file()):
        digest.update(str(path.relative_to(root)).encode())
        digest.update(b"\0")
        digest.update(path.read_bytes())
        digest.update(b"\0")
    return digest.hexdigest()


if __name__ == "__main__":
    unittest.main()
