# Hollis Shared — Agent Guide

Read `../AGENTS.md` first for the compact company map and board protocol.

`hollis-shared` owns the published suite boundary: `@hollis-studio/contracts`,
`design-tokens`, `utils`, and `auth-client`, plus suite-wide documentation.
It is not an application repository. Public APIs are the package `exports` maps;
do not create sibling-path, source-path, or undeclared deep-import compatibility
routes.

## Work in the shared checkout

This checkout is intentionally shared by concurrent agents. Before a command or
edit, check in announcing your goal and the packages you will touch, register or
refresh activity, and claim the file/task in the company coordination board
(`hollis-board`); leave a summary when you finish. Announce even when `status`
shows no other active agents: unregistered or idle-but-present agents do not
appear there, and a published-package change is exactly the record later agents
need. Activity is a ten-minute window used only to freeze a proposal's
electorate; claims persist until their owner explicitly releases them, leaves,
or hands them off. Check `git status` first, touch only
your claimed files, and never reset, clean, stash, checkout, or reformat
another agent's changes. Treat `node_modules/` and every package's `dist/`
directory as shared mutable artifacts: avoid `npm install`, `npm ci`, `npm run
clean`, and full builds while another task may use them unless the board
explicitly reserves that work.

Use the board for status and ownership rather than duplicating its protocol in
this file. Coordinate an overlapping change with its owner. The board's voting
policy applies to additions to shared board documents; ordinary source changes
follow the user's task authorization and proportionate review.

## Package-change contract

1. Read the affected package's `package.json`, public README, source exports,
   and root `README.md`. Search sibling consumers before changing a type,
   schema, runtime export, package version, or dependency.
2. Keep additions backward compatible until all consumers can bump together.
   A contracts change can affect Health, Workouts, Identity, and their servers;
   `auth-client` is staged and does not establish an Identity cutover.
3. Add an export deliberately: consumers may import only paths declared by the
   package's `exports` field. Exercise each published entry point with
   `npm run smoke:import` after a build.
4. Packages are private GitHub Packages releases under `@hollis-studio`, on
   the `alpha` dist-tag. Never use `file:` or `git+...hollis-shared` consumer
   dependencies. A source commit, a successful CI run, npm publication, and a
   consumer lockfile bump are separate states; report each one precisely.
5. Before publishing, inspect the selected package's tarball (`npm pack
   --dry-run --workspace <package>`), run `npm run check` and contracts tests
   from green main, then verify the exact published version and dist-tag. Do
   not publish, tag, or alter a consumer manifest unless the task authorizes it.

## Dependency and authentication checks

- Workspace linking can hide an unsatisfied published dependency. `npm ls
  --workspaces --depth=0` must be clean before a release; reconcile package
  dependency ranges with the version being published.
- GitHub Packages needs the scoped registry in `.npmrc` and a `NODE_AUTH_TOKEN`
  with package read/write scope as appropriate. Keep credentials out of git,
  command arguments, logs, and test fixtures. Use the repository's npm helper
  when it is available.
- CI is a release gate only. Its read-scoped token cannot publish; a green CI
  result does not prove registry delivery or consumer installation.

## Focused validation

Prefer the smallest check that establishes the changed contract. For package
code, build/typecheck the affected workspace and smoke-import its public
exports; run contracts tests for contract changes. State when validation was
skipped because the shared checkout was actively in use, and do not treat a
local build as evidence that any app has consumed a release.
