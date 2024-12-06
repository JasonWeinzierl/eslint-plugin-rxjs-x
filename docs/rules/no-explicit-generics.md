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

## Known problems

- ([#77](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/issues/77)) Type unions cause false positives e.g. `new BehaviorSubject<number | null>(null)` will be incorrectly caught by this rule.
