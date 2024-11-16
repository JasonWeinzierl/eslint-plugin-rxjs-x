# Changelog

## v0.3.0

### Features

- **no-ignored-default-value**: new rule for enforcing `defaultValue` ([#15](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/15)) ([9bd896e](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/9bd896e0acb87cce2931ecda8b683fb5e9a8837c))
- **ban-operators**!: improve type checking of banned operators, report error at usage instead of in import statement ([#25](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/25)) ([994ff25](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/994ff25391cc4efbb2f2cfa99c323c7280e9d1b5))
- **throw-error**!: stop linting regular `throw` statements ([#22](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/22)) ([02fdffd](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/02fdffde6b9376621b902d2ebbae4fb8080d29f1))

## v0.2.4

### Features

- **macro**: deprecated ([#13](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/13)) ([39be258](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/39be258ad359bd1e79f057302d7ffe12954f9c14))

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
