# Disallow using `shareReplay({ refCount: false })` before `takeUntil` (`rxjs-x/no-sharereplay-before-takeuntil`)

💼 This rule is enabled in the 🔒 `strict` config.

<!-- end auto-generated rule header -->

This rule effects failures if the `shareReplay` operator is used without its reference counting behavior
and placed in an observable composition before `takeUntil`.

## Rule details

Examples of **incorrect** code for this rule:

```ts
source.pipe(
    shareReplay(),
    takeUntil(notifier),
);
```

Examples of **correct** code for this rule:

```ts
source.pipe(
    shareReplay({ refCount: true }),
    takeUntil(notifier),
);
```

## Options

<!-- begin auto-generated rule options list -->

| Name             | Description                              | Type  | Default                |
| :--------------- | :--------------------------------------- | :---- | :--------------------- |
| `takeUntilAlias` | List of operators to treat as takeUntil. | Array | [`takeUntilDestroyed`] |

<!-- end auto-generated rule options list -->

This rule accepts a single option which allows specifying any potential aliases for `takeUntil`. The purpose of this is to enforce the "no `shareReplay` before" rule on other operators that are used as `takeUntil()`. The default configuration is Angular friendly by specifying
[`takeUntilDestroyed`](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed)
as an alias.

## When Not To Use It

If you are confident your project uses `shareReplay` and `takeUntil` correctly,
then you may not need this rule.

## Further reading

- [Avoiding takeUntil leaks#An update](https://ncjamieson.com/avoiding-takeuntil-leaks/#an-update)

## Resources

- [Rule source](/src/rules/no-sharereplay-before-takeuntil.ts)
- [Test source](/tests/rules/no-sharereplay-before-takeuntil.test.ts)
