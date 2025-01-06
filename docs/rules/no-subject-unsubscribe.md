# Disallow calling the `unsubscribe` method of subjects (`rxjs-x/no-subject-unsubscribe`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if the `unsubscribe` method is called on subjects.
The method behaves differently to the `unsubscribe` method on subscriptions and is often an error.

## When Not To Use It

If you intentionally use `unsubscribe` to cause errors when subjects are `next`-ed after closing,
then you don't need this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Further reading

- [Closed Subjects](https://ncjamieson.com/closed-subjects/)

## Related To

- [`no-redundant-notify`](./no-redundant-notify.md)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-subject-unsubscribe.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-subject-unsubscribe.test.ts)
