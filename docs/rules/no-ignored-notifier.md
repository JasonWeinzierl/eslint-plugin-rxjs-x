# Disallow observables not composed from the `repeatWhen` or `retryWhen` notifier (`rxjs-x/no-ignored-notifier`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if the notifier passed to a `repeatWhen` or `retryWhen` callback is not used.

> [!NOTE]
> Both `repeatWhen` and `retryWhen` are deprecated by RxJS,
> so this rule may be removed in a future major version.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { range } from "rxjs";
import { repeatWhen, take } from "rxjs/operators";

const repeating = source.pipe(
  repeatWhen(notifications => range(0, 3))
);
```

Examples of **correct** code for this rule:

```ts
import { repeatWhen, take } from "rxjs/operators";

const repeating = source.pipe(
  repeatWhen(notifications => notifications.pipe(take(3)))
);
```

## When Not To Use It

If you don't use `repeatWhen` or `retryWhen` in your project, then you don't need this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-ignored-notifier.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-ignored-notifier.test.ts)
