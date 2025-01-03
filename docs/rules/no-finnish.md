# Disallow Finnish notation (`rxjs-x/no-finnish`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule prevents the use of Finnish notation.

## Rule details

Examples of **incorrect** code for this rule:

```ts
const answer$ = of(42, 54);
```

Examples of **correct** code for this rule:

```ts
const answers = of(42, 54);
```

## When Not To Use It

If you use Finnish notation in your project or don't care if Finnish notation is used in your project, you don't need this rule.
However, keep in mind that inconsistent style can harm readability in a project.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Further reading

- [Observables and Finnish Notation](https://medium.com/@benlesh/observables-and-finnish-notation-df8356ed1c9b)

## Related To

- [`finnish`](./finnish.md)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-finnish.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-finnish.test.ts)
