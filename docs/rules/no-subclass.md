# Disallow subclassing RxJS classes (`rxjs-x/no-subclass`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if an RxJS class is subclassed. Developers are encouraged to avoid subclassing RxJS classes, as some public and protected implementation details might change in the future.

## When Not To Use It

If you need to subclass RxJS classes in your project, then don't use this rule.
However, keep in mind that implementation details may change in the future;
You might consider using ESLint disable comments for specific situations
instead of completely disabling this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-subclass.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-subclass.test.ts)
