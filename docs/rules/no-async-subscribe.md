# Disallow passing `async` functions to `subscribe` (`rxjs-x/no-async-subscribe`)

💼 This rule is enabled in the ✅ `recommended` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if async functions are passed to `subscribe`.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
of(42).subscribe(async () => console.log(value));
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
of(42).subscribe(() => console.log(value));
```

## Further reading

- [Why does this rule exist?](https://stackoverflow.com/q/71559135)
