/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/eslint-plugin-rxjs
 */

import { stripIndent } from "common-tags";
import { fromFixture } from "eslint-etc";
import rule = require("../../source/rules/no-nested-pipe");
import { ruleTester } from "../utils";

ruleTester({ types: true }).run("no-nested-pipe", rule, {
  valid: [
    stripIndent`
      // not nested in pipe
      import { Observable,of,switchMap } from "rxjs";
      of(47).pipe(switchMap(value => {
       console.log('new' ,value);
      })).subscribe(value => {
        console.log(value);
      })
    `,
    stripIndent`
    // not nested in pipe
    import { Observable,switchMap } from "rxjs";
    of(47).pipe(switchMap(value => {
     return someFunction(value)
    })).subscribe(value => {
      console.log(value);
    });
    function someFunction(someParam: Observable<any>): Observable<any> { 
    return of(43).pipe(
      switchMap(value  =>  {value + someParam})
      )
     }
  `,
    stripIndent`
  // not nested in pipe
  import { Observable,switchMap } from "rxjs";
  of(47).pipe(switchMap(value => {
   return someFunction1(value)
  }),
  switchMap(value => {
   return someFunction2(value)
  })
  ).subscribe(value => {
    console.log(value);
  });
  function someFunction1(someParam: Observable<any>): Observable<any> { 
  return of(43).pipe(
    switchMap(value  =>  {value + someParam})
    )
   };
    function someFunction2(someParam: Observable<any>): Observable<any> { 
  return of(43).pipe(
    switchMap(value  =>  {value + someParam})
    )
   }
`,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // nested in pipe
        import { of,switchMap,tap } from "rxjs";
        of("foo").pipe(
        switchMap(value => { 
        return of("bar").pipe(tap(value => { console.log(value)})
                         ~~~~ [forbidden]
        )})
        ).subscribe(value => {
        console.log(value);
      });
      `
    ),
    fromFixture(
      stripIndent`
        // nested in pipe
        import { of,switchMap,tap } from "rxjs";
        of("foo").pipe(
        switchMap(value => { 
        return of("bar").pipe(tap(value => { console.log(value)})
                         ~~~~ [forbidden]
        )}),
         switchMap(value => { 
        return of("bar").pipe(tap(value => { console.log(value)})
                         ~~~~ [forbidden]
        )})
        ).subscribe(value => {
        console.log(value);
      });
      `
    ),
  ],
});
