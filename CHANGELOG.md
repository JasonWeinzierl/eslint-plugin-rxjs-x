# Changelog

## v0.2.3

### Fixes

- **no-ignored-replay-buffer**: check config bufferSize ([#12](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/12)) ([ef2f886](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ef2f8866684ed6f918eb8c465e90a1de8982186a))

### Chores

- rxjs as an optional peer dependency ([90b03e6](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/90b03e6a01e0357603eb6426638ca43e0f392dca))

## v0.2.2

- Fixed broken imports in ESM configs using typescript versions lower than 5.5.

## v0.2.1

- Decreased minimum `typescript-eslint` version to ^8.1.0 (matches import-x plugin).

## v0.2.0

- Improved CJS typing to avoid needing `.default`.
- Added options documentation to rule docs.

## v0.1.0

- Replaced `tsutils` dependency with `ts-api-utils`.
- Removed `tsutils-etc` dependency.

## v0.0.2

- Fixed wrong types for CJS.

## v0.0.1

- Initial release after fork.
- `eslint` ^8.57.0 || 9.0.0
- `typescript-eslint` ^8
- Node.js ^18.18.0 || ^20.9.0 || >= 21.1.0
- Removed dependency `eslint-etc`.
- Removed dependency `requireindex`.
- Fixed `typeAnnotation` bug breaking no-implicit-any-catch.
- Added `requiresTypeChecking` to `meta.docs` of relevant rules.
- Switched from mocha to vitest.
