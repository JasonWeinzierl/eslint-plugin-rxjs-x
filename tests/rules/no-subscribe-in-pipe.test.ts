import { stripIndent } from 'common-tags';
import { noSubscribeInPipeRule } from '../../src/rules/no-subscribe-in-pipe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-subscribe-in-pipe', noSubscribeInPipeRule, {
  valid: [
    {
      name: 'subscribe outside of pipe',
      code: stripIndent`
        import { of } from "rxjs";
        of(47).subscribe(value => {
          console.log(value);
        });
      `,
    },
    {
      name: 'pipe without subscribe',
      code: stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        of(47).pipe(
          map(x => x * 2)
        ).subscribe(value => {
          console.log(value);
        });
      `,
    },
    {
      name: 'nested pipes without subscribe',
      code: stripIndent`
        import { of } from "rxjs";
        import { map, mergeMap } from "rxjs/operators";
        of(47).pipe(
          mergeMap(x => of(x).pipe(
            map(y => y * 2)
          ))
        ).subscribe(value => {
          console.log(value);
        });
      `,
    },
    {
      name: 'subscribe in a function outside pipe',
      code: stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        const logValue = (value) => of(value).subscribe(console.log);
        of(47).pipe(
          map(x => x * 2)
        ).subscribe(logValue);
      `,
    },
    {
      name: 'subscribe method on a non-Observable object inside pipe',
      code: stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        const customObject = { subscribe: () => {} };
        of(47).pipe(
          map(x => {
            customObject.subscribe();
            return x * 2;
          })
        ).subscribe();
      `,
    },
    {
      name: 'subscribe as a variable name inside pipe',
      code: stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        of(47).pipe(
          map(x => {
            const subscribe = 5;
            return x * subscribe;
          })
        ).subscribe();
      `,
    },
    {
      name: 'subscribe in a comment inside pipe',
      code: stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        of(47).pipe(
          map(x => {
            // of(x).subscribe(console.log);
            return x * 2;
          })
        ).subscribe();
      `,
    },
    {
      name: 'subscribe as a string inside pipe',
      code: stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        of(47).pipe(
          map(x => {
            console.log("subscribe");
            return x * 2;
          })
        ).subscribe();
      `,
    },
    {
      name: 'subscribe inside of an Observable constructor',
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
      'subscribe inside map operator',
      stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        of(47).pipe(
          map(x => {
            of(x).subscribe(console.log);
                  ~~~~~~~~~ [forbidden]
            return x * 2;
          })
        ).subscribe();
      `,
    ),
    fromFixture(
      'subscribe inside mergeMap operator',
      stripIndent`
        import { of } from "rxjs";
        import { mergeMap } from "rxjs/operators";
        of(47).pipe(
          mergeMap(x => of(x).pipe(
            map(y => {
              of(y).subscribe(console.log);
                    ~~~~~~~~~ [forbidden]
              return y * 2;
            })
          ))
        ).subscribe();
      `,
    ),
    fromFixture(
      'subscribe inside tap operator',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";
        of(47).pipe(
          tap(x => {
            of(x).subscribe(console.log);
                  ~~~~~~~~~ [forbidden]
          })
        ).subscribe();
      `,
    ),
    fromFixture(
      'subscribe inside switchMap operator',
      stripIndent`
        import { of } from "rxjs";
        import { switchMap } from "rxjs/operators";
        of(47).pipe(
          switchMap(x => {
            of(x).subscribe(console.log);
                  ~~~~~~~~~ [forbidden]
            return of(x * 2);
          })
        ).subscribe();
      `,
    ),
    fromFixture(
      'subscribe inside nested pipes',
      stripIndent`
        import { of } from "rxjs";
        import { map, mergeMap } from "rxjs/operators";
        of(47).pipe(
          mergeMap(x => of(x).pipe(
            map(y => {
              of(y).subscribe(console.log);
                    ~~~~~~~~~ [forbidden]
              return y * 2;
            })
          ))
        ).subscribe();
      `,
    ),
    fromFixture(
      'subscribe inside a deeply nested function in pipe',
      stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        of(47).pipe(
          map(x => {
            const nestedFunc = () => {
              const deeplyNested = () => {
                of(x).subscribe(console.log);
                      ~~~~~~~~~ [forbidden]
              };
              deeplyNested();
            };
            nestedFunc();
            return x * 2;
          })
        ).subscribe();
      `,
    ),
    fromFixture(
      'subscribe in a ternary operator in pipe',
      stripIndent`
        import { of } from "rxjs";
        import { map } from "rxjs/operators";
        of(47).pipe(
          map(x => x > 50 ? x : of(x).subscribe(console.log))
                                      ~~~~~~~~~ [forbidden]
        ).subscribe();
      `,
    ),
  ],
});
