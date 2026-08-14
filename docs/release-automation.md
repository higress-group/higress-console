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
| `console-chart-production` | Release tags matching `v*.*.*` | `CONSOLE_CHART_REGISTRY=higress-registry.cn-hangzhou.cr.aliyuncs.com/higress`; `CONSOLE_CHART_REGISTRY_IMMUTABLE_TAGS=true` | `CONSOLE_CHART_REGISTRY_USERNAME`, `CONSOLE_CHART_REGISTRY_PASSWORD`; existing OSS publisher secrets `ACCESS_KEYID`, `ACCESS_KEYSECRET` if they are not retained as repository secrets |
| `console-plugin-sync` | `main` | `CONSOLE_RELEASE_APP_ID` | `CONSOLE_RELEASE_APP_PRIVATE_KEY` |

The OCI publisher credential must write only the
`higress/higress-console` repository. It is not a plugin or plugin-server
publisher credential. The snapshot receiver uses the release automation GitHub
App private key only from `console-plugin-sync`; its dry run never requests an
App token or creates a branch/PR.

The one-time, not-yet-public `2.2.4` Console image repair reuses the existing
`console-chart-production` reviewers and the repository-level
`PRODUCTION_REGISTRY_USERNAME` / `PRODUCTION_REGISTRY_PASSWORD` image
credentials. It does not use the chart registry credentials. Before that
manual dispatch, temporarily add the exact `main` branch to the Environment's
allowed deployment refs; the existing `v*` tag rule alone does not admit a
merged source commit. The temporary branch rule may be removed after recovery.

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

## One-time not-yet-public Console 2.2.4 image recovery

This exception replaces only
`higress-registry.cn-hangzhou.cr.aliyuncs.com/higress/console:2.2.4`. It does
not rebuild or overwrite the `v2.2.4` Git tag, GitHub Release, Helm chart,
plugin-server image, plugin images, or the existing
`plugin-release-provenance.json` asset.

1. Merge the Higress marketplace bundle/catalog PR, then merge the Console
   resource/renderer PR. Record both exact merged `main` commits and the
   SHA-256 of
   `plugins/release/console-recovery/2.2.4.json` from the Higress commit.
2. Confirm that the manifest fixes the original Console commit to
   `36aa9c67fb0057164dab9b1fe687b38fe5b8a022` and the original
   `higress/console:2.2.4` multi-platform digest to
   `sha256:c8cb47ad0a550e58df4cfee57f2f358eb0b1635a0812c77e04388dfb17bbebb6`.
   The workflow accepts only this digest as `expected_old_digest`; changing
   the input cannot authorize a second replacement. Keep the ACR immutable-tag
   rule enabled.
3. Run `Recover Not-Yet-Public Console 2.2.4 Image` with operation
   `build-candidate`, both exact commits, the manifest hash, the fixed original
   manifest digest as `expected_old_digest`, no new digest, and confirmation
   `BUILD_NOT_YET_PUBLIC_2.2.4`. The workflow verifies merged marketplace
   bytes and publishes only a source-addressed recovery candidate. Copy its
   reported digest from the run summary.
4. Independently inspect the candidate digest and marketplace inventory. Only
   then temporarily relax the ACR immutable rule that covers the single
   `higress/console` repository.
5. Run the same workflow with operation `replace`, the same commits, manifest
   hash and the same fixed old digest, the reviewed candidate as
   `expected_new_digest`, and confirmation `REPLACE_NOT_YET_PUBLIC_2.2.4`.
   The protected job refuses a
   non-2.2.4 target, unmerged source, stale current digest, candidate-label
   drift, or a different candidate digest.
6. Verify the new `higress/console:2.2.4` digest and the eight-plugin market
   inventory, then immediately restore the ACR immutable rule. The workflow
   uploads separately named immutable recovery evidence to the existing
   `v2.2.4` release and records the unchanged tag/chart/provenance identity.

An identical retry accepts the already-replaced digest and reuses byte-equal
recovery evidence. A later different digest fails because the operator's old
digest must still equal the immutable original digest in the manifest. All
subsequent Console versions use the normal immutable tag
path; this workflow remains hard-coded to `2.2.4`.
