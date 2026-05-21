# Shared Deps Distribution

Date: 2026-05-13

## Decision

Consumer apps (`hollis-identity`, `workouts-server`, `hollis-health-app`, `Hollis-Workouts`) take a dependency on `@hollis-studio/contracts`, `@hollis-studio/auth-client`, and other `hollis-shared` packages from GitHub Packages under the `@hollis-studio` scope.

Consumers use semver pins in `package.json`; CI and container builds provide a package-read token through `NODE_AUTH_TOKEN` or a BuildKit npmrc secret. Sibling `file:../hollis-shared/packages/<pkg>` refs and container-stage clones are no longer the canonical distribution path.

## Why not git tags

`npm install "@hollis-studio/contracts": "git+https://.../hollis-shared.git#contracts-vX.Y.Z"` does not work. The repo root's `package.json` is `@hollis-studio/shared` (a private workspaces root), so npm installs the entire monorepo tree under `node_modules/@hollis-studio/contracts/` and the actual contracts package ends up at `node_modules/@hollis-studio/contracts/packages/contracts/`. TypeScript fails to resolve `import from '@hollis-studio/contracts'`.

This was discovered after committing `dist/` into multiple `contracts-v0.2.0-alpha.*` and `auth-client-v0.1.0-alpha.*` tags hoping the installs would succeed. They will not — the problem is structural, not packaging.

Verified 2026-05-13 on npm 11.10.0.

## Previous local-file decision

The 2026-05-13 interim decision used local `file:` refs because each consumer environment needed an auth token to install from a private registry, and the suite did not yet have a GitHub org/package namespace.

That constraint is now resolved by publishing from `hollis-shared` into the `hollis-studio` org and wiring consumer CI/Docker installs to GitHub Packages.

## How registry consumption works in containers

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /workspace/identity
COPY package.json package-lock.json* ./
COPY .npmrc ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci --omit=dev
# ... subsequent stages
```

Key points:

- `package.json` contains normal semver pins such as `@hollis-studio/contracts: 0.2.0-alpha.7`.
- `.npmrc` maps the `@hollis-studio` scope to `https://npm.pkg.github.com`.
- CI and Docker builds provide package auth through `NODE_AUTH_TOKEN` or a BuildKit secret, not by copying `hollis-shared` into the image.

## How registry consumption works locally

Developers need access to the Hollis Studio GitHub org packages and a token with package read scope available as `NODE_AUTH_TOKEN` when running `npm install`.

The shared package `dist/` is produced and published by `hollis-shared`; consumers no longer depend on a sibling checkout being built locally.

## Consumer pin convention

Pin to the exact version published. As of 2026-05-19, the latest published versions are:

```json
"@hollis-studio/contracts": "0.2.0-alpha.10",
"@hollis-studio/design-tokens": "0.2.0-alpha.2",
"@hollis-studio/utils": "0.1.0-alpha.1",
"@hollis-studio/auth-client": "0.1.0-alpha.3"
```

(Verify against the GitHub Packages registry for the current latest before pinning; versions above reflect the `hollis-shared` workspace versions as of 2026-05-19.)

Do not switch back to `git+https://...#tag` or sibling `file:` refs.

## Related artifacts

- `auth-client-v0.1.0-alpha.{1,2,3}` and `contracts-v0.2.0-alpha.{4,5}` tags committed `dist/` and rewrote `packages/utils/package.json` to remove a stale `git+file://` sibling ref. The fixes are valid; the tags themselves are not directly installable as documented above.
- Future hollis-shared release tags can stop force-adding `dist/` — option 3 builds the dist fresh in the container.
