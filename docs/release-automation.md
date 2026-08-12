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
