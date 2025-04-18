# Disallow use of the `toPromise` method (`rxjs-x/no-topromise`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if the `toPromise` method is used.

This rule provides three editor suggestions which replace `toPromise` with either:

- `lastValueFrom(..., { defaultValue: undefined })`, which imitates the behavior of `toPromise`,
- or `lastValueFrom(...)`, which throws `EmptyError` instead of defaulting to `undefined`,
- or `firstValueFrom(...)`.

## When Not To Use It

If you rely on RxJS's deprecation of `toPromise` and don't need to double-flag usage,
then you don't need this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Further reading

- [Conversion to Promises](https://rxjs.dev/deprecations/to-promise)

## Related To

- [`no-ignored-default-value`](./no-ignored-default-value.md)

## Resources

- [Rule source](/src/rules/no-topromise.ts)
- [Test source](/tests/rules/no-topromise.test.ts)
