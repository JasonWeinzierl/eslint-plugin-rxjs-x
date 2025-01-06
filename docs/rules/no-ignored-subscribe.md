# Disallow calling `subscribe` without specifying arguments (`rxjs-x/no-ignored-subscribe`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures whenever `subscribe` is called without handlers.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).pipe(
  tap((value) => console.log(value))
).subscribe();
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";

of(42, 54).subscribe((value) => console.log(value));
```

## When Not To Use It

If you don't care about errors or output of some observables in your project, you may not need this rule.
Alternatively, you may require all logic to go in the `pipe` section of your observables.
In that case, you should not use this rule and should enable [`no-subscribe-handlers`](./no-subscribe-handlers.md) instead,
which is the opposite of this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Related To

- [`no-subscribe-handlers`](./no-subscribe-handlers.md)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-ignored-subscribe.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-ignored-subscribe.test.ts)
