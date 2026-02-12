import { stripIndent } from 'common-tags';
import { noNestedSubscribeRule } from '../../src/rules/no-nested-subscribe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-nested-subscribe', noNestedSubscribeRule, {
  valid: [
    {
      name: 'not nested in next argument',
      code: stripIndent`
        import { Observable } from "rxjs";
        of(47).subscribe(value => {
          console.log(value);
        })
      `,
    },
    {
      name: 'not nested in observer properties',
      code: stripIndent`
        import { Observable } from "rxjs";
        of(47).subscribe({
          next: value => console.log(value),
          error: value => console.log(value),
          complete: () => console.log(value)
        })
      `,
    },
    {
      name: 'not nested in observer methods',
      code: stripIndent`
        import { Observable } from "rxjs";
        of(47).subscribe({
          next(value) { console.log(value); },
          error(value) { console.log(value); },
          complete() { console.log(value); }
        })
      `,
    },
    {
      name: 'prototype property',
      code: stripIndent`
        import { Observable } from "rxjs";
        const observableSubscribe = Observable.prototype.subscribe;
        expect(Observable.prototype.subscribe).to.equal(observableSubscribe);
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/38',
      code: stripIndent`
        import {of} from "rxjs";
        of(3).subscribe(result => {
          const test = result as boolean;
          if(test > 1) {
            console.log(test);
          }
        });
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/61',
      code: stripIndent`
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe(() => {
          whatever.subscribe(() => {})
        });
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/67',
      code: stripIndent`
        import { Observable, of } from "rxjs";
        new Observable<number>(subscriber => {
          of(42).subscribe(subscriber);
        }).subscribe();
      `,
    },
  ],
  invalid: [
    fromFixture(
      'nested in next argument',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe(
          value => of("bar").subscribe()
                             ~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'nested in next property',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe({
          next: value => of("bar").subscribe()
                                   ~~~~~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      'nested in next method',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe({
          next(value) { of("bar").subscribe(); }
                                  ~~~~~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      'nested in error argument',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe(
          undefined,
          error => of("bar").subscribe()
                             ~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'nested in error property',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe({
          error: error => of("bar").subscribe()
                                    ~~~~~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      'nested in error method',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe({
          error(error) { of("bar").subscribe(); }
                                   ~~~~~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      'nested in complete argument',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe(
          undefined,
          undefined,
          () => of("bar").subscribe()
                          ~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'nested in complete property',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe({
          complete: () => of("bar").subscribe()
                                    ~~~~~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      'nested in complete method',
      stripIndent`
        import { of } from "rxjs";
        of("foo").subscribe({
          complete() { of("bar").subscribe(); }
                                 ~~~~~~~~~ [forbidden]
        });
      `,
    ),
    fromFixture(
      'https://github.com/cartant/eslint-plugin-rxjs/issues/69',
      stripIndent`
        import { Subscribable } from "rxjs";
        declare const subscribable: Subscribable<unknown>;
        subscribable.subscribe(
          () => subscribable.subscribe()
                             ~~~~~~~~~ [forbidden]
        );
      `,
    ),
  ],
});
