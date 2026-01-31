# Disallow ignoring of observables returned by functions (`rxjs-x/no-ignored-observable`)

❌ This rule is deprecated. It was replaced by [`rxjs-x/no-floating-observables`](no-floating-observables.md).

<!-- end auto-generated rule header -->

This effects failures if an observable returned by a function is neither assigned to a variable or property or passed to a function.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
of(42, 54);
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
const answers = of(42, 54);
```

## Related To

- [`no-floating-observables`](./no-floating-observables.md)

## Resources

- [Rule source](/src/rules/no-ignored-observable.ts)
- [Test source](/tests/rules/no-ignored-observable.test.ts)
