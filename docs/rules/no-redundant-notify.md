# Disallow sending redundant notifications from completed or errored observables (`rxjs-x/no-redundant-notify`)

💼 This rule is enabled in the following configs: ✅ `recommended`, 🔒 `strict`.

💭 This rule requires [type information](https://typescript-eslint.io/linting/typed-linting).

<!-- end auto-generated rule header -->

This rule effects failures if an attempt is made to send a notification to an observer after a `complete` or `error` notification has already been sent,
or if `unsubscribe` has been called.

Note that the rule _does not perform extensive analysis_. It uses a straightforward and limited approach to catch obviously redundant notifications.

## Rule details

Examples of **incorrect** code for this rule:

```ts
import { Subject } from "rxjs";

const subject = new Subject<number>();
subject.next(42);
subject.error(new Error("Kaboom!"));
subject.complete();
```

Examples of **correct** code for this rule:

```ts
import { Subject } from "rxjs";

const subject = new Subject<number>();
subject.next(42);
subject.error(new Error("Kaboom!"));
```

## When Not To Use It

If you don't care about redundant notifications, then you don't need this rule.

Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.

## Related To

- [`no-subject-unsubscribe`](./no-subject-unsubscribe.md)

## Resources

- [Rule source](/src/rules/no-redundant-notify.ts)
- [Test source](/tests/rules/no-redundant-notify.test.ts)
