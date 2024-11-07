# Changelog

## Unreleased

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
