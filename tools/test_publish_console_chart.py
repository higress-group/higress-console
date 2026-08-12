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

"""Focused behavior tests for the Console OCI chart publisher."""

import hashlib
from pathlib import Path
import subprocess
import tarfile
import tempfile
import textwrap
from typing import Optional
import unittest


ROOT = Path(__file__).resolve().parents[1]
PUBLISHER = ROOT / "tools" / "publish_console_chart.sh"
WORKFLOW = ROOT / ".github" / "workflows" / "deploy-to-oss.yaml"
CHART_MEDIA_TYPE = "application/vnd.cncf.helm.chart.content.v1.tar+gzip"


class ConsoleChartPublisherTest(unittest.TestCase):
    def make_chart(self, directory: Path) -> Path:
        chart = directory / "higress-console-1.2.3.tgz"
        source = directory / "Chart.yaml"
        source.write_text("apiVersion: v2\nname: higress-console\nversion: 1.2.3\n", encoding="utf-8")
        with tarfile.open(chart, "w:gz") as archive:
            archive.add(source, arcname="higress-console/Chart.yaml")
        return chart

    def write_mock_tools(self, directory: Path) -> Path:
        bin_dir = directory / "bin"
        bin_dir.mkdir()
        (bin_dir / "helm").write_text(
            "#!/bin/sh\n"
            "echo \"helm $*\" >> \"$CALL_LOG\"\n"
            "if [ \"$1\" = push ]; then printf published > \"$FAKE_STATE\"; fi\n",
            encoding="utf-8",
        )
        (bin_dir / "oras").write_text(
            textwrap.dedent(
                """\
                #!/bin/sh
                echo "oras $*" >> "$CALL_LOG"
                if [ "$1" = login ]; then exit 0; fi
                if [ "$1 $2" != 'manifest fetch' ]; then exit 1; fi
                mode=${ORAS_MODE:?}
                if [ "$mode" = absent ] && [ ! -s "$FAKE_STATE" ]; then
                  echo 'manifest unknown' >&2
                  exit 1
                fi
                if [ "$mode" = incompatible ]; then layer=sha256:$(printf z | tr z 0 | head -c 64); else layer=$PACKAGE_DIGEST; fi
                if [ "$4" = --raw ]; then
                  printf '{"layers":[{"mediaType":"%s","digest":"%s"}]}' '"""
            )
            + CHART_MEDIA_TYPE
            + """' "$layer"
                else
                  printf '{"digest":"sha256:%064d"}' 0
                fi
                """,
            encoding="utf-8",
        )
        for command in bin_dir.iterdir():
            command.chmod(0o755)
        return bin_dir

    def run_publisher(self, chart: Optional[Path], mode: str, *, dry_run: bool = False, immutable_tags: str = "true", password: Optional[str] = "password"):
        with tempfile.TemporaryDirectory() as raw_directory:
            directory = Path(raw_directory)
            bin_dir = self.write_mock_tools(directory)
            call_log = directory / "calls.log"
            state = directory / "state"
            summary = directory / "summary.md"
            package_digest = "sha256:" + hashlib.sha256(chart.read_bytes()).hexdigest() if chart else "sha256:" + "0" * 64
            environment = {
                "PATH": f"{bin_dir}:/usr/bin:/bin",
                "CONSOLE_CHART_REGISTRY": "registry.example/higress",
                "CONSOLE_CHART_REGISTRY_IMMUTABLE_TAGS": immutable_tags,
                "CONSOLE_CHART_REGISTRY_USERNAME": "publisher",
                "VERSION": "1.2.3",
                "CHART_PACKAGE": str(chart or directory / "missing.tgz"),
                "DRY_RUN": str(dry_run).lower(),
                "ORAS_MODE": mode,
                "PACKAGE_DIGEST": package_digest,
                "CALL_LOG": str(call_log),
                "FAKE_STATE": str(state),
                "GITHUB_STEP_SUMMARY": str(summary),
            }
            if password is not None:
                environment["CONSOLE_CHART_REGISTRY_PASSWORD"] = password
            result = subprocess.run([str(PUBLISHER)], env=environment, text=True, capture_output=True)
            return result, call_log.read_text(encoding="utf-8") if call_log.exists() else "", summary.read_text(encoding="utf-8") if summary.exists() else ""

    def test_rejects_absent_credential_without_registry_calls(self):
        with tempfile.TemporaryDirectory() as raw_directory:
            result, calls, _ = self.run_publisher(self.make_chart(Path(raw_directory)), "absent", password=None)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("CONSOLE_CHART_REGISTRY_PASSWORD", result.stderr)
        self.assertEqual(calls, "")

    def test_rejects_missing_packaged_chart_without_registry_calls(self):
        result, calls, _ = self.run_publisher(None, "absent")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("packaged Console chart is missing", result.stderr)
        self.assertEqual(calls, "")

    def test_requires_explicit_immutable_tag_prerequisite_without_registry_calls(self):
        with tempfile.TemporaryDirectory() as raw_directory:
            result, calls, _ = self.run_publisher(self.make_chart(Path(raw_directory)), "absent", immutable_tags="false")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("CONSOLE_CHART_REGISTRY_IMMUTABLE_TAGS=true", result.stderr)
        self.assertEqual(calls, "")

    def test_reuses_identical_existing_chart_without_push(self):
        with tempfile.TemporaryDirectory() as raw_directory:
            result, calls, summary = self.run_publisher(self.make_chart(Path(raw_directory)), "same")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertNotIn("helm push", calls)
        self.assertIn("Reused existing exact package", summary)

    def test_rejects_incompatible_existing_chart_without_push(self):
        with tempfile.TemporaryDirectory() as raw_directory:
            result, calls, _ = self.run_publisher(self.make_chart(Path(raw_directory)), "incompatible")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("immutable Console chart tag conflict", result.stderr)
        self.assertNotIn("helm push", calls)

    def test_absent_chart_tag_is_published_and_verified(self):
        with tempfile.TemporaryDirectory() as raw_directory:
            result, calls, summary = self.run_publisher(self.make_chart(Path(raw_directory)), "absent")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("helm push", calls)
        self.assertIn("Digest", summary)

    def test_dry_run_does_not_call_registry_or_require_credentials(self):
        with tempfile.TemporaryDirectory() as raw_directory:
            result, calls, summary = self.run_publisher(self.make_chart(Path(raw_directory)), "absent", dry_run=True, password=None)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls, "")
        self.assertIn("no registry or OSS write was attempted", summary)

    def test_dispatch_validation_job_has_no_production_environment_or_publisher_credentials(self):
        workflow = WORKFLOW.read_text(encoding="utf-8")
        validation_job = workflow.split("  validate-chart:\n", 1)[1].split("  deploy-to-oss:\n", 1)[0]
        production_job = workflow.split("  deploy-to-oss:\n", 1)[1]
        self.assertIn("if: ${{ github.event_name == 'workflow_dispatch' }}", validation_job)
        self.assertNotIn("environment:", validation_job)
        self.assertNotIn("CONSOLE_CHART_REGISTRY_USERNAME", validation_job)
        self.assertNotIn("CONSOLE_CHART_REGISTRY_PASSWORD", validation_job)
        self.assertIn("DRY_RUN: true", validation_job)
        self.assertIn("if: ${{ github.event_name == 'push' }}", production_job)
        self.assertIn("environment: console-chart-production", production_job)

    def test_release_workflows_pair_oras_setup_metadata_with_pinned_cli(self):
        oras_setup = "oras-project/setup-oras@8d34698a59f5ffe24821f0b48ab62a3de8b64b20 # v1.2.3"
        oras_setup_with_cli = oras_setup + "\n        with:\n          version: 1.2.3"
        superseded_setup = "oras-project/setup-oras@ca28077386065e263c03428f4ae0c09024817c93"
        expected_callers = {
            "deploy-to-oss.yaml": 1,
            "publish-plugin-release-provenance.yaml": 1,
            "sync-plugin-snapshot.yaml": 1,
        }
        for name, expected in expected_callers.items():
            workflow = (ROOT / ".github" / "workflows" / name).read_text(encoding="utf-8")
            self.assertNotIn(superseded_setup, workflow, name)
            self.assertEqual(expected, workflow.count("version: 1.2.3"), name)
            self.assertEqual(expected, workflow.count(oras_setup_with_cli), name)


if __name__ == "__main__":
    unittest.main()
