import { stripIndent } from 'common-tags';
import { throwErrorRule } from '../../src/rules/throw-error';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('throw-error', throwErrorRule, {
  valid: [
    // #region valid; throwError
    {
      name: 'Error',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => new Error("Boom!"));
      `,
    },
    {
      name: 'RangeError',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => new RangeError("Boom!"));
      `,
    },
    {
      name: 'DOMException',
      code: stripIndent`
        /// <reference lib="dom" />
        import { throwError } from "rxjs";

        const ob1 = throwError(() => new DOMException("Boom!"));
      `,
    },
    {
      name: 'custom Error',
      code: stripIndent`
        import { throwError } from "rxjs";

        class MyFailure extends Error {}

        const ob1 = throwError(() => new MyFailure("Boom!"));
      `,
    },
    {
      name: 'arrow function return',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError(() => {
          return new Error("Boom!");
        });
      `,
    },
    {
      name: 'function return',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError(function () {
          return new Error("Boom!");
        });
      `,
    },
    {
      name: 'any',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => "Boom!" as any);
      `,
    },
    {
      name: 'returned any',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => errorMessage());

        function errorMessage(): any {
          return "error";
        }
      `,
    },
    {
      name: 'unknown',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => "Boom!" as unknown);
      `,
    },
    {
      name: 'returned unknown',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => errorMessage());

        function errorMessage(): unknown {
          return "error";
        }
      `,
    },
    {
      name: 'Error without factory (deprecated)',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(new Error("Boom!"));
      `,
    },
    {
      name: 'DOMException without factory (deprecated)',
      code: stripIndent`
        /// <reference lib="dom" />
        import { throwError } from "rxjs";

        const ob1 = throwError(new DOMException("Boom!"));
      `,
    },
    {
      name: 'any without factory (deprecated)',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!" as any);
      `,
    },
    {
      name: 'returned any without factory (deprecated)',
      code: stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(errorMessage());

        function errorMessage(): any {
          return "error";
        }
      `,
    },
    {
      name: 'Object.assign',
      code: stripIndent`
        // https://github.com/cartant/rxjs-tslint-rules/issues/86
        import { throwError } from "rxjs";

        throwError(() => Object.assign(
          new Error("Not Found"),
          { code: "NOT_FOUND" }
        ));
      `,
    },
    {
      name: 'Object.assign arrow function return',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError(() => {
          return Object.assign(
            new Error("Not Found"),
            { code: "NOT_FOUND" }
          );
        });
      `,
    },
    {
      name: 'template literal with Error constructor',
      code: stripIndent`
        import { throwError } from "rxjs";

        const errorMessage = "Boom!";
        throwError(() => new Error(\`Error: \${errorMessage}\`));
      `,
    },
    // #endregion valid; throwError
    // #region valid; subject.error
    {
      name: 'Subject.error; Error',
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(new Error("Boom!"));
      `,
    },
    {
      name: 'Subject.error; RangeError',
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(new RangeError("Boom!"));
      `,
    },
    {
      name: 'Subject.error; DOMException',
      code: stripIndent`
        /// <reference lib="dom" />
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(new DOMException("Boom!"));
      `,
    },
    {
      name: 'Subject.error; custom Error',
      code: stripIndent`
        import { Subject } from "rxjs";

        class MyFailure extends Error {}

        const subject = new Subject<void>();

        subject.error(new MyFailure("Boom!"));
      `,
    },
    {
      name: 'Subject.error; any',
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error("Boom!" as any);
      `,
    },
    {
      name: 'Subject.error; unknown',
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error("Boom!" as unknown);
      `,
    },
    {
      name: 'Subject.error; Object.assign',
      code: stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(Object.assign(
          new Error("Not Found"),
          { code: "NOT_FOUND" }
        ));
      `,
    },
    // #endregion valid; subject.error
    // #region valid; other
    {
      name: 'no signature',
      code: stripIndent`
        // There will be no signature for callback and
        // that should not effect an internal error.
        declare const callback: Function;
        callback();
      `,
    },
    {
      name: 'unrelated throw statements (use @typescript-eslint/only-throw-error instead)',
      code: stripIndent`
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
    },
    // #endregion valid; other
  ],
  invalid: [
    // #region invalid; throwError
    fromFixture(
      'string',
      stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => "Boom!");
                                     ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              import { throwError } from "rxjs";

              const ob1 = throwError(() => new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'returned string',
      stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => errorMessage());
                                     ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `,
    ),
    fromFixture(
      'string without factory (deprecated)',
      stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError("Boom!");
                               ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              import { throwError } from "rxjs";

              const ob1 = throwError(new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'returned string without factory (deprecated)',
      stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(errorMessage());
                               ~~~~~~~~~~~~~~ [forbidden]

        function errorMessage() {
          return "Boom!";
        }
      `,
    ),
    fromFixture(
      'any not allowed',
      stripIndent`
        import { throwError } from "rxjs";

        throwError(() => "Boom!" as any);
                         ~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingAny: false }] },
    ),
    fromFixture(
      'unknown not allowed',
      stripIndent`
        import { throwError } from "rxjs";

        throwError(() => "Boom!" as unknown);
                         ~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingUnknown: false }] },
    ),
    fromFixture(
      'falsy',
      stripIndent`
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
      'Object.assign with non-Error',
      stripIndent`
        import { throwError } from "rxjs";

        throwError(() => Object.assign({ message: "Not Found" }, { code: "NOT_FOUND" }));
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'namespace import',
      stripIndent`
        import * as Rx from "rxjs";

        Rx.throwError(() => "Boom!");
                            ~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              import * as Rx from "rxjs";

              Rx.throwError(() => new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'template literal',
      stripIndent`
        import { throwError } from "rxjs";

        const ob1 = throwError(() => \`Boom! \${123}\`);
                                     ~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              import { throwError } from "rxjs";

              const ob1 = throwError(() => new Error(\`Boom! \${123}\`));
            `,
          },
        ],
      },
    ),
    // #endregion invalid; throwError
    // #region invalid; subject.error
    fromFixture(
      'Subject.error; string',
      stripIndent`
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
              import { Subject } from "rxjs";

              const subject = new Subject<void>();

              subject.error(new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'Subject.error; any not allowed',
      stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error("Boom!" as any);
                      ~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingAny: false }] },
    ),
    fromFixture(
      'Subject.error; unknown not allowed',
      stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error("Boom!" as unknown);
                      ~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
      { options: [{ allowThrowingUnknown: false }] },
    ),
    fromFixture(
      'Subject.error; falsy',
      stripIndent`
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
      'Subject.error; Object.assign with non-Error',
      stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(Object.assign({ message: "Not Found" }, { code: "NOT_FOUND" }));
                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'Subject.error; namespace import',
      stripIndent`
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
              import * as Rx from "rxjs";
              const subject = new Rx.Subject<void>();
              subject.error(new Error("Boom!"));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'Subject.error; template literal',
      stripIndent`
        import { Subject } from "rxjs";

        const subject = new Subject<void>();

        subject.error(\`Boom! \${123}\`);
                      ~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestErrorConstructor',
            output: stripIndent`
              import { Subject } from "rxjs";

              const subject = new Subject<void>();

              subject.error(new Error(\`Boom! \${123}\`));
            `,
          },
        ],
      },
    ),
    // #endregion invalid; subject.error
  ],
});
