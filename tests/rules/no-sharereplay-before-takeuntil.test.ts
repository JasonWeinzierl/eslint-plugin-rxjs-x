import { stripIndent } from 'common-tags';
import { noSharereplayBeforeTakeuntilRule } from '../../src/rules/no-sharereplay-before-takeuntil';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-sharereplay-before-takeuntil', noSharereplayBeforeTakeuntilRule, {
  valid: [
    {
      name: 'with refCount true',
      code: stripIndent`
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay({ refCount: true }), takeUntil(b));
      `,
    },
    {
      name: 'with refCount true as const',
      code: stripIndent`
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        const t = true as const;
        a.pipe(shareReplay({ refCount: t }), takeUntil(b));
      `,
    },
    {
      name: 'refCount as variable not supported',
      code: stripIndent`
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        const t = false;
        a.pipe(shareReplay({ refCount: t }), takeUntil(b));
      `,
    },
    {
      name: 'composed observables not supported',
      code: stripIndent`
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        const sr = shareReplay({ refCount: false });
        a.pipe(sr, takeUntil(b));
      `,
    },
    {
      name: 'shareReplay after takeUntil',
      code: stripIndent`
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(takeUntil(b), shareReplay({ refCount: false }));
      `,
    },
    {
      name: 'shareReplay after takeUntil with operators in between',
      code: stripIndent`
        import { of, takeUntil, shareReplay, map, filter } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(takeUntil(b), map(x => x), filter(x => !!x), shareReplay());
      `,
    },
    {
      name: 'namespace import with refCount true',
      code: stripIndent`
        import * as Rx from "rxjs";

        const a = Rx.of("a");
        const b = Rx.of("b");

        a.pipe(Rx.shareReplay({ refCount: true }), Rx.takeUntil(b));
      `,
    },
    {
      name: 'shareReplay by itself',
      code: stripIndent`
        import { of, shareReplay } from "rxjs";

        const a = of("a");

        a.pipe(shareReplay());
      `,
    },
    {
      name: 'unrelated',
      code: stripIndent`
        import { of, takeUntil, toArray } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(takeUntil(b), toArray());
      `,
    },
    {
      name: 'default config takeUntilAlias (takeUntilDestroyed)',
      code: stripIndent`
      import { of, shareReplay } from "rxjs";
      import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

      const a = of("a");

      a.pipe(takeUntilDestroyed(), shareReplay());
    `,
    },
    {
      name: 'custom config takeUntilAlias',
      code: stripIndent`
      import { of, shareReplay, takeUntil as tu } from "rxjs";

      const a = of("a");

      a.pipe(tu(), shareReplay());
    `,
      options: [{ takeUntilAlias: ['tu'] }],
    },
  ],
  invalid: [
    fromFixture(
      'without config',
      stripIndent`
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), takeUntil(b));
               ~~~~~~~~~~~ [forbidden { "takeUntilAlias": "takeUntil" }]
      `,
    ),
    fromFixture(
      'with refCount false',
      stripIndent`
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay({ refCount: false }), takeUntil(b));
               ~~~~~~~~~~~ [forbidden { "takeUntilAlias": "takeUntil" }]
      `,
    ),
    fromFixture(
      'with operators in between',
      stripIndent`
        import { of, takeUntil, shareReplay, map, filter } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), map(x => x), filter(x => !!x), takeUntil(b));
               ~~~~~~~~~~~ [forbidden { "takeUntilAlias": "takeUntil" }]
      `,
    ),
    fromFixture(
      'namespace import',
      stripIndent`
        import * as Rx from "rxjs";

        const a = Rx.of("a");
        const b = Rx.of("b");

        a.pipe(Rx.shareReplay(), Rx.takeUntil(b));
               ~~~~~~~~~~~~~~ [forbidden { "takeUntilAlias": "takeUntil" }]
      `,
    ),
    fromFixture(
      'using default alias (takeUntilDestroyed)',
      stripIndent`
        import { of, shareReplay } from "rxjs";
        import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), takeUntilDestroyed());
               ~~~~~~~~~~~ [forbidden { "takeUntilAlias": "takeUntilDestroyed" }]
      `,
    ),
    fromFixture(
      'custom config takeUntilAlias',
      stripIndent`
        import { of, shareReplay, takeUntil as tu } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), tu());
               ~~~~~~~~~~~ [forbidden { "takeUntilAlias": "tu" }]
      `,
      { options: [{ takeUntilAlias: ['tu'] }] },
    ),
  ],
});
