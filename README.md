# eslint-plugin-rxjs-x

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-rxjs-x.svg)](https://www.npmjs.com/package/eslint-plugin-rxjs-x)

This ESLint plugin is intended to prevent issues with [RxJS](https://github.com/ReactiveX/rxjs).

Most of these rules require TypeScript typed linting and are indicated as such below.

## Migration Guide from `eslint-plugin-rxjs`

This project started as a fork of [`eslint-plugin-rxjs`](https://github.com/cartant/eslint-plugin-rxjs)
but has since introduced new features which involve breaking changes.

1. Migrate your config from the old `.eslintrc` format to `eslint.config.mjs` (or similar), and uninstall `eslint-plugin-rxjs`.
    - See ESLint's guide here: [https://eslint.org/docs/latest/use/configure/migration-guide].
    - If you need to continue using the deprecated format, use the original `eslint-plugin-rxjs` or a different fork.
2. Install `eslint-plugin-rxjs-x`, and import it into your config.

    ```diff
    + import rxjsX from 'eslint-plugin-rxjs-x';
    ```

3. If you previously used the `plugin:rxjs/recommended` shared config, add `rxjsX.configs.recommended` to your `configs` block:

    ```diff
    configs: {
    +   rxjsX.configs.recommended,
    },
    ```

    - Note: `eslint-plugin-rxjs-x` provides a `strict` shared config, so consider using `rxjsX.configs.strict` instead.
4. If you previously did _not_ use a shared config, add the plugin to your `plugins` block with the new namespace:

    ```diff
    plugins: {
    +   'rxjs-x': rxjsX,
    },
    ```

    - Note: this is unnecessary if you are using a shared config.
5. In your `rules` block, replace the namespace `rxjs` with `rxjs-x`:

    ```diff
    -   'rxjs/no-subject-value': 'error',
    +   'rxjs-x/no-subject-value': 'error',
    ```

6. If you previously used `rxjs/no-ignored-observable`, replace it with `rxjs-x/no-floating-observables`.

    ```diff
    -   'rxjs/no-ignored-observable': 'error',
    +   'rxjs-x/no-floating-observables': 'error',
    ```

> [!TIP]
> A complete description of all changes are documented in the [CHANGELOG](CHANGELOG.md) file.

## Installation Guide

See [typescript-eslint's Getting Started](https://typescript-eslint.io/getting-started) for a full ESLint setup guide.

1. Enable typed linting.
    - See [Linting with Type Information](https://typescript-eslint.io/getting-started/typed-linting/) for more information.
2. Start with the `recommended` shared config in your `eslint.config.mjs`.

```js
// @ts-check
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import rxjsX from 'eslint-plugin-rxjs-x';

export default defineConfig({
    extends: [
        ...tseslint.configs.recommended,
        rxjsX.configs.recommended,
    ],
    languageOptions: {
        parserOptions: {
            projectService: true,
        },
    },
});
```

## Configs

<!-- begin auto-generated configs list -->

|    | Name          |
| :- | :------------ |
| ✅  | `recommended` |
| 🔒 | `strict`      |

<!-- end auto-generated configs list -->

## Rules

The package includes the following rules.

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔒 Set in the `strict` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).\
❌ Deprecated.

| Name                                                                             | Description                                                                                               | 💼   | 🔧 | 💡 | 💭 | ❌  |
| :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :--- | :- | :- | :- | :- |
| [ban-observables](docs/rules/ban-observables.md)                                 | Disallow banned observable creators.                                                                      |      |    |    |    |    |
| [ban-operators](docs/rules/ban-operators.md)                                     | Disallow banned operators.                                                                                |      |    |    | 💭 |    |
| [finnish](docs/rules/finnish.md)                                                 | Enforce Finnish notation.                                                                                 |      |    |    | 💭 |    |
| [just](docs/rules/just.md)                                                       | Require the use of `just` instead of `of`.                                                                |      | 🔧 |    |    |    |
| [macro](docs/rules/macro.md)                                                     | Require the use of the RxJS Tools Babel macro.                                                            |      | 🔧 |    |    | ❌  |
| [no-async-subscribe](docs/rules/no-async-subscribe.md)                           | Disallow passing `async` functions to `subscribe`.                                                        | ✅ 🔒 |    |    | 💭 |    |
| [no-compat](docs/rules/no-compat.md)                                             | Disallow the `rxjs-compat` package.                                                                       |      |    |    |    | ❌  |
| [no-connectable](docs/rules/no-connectable.md)                                   | Disallow operators that return connectable observables.                                                   |      |    |    | 💭 |    |
| [no-create](docs/rules/no-create.md)                                             | Disallow the static `Observable.create` function.                                                         | ✅ 🔒 |    |    | 💭 |    |
| [no-cyclic-action](docs/rules/no-cyclic-action.md)                               | Disallow cyclic actions in effects and epics.                                                             |      |    |    | 💭 |    |
| [no-explicit-generics](docs/rules/no-explicit-generics.md)                       | Disallow unnecessary explicit generic type arguments.                                                     |      |    |    |    |    |
| [no-exposed-subjects](docs/rules/no-exposed-subjects.md)                         | Disallow public and protected subjects.                                                                   | 🔒   |    |    | 💭 |    |
| [no-finnish](docs/rules/no-finnish.md)                                           | Disallow Finnish notation.                                                                                |      |    |    | 💭 |    |
| [no-floating-observables](docs/rules/no-floating-observables.md)                 | Require Observables to be handled appropriately.                                                          | 🔒   |    |    | 💭 |    |
| [no-ignored-default-value](docs/rules/no-ignored-default-value.md)               | Disallow using `firstValueFrom`, `lastValueFrom`, `first`, and `last` without specifying a default value. | 🔒   |    |    | 💭 |    |
| [no-ignored-error](docs/rules/no-ignored-error.md)                               | Disallow calling `subscribe` without specifying an error handler.                                         | 🔒   |    |    | 💭 |    |
| [no-ignored-notifier](docs/rules/no-ignored-notifier.md)                         | Disallow observables not composed from the `repeatWhen` or `retryWhen` notifier.                          | ✅ 🔒 |    |    | 💭 |    |
| [no-ignored-replay-buffer](docs/rules/no-ignored-replay-buffer.md)               | Disallow using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.      | ✅ 🔒 |    |    |    |    |
| [no-ignored-subscribe](docs/rules/no-ignored-subscribe.md)                       | Disallow calling `subscribe` without specifying arguments.                                                |      |    |    | 💭 |    |
| [no-ignored-subscription](docs/rules/no-ignored-subscription.md)                 | Disallow ignoring the subscription returned by `subscribe`.                                               |      |    |    | 💭 |    |
| [no-ignored-takewhile-value](docs/rules/no-ignored-takewhile-value.md)           | Disallow ignoring the value within `takeWhile`.                                                           | ✅ 🔒 |    |    |    |    |
| [no-implicit-any-catch](docs/rules/no-implicit-any-catch.md)                     | Disallow implicit `any` error parameters in `catchError` operators.                                       | ✅ 🔒 | 🔧 | 💡 | 💭 |    |
| [no-index](docs/rules/no-index.md)                                               | Disallow importing index modules.                                                                         | ✅ 🔒 |    |    |    |    |
| [no-internal](docs/rules/no-internal.md)                                         | Disallow importing internal modules.                                                                      | ✅ 🔒 | 🔧 | 💡 |    |    |
| [no-misused-observables](docs/rules/no-misused-observables.md)                   | Disallow Observables in places not designed to handle them.                                               | 🔒   |    |    | 💭 |    |
| [no-nested-subscribe](docs/rules/no-nested-subscribe.md)                         | Disallow calling `subscribe` within a `subscribe` callback.                                               | ✅ 🔒 |    |    | 💭 |    |
| [no-redundant-notify](docs/rules/no-redundant-notify.md)                         | Disallow sending redundant notifications from completed or errored observables.                           | ✅ 🔒 |    |    | 💭 |    |
| [no-sharereplay](docs/rules/no-sharereplay.md)                                   | Disallow unsafe `shareReplay` usage.                                                                      | ✅ 🔒 |    |    |    |    |
| [no-sharereplay-before-takeuntil](docs/rules/no-sharereplay-before-takeuntil.md) | Disallow using `shareReplay({ refCount: false })` before `takeUntil`.                                     | 🔒   |    |    |    |    |
| [no-subclass](docs/rules/no-subclass.md)                                         | Disallow subclassing RxJS classes.                                                                        | 🔒   |    |    | 💭 |    |
| [no-subject-unsubscribe](docs/rules/no-subject-unsubscribe.md)                   | Disallow calling the `unsubscribe` method of subjects.                                                    | ✅ 🔒 |    |    | 💭 |    |
| [no-subject-value](docs/rules/no-subject-value.md)                               | Disallow accessing the `value` property of a `BehaviorSubject` instance.                                  |      |    |    | 💭 |    |
| [no-subscribe-handlers](docs/rules/no-subscribe-handlers.md)                     | Disallow passing handlers to `subscribe`.                                                                 |      |    |    | 💭 |    |
| [no-subscribe-in-pipe](docs/rules/no-subscribe-in-pipe.md)                       | Disallow calling of `subscribe` within any RxJS operator inside a `pipe`.                                 | ✅ 🔒 |    |    | 💭 |    |
| [no-tap](docs/rules/no-tap.md)                                                   | Disallow the `tap` operator.                                                                              |      |    |    |    | ❌  |
| [no-topromise](docs/rules/no-topromise.md)                                       | Disallow use of the `toPromise` method.                                                                   | ✅ 🔒 |    | 💡 | 💭 |    |
| [no-unbound-methods](docs/rules/no-unbound-methods.md)                           | Disallow passing unbound methods.                                                                         | ✅ 🔒 |    |    | 💭 |    |
| [no-unsafe-catch](docs/rules/no-unsafe-catch.md)                                 | Disallow unsafe `catchError` usage in effects and epics.                                                  |      |    |    | 💭 |    |
| [no-unsafe-first](docs/rules/no-unsafe-first.md)                                 | Disallow unsafe `first`/`take` usage in effects and epics.                                                |      |    |    | 💭 |    |
| [no-unsafe-subject-next](docs/rules/no-unsafe-subject-next.md)                   | Disallow unsafe optional `next` calls.                                                                    | ✅ 🔒 |    |    | 💭 |    |
| [no-unsafe-switchmap](docs/rules/no-unsafe-switchmap.md)                         | Disallow unsafe `switchMap` usage in effects and epics.                                                   |      |    |    | 💭 |    |
| [no-unsafe-takeuntil](docs/rules/no-unsafe-takeuntil.md)                         | Disallow applying operators after `takeUntil`.                                                            | ✅ 🔒 |    |    | 💭 |    |
| [prefer-observer](docs/rules/prefer-observer.md)                                 | Disallow passing separate handlers to `subscribe` and `tap`.                                              | ✅ 🔒 | 🔧 | 💡 | 💭 |    |
| [prefer-root-operators](docs/rules/prefer-root-operators.md)                     | Disallow importing operators from `rxjs/operators`.                                                       | ✅ 🔒 | 🔧 | 💡 |    |    |
| [suffix-subjects](docs/rules/suffix-subjects.md)                                 | Enforce the use of a suffix in subject identifiers.                                                       |      |    |    | 💭 |    |
| [throw-error](docs/rules/throw-error.md)                                         | Enforce passing only `Error` values to `throwError` or `Subject.error`.                                   | ✅ 🔒 |    |    | 💭 |    |

<!-- end auto-generated rules list -->
