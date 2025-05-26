import { stripIndent } from 'common-tags';
import { noIgnoredSubscriptionRule } from '../../src/rules/no-ignored-subscription';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-subscription', noIgnoredSubscriptionRule, {
  valid: [
    stripIndent`
      // const and add
      import { of } from "rxjs";
      const a = of(42).subscribe();
      a.add(of(42).subscribe());
    `,
    stripIndent`
      // let
      import { Subscription } from "rxjs";
      let b: Subscription;
      b = of(42).subscribe();
    `,
    stripIndent`
      // array element
      import { of } from "rxjs";
      const c = [of(42).subscribe()];
    `,
    stripIndent`
      // object property
      import { of } from "rxjs";
      const d = { subscription: of(42).subscribe() };
    `,
    stripIndent`
      // subscriber
      import { of, Subscriber } from "rxjs";
      const subscriber = new Subscriber<number>();
      of(42).subscribe(subscriber);
    `,
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(callback?: (value: unknown) => void) {}
      };
      whatever.subscribe(() => {});
    `,
    stripIndent`
      // allowed completers and postCompleters
      import { of, first, share, switchMap } from "rxjs";

      of(42).pipe(first(), share()).subscribe();
    `,
    stripIndent`
      // allowed completers and postCompleters; namespace import
      import * as Rx from "rxjs";

      Rx.of(42).pipe(Rx.first(), Rx.share()).subscribe();
    `,
    {
      code: stripIndent`
        // allowed completers and postCompleters; custom
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
      stripIndent`
        // ignored
        import { of } from "rxjs";
        of(42).subscribe();
               ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // ignored; namespace import
        import * as Rx from "rxjs";
        Rx.of(42).subscribe();
                  ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // ignored subject
        import { Subject } from "rxjs";
        const s = new Subject<any>()
        s.subscribe();
          ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // takeUntil is completer but not last operator
        import { of, takeUntil, switchMap } from "rxjs";
        of(42).pipe(takeUntil(), switchMap(() => of(42))).subscribe();
                                                          ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // takeUntil is completer but not last operator; namespace import
        import * as Rx from "rxjs";
        Rx.of(42).pipe(Rx.takeUntil(), Rx.switchMap(() => Rx.of(42))).subscribe();
                                                                      ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // separate subscribe does not support completers
        import { of, takeUntil } from "rxjs";

        const foo$ = of(42).pipe(takeUntil());
        foo$.subscribe();
             ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // custom completer but not last operator
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
      stripIndent`
        // custom postCompleter but no completer
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
