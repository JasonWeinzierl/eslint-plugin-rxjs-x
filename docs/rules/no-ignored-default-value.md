# Disallow using `firstValueFrom`, `lastValueFrom`, `first`, and `last` without specifying a default value (`rxjs-x/no-ignored-default-value`)

💼 This rule is enabled in the 🔒 `strict` config.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule prevents `EmptyError` rejections if there were no emissions from `firstValueFrom`, `lastValueFrom`, `first`, or `last` by requiring `defaultValue`.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { Subject, firstValueFrom } from "rxjs";

const sub = new Subject();
const result = firstValueFrom(sub);
sub.complete();
```

Examples of **correct** code for this rule:

```ts
import { Subject, firstValueFrom } from "rxjs";

const sub = new Subject();
const result = firstValueFrom(sub, { defaultValue: null });
sub.complete();
```

## When Not To Use It

If you intentionally want `EmptyError` rejections when the observable completes, then you may not need this rule.
You might consider using ESLint disable comments for specific situations instead of completely disabling this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-ignored-default-value.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-ignored-default-value.test.ts)
