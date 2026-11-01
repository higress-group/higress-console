# Higress Console Helm Chart

Installs the console components of cloud-native gateway [Higress](http://higress.io/)

**Note:** It is highly recommended to install the whole package of Higress. Please visit https://higress.io/docs/user/quickstart/ for details.

## Console sessions and upgrades

Console sessions are stored server-side in the shared Kubernetes API, with one Secret per session in the console namespace. All console replicas use this store, and the console service account must retain its Secret read, write, list, and delete permissions. Session Secrets contain only the username and creation/last-access timestamps. The bearer session ID is represented by a SHA-256 hash in the Secret name and is not stored in the Secret data.

After upgrading to the server-side session store, previous console cookies are not accepted and all users must log in again.

| Configuration key | Default | Meaning |
| --- | --- | --- |
| `higress-console.admin.session.idle-timeout` | `1800000` ms (30 minutes) | Maximum time between requests before the server removes a session. |
| `higress-console.admin.session.absolute-timeout` | `28800000` ms (8 hours) | Maximum session lifetime, regardless of request activity. |
| `higress-console.admin.cookie.max-age` | `2592000` seconds (30 days) | Cookie `Max-Age` used only when login requests set `autoLogin` to `true`. |

When `autoLogin` is `false`, the browser receives a session cookie without `Max-Age`. `autoLogin` and the cookie maximum age do not change either server-side timeout; in particular, a persistent cookie cannot extend the eight-hour absolute session lifetime.