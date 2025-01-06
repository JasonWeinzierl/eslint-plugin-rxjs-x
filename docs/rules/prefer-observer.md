# Disallow passing separate handlers to `subscribe` and `tap` (`rxjs-x/prefer-observer`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if `subscribe` - or `tap` - is called with separate handlers instead of an observer.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
of(42, 54).subscribe((value) => console.log(value));
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
of(42, 54).subscribe({
  next: (value) => console.log(value)
});
```

## Options

<!-- begin auto-generated rule options list -->

| Name        | Description                      | Type    | Default |
| :---------- | :------------------------------- | :------ | :------ |
| `allowNext` | Allows a single `next` callback. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `allowNext` property that determines whether a single `next` callback is allowed. By default, `allowNext` is `true`.

```json
{
  "rxjs-x/prefer-observer": [
    "error",
    { "allowNext": false }
  ]
}
```

## When Not To Use It

If you rely on RxJS's deprecation of separate handlers and don't need to double-flag usage,
then you don't need this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Further reading

- [Subscribe Arguments](https://rxjs.dev/deprecations/subscribe-arguments)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/prefer-observer.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/prefer-observer.test.ts)
