import { stripIndent } from 'common-tags';
import { noConnectableRule } from '../../src/rules/no-connectable';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-connectable', noConnectableRule, {
  valid: [
    {
      name: 'multicast with selector',
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject(), p => p)
        );`,
    },
    {
      name: 'multicast with factory and selector',
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject(), p => p)
        );`,
    },
    {
      name: 'multicast with selector variable',
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const selector = p => p;
        const result = of(42).pipe(
          multicast(() => new Subject(), selector)
        );`,
    },
    {
      name: 'publish with selector',
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          publish(p => p)
        );`,
    },
    {
      name: 'publishReplay with selector',
      code: stripIndent`
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1, p => p)
        )`,
    },
  ],
  invalid: [
    fromFixture(
      'publish',
      stripIndent`
        import { of, Subject } from "rxjs";
        import { publish } from "rxjs/operators";
        const result = of(42).pipe(
          publish()
          ~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'publishBehavior',
      stripIndent`
        import { of, Subject } from "rxjs";
        import { publishBehavior } from "rxjs/operators";
        const result = of(42).pipe(
          publishBehavior(1)
          ~~~~~~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'publishLast',
      stripIndent`
        import { of, Subject } from "rxjs";
        import { publishLast } from "rxjs/operators";
        const result = of(42).pipe(
          publishLast()
          ~~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'publishReplay',
      stripIndent`
        import { of, Subject } from "rxjs";
        import { publishReplay } from "rxjs/operators";
        const result = of(42).pipe(
          publishReplay(1)
          ~~~~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'multicast',
      stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(new Subject<number>())
          ~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'multicast with factory',
      stripIndent`
        import { of, Subject } from "rxjs";
        import { multicast } from "rxjs/operators";
        const result = of(42).pipe(
          multicast(() => new Subject<number>())
          ~~~~~~~~~ [forbidden]
        );
      `,
    ),
  ],
});
