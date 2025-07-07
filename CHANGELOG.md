# Changelog

[npm history](https://www.npmjs.com/package/eslint-plugin-rxjs-x?activeTab=versions)

## v0.7.7 (2025-07-07)

### Features

- **no-misused-observables**: improve report location for functions: reports their return type or the function head ([#238](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/238)) ([8e06ed9](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/8e06ed97b683c40e93260fc0fef795e8443e2958))

### Fixes

- **no-misused-observables**: false positive for JSX attributes ([#239](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/239)) ([636c922](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/636c922668ccd4cd7add9e4a2fd2e437268318a9))
- **no-misused-observables**: don't report on static accessor properties ([#240](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/240)) ([eee86ce](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/eee86cef74c5a279aa1039c5f93d849775169cde))
- **no-misused-observables**: allow Observable-returning functions for union types ([#236](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/236)) ([93c6dab](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/93c6dabcea81ea6e579c62fcd9ad5dceecef8d57))

## v0.7.6 (2025-06-16)

### Fixes

- **no-implicit-any-catch**: proper parenthesis for two-param `catchError` ([#230](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/230)) ([ea0f36a](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ea0f36ab050daa7511cd16db1b07aa0bc314e7c4))

## v0.7.5 (2025-06-05)

### Features

- **no-unbound-methods**: ignore certain types, defaulting to Angular's Signal ([#211](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/211)) ([087bf3c](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/087bf3cd351fe5cc849c6831a2e0ea0473706177))
- **throw-error**: report subjects throwing non-Errors ([#215](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/215)) ([eb979fb](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/eb979fb9f533e65e0f540af7e986ba4a2fea3fd4))

### Fixes

- **no-async-subscribe**: report async next property on observer objects ([#214](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/214)) ([f3ab04d](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/f3ab04d5d1648d076abc8af40f68befc082f45ae))

## v0.7.4 (2025-05-27)

### Fixes

- **no-explicit-generics**: don't incorrectly flag union types ([#210](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/210)) ([5662966](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/5662966caeb655354fceabef0f080aeebf7de4d9))
- **finnish**: don't require `$` for `forkJoin` and `combineLatest` overloads that take object expressions as input ([#212](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/212)) ([ee9ec8e](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ee9ec8e57ee32d702c6ff44f2b4750110f845182))
- **suffix-subjects**: don't require `Subject` suffix for `forkJoin` and `combineLatest` overloads that take object expressions as input ([#212](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/212)) ([ee9ec8e](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ee9ec8e57ee32d702c6ff44f2b4750110f845182))

## v0.7.3 (2025-05-25)

### Features

- **no-ignored-subscription**: ignore for certain operators ([#187](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/187)) ([782f823](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/782f8237d67ced2d478ba9351a04d049948ae04a))

## v0.7.2 (2025-04-18)

### Fixes

- Functions and methods with implicit return types will now be properly checked by `finnish`, `no-finnish`, and `no-misused-observables`. ([#185](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/185)) ([b69756e](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/b69756e8fc3c27de4e0cc6e244d179a90075601a))

### Chores

- The `docs` folder of Markdown documentation is no longer published to npm. ([#186](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/186)) ([cd82f47](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/cd82f474649adcc10cd4f506b88df5b7eebd6d2a))

## v0.7.1 (2025-04-16)

### Features

- **no-topromise**: suggest `lastValueFrom(..., { defaultValue: undefined })`. ([#184](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/184)) ([940ee0c](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/940ee0cbfbe1ff1a94b22e8abf405993a14258b1))

## v0.7.0 (2025-03-12)

### Breaking Changes

- typescript-eslint ^8.19.0 is required ([#135](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/135)) ([e5e4f7c](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/e5e4f7c4be7fbae1a5c7e7fd2f32e1f9b589dc2f))
- Bump ts-api-utils to ^2.

### Features

- The URL for each rule now aligns with the installed version of this plugin, instead of latest main. ([bf70419](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/bf704199497eafb7d8e8fe44149489a9b2e88e05))

## v0.6.2 (2025-01-08)

### Features

- **no-redundant-notify**: also catch `unsubscribe`. ([#113](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/113)) ([d42dd58](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/d42dd58bbc6095c1c6a11b3f413e260b091146a4))

### Documentation

- add complete documentation on when _not_ to use each rule. ([#91](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/91)) ([f4b16eb](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/f4b16eb1f4461b3f36eb7c40cadf99d8b60cebf3))
- **no-subject-unsubscribe**: document behavior that bans passing subjects to `Subscription`'s `add` method. ([#112](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/112)) ([3ca435b](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/3ca435b1f8e70677f0d5d818892ed508189b694a))

## v0.6.1 (2024-12-06)

### Features

- **no-explicit-generics**: removed from `strict` configuration due to known issue. ([#78](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/78)) ([c97c29f](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/c97c29fd8ab6c363eb1b7c62360d69fc6f8e0c97))

## v0.6.0 (2024-12-04)

### Breaking Changes

- **no-subscribe-in-pipe**: added to recommended and strict configurations. ([#59](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/59)) ([26fe38b](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/26fe38b38af9dcacc9f5c8d4c5db2c4c2c4480f9))
- TypeScript >= 4.8.4 is required ([#68](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/68)) ([7e412aa](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/7e412aa08f93d303c664b22d09360c48d53513fc))

### Features

- **no-subscribe-in-pipe**: new rule to forbid calling `subscribe` within `pipe`. ([#59](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/59)) ([26fe38b](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/26fe38b38af9dcacc9f5c8d4c5db2c4c2c4480f9))

## v0.5.1 (2024-12-03)

### Features

- **no-misused-observables**: new rule similar to `@typescript-eslint/no-misused-promises`. ([#58](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/58)) ([41c7be8](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/41c7be8976b3941b4a9f3e9bb4aa6105978509b6))
  - enabled in the strict configuration.
- add `name` to each configuration. ([#75](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/75)) ([c3b3b33](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/c3b3b33e42235936ad2b6e49231c579088acc52c))

## v0.5.0 (2024-11-28)

### Breaking Changes

- **no-ignored-observable**: rule removed. Use `no-floating-observables` instead. ([#55](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/55)) ([1268dc8](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/1268dc86741a37a71d5b1994b8702a8c3874db4d))
- RxJS ^7.2.0 is required ([#56](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/56)) ([ada5d55](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ada5d55ef29aa07ece11a72a0322dc58c686498a))

### Features

- **no-floating-observables**: new rule which replaces and improves upon `no-ignored-observable`. Adds `ignoreVoid` option which defaults to `true`. ([#55](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/55)) ([1268dc8](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/1268dc86741a37a71d5b1994b8702a8c3874db4d))
- Enabled four more rules in the recommended configuration. ([#56](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/56)) ([ada5d55](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ada5d55ef29aa07ece11a72a0322dc58c686498a))
  - `no-topromise`
  - `prefer-observer`
  - `prefer-root-operators`
  - `throw-error`

## v0.4.1 (2024-11-26)

First (pre)release with provenance.

## v0.4.0 (2024-11-24)

### Breaking Changes

- **no-implicit-any-catch**: default to allow explicit `any` ([#42](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/42)) ([93ef8e8](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/93ef8e8c7a0d3d93142e901dabb17db78a84a2cd))

### Features

- add a strict configuration: ([#41](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/41)) ([f2bf3fa](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/f2bf3fadcbe72dfec5c69db8ec683dc2b7a62a2a))

## v0.3.2 (2024-11-21)

### Features

- **prefer-root-operators**: new rule for migrating from `rxjs/operators` to `rxjs` ([#34](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/34)) ([e3b8090](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/e3b8090a6f2ad346ddeaedb9f5d46543c497f323))
- **no-topromise**: suggest `lastValueFrom` or `firstValueFrom` ([#38](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/38)) ([cec2d60](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/cec2d604931a2862aff38a3d4354dea8a7b66ada))

### Chores

- **no-compat**: deprecated ([#32](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/32)) ([05862a3](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/05862a334ea6e7139fa8f809a6da0c008d4af2e6))

## v0.3.1 (2024-11-16)

### Bug Fixes

- **no-ignored-error**: fix observer objects not getting checked for `error` property ([#27](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/27)) ([46e105f](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/46e105fde371a2013713f5e141b2c67ab039bd07))

## v0.3.0 (2024-11-15)

### Breaking Changes

- **ban-operators**: improve type checking of banned operators, report error at usage instead of in import statement ([#25](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/25)) ([994ff25](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/994ff25391cc4efbb2f2cfa99c323c7280e9d1b5))
- **throw-error**: stop linting regular `throw` statements ([#22](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/22)) ([02fdffd](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/02fdffde6b9376621b902d2ebbae4fb8080d29f1))

### Features

- **no-ignored-default-value**: new rule for enforcing `defaultValue` ([#15](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/15)) ([9bd896e](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/9bd896e0acb87cce2931ecda8b683fb5e9a8837c))

## v0.2.4 (2024-11-09)

### Features

- **macro**: deprecated ([#13](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/13)) ([39be258](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/39be258ad359bd1e79f057302d7ffe12954f9c14))

## v0.2.3 (2024-11-08)

### Bug Fixes

- **no-ignored-replay-buffer**: check config bufferSize ([#12](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/12)) ([ef2f886](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ef2f8866684ed6f918eb8c465e90a1de8982186a))

### Chores

- change `rxjs` to an optional peer dependency ([90b03e6](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/90b03e6a01e0357603eb6426638ca43e0f392dca))

## v0.2.2 (2024-11-07)

### Breaking Changes

- TypeScript >=4.7.4 is required

### Bug Fixes

- fix broken imports in ESM configs using TypeScript versions lower than 5.5 ([#11](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/11)) ([1693df0](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/1693df0423acb1eb7cef237620ed31d2ee5520fa))

## v0.2.1 (2024-11-07)

### Chores

- decrease minimum `typescript-eslint` version to ^8.1.0 ([#10](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/10)) ([e7d0d70](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/e7d0d7078b50d1ef72c48318159a80ce481ef73c))

## v0.2.0 (2024-11-05)

### Breaking Changes

- improve CommonJS typing to avoid needing `.default` ([#4](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/4)) ([0b47390](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/0b473900c141403a1eb45e5a44fd2f2b43ebb6d5))

### Documentation

- add options documentation to rule docs ([#6](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/6)) ([ee705d2](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/ee705d23efe7c779bfabb855e82130c664ba35c4))

## v0.1.0 (2024-11-04)

### Breaking Changes

- TypeScript >=4.2.0 is required
- `tslib` ^2.1.0 is required

### Chores

- drop dependencies `tsutils` and `tsutils-etc`, add dependency `ts-api-utils` ([#3](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/3)) ([c64f9f6](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/c64f9f6bd810f7d114c9dac9f6ab72df1b2d2e31))

## v0.0.2 (2024-11-01)

### Bug Fixes

- fix wrong types for CommonJS ([#2](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/pull/2)) ([2d330aa](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/commit/2d330aa943f31bbb7831607c0573b9c8e41d8268))

## v0.0.1 (2024-11-01)

Initial prerelease version.

### Breaking Changes

- `eslint` ^8.57.0 || 9.0.0 is required
- `typescript-eslint` ^8 is required
- Node.js ^18.18.0 || ^20.9.0 || >= 21.1.0 is required

### Bug Fixes

- **no-implicit-any-catch**: fix `typeAnnotation` bug breaking linting.

### Chores

- drop dependency `eslint-etc`
- drop dependency `requireindex`
- add `rxjs` >=7 as peer dependency
- add `requiresTypeChecking` to `meta.docs` of relevant rules
- switch from mocha to vitest
