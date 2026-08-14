# Copyright 2026 alibaba
# Licensed under the Apache License, Version 2.0.

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
        return dict(operation="replace", version="2.2.4", image_repository=recovery.IMAGE_REPOSITORY,
                    source_commit="a" * 40, higress_commit="b" * 40,
                    manifest_original_console_commit=recovery.ORIGINAL_CONSOLE_COMMIT,
                    manifest_old_digest=recovery.ORIGINAL_IMAGE_DIGEST,
                    expected_old_digest=recovery.ORIGINAL_IMAGE_DIGEST,
                    expected_new_digest="sha256:" + "d" * 64,
                    current_digest=recovery.ORIGINAL_IMAGE_DIGEST,
                    candidate_digest="sha256:" + "d" * 64, source_is_merged=True)

    def test_exact_replacement_and_idempotent_retry(self):
        values = self.values()
        self.assertEqual(recovery.validate(**values), "replace")
        values["current_digest"] = values["expected_new_digest"]
        self.assertEqual(recovery.validate(**values), "already-replaced")

    def test_rejects_other_version_stale_digest_unmerged_source_and_candidate_drift(self):
        for field, value in (("version", "2.2.5"), ("current_digest", "sha256:" + "e" * 64),
                             ("source_is_merged", False), ("candidate_digest", "sha256:" + "e" * 64)):
            with self.subTest(field=field):
                values = self.values(); values[field] = value
                with self.assertRaises(ValueError):
                    recovery.validate(**values)

    def test_candidate_build_requires_old_digest_and_cannot_preapprove_new_digest(self):
        values = self.values(); values.update(operation="build-candidate", expected_new_digest="", candidate_digest="")
        self.assertEqual(recovery.validate(**values), "build")
        values["expected_new_digest"] = "sha256:" + "d" * 64
        with self.assertRaises(ValueError):
            recovery.validate(**values)

    def test_fixed_original_digest_prevents_a_second_different_replacement(self):
        values = self.values()
        values["expected_old_digest"] = values["expected_new_digest"]
        values["current_digest"] = values["expected_new_digest"]
        values["expected_new_digest"] = "sha256:" + "e" * 64
        values["candidate_digest"] = values["expected_new_digest"]
        with self.assertRaisesRegex(ValueError, "fixed recovery manifest"):
            recovery.validate(**values)

    def test_rejects_mismatched_fixed_old_manifest(self):
        values = self.values()
        values["manifest_old_digest"] = "sha256:" + "f" * 64
        values["expected_old_digest"] = values["manifest_old_digest"]
        values["current_digest"] = values["manifest_old_digest"]
        with self.assertRaisesRegex(ValueError, "fixed original image digest"):
            recovery.validate(**values)

    def test_pre_copy_recheck_requires_the_unchanged_fixed_original_digest(self):
        self.assertEqual(recovery.validate_pre_copy("replace", recovery.ORIGINAL_IMAGE_DIGEST,
                                                    recovery.ORIGINAL_IMAGE_DIGEST), "copy")
        with self.assertRaisesRegex(ValueError, "tag changed after validation"):
            recovery.validate_pre_copy("replace", "sha256:" + "e" * 64,
                                       recovery.ORIGINAL_IMAGE_DIGEST)
        with self.assertRaisesRegex(ValueError, "fixed original image digest"):
            recovery.validate_pre_copy("replace", "sha256:" + "e" * 64,
                                       "sha256:" + "e" * 64)

    def test_already_replaced_mode_remains_an_idempotent_no_copy(self):
        self.assertEqual(recovery.validate_pre_copy("already-replaced", "sha256:" + "d" * 64,
                                                    recovery.ORIGINAL_IMAGE_DIGEST), "skip")

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

    def test_workflow_uses_existing_protected_environment_and_production_image_secrets(self):
        workflow_path = ROOT / ".github/workflows/recover-console-image-2.2.4.yaml"
        raw = workflow_path.read_text(encoding="utf-8")
        self.assertIn("environment: console-chart-production", raw)
        self.assertIn("secrets.PRODUCTION_REGISTRY_USERNAME", raw)
        self.assertIn("secrets.PRODUCTION_REGISTRY_PASSWORD", raw)
        self.assertNotIn("CONSOLE_CHART_REGISTRY_USERNAME", raw)
        self.assertNotIn("CONSOLE_CHART_REGISTRY_PASSWORD", raw)
        self.assertIn("higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/console", raw)
        self.assertIn("REPLACE_NOT_YET_PUBLIC_2.2.4", raw)
        self.assertIn("git merge-base --is-ancestor", raw)
        self.assertIn("https://github.com/higress-group/higress.git", raw)
        self.assertIn(recovery.ORIGINAL_CONSOLE_COMMIT, raw)
        self.assertIn(recovery.ORIGINAL_IMAGE_DIGEST, raw)
        self.assertIn('test "$EXPECTED_OLD_DIGEST" = "$manifest_old"', raw)
        self.assertIn('--manifest-old-digest "$MANIFEST_OLD_DIGEST"', raw)
        self.assertIn("console-image-recovery-2.2.4.json", raw)
        self.assertIn("--index-file /tmp/candidate-index.json", raw)
        copy_start = raw.index("- name: Replace only the exact not-yet-public 2.2.4 tag")
        copy_end = raw.index("- name: Publish separate immutable recovery evidence", copy_start)
        copy_step = raw[copy_start:copy_end]
        recheck = 'pre_copy_current=$(oras manifest fetch "$IMAGE_REPOSITORY:$VERSION" --descriptor | jq -er .digest)'
        self.assertIn(recheck, copy_step)
        self.assertIn('--pre-copy-current-digest "$pre_copy_current"', copy_step)
        self.assertIn('--manifest-old-digest "$MANIFEST_OLD_DIGEST"', copy_step)
        self.assertNotIn("EXPECTED_OLD_DIGEST", copy_step)
        self.assertLess(copy_step.index(recheck), copy_step.index('oras cp "$IMAGE_REPOSITORY@$EXPECTED_NEW_DIGEST"'))
        self.assertIn("group: console-image-publish-v2.2.4", raw)
        publisher = (ROOT / ".github/workflows/deploy-to-k8s.yaml").read_text(encoding="utf-8")
        self.assertIn("group: console-image-publish-${{ github.ref_name }}", publisher)
        actions = re.findall(r"(?m)^\s*- uses:\s*[^@\s]+@([^\s#]+)", raw)
        self.assertTrue(actions)
        self.assertTrue(all(re.fullmatch(r"[0-9a-f]{40}", ref) for ref in actions), actions)


if __name__ == "__main__":
    unittest.main()
