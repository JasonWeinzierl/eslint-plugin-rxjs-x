import { stripIndent } from 'common-tags';
import { noSubscribeHandlersRule } from '../../src/rules/no-subscribe-handlers';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subscribe-handlers', noSubscribeHandlersRule, {
  valid: [
    {
      name: 'ignored',
      code: stripIndent`
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe();
      `,
    },
    {
      name: 'subject ignored',
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe();
      `,
    },
    {
      name: 'subscribable ignored',
      code: stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe();
      `,
    },
    {
      name: 'unrelated',
      code: stripIndent`
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe();
      `,
    },
    {
      name: 'unrelated with handler',
      code: stripIndent`
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe(console.log);
      `,
    },
  ],
  invalid: [
    fromFixture(
      'not ignored',
      stripIndent`
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe(value => console.log(value));
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject not ignored',
      stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe(value => console.log(value));
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'not ignored non-arrow',
      stripIndent`
        import { of } from "rxjs";

        function log(value) {
          console.log(value)
        }

        const observable = of([1, 2]);
        observable.subscribe(log);
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subscribable with callback handler',
      stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe((value) => console.log(value));
                     ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subscribable with observer handler',
      stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe({
                     ~~~~~~~~~ [forbidden]
          next: (value) => console.log(value)
        });
      `,
    ),
  ],
});
