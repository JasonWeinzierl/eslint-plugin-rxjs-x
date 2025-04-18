# Disallow banned observable creators (`rxjs-x/ban-observables`)

<!-- end auto-generated rule header -->

It can sometimes be useful to ban specific `rxjs` imports.
This rule can be configured to ban a list of specific `rxjs` imports developers want to avoid in their project.

> [!TIP]
> `ban-observables` only bans at the _import_ site. (In fact, it can ban anything imported from `rxjs`.)
> See [`ban-operators`](./ban-operators.md) for banning operators at their _usage_.

## Options

This rule accepts a single option which is an object the keys of which are the names of anything in `rxjs` and the values are either booleans or strings containing the explanation for the ban.

The following configuration bans `partition` and `onErrorResumeNext`:

```json
{
  "rxjs-x/ban-observables": [
    "error",
    {
      "partition": true,
      "of": false,
      "onErrorResumeNext": "What is this? Visual Basic?"
    }
  ]
}
```

## When Not To Use It

If you have no need to ban importing anything from `rxjs`, you don't need this rule.

## Related To

- [`ban-operators`](./ban-operators.md)

## Resources

- [Rule source](/src/rules/ban-observables.ts)
- [Test source](/tests/rules/ban-observables.test.ts)
