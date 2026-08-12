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


class RenderTest(unittest.TestCase):
    def test_updates_both_live_versions_and_preserves_unmanaged(self):
        with tempfile.TemporaryDirectory() as temp:
            work = pathlib.Path(temp) / "console"
            shutil.copytree(ROOT / "backend/sdk/src/main/resources/plugins", work / "backend/sdk/src/main/resources/plugins")
            snapshot = {"schemaVersion": 1, "sourceCommit": "a" * 40, "plugins": [{"logicalId": "json-converter", "version": "2.1.0", "ociRef": "registry.example/plugins/jsonrpc-converter:2.1.0", "digest": "sha256:" + "b" * 64, "consumers": {"console": {"propertyKey": "json-converter", "resourceDir": "json-converter", "urlForm": "oci"}}}]}
            path = pathlib.Path(temp) / "snapshot.json"
            path.write_text(json.dumps(snapshot), encoding="utf-8")
            renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest(), "c" * 40, "registry.example/plugin-server@sha256:" + "d" * 64, "e" * 40)
            props = (work / "backend/sdk/src/main/resources/plugins/plugins.properties").read_text(encoding="utf-8")
            self.assertIn("json-converter=oci://registry.example/plugins/jsonrpc-converter:2.1.0", props)
            self.assertIn("basic-auth=oci://higress-registry.cn-hangzhou.cr.aliyuncs.com/plugins/basic-auth:2.0.0", props)
            spec = (work / "backend/sdk/src/main/resources/plugins/json-converter/spec.yaml").read_text(encoding="utf-8")
            self.assertIn("  version: 2.1.0", spec)
            lock = json.loads((work / "backend/sdk/src/main/resources/plugins/plugin-snapshot.lock.json").read_text())
            self.assertEqual(lock["plugins"]["json-converter"]["digest"], "sha256:" + "b" * 64)
            self.assertEqual(lock["baseSha"], "e" * 40)
            self.assertEqual(lock["pluginServerCommit"], "c" * 40)
            renderer.validate_rendered(work)

    def test_rendered_lock_rejects_missing_property_and_spec_version_drift(self):
        with tempfile.TemporaryDirectory() as temp:
            work = pathlib.Path(temp) / "console"
            shutil.copytree(ROOT / "backend/sdk/src/main/resources/plugins", work / "backend/sdk/src/main/resources/plugins")
            snapshot = {"schemaVersion": 1, "sourceCommit": "a" * 40, "plugins": [{"logicalId": "json-converter", "version": "2.1.0", "ociRef": "registry.example/plugins/jsonrpc-converter:2.1.0", "digest": "sha256:" + "b" * 64, "consumers": {"console": {"propertyKey": "json-converter", "resourceDir": "json-converter", "urlForm": "oci"}}}]}
            path = pathlib.Path(temp) / "snapshot.json"; path.write_text(json.dumps(snapshot), encoding="utf-8")
            renderer.render(work, path, hashlib.sha256(path.read_bytes()).hexdigest())
            props = work / "backend/sdk/src/main/resources/plugins/plugins.properties"
            props.write_text(props.read_text().replace("json-converter=oci://registry.example/plugins/jsonrpc-converter:2.1.0", ""), encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "properties/lock"):
                renderer.validate_rendered(work)

    def test_json_converter_reviewed_resources_are_loadable(self):
        root = ROOT / "backend/sdk/src/main/resources/plugins/json-converter"
        self.assertTrue((root / "README.md").is_file())
        self.assertTrue((root / "spec.yaml").is_file())

    def test_rejects_wrong_hash(self):
        with tempfile.TemporaryDirectory() as temp:
            path = pathlib.Path(temp) / "snapshot.json"
            path.write_text("{}", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "SHA"):
                renderer.render(ROOT, path, "a" * 64)


if __name__ == "__main__":
    unittest.main()
