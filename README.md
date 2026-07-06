# Hollis Shared

Hollis Shared is the standalone workspace for suite-wide TypeScript infrastructure: `@hollis-studio/contracts`, `@hollis-studio/design-tokens`, `@hollis-studio/utils`, and `@hollis-studio/auth-client`, each consumed through public package exports rather than app-local source paths.

It is also the canonical home for **suite-wide docs** — vision, architecture, cross-app research, and dated phase reports. Per-app docs (Workouts, Health, Identity, workouts-server) live inside each app repo; anything that spans more than one app belongs here.

- **Start with the suite vision:** [`docs/vision/2026-05-19-suite-vision.md`](./docs/vision/2026-05-19-suite-vision.md)
- **Docs index:** [`docs/README.md`](./docs/README.md)
- **Engineering TODO:** [`docs/TODO.md`](./docs/TODO.md)


Canonical consumption is through GitHub Packages under the Hollis Studio org. Current published versions:

```json
{
  "dependencies": {
    "@hollis-studio/contracts": "0.2.0-alpha.42",
    "@hollis-studio/design-tokens": "0.2.0-alpha.2",
    "@hollis-studio/utils": "0.1.0-alpha.1",
    "@hollis-studio/auth-client": "0.1.0-alpha.3"
  }
}
```

> This block drifts — treat the [GitHub Packages page](https://github.com/orgs/Hollis-Studio/packages) as the source of truth, and bump consumers with `npm install @hollis-studio/<pkg>@<version>` rather than hand-editing package.json/package-lock (see `docs/TODO.md`).

Consumers need an `.npmrc` with the `@hollis-studio` registry and an install token:

```ini
@hollis-studio:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```
