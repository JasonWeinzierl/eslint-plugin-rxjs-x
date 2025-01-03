# Require the use of `just` instead of `of` (`rxjs-x/just`)

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

This rule enforces the use of `just` instead of `of`. Some other languages with Rx implementations use the former and this rule is for developers who have that preference.

## When Not To Use It

If you prefer `of` in your project, you will want to avoid this rule.

## Further reading

- [Rename `of` to `just`](https://github.com/ReactiveX/rxjs/issues/3747)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/just.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/just.test.ts)
