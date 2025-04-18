# Require Observables to be handled appropriately (`rxjs-x/no-floating-observables`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

A "floating" observable is one that is created without any code set up to handle any errors it might emit.
Like a floating Promise, floating observables can cause several issues, such as ignored errors, unhandled cold observables, and more.

This rule is like [no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises/) but for Observables.
This rule will report observable-valued statements that are not treated in one of the following ways:

- Calling its `.subscribe()`
- `return`ing it
- Wrapping it in `lastValueFrom` or `firstValueFrom` and `await`ing it
- [`void`ing it](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void)

> [!TIP]
> `no-floating-observables` only detects apparently unhandled observable _statements_.
> See [`no-misused-observables`](./no-misused-observables.md) for detecting code that provides observables to _logical_ locations.

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

## Options

<!-- begin auto-generated rule options list -->

| Name         | Description                           | Type    | Default |
| :----------- | :------------------------------------ | :------ | :------ |
| `ignoreVoid` | Whether to ignore `void` expressions. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

## When Not To Use It

Like `@typescript-eslint/no-floating-promises`,
this rule can be difficult to enable on large existing projects that set up many floating observables.
Alternatively, if you're not worried about ignored errors or unhandled cold observables,
then in some cases it may be safe to not use this rule.
You might consider using `void`s and/or ESLint disable comments for those specific situations
instead of completely disabling this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Related To

- [`no-misused-observables`](./no-misused-observables.md)

## Resources

- [Rule source](/src/rules/no-floating-observables.ts)
- [Test source](/tests/rules/no-floating-observables.test.ts)
