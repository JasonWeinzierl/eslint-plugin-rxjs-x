import { stripIndent } from 'common-tags';
import { noUnnecessaryCollectionRule } from '../../src/rules/no-unnecessary-collection';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-unnecessary-collection', noUnnecessaryCollectionRule, {
  valid: [
    // #region valid; multiple observables in array
    {
      name: 'combineLatest with multiple observables in array',
      code: stripIndent`
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const combined$ = combineLatest([a$, b$]);
      `,
    },
    {
      name: 'combineLatest with multiple observables in sparse array',
      code: stripIndent`
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const combined$ = combineLatest([, a$, b$]);
      `,
    },
    {
      name: 'forkJoin with multiple observables in array',
      code: stripIndent`
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const combined$ = forkJoin([a$, b$]);
      `,
    },
    {
      name: 'merge with multiple observables',
      code: stripIndent`
        import { merge, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const merged$ = merge(a$, b$);
      `,
    },
    {
      name: 'merge with spread',
      code: stripIndent`
        // merge with spread
        import { merge, of } from "rxjs";

        const arr = [of(1), of(2)];
        const merged$ = merge(...arr);
      `,
    },
    {
      name: 'zip with multiple observables',
      code: stripIndent`
        import { zip, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const zipped$ = zip(a$, b$);
      `,
    },
    {
      name: 'concat with multiple observables',
      code: stripIndent`
        import { concat, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const concatenated$ = concat(a$, b$);
      `,
    },
    {
      name: 'race with multiple observables',
      code: stripIndent`
        import { race, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const raced$ = race(a$, b$);
      `,
    },
    // #endregion

    // #region valid; multiple observables in object
    {
      name: 'combineLatest with multiple observables in object',
      code: stripIndent`
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const combined$ = combineLatest({ a: a$, b: b$ });
      `,
    },
    {
      name: 'forkJoin with multiple observables in object',
      code: stripIndent`
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const combined$ = forkJoin({ a: a$, b: b$ });
      `,
    },
    {
      name: 'forkJoin with spread object properties',
      code: stripIndent`
        import { forkJoin, of } from "rxjs";

        const source1$ = of(1);
        const source2$ = of(2);
        const sources = { first: source1$, second: source2$ };
        const combined$ = forkJoin({ ...sources });
      `,
    },
    // #endregion

    // #region valid; no arguments or empty
    {
      name: 'combineLatest with no arguments',
      code: stripIndent`
        import { combineLatest } from "rxjs";

        const combined$ = combineLatest();
      `,
    },
    {
      name: 'merge with no arguments',
      code: stripIndent`
        import { merge } from "rxjs";

        const merged$ = merge();
      `,
    },
    {
      name: 'combineLatest with empty array',
      code: stripIndent`
        import { combineLatest } from "rxjs";

        const combined$ = combineLatest([]);
      `,
    },
    {
      name: 'forkJoin with empty object',
      code: stripIndent`
        import { forkJoin } from "rxjs";

        const combined$ = forkJoin({});
      `,
    },
    // #endregion

    // #region valid; non-rxjs functions with same names
    {
      name: 'non-RxJS combineLatest function',
      code: stripIndent`
        function combineLatest(observables: any[]) {
          return observables[0];
        }

        const result = combineLatest([someValue]);
      `,
    },
    {
      name: 'method call on different object',
      code: stripIndent`
        const someObject = {
          forkJoin(sources: any) { return sources; }
        };

        const result = someObject.forkJoin([singleValue]);
      `,
    },
    // #endregion

    // #region valid; dynamic arrays are not supported
    {
      name: 'combineLatest with variable array',
      code: stripIndent`
        import { combineLatest, of } from "rxjs";

        const observables = [of(1)];
        const combined$ = combineLatest(observables);
      `,
    },
    {
      name: 'forkJoin with computed array',
      code: stripIndent`
        import { forkJoin, of } from "rxjs";

        const sources = getSources(); // could return array of any length
        const combined$ = forkJoin(sources);
      `,
    },
    // #endregion

    // #region valid; namespace imports
    {
      name: 'namespace import with multiple observables in array',
      code: stripIndent`
        import * as Rx from "rxjs";

        const a$ = Rx.of(1);
        const b$ = Rx.of(2);
        const combined$ = Rx.combineLatest([a$, b$]);
      `,
    },
    {
      name: 'namespace import with multiple observables in object',
      code: stripIndent`
        import * as Rx from "rxjs";

        const source1$ = Rx.of('a');
        const source2$ = Rx.of('b');
        const result$ = Rx.forkJoin({ first: source1$, second: source2$ });
      `,
    },
    // #endregion

    // #region valid; aliased imports are not supported
    {
      name: 'aliased combineLatest with single observable',
      code: stripIndent`
        import { combineLatest as combine, of } from "rxjs";

        const a$ = of(1);
        const combined$ = combine([a$]);
      `,
    },
    {
      name: 'aliased forkJoin with single observable in object',
      code: stripIndent`
        import { forkJoin as fork, of } from "rxjs";

        const source$ = of('test');
        const result$ = fork({ single: source$ });
      `,
    },
    // #endregion

    // #region valid; unrelated
    {
      name: 'unrelated code',
      code: stripIndent`
        import { of, map, from, timer, raceWith } from "rxjs";

        const a$ = of(1);
        const b$ = of(2);
        const sum$ = a$.pipe(
          map(x => x + 10),
        );
        const raced$ = a$.pipe(
          raceWith(b$),
        );

        const c$ = from([1]);

        const d$ = timer(1000);
      `,
    },
    // #endregion
  ],

  invalid: [
    // #region invalid; single observable in array
    fromFixture(
      'combineLatest with single observable in array',
      stripIndent`
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const combined$ = combineLatest([a$]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      'forkJoin with single observable in array',
      stripIndent`
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const combined$ = forkJoin([a$]);
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      'merge with single observable',
      stripIndent`
        import { merge, of } from "rxjs";

        const a$ = of(1);
        const merged$ = merge(a$);
                        ~~~~~ [forbidden { "operator": "merge", "inputType": "single argument" }]
      `,
    ),
    fromFixture(
      'zip with single observable',
      stripIndent`
        import { zip, of } from "rxjs";

        const a$ = of(1);
        const zipped$ = zip(a$);
                        ~~~ [forbidden { "operator": "zip", "inputType": "single argument" }]
      `,
    ),
    fromFixture(
      'concat with single observable',
      stripIndent`
        import { concat, of } from "rxjs";

        const a$ = of(1);
        const concatenated$ = concat(a$);
                              ~~~~~~ [forbidden { "operator": "concat", "inputType": "single argument" }]
      `,
    ),
    fromFixture(
      'race with single observable',
      stripIndent`
        import { race, of } from "rxjs";

        const a$ = of(1);
        const raced$ = race(a$);
                       ~~~~ [forbidden { "operator": "race", "inputType": "single argument" }]
      `,
    ),
    // #endregion

    // #region invalid; single observable in object
    fromFixture(
      'combineLatest with single property in object',
      stripIndent`
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const combined$ = combineLatest({ a: a$ });
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-property object" }]
      `,
    ),
    fromFixture(
      'forkJoin with single property in object',
      stripIndent`
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const combined$ = forkJoin({ result: a$ });
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; inline observables
    fromFixture(
      'combineLatest with inline single observable',
      stripIndent`
        import { combineLatest, of } from "rxjs";

        const combined$ = combineLatest([of(1)]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      'forkJoin with inline single observable in object',
      stripIndent`
        import { forkJoin, of } from "rxjs";

        const combined$ = forkJoin({ data: of('hello') });
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; sparse arrays
    fromFixture(
      'combineLatest with sparse array',
      stripIndent`
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const combined$ = combineLatest([, a$]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      'forkJoin with sparse array',
      stripIndent`
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const combined$ = forkJoin([, a$]);
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-valued array" }]
      `,
    ),
    // #endregion

    // #region invalid; getter object member
    fromFixture(
      'combineLatest with non-property object member',
      stripIndent`
        import { combineLatest, of } from "rxjs";

        const combined$ = combineLatest({ get data() { return of(1); } });
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; namespace imports
    fromFixture(
      'combineLatest from namespace import with single observable array',
      stripIndent`
        import * as Rx from "rxjs";

        const a$ = Rx.of(1);
        const combined$ = Rx.combineLatest([a$]);
                          ~~~~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      'forkJoin from namespace import with single observable object',
      stripIndent`
        import * as Rx from "rxjs";

        const source$ = Rx.of('data');
        const result$ = Rx.forkJoin({ item: source$ });
                        ~~~~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; complex expressions with single elements
    fromFixture(
      'combineLatest with single complex expression',
      stripIndent`
        import { combineLatest, of } from "rxjs";
        import { map } from "rxjs/operators";

        const combined$ = combineLatest([of(1).pipe(map(x => x * 2))]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      'forkJoin with single method call result',
      stripIndent`
        import { forkJoin, Observable } from "rxjs";

        function getObservable(): Observable<number> {
          return of(42);
        }

        const combined$ = forkJoin([getObservable()]);
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-valued array" }]
      `,
    ),
    // #endregion
  ],
});
