# Higress Console Helm Chart

Installs the console components of cloud-native gateway [Higress](http://higress.io/)

**Note:** It is highly recommended to install the whole package of Higress. Please visit https://higress.io/docs/user/quickstart/ for details.

## Console sessions and upgrades

Console sessions are stored server-side in the shared Kubernetes API, with one Secret per session in the console namespace. All console replicas use this store, and the console service account must retain its Secret read, write, list, and delete permissions. Session Secrets contain only the username and creation/last-access timestamps. The bearer session ID is represented by a SHA-256 hash in the Secret name and is not stored in the Secret data.

Upgrading to the server-side session store invalidates all existing console sessions. Each user must log in once after the upgrade.

| Configuration key | Environment variable | Default | Meaning |
| --- | --- | --- | --- |
| `higress-console.admin.session.idle-timeout` | `HIGRESS_CONSOLE_ADMIN_SESSION_IDLE_TIMEOUT` | `1800000` ms (30 minutes) | Maximum time between requests before the server removes a session. Set to `0` to disable idle expiry. |
| `higress-console.admin.session.absolute-timeout` | `HIGRESS_CONSOLE_ADMIN_SESSION_ABSOLUTE_TIMEOUT` | `28800000` ms (8 hours) | Maximum session lifetime, regardless of request activity. Set to `0` to disable absolute expiry. |
| `higress-console.admin.cookie.max-age` | `HIGRESS_CONSOLE_ADMIN_COOKIE_MAX_AGE` | `2592000` seconds (30 days) | Cookie `Max-Age` used only when login requests set `autoLogin` to `true`. |

Both session timeout values are expressed in milliseconds. Negative values are rejected. When `autoLogin` is `false`, the browser receives a session cookie without `Max-Age`. `autoLogin` and the cookie maximum age do not change either server-side timeout; in particular, a persistent cookie cannot extend a configured absolute session lifetime.

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
