import { stripIndent } from 'common-tags';
import { noFloatingObservablesRule } from '../../src/rules/no-floating-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-floating-observables', noFloatingObservablesRule, {
  valid: [
    stripIndent`
      // not ignored
      import { Observable, of } from "rxjs";

      function functionSource() {
        return of(42);
      }

      function sink(source: Observable<number>) {
      }

      functionSource().subscribe();
      const a = functionSource();
      sink(functionSource());
      void functionSource();
    `,
    stripIndent`
      // not ignored arrow
      import { Observable, of } from "rxjs";

      const arrowSource = () => of(42);

      function sink(source: Observable<number>) {
      }

      functionSource().subscribe();
      const a = arrowSource();
      sink(arrowSource());
      void functionSource();
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // ignored
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        functionSource();
        ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // ignored arrow
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        arrowSource();
        ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // ignoreVoid false
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        void functionSource();
             ~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
      `,
      {
        options: [{ ignoreVoid: false }],
      },
    ),
  ],
});
