# Disallow calling `subscribe` within a `subscribe` callback (`rxjs-x/no-nested-subscribe`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if `subscribe` is called within a `subscribe` handler.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of, timer } from "rxjs";

of(42, 54).subscribe((value) => {
  timer(1e3).subscribe(() => console.log(value));
});
```

Examples of **correct** code for this rule:

```ts
import { of, timer } from "rxjs";
import { map, mergeMap } from "rxjs/operators";

of(42, 54).pipe(
  mergeMap((value) => timer(1e3).pipe(map(() => value)))
).subscribe((value) => console.log(value));
```

## When Not To Use It

If you need nested subscriptions and are aware of the potential issues,
then you might not need this rule.
However, you should typically prefer to use higher-order mapping operators
like `mergeMap`, `switchMap`, or `concatMap` to handle nested observables.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-nested-subscribe.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-nested-subscribe.test.ts)
