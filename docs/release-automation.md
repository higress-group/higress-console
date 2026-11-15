<!--
Copyright 2026 alibaba

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Console release automation configuration

The Console tag workflow packages `helm/` once and publishes that exact package
to both the existing HTTPS Helm repository and an OCI Helm repository. OCI
publication is an immutable release prerequisite: the workflow creates a version
tag only when it is absent, or reuses it only when its Helm chart content layer
has the same SHA-256 as the locally packaged chart.

## Console environments

Configure these protected Environments in `higress-group/higress-console`:

| Environment | Allowed deployment refs | Variables | Secrets |
| --- | --- | --- | --- |
| `console-chart-production` | `main` and release tags matching `v*.*.*` | `CONSOLE_CHART_REGISTRY=higress-registry.cn-hangzhou.cr.aliyuncs.com/higress`; `CONSOLE_CHART_REGISTRY_IMMUTABLE_TAGS=true` | `CONSOLE_CHART_REGISTRY_USERNAME`, `CONSOLE_CHART_REGISTRY_PASSWORD`; existing OSS publisher secrets `ACCESS_KEYID`, `ACCESS_KEYSECRET` if they are not retained as repository secrets |
| `console-plugin-sync` | `main` | `CONSOLE_RELEASE_APP_ID` | `CONSOLE_RELEASE_APP_PRIVATE_KEY` |

The OCI publisher credential must write only the
`higress/higress-console` repository. It is not a plugin or plugin-server
publisher credential. The snapshot receiver uses the release automation GitHub
App private key only from `console-plugin-sync`; its dry run never requests an
App token or creates a branch/PR.

Guarded Console image recovery reuses the existing `console-chart-production`
reviewers and the repository-level
`PRODUCTION_REGISTRY_USERNAME` / `PRODUCTION_REGISTRY_PASSWORD` image
credentials. It does not use the chart registry credentials. Keep `main` in
the Environment's allowed deployment refs because manual recovery dispatches
run from the protected default branch while checking out an exact merged
source commit.

The Standalone receiver has a separate protected Environment in
`higress-group/higress-standalone`: `standalone-release-sync` (normally limited
to `main`), with `STANDALONE_RELEASE_APP_ID` and
`STANDALONE_RELEASE_APP_PRIVATE_KEY`. Do not reuse the release-manager App for
either receiver.

## Registry prerequisite and dry run

Before setting `CONSOLE_CHART_REGISTRY_IMMUTABLE_TAGS=true`, configure the ACR
repository `higress/higress-console` so non-`latest` tags cannot be overwritten
and verify the setting with a conflicting-tag negative test. This is an external
ACR control; the workflow guard is an operator confirmation, not a replacement
for registry enforcement. A tag release fails closed unless the variable is
exactly `true`.

Use **Run workflow** with a semantic `version` only to validate chart packaging:
the manual path runs in the separate `validate-chart` job, does not enter
`console-chart-production`, receives no publisher credentials, and writes
neither OCI nor OSS artifacts. A tagged release is the only path that enters
`console-chart-production` and publishes the OCI reference
`<CONSOLE_CHART_REGISTRY>/higress-console:<version>` before the release
provenance workflow resolves and records its digest.

## Guarded Console image recovery

Prefer a new patch release for a released Console defect. `Recover Console
Image` is the generic emergency path for an explicitly approved replacement of
`higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/console:<version>`. It
does not move the Git tag or modify the GitHub Release, Helm chart,
plugin-server image, plugin images, or `plugin-release-provenance.json`.

Before dispatching it, merge a reviewed Higress recovery manifest at
`plugins/release/console-recovery/<version>.json`. The manifest binds the
stable release version, original Console tag commit and image digest, plugin
snapshot, marketplace source files and hashes, and the production Console
repository. The exact manifest commit must be on canonical Higress `main`.
The Console hotfix source must likewise be an exact commit already merged into
canonical Console `main` and must descend from the release tag.

1. Record the version, exact Console hotfix commit, exact Higress manifest
   commit, manifest SHA-256, and current Console image digest. Keep the ACR
   immutable-tag rule enabled.
2. For the first replacement, set `expected_old_digest` to the manifest's
   `originalImageDigest` and leave both previous-recovery inputs empty. For a
   later replacement, set it to the current digest and provide the immediately
   preceding `console-image-recovery-*.json` release asset name and exact
   SHA-256. The workflow requires that evidence's `newDigest` to equal the
   expected old digest.
3. Run `Recover Console Image` with operation `build-candidate`, no new digest,
   and confirmation `BUILD_APPROVED_HOTFIX_<version>`. The protected job
   verifies the release provenance and evidence chain, reconstructs the full
   plugin resource tree from the release tag plus the reviewed manifest,
   compares it with the merged source, and publishes only a source-addressed
   multi-platform candidate.
4. Independently inspect the candidate digest, platforms, labels, and plugin
   inventory. Only then temporarily relax the immutable rule for the single
   `higress/console` repository.
5. Run the same workflow with operation `replace`, identical contract inputs,
   the reviewed candidate digest as `expected_new_digest`, and confirmation
   `REPLACE_APPROVED_HOTFIX_<version>`. Immediately before copying the digest,
   the workflow repeats the current-tag comparison to reject concurrent or
   stale updates.
6. Verify the stable tag digest and restore the ACR immutable rule. The
   workflow appends content-addressed recovery evidence to the existing
   release, including the previous evidence link when present and the
   unchanged tag/chart/provenance identity.

An identical retry recognizes the already-replaced digest and requires the
existing evidence assets to be byte-identical. A different follow-up digest
must extend the evidence chain; an arbitrary `expected_old_digest` cannot
authorize an overwrite.
