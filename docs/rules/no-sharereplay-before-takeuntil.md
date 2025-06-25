# Disallow using `shareReplay({ refCount: false })` before `takeUntil` (`rxjs-x/no-sharereplay-before-takeuntil`)

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

## When Not To Use It

If you are confident your project uses `shareReplay` and `takeUntil` correctly,
then you may not need this rule.

## Further reading

- [Avoiding takeUntil leaks#An update](https://ncjamieson.com/avoiding-takeuntil-leaks/#an-update)

## Resources

- [Rule source](/src/rules/no-sharereplay-before-takeuntil.ts)
- [Test source](/tests/rules/no-sharereplay-before-takeuntil.test.ts)
