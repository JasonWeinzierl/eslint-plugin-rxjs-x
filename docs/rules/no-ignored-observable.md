# Disallow ignoring observables returned by functions (`rxjs-x/no-ignored-observable`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

The effects failures if an observable returned by a function is neither assigned to a variable or property or passed to a function.
This rule is like [no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/) but for Observables.

This rule will report Observable-valued statements that are not treated in one of the following ways:

- Calling its `.subscribe()`
- `return`ing it
- Wrapping it in `lastValueFrom` or `firstValueFrom` and `await`ing it
- [`void`ing it](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

> [!TIP]
> `no-ignored-observable` only detects apparently unhandled Observable _statements_.

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
