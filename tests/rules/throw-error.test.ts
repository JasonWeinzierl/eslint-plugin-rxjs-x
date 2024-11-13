import { stripIndent } from 'common-tags';
import { throwErrorRule } from '../../src/rules/throw-error';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('throw-error', throwErrorRule, {
  valid: [
    stripIndent`
      // Error
      import { throwError } from "rxjs";

      const ob1 = throwError(new Error("Boom!"));
    `,
    stripIndent`
      // RangeError
      import { throwError } from "rxjs";

      const ob1 = throwError(new RangeError("Boom!"));
    `,
    stripIndent`
      // DOMException
      /// <reference lib="dom" />
      import { throwError } from "rxjs";

      const ob1 = throwError(new DOMException("Boom!"));
    `,
    stripIndent`
      // any
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as any);
    `,
    stripIndent`
      // returned any
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      // unknown
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as unknown);
    `,
    stripIndent`
      // returned unknown
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): unknown {
        return "error";
      }
    `,
    stripIndent`
      // Error with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new Error("Boom!"));
    `,
    stripIndent`
      // DOMException with factory
      /// <reference lib="dom" />
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new DOMException("Boom!"));
    `,
    stripIndent`
      // any with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => "Boom!" as any);
    `,
    stripIndent`
      // returned any with factory
      import { throwError } from "rxjs";

      const ob1 = throwError(() => errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      // subtype with Object.assign
      // https://github.com/cartant/rxjs-tslint-rules/issues/86
      import { throwError } from "rxjs";

      throwError(() => Object.assign(
        new Error("Not Found"),
        { code: "NOT_FOUND" }
      ));
    `,
    stripIndent`
      // no signature
      // There will be no signature for callback and
      // that should not effect an internal error.
      declare const callback: Function;
      callback();
    `,
    stripIndent`
      // unrelated throw statements (use @typescript-eslint/only-throw-error instead).
      const a = () => { throw "error"; };
      const b = () => { throw new Error("error"); };

      const errorMessage = "Boom!";
      const c = () => { throw errorMessage; };

      const d = () => { throw errorMessage(); };
      function errorMessage() {
        return "error";
      }

      const e = () => { throw new DOMException("error"); };
      const f = () => { throw "error" as any };

      const g = () => { throw errorMessageAny(); };
      function errorMessageAny(): any {
        return "error";
      }

      https://github.com/cartant/rxjs-tslint-rules/issues/85
      try {
        throw new Error("error");
      } catch (error: any) {
        throw error;
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // string
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!");
                               ~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // returned string
        import { throwError } from "rxjs";

        const ob1 = throwError(errorMessage());
                               ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // string with factory
        import { throwError } from "rxjs";

        const ob1 = throwError(() => "Boom!");
                               ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // returned string with factory
        import { throwError } from "rxjs";

        const ob1 = throwError(() => errorMessage());
                               ~~~~~~~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // falsy
        import { throwError } from "rxjs";

        const ob1 = throwError(() => 0);
                               ~~~~~~~ [forbidden]
        const ob2 = throwError(() => false);
                               ~~~~~~~~~~~ [forbidden]
        const ob3 = throwError(() => null);
                               ~~~~~~~~~~ [forbidden]
        const ob4 = throwError(() => undefined);
                               ~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
