import { stripIndent } from 'common-tags';
import { noIgnoredErrorRule } from '../../src/rules/no-ignored-error';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-error', noIgnoredErrorRule, {
  valid: [
    {
      name: 'noop',
      code: stripIndent`
        import { of } from "rxjs";
        const observable = of([1, 2]);
        observable.subscribe(() => {}, () => {});
      `,
    },
    {
      name: 'observer argument',
      code: stripIndent`
        // observer argument
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe({ next: () => {}, error: () => {} });

        const observer1 = { next: () => {}, error: () => {} };
        observable.subscribe(observer1);

        const obj = { observer: observer1 };
        observable.subscribe(obj.observer);
      `,
    },
    {
      name: 'subject',
      code: stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<any>();
        const observable = of([1, 2]);
        observable.subscribe(subject);
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/61',
      code: stripIndent`
        const whatever = {
          subscribe(
            next?: (value: unknown) => void,
            error?: (error: unknown) => void
          ) {}
        };
        whatever.subscribe();
      `,
    },
  ],
  invalid: [
    fromFixture(
      'arrow next ignored error',
      stripIndent`
        import { of } from "rxjs";
        const observable = of([1, 2]);
        observable.subscribe(() => {});
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'variable next ignored error',
      stripIndent`
        import { of } from "rxjs";
        const observable = of([1, 2]);
        const next = () => {};
        observable.subscribe(next);
                   ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject arrow next ignored error',
      stripIndent`
        import { Subject } from "rxjs";
        const subject = new Subject<any>();
        subject.subscribe(() => {});
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'subject variable next ignored error',
      stripIndent`
        import { Subject } from "rxjs";
        const next = () => {};
        const subject = new Subject<any>();
        subject.subscribe(next);
                ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'https://github.com/cartant/eslint-plugin-rxjs/issues/60',
      stripIndent`
        import { Observable } from "rxjs"
        interface ISomeExtension {
          sayHi(): void
        }
        function subscribeObservable<T>(obs: Observable<T>) {
          return obs.subscribe((v: T) => {})
                     ~~~~~~~~~ [forbidden]
        }
        function subscribeObservableWithExtension<T>(obs: Observable<T> & ISomeExtension) {
          return obs.subscribe((v: T) => {})
                     ~~~~~~~~~ [forbidden]
        }
      `,
    ),
    fromFixture(
      'observer argument',
      stripIndent`
        import { of } from "rxjs";

        const observable = of([1, 2]);
        observable.subscribe({ next: () => {} });
                   ~~~~~~~~~ [forbidden]
        const observer1 = { next: () => {} };
        observable.subscribe(observer1);
                   ~~~~~~~~~ [forbidden]
        const obj = { observer: observer1 };
        observable.subscribe(obj.observer1);
                   ~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
