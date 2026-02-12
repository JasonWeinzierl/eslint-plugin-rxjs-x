import { stripIndent } from 'common-tags';
import { noIgnoredObservableRule } from '../../src/rules/no-ignored-observable';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-observable', noIgnoredObservableRule, {
  valid: [
    {
      name: 'not ignored',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        function sink(source: Observable<number>) {
        }

        const a = functionSource();
        sink(functionSource());
      `,
    },
    {
      name: 'not ignored arrow',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        function sink(source: Observable<number>) {
        }

        const a = arrowSource();
        sink(arrowSource());
      `,
    },
  ],
  invalid: [
    fromFixture(
      'ignored',
      stripIndent`
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        functionSource();
        ~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'ignored arrow',
      stripIndent`
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        arrowSource();
        ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
