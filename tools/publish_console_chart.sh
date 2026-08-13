#!/usr/bin/env bash

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

# Publish a release chart only when its exact OCI tag is absent. Existing tags
# must contain the byte-identical package, so retries cannot silently cover a
# mutable-tag overwrite.
set -euo pipefail

: "${CONSOLE_CHART_REGISTRY:?CONSOLE_CHART_REGISTRY must be configured}"
: "${VERSION:?VERSION must be configured}"
: "${CHART_PACKAGE:?CHART_PACKAGE must be configured}"
: "${DRY_RUN:=false}"

test -f "$CHART_PACKAGE" || { echo "packaged Console chart is missing: $CHART_PACKAGE" >&2; exit 1; }
test "$(tar -xOf "$CHART_PACKAGE" higress-console/Chart.yaml | awk '$1 == "name:" { print $2; exit }')" = higress-console
test "$(tar -xOf "$CHART_PACKAGE" higress-console/Chart.yaml | awk '$1 == "version:" { print $2; exit }')" = "$VERSION"
[[ "$CONSOLE_CHART_REGISTRY" =~ ^[a-z0-9][a-z0-9.-]*(:[0-9]+)?(/[a-z0-9][a-z0-9._-]*)+$ ]]

if [ "$DRY_RUN" = true ]; then
  echo "Dry run: packaged Console OCI chart was validated; no registry or OSS write was attempted." >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
  exit 0
fi

test "$CONSOLE_CHART_REGISTRY_IMMUTABLE_TAGS" = true || {
  echo "CONSOLE_CHART_REGISTRY_IMMUTABLE_TAGS=true is required before production chart publication" >&2
  exit 1
}
: "${CONSOLE_CHART_REGISTRY_USERNAME:?CONSOLE_CHART_REGISTRY_USERNAME must be configured}"
: "${CONSOLE_CHART_REGISTRY_PASSWORD:?CONSOLE_CHART_REGISTRY_PASSWORD must be configured}"

registry_host="${CONSOLE_CHART_REGISTRY%%/*}"
chart_ref="$CONSOLE_CHART_REGISTRY/higress-console:$VERSION"
package_digest="sha256:$(sha256sum "$CHART_PACKAGE" | awk '{print $1}')"

printf '%s' "$CONSOLE_CHART_REGISTRY_PASSWORD" | helm registry login "$registry_host" --username "$CONSOLE_CHART_REGISTRY_USERNAME" --password-stdin
printf '%s' "$CONSOLE_CHART_REGISTRY_PASSWORD" | oras login "$registry_host" --username "$CONSOLE_CHART_REGISTRY_USERNAME" --password-stdin

descriptor_error=/tmp/console-chart-descriptor.err
if descriptor=$(oras manifest fetch "$chart_ref" --descriptor --format json 2>"$descriptor_error"); then
  digest=$(jq -er '.digest' <<<"$descriptor")
  [[ "$digest" =~ ^sha256:[0-9a-f]{64}$ ]]
  manifest=$(oras manifest fetch "$chart_ref@$digest")
  layer_digest=$(jq -er '[.layers[] | select(.mediaType == "application/vnd.cncf.helm.chart.content.v1.tar+gzip")] | if length == 1 then .[0].digest else error("expected one Helm chart content layer") end' <<<"$manifest")
  if [ "$layer_digest" != "$package_digest" ]; then
    echo "immutable Console chart tag conflict: $chart_ref contains $layer_digest, expected $package_digest" >&2
    exit 1
  fi
  {
    echo "### OCI Helm chart"
    echo
    echo "- Reused existing exact package: \`$chart_ref@$digest\`"
  } >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
  exit 0
fi

if ! grep -Eqi 'not found|404|manifest unknown|name unknown' "$descriptor_error"; then
  cat "$descriptor_error" >&2
  echo "unable to determine whether Console OCI chart tag already exists: $chart_ref" >&2
  exit 1
fi

helm push "$CHART_PACKAGE" "oci://$CONSOLE_CHART_REGISTRY"
published=$(oras manifest fetch "$chart_ref" --descriptor --format json)
digest=$(jq -er '.digest' <<<"$published")
[[ "$digest" =~ ^sha256:[0-9a-f]{64}$ ]]
manifest=$(oras manifest fetch "$chart_ref@$digest")
layer_digest=$(jq -er '[.layers[] | select(.mediaType == "application/vnd.cncf.helm.chart.content.v1.tar+gzip")] | if length == 1 then .[0].digest else error("expected one Helm chart content layer") end' <<<"$manifest")
test "$layer_digest" = "$package_digest"
{
  echo "### OCI Helm chart"
  echo
  echo "- Reference: \`$chart_ref\`"
  echo "- Digest: \`$digest\`"
} >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
