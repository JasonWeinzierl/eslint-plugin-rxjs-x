# Disallow unnecessary usage of collection arguments with single values (`rxjs-x/no-unnecessary-collection`)

💼 This rule is enabled in the 🔒 `strict` config.

<!-- end auto-generated rule header -->

This rule effects failures when passing a collection (object or array) containing a single observable
to the static observable creators that accept multiple observables
(`combineLatest`, `forkJoin`, `merge`, `zip`, `concat`, `race`).
Use of these creator functions with only a single observable
can be replaced with direct usage of the observable itself.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { combineLatest, forkJoin, merge, zip, concat, race, of } from "rxjs";

// These incorrect example can be simplified:
const a$ = combineLatest([of(1)]);
const b$ = forkJoin([of('data')]);

const c$ = combineLatest({ value: of(1) });
const d$ = forkJoin({ data: of('hello') });

const e$ = merge(of(1));
const f$ = zip(of(1));
const g$ = concat(of(1));
const h$ = race(of(1));
```

Examples of **correct** code for this rule:

```ts
import { of, map } from "rxjs";

// These are equivalent to the previous examples:
const a$ = of(1);
const b$ = of('data').pipe(map(x => [x]));

const c$ = of(1).pipe(map(x => ({ value: x })))
const d$ = of('hello').pipe(map(x => ({ data: x })));

const e$ = of(1);
const f$ = of(1).pipe(map(x => [x]));
const g$ = of(1);
const h$ = of(1);
```

## When Not To Use It

If you don't care about unnecessary usage of static observable creators,
then you don't need this rule.

## Resources

- [Rule source](/src/rules/no-unnecessary-collection.ts)
- [Test source](/tests/rules/no-unnecessary-collection.test.ts)
