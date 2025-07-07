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

      const t = true as const;
      a.pipe(shareReplay({ refCount: t }), takeUntil(b));
    `,
    stripIndent`
      // unrelated
      import { of, takeUntil, toArray } from "rxjs";

      const a = of("a");
      const b = of("b");

      a.pipe(takeUntil(b), toArray());
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // without config
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay(), takeUntil(b));
               ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // with refCount false
        import { of, takeUntil, shareReplay } from "rxjs";

        const a = of("a");
        const b = of("b");

        a.pipe(shareReplay({ refCount: false }), takeUntil(b));
               ~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
