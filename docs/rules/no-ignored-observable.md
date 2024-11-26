# Disallow ignoring observables returned by functions (`rxjs-x/no-ignored-observable`)

❌ This rule is deprecated. It was replaced by [`rxjs-x/no-floating-observables`](no-floating-observables.md).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

The effects failures if an observable returned by a function is neither assigned to a variable or property or passed to a function.

> [!WARNING]
> This rule is being replaced by `no-floating-observables`.
> The new rule has been expanded to handle more expression types.
>
> The current rule `no-ignored-observable` will be removed in a future major version.

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
