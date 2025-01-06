# Disallow accessing the `value` property of a `BehaviorSubject` instance (`rxjs-x/no-subject-value`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects an error if the `value` property - or `getValue` method - of a `BehaviorSubject` is used.

## When Not To Use It

If your code uses the `value` property or the `getValue` method of `BehaviorSubject`,
then don't enable this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-subject-value.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-subject-value.test.ts)
