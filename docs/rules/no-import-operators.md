# Disallow importing operators from `rxjs/operators` (`rxjs-x/no-import-operators`)

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

This rule prevents importing from the `rxjs/operators` export site.
Most operators were moved to the `rxjs` export site in RxJS v7.2.0
(excepting a couple of old and deprecated operators).
The `rxjs/operators` export site has since been deprecated and will be removed in a future major version.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { map } from 'rxjs/operators';
```

Examples of **correct** code for this rule:

```ts
import { map } from 'rxjs';
```

## Further reading

- [Importing instructions](https://rxjs.dev/guide/importing)
