import { stripIndent } from 'common-tags';
import { noAsyncSubscribeRule } from '../../src/rules/no-async-subscribe';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-async-subscribe', noAsyncSubscribeRule, {
  valid: [
    {
      name: 'sync arrow function',
      code: stripIndent`
        import { of } from "rxjs";

        of("a").subscribe(() => {});
      `,
    },
    {
      name: 'sync function',
      code: stripIndent`
        import { of } from "rxjs";

        of("a").subscribe(function() {});
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/46',
      code: stripIndent`
        import React, { FC } from "react";
        const SomeComponent: FC<{}> = () => <span>some component</span>;
        const someElement = <SomeComponent />;
      `,
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/61',
      code: stripIndent`
        const whatever = {
          subscribe(next?: (value: unknown) => void) {}
        };
        whatever.subscribe(async () => { await 42; });
      `,
    },
    {
      name: 'observer object',
      code: stripIndent`
        import { of } from "rxjs";

        of('a').subscribe({
          next: () => {},
        });
        of('a').subscribe({
          next: function() {},
        });
      `,
    },
    {
      name: 'non-RxJS observer object',
      code: stripIndent`
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
    },
  ],
  invalid: [
    fromFixture(
      'async arrow function',
      stripIndent`
        import { of } from "rxjs";

        of("a").subscribe(async () => {
                          ~~~~~ [forbidden]
          return await "a";
        });
      `,
    ),
    fromFixture(
      'async arrow function; observer object',
      stripIndent`
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
      'async function',
      stripIndent`
        import { of } from "rxjs";

        of("a").subscribe(async function() {
                          ~~~~~ [forbidden]
          return await "a";
        });
      `,
    ),
    fromFixture(
      'async function; observer object',
      stripIndent`
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
