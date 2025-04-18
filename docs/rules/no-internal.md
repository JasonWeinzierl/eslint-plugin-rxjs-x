# Disallow importing internal modules (`rxjs-x/no-internal`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

🔧💡 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix) and manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule effects failures if an internal module is specified as the import location.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs/internal/observable/of";
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
```

## When Not To Use It

If you need to import internal modules that are not covered by the public API,
then you don't need this rule.
However, keep in mind that internal modules may change without notice.

## Further reading

- [Importing instructions](https://rxjs.dev/guide/importing)

## Resources

- [Rule source](/src/rules/no-internal.ts)
- [Test source](/tests/rules/no-internal.test.ts)
