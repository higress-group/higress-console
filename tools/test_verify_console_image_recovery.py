# Copyright 2026 alibaba
# Licensed under the Apache License, Version 2.0.

import importlib.util
import pathlib
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


if __name__ == "__main__":
    unittest.main()
