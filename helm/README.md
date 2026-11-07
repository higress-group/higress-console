# Higress Console Helm Chart

Installs the console components of cloud-native gateway [Higress](http://higress.io/)

**Note:** It is highly recommended to install the whole package of Higress. Please visit https://higress.io/docs/user/quickstart/ for details.

## TLS and authentication

The console container serves plain HTTP on port 8080. For production deployments, terminate TLS at an Ingress or another trusted reverse proxy instead of exposing the Service directly. Direct Service access and `kubectl port-forward` do not provide transport encryption.

When `ingress.enabled=true` and `ingress.tlsSecretName` is set, the chart creates a TLS Ingress, redirects HTTP to HTTPS, and automatically sets `HIGRESS_CONSOLE_ADMIN_COOKIE_SECURE=true` for the console pod. If TLS is terminated outside this chart, set the same environment variable explicitly:

```yaml
podEnvs:
  HIGRESS_CONSOLE_ADMIN_COOKIE_SECURE: "true"
```

HTTP Basic authentication for console APIs is disabled by default. Cookie-based login continues to work without it. If existing automation requires Basic authentication, opt in explicitly:

```yaml
admin:
  basicAuth:
    enabled: true
```

The equivalent environment variable is `HIGRESS_CONSOLE_ADMIN_BASIC_AUTH_ENABLED=true`. Enable Basic authentication only for clients that require it, and use HTTPS for those connections.

## Upgrade note: login rate limiting

The console now limits failed form logins and failed HTTP Basic authentication attempts. Defaults are 5 failures within
10 minutes per budget, followed by a 15-minute lock. The API returns HTTP 429 with a `Retry-After` header, and the login
page reports the remaining lock time.

Budgets are independent per authentication source. Form login uses `form:<username>:<ip>` and Basic authentication uses
`basic:<username>:<ip>`, so repeated Basic authentication failures with old credentials do not lock out the form login
for the same account and address, and vice versa. A successful authentication resets only its own source budget. If you
tested an earlier build with a shared budget, expect failed attempts in one source no longer to affect the other.
The lock check happens before password verification, and only verified failures increment the failure count. Correct
credentials never consume the budget. Expired states are pruned before writes, and a full shared store evicts its
oldest state rather than rejecting a new key with HTTP 503. Missing or blank client addresses use `unknown`, so they
remain subject to a shared budget per account and source.

The chart keeps the console defaults. Override them through `podEnvs` when needed:

```yaml
podEnvs:
  HIGRESS_CONSOLE_LOGIN_FAILURE_LIMIT: "5"
  HIGRESS_CONSOLE_LOGIN_FAILURE_WINDOW_SECONDS: "600"
  HIGRESS_CONSOLE_LOGIN_LOCK_SECONDS: "900"
```

All three values must be at least 1. `0` (and negative values) is invalid and is treated as `1`.

The console ships with `server.forward-headers-strategy=none`, so all requests behind a proxy can appear to come from the
proxy address and share one budget per account and source. When the proxy is trusted and clients cannot reach the
console directly, enable forwarded-header handling, for example:

```yaml
podEnvs:
  SERVER_FORWARD_HEADERS_STRATEGY: "native"
```

Only enable this for trusted proxies; otherwise clients can spoof forwarding headers and evade or manipulate budgets.

## Write-only credential API responses

Provider and consumer credentials are write-only:

- `GET /v1/ai/providers`, `GET /v1/ai/providers/{name}`, and `PUT /v1/ai/providers/{name}` no longer return provider `tokens` or credential fields in `rawConfigs` (`apiTokens`, `awsAccessKey`, `awsSecretKey`, `vertexAuthKey`). They return only redacted metadata such as `tokenCount` and the `*Configured` flags.
- `GET /v1/consumers`, `GET /v1/consumers/{name}`, and `PUT /v1/consumers/{name}` no longer return key-auth credential `values`; they return metadata such as `credentialCount`.
- `POST /v1/ai/providers` and `POST /v1/consumers` are create-only. If the name already exists, they return `409 Conflict` without any stored credential values. A successful create returns the submitted credentials exactly once (`tokens` and credential fields in `rawConfigs` for providers, `values` for consumers); the credentials cannot be read again through the API afterwards.
- Scripts that relied on `POST` as an upsert must use `PUT /v1/ai/providers/{name}` or `PUT /v1/consumers/{name}` to update an existing resource.
- External scripts that perform read-modify-write must be updated: omit a credential field to keep the existing value, send a new value to replace it, or send an explicit empty value to clear it.
