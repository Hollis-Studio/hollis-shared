# Hollis Shared

Hollis Shared is the standalone workspace for suite-wide TypeScript infrastructure: `@hollis-studio/contracts`, `@hollis-studio/design-tokens`, `@hollis-studio/utils`, and `@hollis-studio/auth-client`, each consumed through public package exports rather than app-local source paths.

It is also the canonical home for **suite-wide docs** — vision, architecture, cross-app research, and dated phase reports. Per-app docs (Workouts, Health, Identity, workouts-server) live inside each app repo; anything that spans more than one app belongs here.

- **Start with the suite vision:** [`docs/vision/2026-05-19-suite-vision.md`](./docs/vision/2026-05-19-suite-vision.md)
- **Docs index:** [`docs/README.md`](./docs/README.md)
- **Engineering TODO:** [`docs/TODO.md`](./docs/TODO.md)


Canonical consumption is through GitHub Packages under the Hollis Studio org.

**This README does not list current versions on purpose** — a hardcoded version
block lived here and drifted three times (alpha.12, then alpha.42, while later
releases were live). Read the registry instead:

```sh
# Release channel for all four packages is the `alpha` dist-tag:
npm run npm:agent -- view @hollis-studio/contracts dist-tags

# Works for every package, including the three that have NO dist-tags at all
# (design-tokens, utils, auth-client) and therefore print nothing from `npm view`:
gh api /orgs/Hollis-Studio/packages/npm/contracts/versions --jq '.[0].name'
gh api /orgs/Hollis-Studio/packages/npm/design-tokens/versions --jq '.[0].name'
gh api /orgs/Hollis-Studio/packages/npm/utils/versions --jq '.[0].name'
gh api /orgs/Hollis-Studio/packages/npm/auth-client/versions --jq '.[0].name'
```

> ⚠️ **Never install without an exact version.** The `contracts` `latest`
> dist-tag is stuck on an old alpha, so a bare
> `npm install @hollis-studio/contracts` pulls stale legal-document versions and
> the old studio address; the other three packages have no dist-tags, so a bare
> install cannot resolve at all. Bump consumers with
> `npm install @hollis-studio/<pkg>@<exact-version>` rather than hand-editing
> `package.json`/`package-lock.json` (see [`docs/TODO.md`](./docs/TODO.md)), and
> confirm afterwards with `npm ls @hollis-studio/<pkg>`. What is published and
> what a consumer has installed are separate facts — `docs/README.md` tracks
> both.

Consumers need an `.npmrc` with the `@hollis-studio` registry and an install token:

```ini
@hollis-studio:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

## Agent and terminal package management

These packages use **GitHub Packages**, not the npmjs registry. Set
`NODE_AUTH_TOKEN` to a GitHub credential with `read:packages` for installs and
`write:packages` for publishing, with access to the Hollis Studio packages.
Do not put credentials in tracked files or command arguments.

For local agents, the helper also loads the GitHub Packages token from your
user `~/.npmrc` (or `npm_config_userconfig` / `NPM_CONFIG_USERCONFIG`). An explicit
`NODE_AUTH_TOKEN` always wins, including in CI. This avoids the repo `.npmrc`
placeholder overriding a working user-level token. It works without shell
startup files or aliases:

```sh
npm run package:auth
npm run npm:agent -- ci
npm run package:publish -- --workspace @hollis-studio/contracts --dry-run
# After release validation and the intended version bump:
npm run package:publish -- --workspace @hollis-studio/contracts
```

You can invoke `node /absolute/path/to/hollis-shared/scripts/npm-agent.mjs install`
from a consumer repository as well; the helper preserves the working directory
and forwards npm arguments and exit status. Existing terminal sessions can load
the locally configured credential bridge with `source ~/.zshenv`; new zsh agent
and terminal shells load it automatically on this workstation.

All four packages currently set `publishConfig.tag` to `alpha`, so bare
`npm publish` in a package directory also uses the correct prerelease channel.
When moving to beta, rc, or stable releases, update that field along with the
version (`latest` for stable), or deliberately override it with `--tag`.
The `package:publish` helper also passes `--tag alpha` explicitly (override it
with `--tag beta`, `--tag rc`, or `--tag latest` when appropriate). npm 11.10 can
misreport `latest` in its notice when only `publishConfig.tag` is used, even
though the actual registry payload uses `alpha`.
Never promote an alpha release to `latest` by accident.

Run `npm run check` and the contracts tests before releasing from a tagged,
green main. Publish lifecycle hooks also build and typecheck the selected package.
`--dry-run` checks packaging and hooks; it does **not** prove that the registry
will accept a write or that a version was published. After publishing, verify
the exact version and tag with `npm run npm:agent -- view <package> dist-tags`.

GitHub Actions already supplies `NODE_AUTH_TOKEN` during installs. A future
publishing job must explicitly request `packages: write` and supply its
`GITHUB_TOKEN`; the existing CI workflow intentionally only has read access.
