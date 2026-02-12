import { stripIndent } from 'common-tags';
import { noIgnoredReplayBufferRule } from '../../src/rules/no-ignored-replay-buffer';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-ignored-replay-buffer', noIgnoredReplayBufferRule, {
  valid: [
    {
      name: 'ReplaySubject not ignored',
      code: stripIndent`
        import { ReplaySubject } from "rxjs";

        const a = new ReplaySubject<string>(1);
        const b = new Thing(new ReplaySubject<number>(1));
      `,
    },
    {
      name: 'publishReplay not ignored',
      code: stripIndent`
        import { of } from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = of(42).pipe(publishReplay(1));
      `,
    },
    {
      name: 'shareReplay not ignored',
      code: stripIndent`
        import { of } from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = of(42).pipe(shareReplay(1));
      `,
    },
    {
      name: 'shareReplay with config not ignored',
      code: stripIndent`
        import { interval, shareReplay } from "rxjs";
        interval(1000).pipe(shareReplay({ bufferSize: 1, refCount: true }));
      `,
    },
    {
      name: 'namespace ReplaySubject not ignored',
      code: stripIndent`
        import * as Rx from "rxjs";

        const a = new Rx.ReplaySubject<string>(1);
        const b = new Thing(new Rx.ReplaySubject<number>(1));
      `,
    },
    {
      name: 'namespace publishReplay not ignored',
      code: stripIndent`
        import * as Rx from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(publishReplay(1));
      `,
    },
    {
      name: 'namespace shareReplay not ignored',
      code: stripIndent`
        import * as Rx from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(shareReplay(1));
      `,
    },
    {
      name: 'namespace shareReplay with config not ignored',
      code: stripIndent`
        import * as Rx from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(shareReplay({ bufferSize: 1, refCount: true }));
      `,
    },
    {
      name: 'namespace class not ignored',
      code: stripIndent`
        import * as Rx from "rxjs";

        class Mock {
          private valid: Rx.ReplaySubject<number>;
          constructor(){
            this.valid = new Rx.ReplaySubject<number>(1);
          }
        }
      `,
    },
  ],
  invalid: [
    fromFixture(
      'ReplaySubject ignored',
      stripIndent`
        import { ReplaySubject } from "rxjs";

        const a = new ReplaySubject<string>();
                      ~~~~~~~~~~~~~ [forbidden]
        const b = new Thing(new ReplaySubject<number>());
                                ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'publishReplay ignored',
      stripIndent`
        import { of } from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = of(42).pipe(publishReplay());
                              ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'shareReplay ignored',
      stripIndent`
        import { of } from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = of(42).pipe(shareReplay());
                              ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'shareReplay with config ignored',
      stripIndent`
        import { of, shareReplay } from "rxjs";

        const a = of(42).pipe(shareReplay({ refCount: true }));
                              ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'namespace ReplaySubject ignored',
      stripIndent`
        import * as Rx from "rxjs";

        const a = new Rx.ReplaySubject<string>();
                         ~~~~~~~~~~~~~ [forbidden]
        const b = new Thing(new Rx.ReplaySubject<number>());
                                   ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'namespace publishReplay ignored',
      stripIndent`
        import * as Rx from "rxjs";
        import { publishReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(publishReplay());
                                 ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'namespace shareReplay ignored',
      stripIndent`
        import * as Rx from "rxjs";
        import { shareReplay } from "rxjs/operators";

        const a = Rx.of(42).pipe(shareReplay());
                                 ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'namespace shareReplay with config ignored',
      stripIndent`
        import * as Rx from "rxjs";
        const a = Rx.of(42).pipe(Rx.shareReplay({ refCount: true }));
                                    ~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'namespace class ignored',
      stripIndent`
        import * as Rx from "rxjs";

        class Mock {
          private invalid: Rx.ReplaySubject<number>;
          constructor(){
            this.invalid = new Rx.ReplaySubject<number>();
                                  ~~~~~~~~~~~~~ [forbidden]
          }
        }
      `,
    ),
  ],
});
