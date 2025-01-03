# Disallow operators that return connectable observables (`rxjs-x/no-connectable`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule prevents the use of operators that return connectable observables.

Note that all operators banned by this rule are also deprecated by RxJS,
so this rule may be removed in a future major version.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of, publish } from "rxjs";

const result = of(42).pipe(publish());
```

## When Not To Use It

If you use operators that return connectable observables in your project, you may not need this rule.
Or you may rely on RxJS's deprecation of those operators and don't need to double-flag the operators as banned.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-connectable.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-connectable.test.ts)
