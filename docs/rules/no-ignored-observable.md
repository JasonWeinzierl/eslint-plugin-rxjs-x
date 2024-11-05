# Disallow ignoring observables returned by functions (`rxjs-x/no-ignored-observable`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

The effects failures if an observable returned by a function is neither assigned to a variable or property or passed to a function.

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
