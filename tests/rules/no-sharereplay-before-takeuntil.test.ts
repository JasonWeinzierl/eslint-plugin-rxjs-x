import { stripIndent } from 'common-tags';
import { noSharereplayBeforeTakeuntilRule } from '../../src/rules/no-sharereplay-before-takeuntil';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-sharereplay-before-takeuntil', noSharereplayBeforeTakeuntilRule, {
  valid: [
    stripIndent`
      // with refCount true
      import { of, takeUntil, shareReplay } from "rxjs";

      const a = of("a");
      const b = of("b");

      a.pipe(shareReplay({ refCount: true }), takeUntil(b));
    `,
    stripIndent`
      // with refCount true as const
      import { of, takeUntil, shareReplay } from "rxjs";

      const a = of("a");
      const b = of("b");

      const t = true as const;
      a.pipe(shareReplay({ refCount: t }), takeUntil(b));
    `,
    stripIndent`
      // refCount as variable not supported
      import { of, takeUntil, shareReplay } from "rxjs";

      const a = of("a");
      const b = of("b");

      const t = false;
      a.pipe(shareReplay({ refCount: t }), takeUntil(b));
    `,
    stripIndent`
      // composed observables not supported
      import { of, takeUntil, shareReplay } from "rxjs";

      const a = of("a");
      const b = of("b");

      const sr = shareReplay({ refCount: false });
      a.pipe(sr, takeUntil(b));
    `,
    stripIndent`
      // shareReplay after takeUntil
      import { of, takeUntil, shareReplay } from "rxjs";

      const a = of("a");
      const b = of("b");

      a.pipe(takeUntil(b), shareReplay({ refCount: false }));
    `,
    stripIndent`
      // shareReplay after takeUntil with operators in between
      import { of, takeUntil, shareReplay, map, filter } from "rxjs";

      const a = of("a");
      const b = of("b");

      a.pipe(takeUntil(b), map(x => x), filter(x => !!x), shareReplay());
    `,
    stripIndent`
      // namespace import with refCount true
      import * as Rx from "rxjs";

      const a = Rx.of("a");
      const b = Rx.of("b");

      a.pipe(Rx.shareReplay({ refCount: true }), Rx.takeUntil(b));
    `,
    stripIndent`
      // shareReplay by itself
      import { of, shareReplay } from "rxjs";

      const a = of("a");

      a.pipe(shareReplay());
    `,
    stripIndent`
      // unrelated
      import { of, takeUntil, toArray } from "rxjs";

      const a = of("a");
      const b = of("b");

      a.pipe(takeUntil(b), toArray());
    `,
    {
      code: stripIndent`
      // default config takeUntilAlias (takeUntilDestroyed)
      import { of, shareReplay } from "rxjs";
      import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

      const a = of("a");

      a.pipe(takeUntilDestroyed(), shareReplay());
    `,
    },
    {
      code: stripIndent`
      // custom config takeUntilAlias
      import { of, shareReplay, takeUntil as tu } from "rxjs";

      const a = of("a");

      a.pipe(tu(), shareReplay());
    `,
      options: [{ takeUntilAlias: ['tu'] }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // without config
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), takeUntil(b));
               ~~~~~~~~~~~ [forbidden { "takeUntilAliases": "takeUntil or takeUntilDestroyed" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // with refCount false
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay({ refCount: false }), takeUntil(b));
               ~~~~~~~~~~~ [forbidden { "takeUntilAliases": "takeUntil or takeUntilDestroyed" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // with operators in between
        import { of, takeUntil, shareReplay, map, filter } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), map(x => x), filter(x => !!x), takeUntil(b));
               ~~~~~~~~~~~ [forbidden { "takeUntilAliases": "takeUntil or takeUntilDestroyed" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace import
        import * as Rx from "rxjs";

        const a = Rx.of("a");
        const b = Rx.of("b");

        a.pipe(Rx.shareReplay(), Rx.takeUntil(b));
               ~~~~~~~~~~~~~~ [forbidden { "takeUntilAliases": "takeUntil or takeUntilDestroyed" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // using default alias (takeUntilDestroyed)
        import { of, shareReplay } from "rxjs";
        import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), takeUntilDestroyed());
               ~~~~~~~~~~~ [forbidden { "takeUntilAliases": "takeUntil or takeUntilDestroyed" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // custom config takeUntilAlias
        import { of, shareReplay, takeUntil as tu } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), tu());
               ~~~~~~~~~~~ [forbidden { "takeUntilAliases": "takeUntil or tu" }]
      `,
      { options: [{ takeUntilAlias: ['tu'] }] },
    ),
  ],
});
