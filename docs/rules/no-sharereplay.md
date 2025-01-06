# Disallow unsafe `shareReplay` usage (`rxjs-x/no-sharereplay`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

This rule effects failures if the `shareReplay` operator is used - or if it is used without specifying a `config` argument.

The behavior of `shareReplay` has changed several times - see the blog post linked below.

## Options

<!-- begin auto-generated rule options list -->

| Name          | Description                                          | Type    | Default |
| :------------ | :--------------------------------------------------- | :------ | :------ |
| `allowConfig` | Allow shareReplay if a config argument is specified. | Boolean | `true`  |

<!-- end auto-generated rule options list -->

This rule accepts a single option which is an object with an `allowConfig` property that that determines whether `shareReplay` is allow if a config argument is specified. By default, `allowConfig` is `true`.

```json
{
  "rxjs-x/no-sharereplay": [
    "error",
    { "allowConfig": true }
  ]
}
```

## When Not To Use It

If you are confident that `shareReplay` is used properly your project,
then you may not need this rule.
However, keep in mind that it's recommended to always provide a config object
that explicitly specifies `refCount` (see linked blog post);
by default, `shareReplay` without any config defaults to `refCount: false`,
which means the source observable will never be unsubscribed from,
potentially leading to unexpected behavior and memory leaks.

## Further reading

- [What's changed with shareReplay](https://ncjamieson.com/whats-changed-with-sharereplay/)

## Resources

- [Rule source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/src/rules/no-sharereplay.ts)
- [Test source](https://github.com/JasonWeinzierl/eslint-plugin-rxjs-x/blob/main/tests/rules/no-sharereplay.test.ts)
