# Disallow unnecessary explicit generic type arguments (`rxjs-x/no-explicit-generics`)

<!-- end auto-generated rule header -->

This rule prevents the use of explicit type arguments when the type arguments can be inferred.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { BehaviorSubject } from "rxjs";
const subject = new BehaviorSubject<number>(42);
```

Examples of **correct** code for this rule:

```ts
import { BehaviorSubject } from "rxjs";
const subject = new BehaviorSubject(42);
```

## When Not To Use It

This rule has known problems in the latest release:

- ([#77](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/issues/77)) Type unions cause false positives e.g. `new BehaviorSubject<number | null>(null)` will be incorrectly caught by this rule.

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-explicit-generics.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-explicit-generics.test.ts)
