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

import importlib.util
import json
import pathlib
import re
import subprocess
import sys
import tempfile
import unittest


ROOT = pathlib.Path(__file__).parents[1]
SPEC = importlib.util.spec_from_file_location("recovery", ROOT / "tools/verify_console_image_recovery.py")
recovery = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(recovery)


class RecoveryContractTest(unittest.TestCase):
    def values(self):
        return dict(operation="replace", version="3.1.0", image_repository=recovery.IMAGE_REPOSITORY,
                    source_commit="a" * 40, higress_commit="b" * 40,
                    manifest_original_console_commit="c" * 40,
                    manifest_old_digest="sha256:" + "c" * 64,
                    expected_old_digest="sha256:" + "c" * 64,
                    expected_new_digest="sha256:" + "d" * 64,
                    current_digest="sha256:" + "c" * 64,
                    candidate_digest="sha256:" + "d" * 64, source_is_merged=True,
                    source_descends_release=True, release_tag_matches_manifest=True,
                    old_digest_is_authorized=True)

    def test_exact_replacement_and_idempotent_retry_are_version_independent(self):
        values = self.values()
        self.assertEqual(recovery.validate(**values), "replace")
        values["current_digest"] = values["expected_new_digest"]
        self.assertEqual(recovery.validate(**values), "already-replaced")
        values.update(version="2.2.4", current_digest=values["expected_old_digest"])
        self.assertEqual(recovery.validate(**values), "replace")

    def test_rejects_invalid_version_stale_digest_unmerged_source_and_candidate_drift(self):
        for field, value in (("version", "latest"), ("version", "3.1.0-rc1"),
                             ("source_commit", "invalid"),
                             ("current_digest", "sha256:" + "e" * 64),
                             ("source_is_merged", False), ("source_descends_release", False),
                             ("release_tag_matches_manifest", False),
                             ("old_digest_is_authorized", False),
                             ("candidate_digest", "sha256:" + "e" * 64)):
            with self.subTest(field=field):
                values = self.values(); values[field] = value
                with self.assertRaises(ValueError):
                    recovery.validate(**values)

    def test_candidate_build_requires_current_authorized_digest_and_cannot_preapprove_new_digest(self):
        values = self.values(); values.update(operation="build-candidate", expected_new_digest="", candidate_digest="")
        self.assertEqual(recovery.validate(**values), "build")
        values["expected_new_digest"] = "sha256:" + "d" * 64
        with self.assertRaises(ValueError):
            recovery.validate(**values)

    def test_rejects_malformed_manifest_digest_without_hardcoded_release_values(self):
        values = self.values()
        values["manifest_old_digest"] = "invalid"
        with self.assertRaisesRegex(ValueError, "manifest old digest"):
            recovery.validate(**values)
        values = self.values()
        values["manifest_old_digest"] = "sha256:" + "f" * 64
        self.assertEqual(recovery.validate(**values), "replace")

    def test_pre_copy_recheck_is_generic_and_race_safe(self):
        old = "sha256:" + "c" * 64
        self.assertEqual(recovery.validate_pre_copy("replace", old, old), "copy")
        with self.assertRaisesRegex(ValueError, "tag changed after validation"):
            recovery.validate_pre_copy("replace", "sha256:" + "e" * 64, old)

    def test_already_replaced_mode_remains_an_idempotent_no_copy(self):
        self.assertEqual(recovery.validate_pre_copy("already-replaced", "sha256:" + "d" * 64,
                                                    "sha256:" + "c" * 64), "skip")

    def descriptor(self, architecture, digest_char, *, os_name="linux"):
        return {"mediaType": "application/vnd.oci.image.manifest.v1+json",
                "digest": "sha256:" + digest_char * 64,
                "platform": {"os": os_name, "architecture": architecture}}

    def attestation(self, digest_char, subject_char):
        descriptor = self.descriptor("unknown", digest_char, os_name="unknown")
        descriptor["annotations"] = {
            "vnd.docker.reference.type": "attestation-manifest",
            "vnd.docker.reference.digest": "sha256:" + subject_char * 64,
        }
        return descriptor

    def test_platform_index_accepts_exact_pair_and_one_to_one_attestations(self):
        amd64 = self.descriptor("amd64", "a")
        arm64 = self.descriptor("arm64", "b")
        index = {"manifests": [amd64, arm64, self.attestation("c", "a"), self.attestation("d", "b")]}
        self.assertEqual(recovery.validate_platform_index(index), [amd64["digest"], arm64["digest"]])

    def test_platform_index_rejects_two_amd64_extra_runnable_and_unknown_extra(self):
        valid = [self.descriptor("amd64", "a"), self.descriptor("arm64", "b")]
        cases = {
            "two amd64": [self.descriptor("amd64", "a"), self.descriptor("amd64", "b")],
            "extra runnable": valid + [self.descriptor("s390x", "c")],
            "unknown extra": valid + [self.descriptor("unknown", "c", os_name="unknown")],
        }
        for name, manifests in cases.items():
            with self.subTest(name=name), self.assertRaises(ValueError):
                recovery.validate_platform_index({"manifests": manifests})

    def test_platform_index_rejects_duplicate_or_misbound_attestations(self):
        valid = [self.descriptor("amd64", "a"), self.descriptor("arm64", "b")]
        cases = [
            valid + [self.attestation("c", "a"), self.attestation("c", "b")],
            valid + [self.attestation("c", "a"), self.attestation("d", "a")],
        ]
        for manifests in cases:
            with self.subTest(manifests=manifests), self.assertRaises(ValueError):
                recovery.validate_platform_index({"manifests": manifests})

    def test_platform_index_cli_does_not_require_replacement_arguments(self):
        index = {"manifests": [self.descriptor("amd64", "a"), self.descriptor("arm64", "b")]}
        with tempfile.TemporaryDirectory() as temp:
            path = pathlib.Path(temp) / "index.json"
            path.write_text(json.dumps(index), encoding="utf-8")
            result = subprocess.run(
                [sys.executable, str(ROOT / "tools/verify_console_image_recovery.py"),
                 "--index-file", str(path)], check=False, capture_output=True, text=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.splitlines(), ["sha256:" + "a" * 64, "sha256:" + "b" * 64])

    def test_workflow_is_generic_guarded_and_uses_production_secrets(self):
        workflow_path = ROOT / ".github/workflows/recover-console-image.yaml"
        raw = workflow_path.read_text(encoding="utf-8")
        self.assertIn("environment: console-chart-production", raw)
        self.assertIn("secrets.PRODUCTION_REGISTRY_USERNAME", raw)
        self.assertIn("secrets.PRODUCTION_REGISTRY_PASSWORD", raw)
        self.assertNotIn("CONSOLE_CHART_REGISTRY_USERNAME", raw)
        self.assertNotIn("CONSOLE_CHART_REGISTRY_PASSWORD", raw)
        self.assertIn("VERSION: ${{ inputs.version }}", raw)
        self.assertIn("plugins/release/console-recovery/${{ inputs.version }}.json", raw)
        self.assertIn('test "$CONFIRMATION" = "REPLACE_APPROVED_HOTFIX_$VERSION"', raw)
        self.assertIn("git merge-base --is-ancestor", raw)
        self.assertIn("https://github.com/higress-group/higress.git", raw)
        self.assertNotIn("1aa0c03da2279b8c7d2eec025d39f9951d329bf1", raw)
        self.assertNotIn("sha256:4a07fedf9925a2775e9e9b7dfdbf99194651e51a7ee2c0b6bb8fab62e61d2da8", raw)
        self.assertIn("previous_recovery_asset", raw)
        self.assertIn('.newDigest == $digest', raw)
        self.assertIn('--expected-version "$VERSION"', raw)
        self.assertIn('git worktree add --detach "$expected_root" "refs/tags/v$VERSION"', raw)
        self.assertIn('test "$actual_tree_sha" = "$expected_tree_sha"', raw)
        self.assertIn('pluginResourcesSha256:$resources', raw)
        self.assertIn('evidence_basename="console-image-recovery-$VERSION-${SOURCE_COMMIT:0:12}-${EXPECTED_NEW_DIGEST:7:12}"', raw)
        self.assertIn("--index-file /tmp/candidate-index.json", raw)
        copy_start = raw.index("- name: Replace only the exact approved release tag")
        copy_end = raw.index("- name: Publish separate immutable recovery evidence", copy_start)
        copy_step = raw[copy_start:copy_end]
        recheck = 'pre_copy_current=$(oras manifest fetch "$IMAGE_REPOSITORY:$VERSION" --descriptor | jq -er .digest)'
        self.assertIn(recheck, copy_step)
        self.assertIn('--pre-copy-current-digest "$pre_copy_current"', copy_step)
        self.assertIn('--expected-old-digest "$EXPECTED_OLD_DIGEST"', copy_step)
        self.assertLess(copy_step.index(recheck), copy_step.index('oras cp "$IMAGE_REPOSITORY@$EXPECTED_NEW_DIGEST"'))
        self.assertIn("group: console-image-publish-v${{ inputs.version }}", raw)
        publisher = (ROOT / ".github/workflows/deploy-to-k8s.yaml").read_text(encoding="utf-8")
        self.assertIn("group: console-image-publish-${{ github.ref_name }}", publisher)
        actions = re.findall(r"(?m)^\s*- uses:\s*[^@\s]+@([^\s#]+)", raw)
        self.assertTrue(actions)
        self.assertTrue(all(re.fullmatch(r"[0-9a-f]{40}", ref) for ref in actions), actions)


if __name__ == "__main__":
    unittest.main()
