# Disallow importing index modules (`rxjs-x/no-index`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

<!-- end auto-generated rule header -->

This rule effects failures if an index module is specified as the import location.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { of } from "rxjs/index";
```

Examples of **correct** code for this rule:

```ts
import { of } from "rxjs";
```

## When Not To Use It

If you don't care about unnecessary import path segments, then you don't need this rule.

## Further reading

- [Importing instructions](https://rxjs.dev/guide/importing)

## Resources

- [Rule source](/src/rules/no-index.ts)
- [Test source](/tests/rules/no-index.test.ts)
