# eslint-plugin-rxjs-x

This package contains a bunch of ESLint v9+ rules for RxJS.
It is a fork of [`eslint-plugin-rxjs`](https://github.com/cartant/eslint-plugin-rxjs)
initially started to support the new ESLint flat config format.
The original package is itself a re-implementation of the rules that are in the [`rxjs-tslint-rules`](https://github.com/cartant/rxjs-tslint-rules) package.
(The Angular-specific rules in `rxjs-tslint-rules` have been re-implemented in [`eslint-plugin-rxjs-angular`](https://github.com/cartant/eslint-plugin-rxjs-angular).)

Some of the rules are rather opinionated and are not included in the `recommended` configuration. Developers can decide for themselves whether they want to enable opinionated rules.

Almost all of these rules require the TypeScript parser for ESLint and are indicated as such below.

## Install

See [typescript-eslint's Getting Started](https://typescript-eslint.io/getting-started) for a full ESLint setup guide.

Then use the `recommended` configuration in your `eslint.config.mjs`:

```js
// @ts-check
import tseslint from 'typescript-eslint';
import rxjsX from 'eslint-plugin-rxjs-x';

export default tseslint.config({
    extends: [
        rxjsX.configs.recommended,
    ],
    languageOptions: {
        parserOptions: {
            projectService: true,
        },
    },
});
```

## Rules

The package includes the following rules.

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).\
💡 Manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).\
💭 Requires [type information](https://typescript-eslint.io/linting/typed-linting).\
❌ Deprecated.

| Name                                                                   | Description                                                                                         | 💼 | 🔧 | 💡 | 💭 | ❌ |
| :--------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :- | :- | :- | :- | :- |
| [ban-observables](docs/rules/ban-observables.md)                       | Forbids the use of banned observables.                                                              |    |    |    |    |    |
| [ban-operators](docs/rules/ban-operators.md)                           | Forbids the use of banned operators.                                                                |    |    |    |    |    |
| [finnish](docs/rules/finnish.md)                                       | Enforces the use of Finnish notation.                                                               |    |    |    | 💭 |    |
| [just](docs/rules/just.md)                                             | Enforces the use of a `just` alias for `of`.                                                        |    | 🔧 |    |    |    |
| [macro](docs/rules/macro.md)                                           | Enforces the use of the RxJS Tools Babel macro.                                                     |    | 🔧 |    |    |    |
| [no-async-subscribe](docs/rules/no-async-subscribe.md)                 | Forbids passing `async` functions to `subscribe`.                                                   | ✅ |    |    | 💭 |    |
| [no-compat](docs/rules/no-compat.md)                                   | Forbids importation from locations that depend upon `rxjs-compat`.                                  |    |    |    |    |    |
| [no-connectable](docs/rules/no-connectable.md)                         | Forbids operators that return connectable observables.                                              |    |    |    | 💭 |    |
| [no-create](docs/rules/no-create.md)                                   | Forbids the calling of `Observable.create`.                                                         | ✅ |    |    | 💭 |    |
| [no-cyclic-action](docs/rules/no-cyclic-action.md)                     | Forbids effects and epics that re-emit filtered actions.                                            |    |    |    | 💭 |    |
| [no-explicit-generics](docs/rules/no-explicit-generics.md)             | Forbids explicit generic type arguments.                                                            |    |    |    |    |    |
| [no-exposed-subjects](docs/rules/no-exposed-subjects.md)               | Forbids exposed (i.e. non-private) subjects.                                                        |    |    |    | 💭 |    |
| [no-finnish](docs/rules/no-finnish.md)                                 | Forbids the use of Finnish notation.                                                                |    |    |    | 💭 |    |
| [no-ignored-error](docs/rules/no-ignored-error.md)                     | Forbids the calling of `subscribe` without specifying an error handler.                             |    |    |    | 💭 |    |
| [no-ignored-notifier](docs/rules/no-ignored-notifier.md)               | Forbids observables not composed from the `repeatWhen` or `retryWhen` notifier.                     | ✅ |    |    | 💭 |    |
| [no-ignored-observable](docs/rules/no-ignored-observable.md)           | Forbids the ignoring of observables returned by functions.                                          |    |    |    | 💭 |    |
| [no-ignored-replay-buffer](docs/rules/no-ignored-replay-buffer.md)     | Forbids using `ReplaySubject`, `publishReplay` or `shareReplay` without specifying the buffer size. | ✅ |    |    |    |    |
| [no-ignored-subscribe](docs/rules/no-ignored-subscribe.md)             | Forbids the calling of `subscribe` without specifying arguments.                                    |    |    |    | 💭 |    |
| [no-ignored-subscription](docs/rules/no-ignored-subscription.md)       | Forbids ignoring the subscription returned by `subscribe`.                                          |    |    |    | 💭 |    |
| [no-ignored-takewhile-value](docs/rules/no-ignored-takewhile-value.md) | Forbids ignoring the value within `takeWhile`.                                                      | ✅ |    |    |    |    |
| [no-implicit-any-catch](docs/rules/no-implicit-any-catch.md)           | Forbids implicit `any` error parameters in `catchError` operators.                                  | ✅ | 🔧 | 💡 | 💭 |    |
| [no-index](docs/rules/no-index.md)                                     | Forbids the importation from index modules.                                                         | ✅ |    |    |    |    |
| [no-internal](docs/rules/no-internal.md)                               | Forbids the importation of internals.                                                               | ✅ | 🔧 | 💡 |    |    |
| [no-nested-subscribe](docs/rules/no-nested-subscribe.md)               | Forbids the calling of `subscribe` within a `subscribe` callback.                                   | ✅ |    |    | 💭 |    |
| [no-redundant-notify](docs/rules/no-redundant-notify.md)               | Forbids redundant notifications from completed or errored observables.                              | ✅ |    |    | 💭 |    |
| [no-sharereplay](docs/rules/no-sharereplay.md)                         | Forbids using the `shareReplay` operator.                                                           | ✅ |    |    |    |    |
| [no-subclass](docs/rules/no-subclass.md)                               | Forbids subclassing RxJS classes.                                                                   |    |    |    | 💭 |    |
| [no-subject-unsubscribe](docs/rules/no-subject-unsubscribe.md)         | Forbids calling the `unsubscribe` method of a subject instance.                                     | ✅ |    |    | 💭 |    |
| [no-subject-value](docs/rules/no-subject-value.md)                     | Forbids accessing the `value` property of a `BehaviorSubject` instance.                             |    |    |    | 💭 |    |
| [no-subscribe-handlers](docs/rules/no-subscribe-handlers.md)           | Forbids the passing of handlers to `subscribe`.                                                     |    |    |    | 💭 |    |
| [no-tap](docs/rules/no-tap.md)                                         | Forbids the use of the `tap` operator.                                                              |    |    |    |    | ❌ |
| [no-topromise](docs/rules/no-topromise.md)                             | Forbids the use of the `toPromise` method.                                                          |    |    |    | 💭 |    |
| [no-unbound-methods](docs/rules/no-unbound-methods.md)                 | Forbids the passing of unbound methods.                                                             | ✅ |    |    | 💭 |    |
| [no-unsafe-catch](docs/rules/no-unsafe-catch.md)                       | Forbids unsafe `catchError` usage in effects and epics.                                             |    |    |    | 💭 |    |
| [no-unsafe-first](docs/rules/no-unsafe-first.md)                       | Forbids unsafe `first`/`take` usage in effects and epics.                                           |    |    |    | 💭 |    |
| [no-unsafe-subject-next](docs/rules/no-unsafe-subject-next.md)         | Forbids unsafe optional `next` calls.                                                               | ✅ |    |    | 💭 |    |
| [no-unsafe-switchmap](docs/rules/no-unsafe-switchmap.md)               | Forbids unsafe `switchMap` usage in effects and epics.                                              |    |    |    | 💭 |    |
| [no-unsafe-takeuntil](docs/rules/no-unsafe-takeuntil.md)               | Forbids the application of operators after `takeUntil`.                                             | ✅ |    |    | 💭 |    |
| [prefer-observer](docs/rules/prefer-observer.md)                       | Forbids the passing separate handlers to `subscribe` and `tap`.                                     |    | 🔧 | 💡 | 💭 |    |
| [suffix-subjects](docs/rules/suffix-subjects.md)                       | Enforces the use of a suffix in subject identifiers.                                                |    |    |    | 💭 |    |
| [throw-error](docs/rules/throw-error.md)                               | Enforces the passing of `Error` values to error notifications.                                      |    |    |    | 💭 |    |
