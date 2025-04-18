# Disallow banned operators (`rxjs-x/ban-operators`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule can be configured so that developers can ban `rxjs` operators they want to avoid in their project.

> [!NOTE]
> Operators outside of a `pipe` or not directly exported by `rxjs` are ignored.

## Options

This rule accepts a single option which is an object the keys of which are the names of operators and the values are either booleans or strings containing the explanation for the ban.

The following configuration bans `partition` and `onErrorResumeNext`:

```json
{
  "rxjs-x/ban-operators": [
    "error",
    {
      "partition": true,
      "map": false,
      "onErrorResumeNext": "What is this? Visual Basic?"
    }
  ]
}
```

## When Not To Use It

If you have no need to ban `rxjs` operators, you don't need this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Related To

- [`ban-observables`](./ban-observables.md)

## Resources

- [Rule source](/src/rules/ban-operators.ts)
- [Test source](/tests/rules/ban-operators.test.ts)
