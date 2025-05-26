# Disallow ignoring the subscription returned by `subscribe` (`rxjs-x/no-ignored-subscription`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if an subscription returned by call to `subscribe` is neither assigned to a variable or property or passed to a function.

This rule is aware of operators which can automatically complete the observable (see the rule's options, below)
and will not effect failures if they are present in the `pipe` before calling `subscribe`.
(Note this does not work if you compose an observable into a variable and subscribe later.)

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

Operators that automatically unsubscribe will let the subscription be ignored:

```ts
interval(1e3).pipe(take(3)).subscribe(
  (value) => console.log(value)
);
```

When subscribers are passed to `subscribe` they are chained, so the returned subscription can be ignored:

```ts
const numbers = new Observable<number>(subscriber => {
  interval(1e3).subscribe(subscriber);
});
```

## Options

<!-- begin auto-generated rule options list -->

| Name             | Description                                                                         | Type     | Default                                                                                                                                                                                                                                                    |
| :--------------- | :---------------------------------------------------------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `completers`     | An array of operator names that will complete the observable and silence this rule. | String[] | [`takeUntil`, `takeWhile`, `take`, `first`, `last`, `takeUntilDestroyed`]                                                                                                                                                                                  |
| `postCompleters` | An array of operator names that are allowed to follow the completion operators.     | String[] | [`count`, `defaultIfEmpty`, `endWith`, `every`, `finalize`, `finally`, `isEmpty`, `last`, `max`, `min`, `publish`, `publishBehavior`, `publishLast`, `publishReplay`, `reduce`, `share`, `shareReplay`, `skipLast`, `takeLast`, `throwIfEmpty`, `toArray`] |

<!-- end auto-generated rule options list -->

## When Not To Use It

If you don't care about unsubscribing from all observables in your project, then you may not need this rule.
Alternatively, your project might compose observables with operators like `take`, `takeUntil`, `takeWhile`, etc.
or Angular's `takeUntilDestroyed` and then call `subscribe` elsewhere, which cannot be detected by this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](/src/rules/no-ignored-subscription.ts)
- [Test source](/tests/rules/no-ignored-subscription.test.ts)
