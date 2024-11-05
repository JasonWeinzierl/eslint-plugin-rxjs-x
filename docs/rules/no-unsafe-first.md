# Disallow unsafe `first`/`take` usage in effects and epics (`rxjs-x/no-unsafe-first`)

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if `first` is used in an effect or epic in a manner that will complete the outermost observable.

## Options

<!-- begin auto-generated rule options list -->

| Name         | Type   |
| :----------- | :----- |
| `observable` | String |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `observable` property that is a regular expression used to match an effect or epic's actions observable. The default `observable` regular expression should match most effect and epic action sources.

```json
{
  "rxjs-x/no-unsafe-first": [
    "error",
    { "observable": "[Aa]ction(s|s\\$|\\$)$" }
  ]
}
```
