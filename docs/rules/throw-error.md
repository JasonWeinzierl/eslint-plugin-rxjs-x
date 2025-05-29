# Enforce passing only `Error` values to `throwError` or `Subject.error` (`rxjs-x/throw-error`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule forbids passing values that are not `Error` objects to `throwError` or `Subject.error`.
It's similar to the typescript-eslint [`only-throw-error`](https://typescript-eslint.io/rules/only-throw-error/) rule,
but is for the `throwError` Observable creation function or the `Subject.error` method - not `throw` statements.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { throwError, Subject } from "rxjs";

throwError(() => "Kaboom!");

const subject = new Subject<void>();
subject.error("Kaboom!");
```

Examples of **correct** code for this rule:

```ts
import { throwError, Subject } from "rxjs";

throwError(() => new Error("Kaboom!"));

const subject = new Subject<void>();
subject.error(new Error("Kaboom!"));
```

## Options

<!-- begin auto-generated rule options list -->

| Name                   | Description                                                 | Type    | Default |
| :--------------------- | :---------------------------------------------------------- | :------ | :------ |
| `allowThrowingAny`     | Whether to always allow throwing values typed as `any`.     | Boolean | `true`  |
| `allowThrowingUnknown` | Whether to always allow throwing values typed as `unknown`. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

## When Not To Use It

If you don't care about throwing values that are not `Error` objects, then you don't need this rule.
However, keep in mind that, while JavaScript _allows_ throwing any value,
most developer may find this behavior surprising or inconvenient to handle.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](/src/rules/throw-error.ts)
- [Test source](/tests/rules/throw-error.test.ts)
