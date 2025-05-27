# Disallow unnecessary explicit generic type arguments (`rxjs-x/no-explicit-generics`)

<!-- end auto-generated rule header -->

This rule prevents the use of explicit type arguments when the type arguments can be inferred.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { BehaviorSubject } from "rxjs";
const subject = new BehaviorSubject<number>(42); //Adding a type here is not useful
```

Examples of **correct** code for this rule:

```ts
import { BehaviorSubject } from "rxjs";
const subject = new BehaviorSubject(42);
```

```ts
import { BehaviorSubject } from "rxjs";
const subject = new BehaviorSubject<ISomeType | null>(null); //Allow union types to be defined, useful when things can be nullable
```

## Resources

- [Rule source](/src/rules/no-explicit-generics.ts)
- [Test source](/tests/rules/no-explicit-generics.test.ts)
