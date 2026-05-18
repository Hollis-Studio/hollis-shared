# Hollis Shared

Hollis Shared is the standalone workspace for suite-wide TypeScript infrastructure: `@hollis-studio/contracts`, `@hollis-studio/design-tokens`, `@hollis-studio/utils`, and `@hollis-studio/auth-client`, each consumed through public package exports rather than app-local source paths.

It is also the canonical home for **suite-wide docs** — vision, architecture, cross-app research, and dated phase reports. Per-app docs (Workouts, Health, Identity, workouts-server) live inside each app repo; anything that spans more than one app belongs here.

- **Start with the suite vision:** [`docs/vision/2026-05-18-suite-vision.md`](./docs/vision/2026-05-18-suite-vision.md)
- **Docs index:** [`docs/README.md`](./docs/README.md)


Canonical consumption is through GitHub Packages under the Hollis Studio org. Current published versions:

```json
{
  "dependencies": {
    "@hollis-studio/contracts": "0.2.0-alpha.7",
    "@hollis-studio/design-tokens": "0.2.0-alpha.2",
    "@hollis-studio/utils": "0.1.0-alpha.1",
    "@hollis-studio/auth-client": "0.1.0-alpha.3"
  }
}
```

Consumers need an `.npmrc` with the `@hollis-studio` registry and an install token:

```ini
@hollis-studio:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```
