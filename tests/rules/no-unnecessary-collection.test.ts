import { stripIndent } from 'common-tags';
import { noUnnecessaryCollectionRule } from '../../src/rules/no-unnecessary-collection';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-unnecessary-collection', noUnnecessaryCollectionRule, {
  valid: [
    // #region valid; multiple observables in array
    stripIndent`
      // combineLatest with multiple observables in array
      import { combineLatest, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const combined$ = combineLatest([a$, b$]);
    `,
    stripIndent`
      // combineLatest with multiple observables in sparse array
      import { combineLatest, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const combined$ = combineLatest([, a$, b$]);
    `,
    stripIndent`
      // forkJoin with multiple observables in array
      import { forkJoin, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const combined$ = forkJoin([a$, b$]);
    `,
    stripIndent`
      // merge with multiple observables
      import { merge, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const merged$ = merge(a$, b$);
    `,
    stripIndent`
      // zip with multiple observables
      import { zip, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const zipped$ = zip(a$, b$);
    `,
    stripIndent`
      // concat with multiple observables
      import { concat, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const concatenated$ = concat(a$, b$);
    `,
    stripIndent`
      // race with multiple observables
      import { race, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const raced$ = race(a$, b$);
    `,
    // #endregion

    // #region valid; multiple observables in object
    stripIndent`
      // combineLatest with multiple observables in object
      import { combineLatest, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const combined$ = combineLatest({ a: a$, b: b$ });
    `,
    stripIndent`
      // forkJoin with multiple observables in object
      import { forkJoin, of } from "rxjs";

      const a$ = of(1);
      const b$ = of(2);
      const combined$ = forkJoin({ a: a$, b: b$ });
    `,
    stripIndent`
      // forkJoin with spread object properties
      import { forkJoin, of } from "rxjs";

      const source1$ = of(1);
      const source2$ = of(2);
      const sources = { first: source1$, second: source2$ };
      const combined$ = forkJoin({ ...sources });
    `,
    // #endregion

    // #region valid; no arguments or empty
    stripIndent`
      // combineLatest with no arguments
      import { combineLatest } from "rxjs";

      const combined$ = combineLatest();
    `,
    stripIndent`
      // merge with no arguments
      import { merge } from "rxjs";

      const merged$ = merge();
    `,
    stripIndent`
      // combineLatest with empty array
      import { combineLatest } from "rxjs";

      const combined$ = combineLatest([]);
    `,
    stripIndent`
      // forkJoin with empty object
      import { forkJoin } from "rxjs";

      const combined$ = forkJoin({});
    `,
    // #endregion

    // #region valid; non-rxjs functions with same names
    stripIndent`
      // non-RxJS combineLatest function
      function combineLatest(observables: any[]) {
        return observables[0];
      }

      const result = combineLatest([someValue]);
    `,
    stripIndent`
      // method call on different object
      const someObject = {
        forkJoin(sources: any) { return sources; }
      };

      const result = someObject.forkJoin([singleValue]);
    `,
    // #endregion

    // #region valid; dynamic arrays are not supported
    stripIndent`
      // combineLatest with variable array
      import { combineLatest, of } from "rxjs";

      const observables = [of(1)];
      const combined$ = combineLatest(observables);
    `,
    stripIndent`
      // forkJoin with computed array
      import { forkJoin, of } from "rxjs";

      const sources = getSources(); // could return array of any length
      const combined$ = forkJoin(sources);
    `,
    // #endregion

    // #region valid; namespace imports
    stripIndent`
      // namespace import with multiple observables in array
      import * as Rx from "rxjs";

      const a$ = Rx.of(1);
      const b$ = Rx.of(2);
      const combined$ = Rx.combineLatest([a$, b$]);
    `,
    stripIndent`
      // namespace import with multiple observables in object
      import * as Rx from "rxjs";

      const source1$ = Rx.of('a');
      const source2$ = Rx.of('b');
      const result$ = Rx.forkJoin({ first: source1$, second: source2$ });
    `,
    // #endregion

    // #region valid; aliased imports are not supported
    stripIndent`
      // aliased combineLatest with single observable
      import { combineLatest as combine, of } from "rxjs";

      const a$ = of(1);
      const combined$ = combine([a$]);
    `,
    stripIndent`
      // aliased forkJoin with single observable in object
      import { forkJoin as fork, of } from "rxjs";

      const source$ = of('test');
      const result$ = fork({ single: source$ });
    `,
    // #endregion

    // #region valid; unrelated
    stripIndent`
      // unrelated code
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
    // #endregion
  ],

  invalid: [
    // #region invalid; single observable in array
    fromFixture(
      stripIndent`
        // combineLatest with single observable in array
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const combined$ = combineLatest([a$]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // forkJoin with single observable in array
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const combined$ = forkJoin([a$]);
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // merge with single observable
        import { merge, of } from "rxjs";

        const a$ = of(1);
        const merged$ = merge(a$);
                        ~~~~~ [forbidden { "operator": "merge", "inputType": "single argument" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // zip with single observable
        import { zip, of } from "rxjs";

        const a$ = of(1);
        const zipped$ = zip(a$);
                        ~~~ [forbidden { "operator": "zip", "inputType": "single argument" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // concat with single observable
        import { concat, of } from "rxjs";

        const a$ = of(1);
        const concatenated$ = concat(a$);
                              ~~~~~~ [forbidden { "operator": "concat", "inputType": "single argument" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // race with single observable
        import { race, of } from "rxjs";

        const a$ = of(1);
        const raced$ = race(a$);
                       ~~~~ [forbidden { "operator": "race", "inputType": "single argument" }]
      `,
    ),
    // #endregion

    // #region invalid; single observable in object
    fromFixture(
      stripIndent`
        // combineLatest with single property in object
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const combined$ = combineLatest({ a: a$ });
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-property object" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // forkJoin with single property in object
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const combined$ = forkJoin({ result: a$ });
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; inline observables
    fromFixture(
      stripIndent`
        // combineLatest with inline single observable
        import { combineLatest, of } from "rxjs";

        const combined$ = combineLatest([of(1)]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // forkJoin with inline single observable in object
        import { forkJoin, of } from "rxjs";

        const combined$ = forkJoin({ data: of('hello') });
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; sparse arrays
    fromFixture(
      stripIndent`
        // combineLatest with sparse array
        import { combineLatest, of } from "rxjs";

        const a$ = of(1);
        const combined$ = combineLatest([, a$]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // forkJoin with sparse array
        import { forkJoin, of } from "rxjs";

        const a$ = of(1);
        const combined$ = forkJoin([, a$]);
                          ~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-valued array" }]
      `,
    ),
    // #endregion

    // #region invalid; getter object member
    fromFixture(
      stripIndent`
        // combineLatest with non-property object member
        import { combineLatest, of } from "rxjs";

        const combined$ = combineLatest({ get data() { return of(1); } });
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; namespace imports
    fromFixture(
      stripIndent`
        // combineLatest from namespace import with single observable array
        import * as Rx from "rxjs";

        const a$ = Rx.of(1);
        const combined$ = Rx.combineLatest([a$]);
                          ~~~~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // forkJoin from namespace import with single observable object
        import * as Rx from "rxjs";

        const source$ = Rx.of('data');
        const result$ = Rx.forkJoin({ item: source$ });
                        ~~~~~~~~~~~ [forbidden { "operator": "forkJoin", "inputType": "single-property object" }]
      `,
    ),
    // #endregion

    // #region invalid; complex expressions with single elements
    fromFixture(
      stripIndent`
        // combineLatest with single complex expression
        import { combineLatest, of } from "rxjs";
        import { map } from "rxjs/operators";

        const combined$ = combineLatest([of(1).pipe(map(x => x * 2))]);
                          ~~~~~~~~~~~~~ [forbidden { "operator": "combineLatest", "inputType": "single-valued array" }]
      `,
    ),
    fromFixture(
      stripIndent`
        // forkJoin with single method call result
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
