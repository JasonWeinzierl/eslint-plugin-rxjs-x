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

      const a = functionSource();
      sink(functionSource());
    `,
    stripIndent`
      // not ignored arrow
      import { Observable, of } from "rxjs";

      const arrowSource = () => of(42);

      function sink(source: Observable<number>) {
      }

      const a = arrowSource();
      sink(arrowSource());
    `,
    stripIndent`
      // void operator
      import { of } from "rxjs";

      function functionSource() {
        return of(42);
      }

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
  ],
});
