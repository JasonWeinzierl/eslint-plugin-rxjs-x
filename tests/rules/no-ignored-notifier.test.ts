import { stripIndent } from 'common-tags';
import { noIgnoredNotifierRule } from '../../src/rules/no-ignored-notifier';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-notifier', noIgnoredNotifierRule, {
  valid: [
    {
      name: 'repeatWhen not ignored',
      code: stripIndent`
        import { of } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const a = source.pipe(
          repeatWhen(notifications => notifications)
        );

        const b = source.pipe(
          repeatWhen(
            function (notifications) {
              return notifications;
            }
          )
        );
      `,
    },
    {
      name: 'retryWhen not ignored',
      code: stripIndent`
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const g = source.pipe(
          retryWhen(errors => errors)
        );

        const h = source.pipe(
          retryWhen(
            function (errors) {
              return errors;
            }
          )
        );
      `,
    },
  ],
  invalid: [
    fromFixture(
      'repeatWhen ignored parameter',
      stripIndent`
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(notifications => range(0, 3))
          ~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'repeatWhen no parameter',
      stripIndent`
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(() => range(0, 3))
          ~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'repeatWhen non-arrow ignored parameter',
      stripIndent`
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(
          ~~~~~~~~~~ [forbidden]
            function (notifications) {
              return range(0, 3);
            }
          )
        );
      `,
    ),
    fromFixture(
      'repeatWhen non-arrow no parameter',
      stripIndent`
        import { of, range } from "rxjs";
        import { repeatWhen } from "rxjs/operators";

        const source = of(42);

        const c = source.pipe(
          repeatWhen(
          ~~~~~~~~~~ [forbidden]
            function () {
              return range(0, 3);
            }
          )
        );
      `,
    ),
    fromFixture(
      'retryWhen ignored parameter',
      stripIndent`
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(errors => range(0, 3))
          ~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'retryWhen no parameter',
      stripIndent`
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(() => range(0, 3))
          ~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'retryWhen non-arrow ignored parameter',
      stripIndent`
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(
          ~~~~~~~~~ [forbidden]
            function (errors) {
              return range(0, 3);
            }
          )
        );
      `,
    ),
    fromFixture(
      'retryWhen non-arrow no parameter',
      stripIndent`
        import { of } from "rxjs";
        import { retryWhen } from "rxjs/operators";

        const source = of(42);

        const h = source.pipe(
          retryWhen(
          ~~~~~~~~~ [forbidden]
            function () {
              return range(0, 3);
            }
          )
        );
      `,
    ),
  ],
});
