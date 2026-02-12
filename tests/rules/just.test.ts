import { stripIndent } from 'common-tags';
import { justRule } from '../../src/rules/just';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('just', justRule, {
  valid: [
    {
      name: 'non-RxJS of',
      code: stripIndent`
        function foo(): void {
          function of(): void {}
          of();
        }

        function bar(of: Function): void {
          of();
        }

        function baz(): void {
          const of = () => {};
          of();
        }
      `,
    },
    {
      name: 'aliased as bar',
      code: stripIndent`
        import { of as bar } from "rxjs";

        const a = bar("a");
      `,
    },
    {
      name: 'aliased as of',
      code: stripIndent`
        import { of as of } from "rxjs";

        const a = of("a");
      `,
    },
  ],
  invalid: [
    fromFixture(
      'imported of',
      stripIndent`
        import { of } from "rxjs";
                 ~~ [forbidden]

        const a = of("a");
                  ~~ [forbidden]
        const b = of("b");
                  ~~ [forbidden]
      `,
      {
        output: stripIndent`
          import { of as just } from "rxjs";

          const a = just("a");
          const b = just("b");
        `,
      },
    ),
    fromFixture(
      'imported of with non-RxJS of',
      stripIndent`
        import { of } from "rxjs";
                 ~~ [forbidden]

        function foo(): void {
          function of(): void {}
          of();
        }

        function bar(of: Function): void {
          of();
        }

        function baz(): void {
          const of = () => {};
          of();
        }
      `,
      {
        output: stripIndent`
          import { of as just } from "rxjs";

          function foo(): void {
            function of(): void {}
            of();
          }

          function bar(of: Function): void {
            of();
          }

          function baz(): void {
            const of = () => {};
            of();
          }
        `,
      },
    ),
  ],
});
