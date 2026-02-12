import { stripIndent } from 'common-tags';
import { noIgnoredSubscriptionRule } from '../../src/rules/no-ignored-subscription';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-subscription', noIgnoredSubscriptionRule, {
  valid: [
    {
      name: 'const and add',
      code: stripIndent`
        import { of } from "rxjs";
        const a = of(42).subscribe();
        a.add(of(42).subscribe());
      `,
    },
    {
      name: 'let',
      code: stripIndent`
        import { Subscription } from "rxjs";
        let b: Subscription;
        b = of(42).subscribe();
      `,
    },
    {
      name: 'array element',
      code: stripIndent`
        import { of } from "rxjs";
        const c = [of(42).subscribe()];
      `,
    },
    {
      name: 'object property',
      code: stripIndent`
        import { of } from "rxjs";
        const d = { subscription: of(42).subscribe() };
      `,
    },
    {
      name: 'subscriber',
      code: stripIndent`
        import { of, Subscriber } from "rxjs";
        const subscriber = new Subscriber<number>();
        of(42).subscribe(subscriber);
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/61',
      code: stripIndent`
        const whatever = {
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.subscribe(() => {});
      `,
    },
    {
      name: 'allowed completers and postCompleters',
      code: stripIndent`
        import { of, first, share, switchMap } from "rxjs";

        of(42).pipe(first(), share()).subscribe();
      `,
    },
    {
      name: 'allowed completers and postCompleters; separate subscribe',
      code: stripIndent`
        import * as Rx from "rxjs";

        Rx.of(42).pipe(Rx.first(), Rx.share()).subscribe();
      `,
    },
    {
      name: 'allowed completers and postCompleters; custom',
      code: stripIndent`
        import { of } from "rxjs";

        of(42).pipe(customCompleter(), customPostCompleter()).subscribe();
      `,
      options: [{
        completers: ['customCompleter'],
        postCompleters: ['customPostCompleter'],
      }],
    },
  ],
  invalid: [
    fromFixture(
      'ignored',
      stripIndent`
        import { of } from "rxjs";
        of(42).subscribe();
               ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'ignored; namespace import',
      stripIndent`
        import * as Rx from "rxjs";
        Rx.of(42).subscribe();
                  ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'ignored subject',
      stripIndent`
        import { Subject } from "rxjs";
        const s = new Subject<any>()
        s.subscribe();
          ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'takeUntil is completer but not last operator',
      stripIndent`
        import { of, takeUntil, switchMap } from "rxjs";
        of(42).pipe(takeUntil(), switchMap(() => of(42))).subscribe();
                                                          ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'takeUntil is completer but not last operator; namespace import',
      stripIndent`
        import * as Rx from "rxjs";
        Rx.of(42).pipe(Rx.takeUntil(), Rx.switchMap(() => Rx.of(42))).subscribe();
                                                                      ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'separate subscribe does not support completers',
      stripIndent`
        import { of, takeUntil } from "rxjs";

        const foo$ = of(42).pipe(takeUntil());
        foo$.subscribe();
             ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'custom completer but not last operator',
      stripIndent`
        import { of } from "rxjs";
        of(42).pipe(customCompleter(), skip(1)).subscribe();
                                                ~~~~~~~~~ [forbidden]
      `,
      {
        options: [{
          completers: ['customCompleter'],
        }],
      },
    ),
    fromFixture(
      'custom postCompleter but no completer',
      stripIndent`
        import { of } from "rxjs";
        of(42).pipe(customPostCompleter()).subscribe();
                                           ~~~~~~~~~ [forbidden]
      `,
      {
        options: [{
          postCompleters: ['customPostCompleter'],
        }],
      },
    ),
  ],
});
