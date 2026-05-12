# Hollis Shared

Hollis Shared is the standalone workspace for suite-wide TypeScript infrastructure: `@hollis/contracts`, `@hollis/design-tokens`, and `@hollis/utils`, each consumed through public package exports rather than app-local source paths.

During the Phase H transition, Health pins each package to the same immutable local git tag before GitHub Packages publishing is enabled:

```json
{
  "dependencies": {
    "@hollis/contracts": "git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#v0.1.0-alpha.1&path=packages/contracts",
    "@hollis/design-tokens": "git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#v0.1.0-alpha.1&path=packages/design-tokens",
    "@hollis/utils": "git+file:///Users/isaaclandes/Documents/SRC/hollis-shared#v0.1.0-alpha.1&path=packages/utils"
  }
}
```

After the private GitHub repo exists, use the same tag with the GitHub remote URL and `path=packages/<name>`.
