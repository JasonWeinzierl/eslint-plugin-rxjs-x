# Enforce passing only `Error` values to error notifications (`rxjs-x/throw-error`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule forbids throwing values that are neither `Error` nor `DOMException` instances.

## Rule details

Examples of **incorrect** code for this rule:

```ts
throw "Kaboom!";
```

```ts
import { throwError } from "rxjs";
throwError("Kaboom!");
```

```ts
import { throwError } from "rxjs";
throwError(() => "Kaboom!");
```

Examples of **correct** code for this rule:

```ts
throw new Error("Kaboom!");
```

```ts
throw new RangeError("Kaboom!");
```

```ts
throw new DOMException("Kaboom!");
```

```ts
import { throwError } from "rxjs";
throwError(new Error("Kaboom!"));
```

```ts
import { throwError } from "rxjs";
throwError(() => new Error("Kaboom!"));
```
