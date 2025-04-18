# Disallow passing handlers to `subscribe` (`rxjs-x/no-subscribe-handlers`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures whenever `subscribe` is called with handlers.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).subscribe((value) => console.log(value));
```

```ts
import { of } from "rxjs";
import { tap } from "rxjs/operators";

of(42, 54).subscribe({
  next: (value) => console.log(value),
});
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";

of(42, 54)
  .pipe(tap((value) => console.log(value)))
  .subscribe();
```

## When Not To Use It

If you don't require all logic to go in the `pipe` section of your observables, then you don't need this rule.
Also, if your project uses `no-ignored-subscribe`, which is the opposite of this rule, then you should not use this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Related To

- [`no-ignored-subscribe`](./no-ignored-subscribe.md)

## Resources

- [Rule source](/src/rules/no-subscribe-handlers.ts)
- [Test source](/tests/rules/no-subscribe-handlers.test.ts)
