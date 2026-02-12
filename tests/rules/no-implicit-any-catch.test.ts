import { stripIndent } from 'common-tags';
import { noImplicitAnyCatchRule } from '../../src/rules/no-implicit-any-catch';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-implicit-any-catch', noImplicitAnyCatchRule, {
  valid: [
    {
      name: 'arrow; no parameter',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(() => console.error("Whoops!"))
        );
      `,
    },
    {
      name: 'non-arrow; no parameter',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function () { console.error("Whoops!"); })
        );
      `,
    },
    {
      name: 'arrow; explicit unknown; default option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
    },
    {
      name: 'non-arrow; explicit unknown; default option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
    },
    {
      name: 'arrow; explicit unknown; explicit option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: unknown) => console.error(error))
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      name: 'non-arrow; explicit unknown; explicit option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: unknown) { console.error(error); })
        );
      `,
      options: [{ allowExplicitAny: true }],
    },
    {
      name: 'arrow; explicit any',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
        );
      `,
    },
    {
      name: 'non-arrow; explicit any',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
        );
      `,
    },
    {
      name: 'arrow; explicit unknown and caught; default option',
      code: stripIndent`
        import { throwError, catchError, Observable } from "rxjs";

        throwError(new Error("Kaboom!")).pipe(
          catchError((error: unknown, caught: Observable<unknown>) => console.error(error)),
        );
      `,
    },
    {
      name: 'non-arrow; explicit unknown and caught; default option',
      code: stripIndent`
        import { throwError, catchError, Observable } from "rxjs";

        throwError(new Error("Kaboom!")).pipe(
          catchError(function (error: unknown, caught: Observable<unknown>) { console.error(error); }),
        );
      `,
    },
    {
      name: 'subscribe; arrow; explicit unknown; default option',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: unknown) => console.error(error)
        );
      `,
    },
    {
      name: 'subscribe; arrow; explicit any; default option',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: any) => console.error(error)
        );
      `,
    },
    {
      name: 'subscribe; arrow; explicit unknown and caught; default option',
      code: stripIndent`
        import { throwError, catchError, Observable } from "rxjs";

        throwError(new Error("Kaboom!")).subscribe(
          undefined,
          (error: unknown, caught: Observable<unknown>) => console.error(error)
        );
      `,
    },
    {
      name: 'subscribe; arrow; explicit any and caught; default option',
      code: stripIndent`
        import { throwError, catchError, Observable } from "rxjs";

        throwError(new Error("Kaboom!")).subscribe(
          undefined,
          (error: any, caught: Observable<unknown>) => console.error(error)
        );
      `,
    },
    {
      name: 'subscribe observer; arrow; explicit unknown; default option',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: unknown) => console.error(error)
        });
      `,
    },
    {
      name: 'subscribe observer; arrow; explicit any; default option',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: any) => console.error(error)
        });
      `,
    },
    {
      name: 'subscribe observer; arrow; explicit unknown and caught; default option',
      code: stripIndent`
        import { throwError, catchError, Observable } from "rxjs";

        throwError(new Error("Kaboom!")).subscribe({
          error: (error: unknown, caught: Observable<unknown>) => console.error(error)
        });
      `,
    },
    {
      name: 'subscribe observer; arrow; explicit any and caught; default option',
      code: stripIndent`
        import { throwError, catchError, Observable } from "rxjs";

        throwError(new Error("Kaboom!")).subscribe({
          error: (error: any, caught: Observable<unknown>) => console.error(error)
        });
      `,
    },
    {
      name: 'tap; arrow; explicit unknown; default option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: unknown) => console.error(error)
        ));
      `,
    },
    {
      name: 'tap; arrow; explicit any; default option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: any) => console.error(error)
        ));
      `,
    },
    {
      name: 'tap observer; arrow; explicit unknown; default option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: unknown) => console.error(error)
        }));
      `,
    },
    {
      name: 'tap observer; arrow; explicit any; default option',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: any) => console.error(error)
        }));
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/61',
      code: stripIndent`
        const whatever = {
          subscribe(
            next?: (value: unknown) => void,
            error?: (error: unknown) => void
          ) {}
        };
        whatever.subscribe(() => {}, (error) => {});
      `,
      options: [{}],
    },
    {
      name: 'catchError; arrow; Error type with allowExplicitError',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: Error) => console.error(error))
        );
      `,
      options: [{ allowExplicitError: true }],
    },
    {
      name: 'catchError; function; Error type with allowExplicitError',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: Error) { console.error(error); })
        );
      `,
      options: [{ allowExplicitError: true }],
    },
    {
      name: 'subscribe; Error type with allowExplicitError',
      code: stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: Error) => console.error(error)
        });
      `,
      options: [{ allowExplicitError: true }],
    },
    {
      name: 'tap; Error type with allowExplicitError',
      code: stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          tap({
            error: (error: Error) => console.error(error)
          })
        );
      `,
      options: [{ allowExplicitError: true }],
    },

  ],
  invalid: [
    fromFixture(
      'arrow; implicit any',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error) => console.error(error))
                      ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: any) => console.error(error))
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: any) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'arrow; no parentheses; implicit any',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(error => console.error(error))
                     ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError((error: any) => console.error(error))
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: any) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'arrow; implicit any and caught',
      stripIndent`
        import { throwError, catchError } from "rxjs";

        throwError(new Error("Kaboom!")).pipe(
          catchError((error, caught) => console.error(error)),
                      ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          import { throwError, catchError } from "rxjs";

          throwError(new Error("Kaboom!")).pipe(
            catchError((error: any, caught) => console.error(error)),
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError, catchError } from "rxjs";

              throwError(new Error("Kaboom!")).pipe(
                catchError((error: unknown, caught) => console.error(error)),
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError, catchError } from "rxjs";

              throwError(new Error("Kaboom!")).pipe(
                catchError((error: any, caught) => console.error(error)),
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow; implicit any',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error) { console.error(error); })
                               ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";
          import { catchError } from "rxjs/operators";

          throwError("Kaboom!").pipe(
            catchError(function (error: any) { console.error(error); })
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: unknown) { console.error(error); })
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: any) { console.error(error); })
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow; implicit any and caught',
      stripIndent`
        import { throwError, catchError } from "rxjs";

        throwError(new Error("Kaboom!")).pipe(
          catchError(function (error, caught) { console.error(error); })
                               ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          import { throwError, catchError } from "rxjs";

          throwError(new Error("Kaboom!")).pipe(
            catchError(function (error: any, caught) { console.error(error); })
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError, catchError } from "rxjs";

              throwError(new Error("Kaboom!")).pipe(
                catchError(function (error: unknown, caught) { console.error(error); })
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError, catchError } from "rxjs";

              throwError(new Error("Kaboom!")).pipe(
                catchError(function (error: any, caught) { console.error(error); })
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'arrow; explicit any; explicit option',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: any) => console.error(error))
                      ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow; explicit any; explicit option',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: any) { console.error(error); })
                               ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: unknown) { console.error(error); })
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'arrow; narrowed',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: string) => console.error(error))
                      ~~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: any) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'arrow; narrowed; explicit option',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: string) => console.error(error))
                      ~~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow; narrowed',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError(function (error: string) { console.error(error); })
                               ~~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: unknown) { console.error(error); })
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError(function (error: any) { console.error(error); })
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe; arrow; implicit any',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error) => console.error(error)
           ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe(
            undefined,
            (error: any) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: any) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe; arrow; no parentheses; implicit any',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          error => console.error(error)
          ~~~~~ [implicitAny suggest]
        );
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe(
            undefined,
            (error: any) => console.error(error)
          );
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: any) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe; arrow; explicit any; explicit option',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        );
      `,
      {
        options: [{ allowExplicitAny: false }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe; arrow; narrowed',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe(
          undefined,
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: unknown) => console.error(error)
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe(
                undefined,
                (error: any) => console.error(error)
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe observer; arrow; implicit any',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error) => console.error(error)
                  ~~~~~ [implicitAny suggest]
        });
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe({
            error: (error: any) => console.error(error)
          });
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: any) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe observer; arrow; no parentheses; implicit any',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: error => console.error(error)
                 ~~~~~ [implicitAny suggest]
        });
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";

          throwError("Kaboom!").subscribe({
            error: (error: any) => console.error(error)
          });
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: any) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe observer; arrow; explicit any; explicit option',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~ [explicitAny suggest]
        });
      `,
      {
        options: [{ allowExplicitAny: false }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe observer; arrow; narrowed',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: string) => console.error(error)
                  ~~~~~~~~~~~~~ [narrowed suggest]
        });
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: any) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; arrow; implicit any',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error) => console.error(error)
           ~~~~~ [implicitAny suggest]
        ));
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap(
            undefined,
            (error: any) => console.error(error)
          ));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: any) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; arrow; no parentheses; implicit any',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          error => console.error(error)
          ~~~~~ [implicitAny suggest]
        ));
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap(
            undefined,
            (error: any) => console.error(error)
          ));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: any) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; arrow; explicit any; explicit option',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: any) => console.error(error)
           ~~~~~~~~~~ [explicitAny suggest]
        ));
      `,
      {
        options: [{ allowExplicitAny: false }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; arrow; narrowed',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap(
          undefined,
          (error: string) => console.error(error)
           ~~~~~~~~~~~~~ [narrowed suggest]
        ));
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: unknown) => console.error(error)
              ));
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap(
                undefined,
                (error: any) => console.error(error)
              ));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap observer; arrow; implicit any',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error) => console.error(error)
                  ~~~~~ [implicitAny suggest]
        }));
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap({
            error: (error: any) => console.error(error)
          }));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: any) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap observer; arrow; no parentheses; implicit any',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: error => console.error(error)
                 ~~~~~ [implicitAny suggest]
        }));
      `,
      {
        output: stripIndent`
          import { throwError } from "rxjs";
          import { tap } from "rxjs/operators";

          throwError("Kaboom!").pipe(tap({
            error: (error: any) => console.error(error)
          }));
        `,
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: any) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap observer; arrow; explicit any; explicit option',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: any) => console.error(error)
                  ~~~~~~~~~~ [explicitAny suggest]
        }));
      `,
      {
        options: [{ allowExplicitAny: false }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap observer; arrow; narrowed',
      stripIndent`
        import { throwError } from "rxjs";
        import { tap } from "rxjs/operators";

        throwError("Kaboom!").pipe(tap({
          error: (error: string) => console.error(error)
                  ~~~~~~~~~~~~~ [narrowed suggest]
        }));
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: unknown) => console.error(error)
              }));
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { tap } from "rxjs/operators";

              throwError("Kaboom!").pipe(tap({
                error: (error: any) => console.error(error)
              }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'catchError; Error type without allowExplicitError option',
      stripIndent`
        import { throwError } from "rxjs";
        import { catchError } from "rxjs/operators";

        throwError("Kaboom!").pipe(
          catchError((error: Error) => console.error(error))
                      ~~~~~~~~~~~~ [narrowed suggest]
        );
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: unknown) => console.error(error))
              );
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";
              import { catchError } from "rxjs/operators";

              throwError("Kaboom!").pipe(
                catchError((error: any) => console.error(error))
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe; Error type not allowed',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: Error) => console.error(error)
                  ~~~~~~~~~~~~ [narrowed suggest]
        });
      `,
      {
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error)
              });
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: any) => console.error(error)
              });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe; Error type allowed',
      stripIndent`
        import { throwError } from "rxjs";

        throwError("Kaboom!").subscribe({
          error: (error: object) => console.error(error),
                  ~~~~~~~~~~~~~ [narrowedAllowError suggest]
        });
      `,
      {
        options: [{ allowExplicitError: true }],
        suggestions: [
          {
            messageId: 'suggestExplicitUnknown',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: unknown) => console.error(error),
              });
            `,
          },
          {
            messageId: 'suggestExplicitAny',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: any) => console.error(error),
              });
            `,
          },
          {
            messageId: 'suggestExplicitError',
            output: stripIndent`
              import { throwError } from "rxjs";

              throwError("Kaboom!").subscribe({
                error: (error: Error) => console.error(error),
              });
             `,
          },
        ],
      },
    ),
  ],
});
