import { stripIndent } from 'common-tags';
import { noIgnoredSubscribeRule } from '../../src/rules/no-ignored-subscribe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-subscribe', noIgnoredSubscribeRule, {
  valid: [
    {
      name: 'not ignored',
      code: stripIndent`
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe(value => console.log(value));
      `,
    },
    {
      name: 'subject not ignored',
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe(value => console.log(value));
      `,
    },
    {
      name: 'not ignored non-arrow',
      code: stripIndent`
        import { of } from "rxjs";

        function log(value) {
          console.log(value)
        }

        const observable = of([1, 2]);
        observable.subscribe(log);
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/61',
      code: stripIndent`
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe();
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/69',
      code: stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe((value) => console.log(value));
      `,
    },
  ],
  invalid: [
    fromFixture(
      'ignored',
      stripIndent`
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe();
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject ignored',
      stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<any>();
        subject.subscribe();
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'https://github.com/cartant/eslint-plugin-rxjs/issues/69',
      stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe();
                     ~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
