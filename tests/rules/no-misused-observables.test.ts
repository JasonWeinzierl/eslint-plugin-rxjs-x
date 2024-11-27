import { stripIndent } from 'common-tags';
import { noMisusedObservablesRule } from '../../src/rules/no-misused-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-misused-observables', noMisusedObservablesRule, {
  valid: [
    // #region valid; void return argument
    {
      code: stripIndent`
        // void return argument; explicitly allowed
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> => { return of(i); });
        [1, 2, 3].forEach(i => of(i));

        class Foo {
          constructor(x: () => void) {}
        }
        new Foo(() => of(42));
      `,
      options: [{ checksVoidReturn: false }],
    },
    stripIndent`
      // void return argument; unrelated
      [1, 2, 3].forEach(i => i);
      [1, 2, 3].forEach(i => { return i; });

      class Foo {
        constructor(x: () => void) {}
      }
      new Foo(() => 42);
      new Foo;
    `,
    stripIndent`
      // couldReturnType is bugged for block body implicit return types (#57)
      import { of } from "rxjs";

      [1, 2, 3].forEach(i => { return of(i); });
    `,
    // #endregion valid; void return argument
    // #region valid; void return attribute
    {
      code: stripIndent`
        // void return attribute; explicitly allowed
        import { Observable, of } from "rxjs";
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void }> = () => <div />;
        return (
          <Component foo={() => of(42)} />
        );
      `,
      options: [{ checksVoidReturn: false }],
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    {
      code: stripIndent`
        // void return attribute; unrelated
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void }> = () => <div />;
        return (
          <Component foo={() => 42} />
        );
      `,
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    // #endregion valid; void return attribute
    // #region valid; spread
    {
      code: stripIndent`
        // spread; explicitly allowed
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
      `,
      options: [{ checksSpreads: false }],
    },
    stripIndent`
      // spread; unrelated
      const foo = { bar: 42 };
      const baz = { ...foo };
    `,
    // #endregion valid; spread
  ],
  invalid: [
    // #region invalid; void return argument
    fromFixture(
      stripIndent`
        // void return argument; block body
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> => { return of(i); });
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; inline body
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => of(i));
                          ~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; block body; union return
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> | number => { if (i > 1) { return of(i); } else { return i; } });
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; inline body; union return
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => i > 1 ? of(i) : i);
                          ~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      stripIndent`
        // void return argument; constructor
        import { of } from "rxjs";

        class Foo {
          constructor(x: () => void) {}
        }
        new Foo(() => of(42));
                ~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    // #endregion invalid; void return argument
    // #region invalid; void return attribute
    fromFixture(
      stripIndent`
        // void return attribute; block body
        import { Observable, of } from "rxjs";
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void }> = () => <div />;
        return (
          <Component foo={(): Observable<number> => { return of(42); }} />
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnAttribute]
        );
      `,
      {
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      },
    ),
    fromFixture(
      stripIndent`
        // void return attribute; inline body
        import { Observable, of } from "rxjs";
        import React, { FC } from "react";

        const Component: FC<{ foo: () => void }> = () => <div />;
        return (
          <Component foo={() => of(42)} />
                         ~~~~~~~~~~~~~~ [forbiddenVoidReturnAttribute]
        );
      `,
      {
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      },
    ),
    // #endregion invalid; void return attribute
    // #region invalid; spread
    fromFixture(
      stripIndent`
        // spread variable
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
                         ~~~~~~ [forbiddenSpread]
      `,
    ),
    fromFixture(
      stripIndent`
        // spread call function
        import { of } from "rxjs";

        function source() {
          return of(42);
        }
        const foo = { ...source() };
                         ~~~~~~~~ [forbiddenSpread]
      `,
    ),
    // #endregion invalid; spread
  ],
});
