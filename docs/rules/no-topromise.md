# Disallow use of the `toPromise` method (`rxjs-x/no-topromise`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if the `toPromise` method is used.

This rule provides two editor suggestions which replace `toPromise` with either:

- `lastValueFrom(...)`, which behaves closest to the behavior of `toPromise`,
- or `firstValueFrom(...)`.

## When Not To Use It

If you rely on RxJS's deprecation of `toPromise` and don't need to double-flag usage,
then you don't need this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Further reading

- [Conversion to Promises](https://rxjs.dev/deprecations/to-promise)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-topromise.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-topromise.test.ts)
