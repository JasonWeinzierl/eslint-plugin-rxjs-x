# Disallow ignoring the subscription returned by `subscribe` (`rxjs-x/no-ignored-subscription`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

The effects failures if an subscription returned by call to `subscribe` is neither assigned to a variable or property or passed to a function.

## Rule details

Examples of **incorrect** code for this rule:

```ts
interval(1e3).subscribe(
  (value) => console.log(value)
);
```

Examples of **correct** code for this rule:

```ts
const subscription = interval(1e3).subscribe(
  (value) => console.log(value)
);
```

When subscribers are passed to `subscribe` they are chained, so the returned subscription can be ignored:

```ts
const numbers = new Observable<number>(subscriber => {
  interval(1e3).subscribe(subscriber);
});
```

## When Not To Use It

If you don't care about unsubscribing from all observables in your project, then you may not need this rule.
Alternatively, your project might use operators like `take`, `takeUntil`, `takeWhile`, etc.
or Angular's `takeUntilDestroyed` to automatically handle subscriptions.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](/src/rules/no-ignored-subscription.ts)
- [Test source](/tests/rules/no-ignored-subscription.test.ts)
