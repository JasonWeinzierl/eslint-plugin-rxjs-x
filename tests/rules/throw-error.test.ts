import { stripIndent } from 'common-tags';
import { throwErrorRule } from '../../src/rules/throw-error';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('throw-error', throwErrorRule, {
  valid: [
    // #region valid; throwError
    stripIndent`
      // Error
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new Error("Boom!"));
    `,
    stripIndent`
      // RangeError
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new RangeError("Boom!"));
    `,
    stripIndent`
      // DOMException
      /// <reference lib="dom" />
      import { throwError } from "rxjs";

      const ob1 = throwError(() => new DOMException("Boom!"));
    `,
    stripIndent`
      // custom Error
      import { throwError } from "rxjs";

      class MyFailure extends Error {}

      const ob1 = throwError(() => new MyFailure("Boom!"));
    `,
    stripIndent`
      // arrow function return
      import { throwError } from "rxjs";

      throwError(() => {
        return new Error("Boom!");
      });
    `,
    stripIndent`
      // function return
      import { throwError } from "rxjs";

      throwError(function () {
        return new Error("Boom!");
      });
    `,
    stripIndent`
      // any
      import { throwError } from "rxjs";

      const ob1 = throwError(() => "Boom!" as any);
    `,
    stripIndent`
      // returned any
      import { throwError } from "rxjs";

      const ob1 = throwError(() => errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      // unknown
      import { throwError } from "rxjs";

      const ob1 = throwError(() => "Boom!" as unknown);
    `,
    stripIndent`
      // returned unknown
      import { throwError } from "rxjs";

      const ob1 = throwError(() => errorMessage());

      function errorMessage(): unknown {
        return "error";
      }
    `,
    stripIndent`
      // Error without factory (deprecated)
      import { throwError } from "rxjs";

      const ob1 = throwError(new Error("Boom!"));
    `,
    stripIndent`
      // DOMException without factory (deprecated)
      /// <reference lib="dom" />
      import { throwError } from "rxjs";

      const ob1 = throwError(new DOMException("Boom!"));
    `,
    stripIndent`
      // any without factory (deprecated)
      import { throwError } from "rxjs";

      const ob1 = throwError("Boom!" as any);
    `,
    stripIndent`
      // returned any without factory (deprecated)
      import { throwError } from "rxjs";

      const ob1 = throwError(errorMessage());

      function errorMessage(): any {
        return "error";
      }
    `,
    stripIndent`
      // Object.assign
      // https://github.com/cartant/rxjs-tslint-rules/issues/86
      import { throwError } from "rxjs";

      throwError(() => Object.assign(
        new Error("Not Found"),
        { code: "NOT_FOUND" }
      ));
    `,
    stripIndent`
      // Object.assign arrow function return
      import { throwError } from "rxjs";

      throwError(() => {
        return Object.assign(
          new Error("Not Found"),
          { code: "NOT_FOUND" }
        );
      });
    `,
    // #endregion valid; throwError
    // #region valid; subject.error
    stripIndent`
      // Error
      import { Subject } from "rxjs";

      const subject = new Subject<void>();

      subject.error(new Error("Boom!"));
    `,
    stripIndent`
      // RangeError
      import { Subject } from "rxjs";

      const subject = new Subject<void>();

      subject.error(new RangeError("Boom!"));
    `,
    stripIndent`
      // DOMException
      /// <reference lib="dom" />
      import { Subject } from "rxjs";

      const subject = new Subject<void>();

      subject.error(new DOMException("Boom!"));
    `,
    stripIndent`
      // custom Error
      import { Subject } from "rxjs";

      class MyFailure extends Error {}

      const subject = new Subject<void>();

      subject.error(new MyFailure("Boom!"));
    `,
    stripIndent`
      // any
      import { Subject } from "rxjs";

      const subject = new Subject<void>();

      subject.error("Boom!" as any);
    `,
    stripIndent`
      // unknown
      import { Subject } from "rxjs";

      const subject = new Subject<void>();

      subject.error("Boom!" as unknown);
    `,
    stripIndent`
      // Object.assign
      import { Subject } from "rxjs";

      const subject = new Subject<void>();

      subject.error(Object.assign(
        new Error("Not Found"),
        { code: "NOT_FOUND" }
      ));
    `,
    // #endregion valid; subject.error
    // #region valid; other
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
    // #endregion valid; other
  ],
  invalid: [
    // #region invalid; throwError
    fromFixture(
      stripIndent`
        // string
        import { throwError } from "rxjs";

        const ob1 = throwError(() => "Boom!");
                                     ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              // string
              import { throwError } from "rxjs";

              const ob1 = throwError(() => new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // returned string
        import { throwError } from "rxjs";

        const ob1 = throwError(() => errorMessage());
                                     ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // string without factory (deprecated)
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!");
                               ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              // string without factory (deprecated)
              import { throwError } from "rxjs";

              const ob1 = throwError(new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // returned string without factory (deprecated)
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
        // any not allowed
        import { throwError } from "rxjs";

        throwError(() => "Boom!" as any);
                         ~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingAny: false }] },
    ),
    fromFixture(
      stripIndent`
        // unknown not allowed
        import { throwError } from "rxjs";

        throwError(() => "Boom!" as unknown);
                         ~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingUnknown: false }] },
    ),
    fromFixture(
      stripIndent`
        // falsy
        import { throwError } from "rxjs";

        const ob1 = throwError(() => 0);
                                     ~ [forbidden]
        const ob2 = throwError(() => false);
                                     ~~~~~ [forbidden]
        const ob3 = throwError(() => null);
                                     ~~~~ [forbidden]
        const ob4 = throwError(() => undefined);
                                     ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // Object.assign with non-Error
        import { throwError } from "rxjs";

        throwError(() => Object.assign({ message: "Not Found" }, { code: "NOT_FOUND" }));
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace import
        import * as Rx from "rxjs";

        Rx.throwError(() => "Boom!");
                            ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              // namespace import
              import * as Rx from "rxjs";

              Rx.throwError(() => new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    // #endregion invalid; throwError
    // #region invalid; subject.error
    fromFixture(
      stripIndent`
        // string
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error("Boom!");
                      ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              // string
              import { Subject } from "rxjs";

              const subject = new Subject<void>();

              subject.error(new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      stripIndent`
        // any not allowed
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error("Boom!" as any);
                      ~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingAny: false }] },
    ),
    fromFixture(
      stripIndent`
        // unknown not allowed
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error("Boom!" as unknown);
                      ~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingUnknown: false }] },
    ),
    fromFixture(
      stripIndent`
        // falsy
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(0);
                      ~ [forbidden]
        subject.error(false);
                      ~~~~~ [forbidden]
        subject.error(null);
                      ~~~~ [forbidden]
        subject.error(undefined);
                      ~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // Object.assign with non-Error
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(Object.assign({ message: "Not Found" }, { code: "NOT_FOUND" }));
                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      stripIndent`
        // namespace import
        import * as Rx from "rxjs";
        const subject = new Rx.Subject<void>();
        subject.error("Boom!");
                      ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              // namespace import
              import * as Rx from "rxjs";
              const subject = new Rx.Subject<void>();
              subject.error(new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    // #endregion invalid; subject.error
  ],
});
