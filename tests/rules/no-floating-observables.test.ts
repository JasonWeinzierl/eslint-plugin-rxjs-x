import { stripIndent } from 'common-tags';
import { noFloatingObservablesRule } from '../../src/rules/no-floating-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-floating-observables', noFloatingObservablesRule, {
  valid: [
    {
      name: 'not ignored',
      code: stripIndent`
        // not ignored
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        function sink(source: Observable<number>) {
        }

        functionSource().subscribe();
        const a = functionSource();
        const b = [functionSource()];
        [void functionSource()];
        sink(functionSource());
        void functionSource();
      `,
    },
    {
      name: 'not ignored arrow',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const arrowSource = () => of(42);

        function sink(source: Observable<number>) {
        }

        functionSource().subscribe();
        const a = arrowSource();
        const b = [arrowSource()];
        [void arrowSource()];
        sink(arrowSource());
        void functionSource();
      `,
    },
    {
      name: 'unrelated',
      code: stripIndent`
        function foo() {}

        [1, 2, 3, 'foo'];
        const a = [1];
        foo();
        [foo()];
        void foo();
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
    fromFixture(
      'chain expression',
      stripIndent`
        import { Observable, of } from "rxjs";

        const arrowSource: null | (() => Observable<number>) = () => of(42);

        arrowSource?.();
        ~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'array',
      stripIndent`
        import { of } from "rxjs";

        [of(42)];
         ~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'ignoreVoid false',
      stripIndent`
        import { Observable, of } from "rxjs";

        function functionSource() {
          return of(42);
        }

        void functionSource();
             ~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
        void functionSource?.();
             ~~~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
        [void functionSource()];
              ~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
        [void functionSource?.()];
              ~~~~~~~~~~~~~~~~~~ [forbiddenNoVoid]
      `,
      {
        options: [{ ignoreVoid: false }],
      },
    ),
    fromFixture(
      'sequence expression',
      stripIndent`
        import { of } from "rxjs";

        of(42), of(42), void of(42);
        ~~~~~~ [forbidden]
                ~~~~~~ [forbidden]
      `,
    ),
  ],
});
