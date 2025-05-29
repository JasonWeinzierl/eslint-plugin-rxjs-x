import { stripIndent } from 'common-tags';
import { noAsyncSubscribeRule } from '../../src/rules/no-async-subscribe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-async-subscribe', noAsyncSubscribeRule, {
  valid: [
    stripIndent`
      // sync arrow function
      import { of } from "rxjs";

      of("a").subscribe(() => {});
    `,
    stripIndent`
      // sync function
      import { of } from "rxjs";

      of("a").subscribe(function() {});
    `,
    {
      code: stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/46
        import React, { FC } from "react";
        const SomeComponent: FC<{}> = () => <span>some component</span>;
        const someElement = <SomeComponent />;
      `,
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    stripIndent`
      // https://github.com/cartant/eslint-plugin-rxjs/issues/61
      const whatever = {
        subscribe(next?: (value: unknown) => void) {}
      };
      whatever.subscribe(async () => { await 42; });
    `,
    stripIndent`
      // observer object
      import { of } from "rxjs";

      of('a').subscribe({
        next: () => {},
      });
      of('a').subscribe({
        next: function() {},
      });
    `,
    stripIndent`
      // non-RxJS observer object
      const whatever = {
        subscribe: (observer: {
          next?: (value: unknown) => void;
        }) => {},
      };
      whatever.subscribe({
        next: () => {},
      });
      whatever.subscribe({
        next: function() {},
      });
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // async arrow function
        import { of } from "rxjs";

        of("a").subscribe(async () => {
                          ~~~~~ [forbidden]
          return await "a";
        });
      `,
    ),
    fromFixture(
      stripIndent`
        // async arrow function; observer object
        import { of } from "rxjs";

        of("a").subscribe({
          next: async () => {
                ~~~~~ [forbidden]
            return await "a";
          },
        });
      `,
    ),
    fromFixture(
      stripIndent`
        // async function
        import { of } from "rxjs";

        of("a").subscribe(async function() {
                          ~~~~~ [forbidden]
          return await "a";
        });
      `,
    ),
    fromFixture(
      stripIndent`
        // async function; observer object
        import { of } from "rxjs";

        of("a").subscribe({
          next: async function() {
                ~~~~~ [forbidden]
            return await "a";
          },
        });
      `,
    ),
  ],
});
