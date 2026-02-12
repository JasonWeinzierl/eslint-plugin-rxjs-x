import { stripIndent } from 'common-tags';
import { macroRule } from '../../src/rules/macro';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('macro', macroRule, {
  valid: [
    {
      name: 'no macro; no RxJS',
      code: stripIndent`
        import { foo } from "bar";
      `,
    },
    {
      name: 'macro; RxJS imports',
      code: stripIndent`
        import "babel-plugin-rxjs-tools/macro";
        import { of } from "rxjs";
      `,
    },
    {
      name: 'macro; pipe',
      code: stripIndent`
        import "babel-plugin-rxjs-tools/macro";
        import { foo, goo } from "bar";
        const hoo = foo.pipe(goo());
      `,
    },
    {
      name: 'macro; subscribe',
      code: stripIndent`
        import "babel-plugin-rxjs-tools/macro";
        import { foo } from "bar";
        foo.subscribe();
      `,
    },
  ],
  invalid: [
    fromFixture(
      'no macro; RxJS imports',
      stripIndent`
        import { of } from "rxjs";
        ~~~~~~~~~~~~~~~~~~~~~~~~~~ [macro]
      `,
      {
        output: stripIndent`
          import "babel-plugin-rxjs-tools/macro";
          import { of } from "rxjs";
        `,
      },
    ),
    fromFixture(
      'no macro; pipe',
      stripIndent`
        import { foo, goo } from "bar";
        const hoo = foo.pipe(goo());
                    ~~~~~~~~ [macro]
      `,
      {
        output: stripIndent`
          import "babel-plugin-rxjs-tools/macro";
          import { foo, goo } from "bar";
          const hoo = foo.pipe(goo());
        `,
      },
    ),
    fromFixture(
      'no macro; subscribe',
      stripIndent`
        import { foo } from "bar";
        foo.subscribe();
        ~~~~~~~~~~~~~ [macro]
      `,
      {
        output: stripIndent`
          import "babel-plugin-rxjs-tools/macro";
          import { foo } from "bar";
          foo.subscribe();
        `,
      },
    ),
  ],
});
