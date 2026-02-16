# eslint-plugin-rxjs-x

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/eslint-plugin-rxjs-x.svg)](https://www.npmjs.com/package/eslint-plugin-rxjs-x)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/JasonWeinzierl/eslint-plugin-rxjs-x/badge)](https://scorecard.dev/viewer/?uri=github.com/JasonWeinzierl/eslint-plugin-rxjs-x)

> [!NOTE]
> Forked from [`eslint-plugin-rxjs`](https://github.com/cartant/eslint-plugin-rxjs)
> as the original repository seems [no longer maintained](https://github.com/cartant/eslint-plugin-rxjs/issues/127).

This ESLint plugin is intended to prevent issues with [RxJS 7](https://github.com/ReactiveX/rxjs/tree/7.x).

Most of these rules require TypeScript typed linting and are indicated as such below.

## Installation Guide (Flat Configuration)

See [typescript-eslint's Getting Started](https://typescript-eslint.io/getting-started) for a full ESLint setup guide.

1. Install `eslint-plugin-rxjs-x` using your preferred package manager.
2. Enable typed linting.
    - See [Linting with Type Information](https://typescript-eslint.io/getting-started/typed-linting/) for more information.
3. Import this plugin into your config.
   Add the `rxjsX.configs.recommended` shared config to your configuration like so:

    ```diff
    // @ts-check
    import { defineConfig } from 'eslint/config';
    import tseslint from 'typescript-eslint';
    + import rxjsX from 'eslint-plugin-rxjs-x';

    export default defineConfig({
        extends: [
            tseslint.configs.recommended,
    +       rxjsX.configs.recommended,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    });
    ```

Additionally, consider if the `rxjsX.configs.strict` shared config is right for your project.

## Notable Changes from `eslint-plugin-rxjs`

1. eslintrc is not supported.
2. The namespace of this plugin is `rxjs-x` instead of `rxjs`.
    - e.g. if your ESLint config had `"rxjs/no-subject-value": "error"`, replace it with `"rxjs-x/no-subject-value": "error"`.
    - e.g. if your project had inline comments like `// eslint-disable-next-line rxjs/no-async-subscribe`, replace them with `// eslint-disable-next-line rxjs-x/no-async-subscribe`.
3. `rxjs/no-ignored-observable` is replaced with `rxjs-x/no-floating-observable`.

> [!TIP]
> A complete description of all changes from `eslint-plugin-rxjs` are documented in the [CHANGELOG](CHANGELOG.md) file.

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
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).

| Name                                                                             | Description                                                                                               | 💼   | 🔧 | 💡 | 💭 |
| :------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :--- | :- | :- | :- |
| [ban-observables](docs/rules/ban-observables.md)                                 | Disallow banned observable creators.                                                                      |      |    |    |    |
| [ban-operators](docs/rules/ban-operators.md)                                     | Disallow banned operators.                                                                                |      |    |    | 💭 |
| [finnish](docs/rules/finnish.md)                                                 | Enforce Finnish notation.                                                                                 |      |    |    | 💭 |
| [just](docs/rules/just.md)                                                       | Require the use of `just` instead of `of`.                                                                |      | 🔧 |    |    |
| [no-async-subscribe](docs/rules/no-async-subscribe.md)                           | Disallow passing `async` functions to `subscribe`.                                                        | ✅ 🔒 |    |    | 💭 |
| [no-connectable](docs/rules/no-connectable.md)                                   | Disallow operators that return connectable observables.                                                   |      |    |    | 💭 |
| [no-create](docs/rules/no-create.md)                                             | Disallow the static `Observable.create` and `Subject.create` functions.                                   | ✅ 🔒 |    |    | 💭 |
| [no-cyclic-action](docs/rules/no-cyclic-action.md)                               | Disallow cyclic actions in effects and epics.                                                             |      |    |    | 💭 |
| [no-explicit-generics](docs/rules/no-explicit-generics.md)                       | Disallow unnecessary explicit generic type arguments.                                                     |      |    |    | 💭 |
| [no-exposed-subjects](docs/rules/no-exposed-subjects.md)                         | Disallow public and protected subjects.                                                                   | 🔒   |    |    | 💭 |
| [no-finnish](docs/rules/no-finnish.md)                                           | Disallow Finnish notation.                                                                                |      |    |    | 💭 |
| [no-floating-observables](docs/rules/no-floating-observables.md)                 | Require Observables to be handled appropriately.                                                          | 🔒   |    |    | 💭 |
| [no-ignored-default-value](docs/rules/no-ignored-default-value.md)               | Disallow using `firstValueFrom`, `lastValueFrom`, `first`, and `last` without specifying a default value. | 🔒   |    |    | 💭 |
| [no-ignored-error](docs/rules/no-ignored-error.md)                               | Disallow calling `subscribe` without specifying an error handler.                                         | 🔒   |    |    | 💭 |
| [no-ignored-notifier](docs/rules/no-ignored-notifier.md)                         | Disallow observables not composed from the `repeatWhen` or `retryWhen` notifier.                          | ✅ 🔒 |    |    | 💭 |
| [no-ignored-replay-buffer](docs/rules/no-ignored-replay-buffer.md)               | Disallow using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size.      | ✅ 🔒 |    |    |    |
| [no-ignored-subscribe](docs/rules/no-ignored-subscribe.md)                       | Disallow calling `subscribe` without specifying arguments.                                                |      |    |    | 💭 |
| [no-ignored-subscription](docs/rules/no-ignored-subscription.md)                 | Disallow ignoring the subscription returned by `subscribe`.                                               |      |    |    | 💭 |
| [no-ignored-takewhile-value](docs/rules/no-ignored-takewhile-value.md)           | Disallow ignoring the value within `takeWhile`.                                                           | ✅ 🔒 |    |    |    |
| [no-implicit-any-catch](docs/rules/no-implicit-any-catch.md)                     | Disallow implicit `any` error parameters in `catchError`, `subscribe`, and `tap`.                         | ✅ 🔒 | 🔧 | 💡 | 💭 |
| [no-index](docs/rules/no-index.md)                                               | Disallow importing index modules.                                                                         | ✅ 🔒 |    |    |    |
| [no-internal](docs/rules/no-internal.md)                                         | Disallow importing internal modules.                                                                      | ✅ 🔒 | 🔧 | 💡 |    |
| [no-misused-observables](docs/rules/no-misused-observables.md)                   | Disallow Observables in places not designed to handle them.                                               | 🔒   |    |    | 💭 |
| [no-nested-subscribe](docs/rules/no-nested-subscribe.md)                         | Disallow calling `subscribe` within a `subscribe` callback.                                               | ✅ 🔒 |    |    | 💭 |
| [no-redundant-notify](docs/rules/no-redundant-notify.md)                         | Disallow sending redundant notifications from completed or errored observables.                           | ✅ 🔒 |    |    | 💭 |
| [no-sharereplay](docs/rules/no-sharereplay.md)                                   | Disallow unsafe `shareReplay` usage.                                                                      | ✅ 🔒 |    |    |    |
| [no-sharereplay-before-takeuntil](docs/rules/no-sharereplay-before-takeuntil.md) | Disallow using `shareReplay({ refCount: false })` before `takeUntil`.                                     | 🔒   |    |    |    |
| [no-subclass](docs/rules/no-subclass.md)                                         | Disallow subclassing RxJS classes.                                                                        | 🔒   |    |    | 💭 |
| [no-subject-unsubscribe](docs/rules/no-subject-unsubscribe.md)                   | Disallow calling the `unsubscribe` method of subjects.                                                    | ✅ 🔒 |    |    | 💭 |
| [no-subject-value](docs/rules/no-subject-value.md)                               | Disallow accessing the `value` property of a `BehaviorSubject` instance.                                  |      |    |    | 💭 |
| [no-subscribe-handlers](docs/rules/no-subscribe-handlers.md)                     | Disallow passing handlers to `subscribe`.                                                                 |      |    |    | 💭 |
| [no-subscribe-in-pipe](docs/rules/no-subscribe-in-pipe.md)                       | Disallow calling of `subscribe` within any RxJS operator inside a `pipe`.                                 | ✅ 🔒 |    |    | 💭 |
| [no-topromise](docs/rules/no-topromise.md)                                       | Disallow use of the `toPromise` method.                                                                   | ✅ 🔒 |    | 💡 | 💭 |
| [no-unbound-methods](docs/rules/no-unbound-methods.md)                           | Disallow passing unbound methods.                                                                         | ✅ 🔒 |    |    | 💭 |
| [no-unnecessary-collection](docs/rules/no-unnecessary-collection.md)             | Disallow unnecessary usage of collection arguments with single values.                                    | 🔒   |    |    |    |
| [no-unsafe-catch](docs/rules/no-unsafe-catch.md)                                 | Disallow unsafe `catchError` usage in effects and epics.                                                  |      |    |    | 💭 |
| [no-unsafe-first](docs/rules/no-unsafe-first.md)                                 | Disallow unsafe `first`/`take` usage in effects and epics.                                                |      |    |    | 💭 |
| [no-unsafe-subject-next](docs/rules/no-unsafe-subject-next.md)                   | Disallow unsafe optional `next` calls.                                                                    | ✅ 🔒 |    |    | 💭 |
| [no-unsafe-switchmap](docs/rules/no-unsafe-switchmap.md)                         | Disallow unsafe `switchMap` usage in effects and epics.                                                   |      |    |    | 💭 |
| [no-unsafe-takeuntil](docs/rules/no-unsafe-takeuntil.md)                         | Disallow applying operators after `takeUntil`.                                                            | ✅ 🔒 |    |    | 💭 |
| [prefer-observer](docs/rules/prefer-observer.md)                                 | Disallow passing separate handlers to `subscribe` and `tap`.                                              | ✅ 🔒 | 🔧 | 💡 | 💭 |
| [prefer-root-operators](docs/rules/prefer-root-operators.md)                     | Disallow importing operators from `rxjs/operators`.                                                       | ✅ 🔒 | 🔧 | 💡 |    |
| [suffix-subjects](docs/rules/suffix-subjects.md)                                 | Enforce the use of a suffix in subject identifiers.                                                       |      |    |    | 💭 |
| [throw-error](docs/rules/throw-error.md)                                         | Enforce passing only `Error` values to `throwError` or `Subject.error`.                                   | ✅ 🔒 |    | 💡 | 💭 |

<!-- end auto-generated rules list -->
