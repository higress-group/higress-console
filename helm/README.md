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
