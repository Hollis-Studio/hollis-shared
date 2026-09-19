# Hollis Shared

Read `../AGENTS.md` for coordination and shared-checkout rules.

Owns published `@hollis-studio/contracts`, `design-tokens`, `utils`, and
`auth-client`, plus suite docs. Public boundaries are package `exports` maps;
no sibling-source imports, undeclared deep imports, or consumer `file:`/Git deps.

For package changes:
1. Read the package manifest, exports and affected code; search every consumer.
   Keep compatibility until consumer upgrades can land together.
2. Validate the affected workspace and exported entrypoints (`smoke:import`).
   Contracts changes need contract tests; release validation uses `npm run check`.
3. Before an authorized publish, inspect `npm pack --dry-run --workspace ...`,
   verify dependency ranges and `npm ls --workspaces --depth=0`, then confirm the
   actual published version/tag. GitHub Packages prereleases use `--tag alpha`.
4. Update affected consumer manifests/lockfiles within the authorized scope.
   Tests, registry publication and installed consumer versions are separate facts.

Treat `node_modules/` and `dist/` as shared mutable state; coordinate installs,
cleans and builds. Inspect existing npm authentication before requesting tokens;
never put credentials in files, commands or logs that may be exposed. CI's
read-scoped package token does not authorize publication.
