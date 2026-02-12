import { stripIndent } from 'common-tags';
import { noSharereplayRule } from '../../src/rules/no-sharereplay';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-sharereplay', noSharereplayRule, {
  valid: [
    {
      name: 'config allowed refCount',
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
        );`,
    },
    {
      name: 'config allowed no refCount',
      code: stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
        );`,
    },
  ],
  invalid: [
    fromFixture(
      'no arguments',
      stripIndent`
        const shared = of(42).pipe(
          shareReplay()
          ~~~~~~~~~~~ [forbidden]
        );
      `,
      { options: [{ allowConfig: false }] },
    ),
    fromFixture(
      'config allowed no arguments',
      stripIndent`
        const shared = of(42).pipe(
          shareReplay()
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
      { options: [{ allowConfig: true }] },
    ),
    fromFixture(
      'one argument',
      stripIndent`
        const shared = of(42).pipe(
          shareReplay(1)
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
    ),
    fromFixture(
      'two arguments',
      stripIndent`
        const shared = of(42).pipe(
          shareReplay(1, 100)
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
    ),
    fromFixture(
      'three arguments',
      stripIndent`
        const shared = of(42).pipe(
          shareReplay(1, 100, asapScheduler)
          ~~~~~~~~~~~ [forbiddenWithoutConfig]
        );
      `,
    ),
    fromFixture(
      'config argument refCount',
      stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: true })
          ~~~~~~~~~~~ [forbidden]
        );
      `,
      { options: [{ allowConfig: false }] },
    ),
    fromFixture(
      'config argument no refCount',
      stripIndent`
        const shared = of(42).pipe(
          shareReplay({ refCount: false })
          ~~~~~~~~~~~ [forbidden]
        );
      `,
      { options: [{ allowConfig: false }] },
    ),
  ],
});
