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

## Write-only credential API responses

Provider and consumer credentials are write-only:

- `GET /v1/ai/providers`, `GET /v1/ai/providers/{name}`, and `PUT /v1/ai/providers/{name}` no longer return provider `tokens` or credential fields in `rawConfigs` (`apiTokens`, `awsAccessKey`, `awsSecretKey`, `vertexAuthKey`). They return only redacted metadata such as `tokenCount` and the `*Configured` flags.
- `GET /v1/consumers`, `GET /v1/consumers/{name}`, and `PUT /v1/consumers/{name}` no longer return key-auth credential `values`; they return metadata such as `credentialCount`.
- `POST /v1/ai/providers` and `POST /v1/consumers` return the persisted credentials exactly once in the create response (`tokens` and credential fields in `rawConfigs` for providers, `values` for consumers). The credentials cannot be read again through the API afterwards.
- External scripts that perform read-modify-write must be updated: omit a credential field to keep the existing value, send a new value to replace it, or send an explicit empty value to clear it.
