import { stripIndent } from 'common-tags';
import { preferObserverRule } from '../../src/rules/prefer-observer';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('prefer-observer', preferObserverRule, {
  valid: [
    {
      name: 'allow-next',
      code: stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: true }],
    },
    {
      name: 'default',
      code: stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          value => console.log(value)
        );

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          error(error) { console.log(error); }
        });
        source.subscribe({
          complete() { console.log("complete"); }
        });
        source.subscribe({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        });

        source.subscribe({
          next: value => console.log(value)
        });
        source.subscribe({
          error: error => console.log(error)
        });
        source.subscribe({
          complete: () => console.log("complete")
        });
        source.subscribe({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        });

        source.pipe(tap(
          value => console.log(value)
        )).subscribe();

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          error(error) { console.log(error); }
        })).subscribe();
        source.pipe(tap({
          complete() { console.log("complete"); }
        })).subscribe();
        source.pipe(tap({
          next(value) { console.log(value); },
          error(error) { console.log(error); },
          complete() { console.log("complete"); }
        })).subscribe();

        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
        source.pipe(tap({
          error: error => console.log(error)
        })).subscribe();
        source.pipe(tap({
          complete: () => console.log("complete")
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value),
          error: error => console.log(error),
          complete: () => console.log("complete")
        })).subscribe();
      `,
      options: [{}],
    },
    {
      name: 'disallow-next',
      code: stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe({
          next(value) { console.log(value); }
        });
        source.subscribe({
          next: value => console.log(value)
        });

        source.pipe(tap({
          next(value) { console.log(value); }
        })).subscribe();
        source.pipe(tap({
          next: value => console.log(value)
        })).subscribe();
      `,
      options: [{ allowNext: false }],
    },
    {
      name: 'named',
      code: stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextObserver = {
          next: (value: number) => { console.log(value); }
        };
        const source = of(42);

        source.subscribe(nextObserver);
        source.pipe(tap(nextObserver));
      `,
      options: [{}],
    },
    {
      name: 'non-arrow functions',
      code: stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe();
        source.subscribe(
          function (value) { console.log(value); }
        );
        source.pipe(tap(
          function (value) { console.log(value); }
        )).subscribe();
      `,
      options: [{}],
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/61',
      code: stripIndent`
        const whatever = {
          pipe(...value: unknown[]) {},
          subscribe(callback?: (value: unknown) => void) {}
        };
        whatever.pipe(() => {});
        whatever.subscribe(() => {});
      `,
      options: [{ allowNext: false }],
    },
  ],
  invalid: [
    // #region subscribe arrow
    fromFixture(
      'default; next, error',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error)
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value), error: error => console.log(error) }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value), error: error => console.log(error) }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'default; next, error, complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'default; next, complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          value => console.log(value),
          undefined,
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value), complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value), complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'default; error',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          error => console.log(error)
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: error => console.log(error) }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: error => console.log(error) }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'default; error, complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          error => console.log(error),
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: error => console.log(error), complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: error => console.log(error), complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'default; complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          undefined,
          () => console.log("complete")
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { complete: () => console.log("complete") }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { complete: () => console.log("complete") }
              );
            `,
          },
        ],
      },
    ),
    // #endregion subscribe arrow
    // #region tap arrow
    fromFixture(
      'tap; next, error',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error)
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: value => console.log(value), error: error => console.log(error) }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: value => console.log(value), error: error => console.log(error) }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; next, error, complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          value => console.log(value),
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: value => console.log(value), error: error => console.log(error), complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; next, complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          value => console.log(value),
          undefined,
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: value => console.log(value), complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: value => console.log(value), complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; error',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          error => console.log(error)
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: error => console.log(error) }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: error => console.log(error) }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; error, complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          error => console.log(error),
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: error => console.log(error), complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: error => console.log(error), complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'tap; complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          undefined,
          () => console.log("complete")
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { complete: () => console.log("complete") }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { complete: () => console.log("complete") }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    // #endregion tap arrow
    // #region disallow next
    fromFixture(
      'disallow-next',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest 0]
          value => console.log(value)
        );

        source.pipe(tap(
                    ~~~ [forbidden suggest 1]
          value => console.log(value)
        )).subscribe();
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.subscribe(
            { next: value => console.log(value) }
          );

          source.pipe(tap(
            { next: value => console.log(value) }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.subscribe(
                { next: value => console.log(value) }
              );

              source.pipe(tap(
                value => console.log(value)
              )).subscribe();
            `,
          },
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.subscribe(
                value => console.log(value)
              );

              source.pipe(tap(
                { next: value => console.log(value) }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'disallow-next; named; next arrow',
      stripIndent`
        import { of } from "rxjs";

        const nextArrow = (value: number) => { console.log(value); };
        const source = of(42);

        source.subscribe(nextArrow);
               ~~~~~~~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          import { of } from "rxjs";

          const nextArrow = (value: number) => { console.log(value); };
          const source = of(42);

          source.subscribe({ next: nextArrow });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const nextArrow = (value: number) => { console.log(value); };
              const source = of(42);

              source.subscribe({ next: nextArrow });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'disallow-next; named; next named',
      stripIndent`
        import { of } from "rxjs";

        function nextNamed(value: number): void { console.log(value); }
        const source = of(42);

        source.subscribe(nextNamed);
               ~~~~~~~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          import { of } from "rxjs";

          function nextNamed(value: number): void { console.log(value); }
          const source = of(42);

          source.subscribe({ next: nextNamed });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              function nextNamed(value: number): void { console.log(value); }
              const source = of(42);

              source.subscribe({ next: nextNamed });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'disallow-next; named; next non-arrow',
      stripIndent`
        import { of } from "rxjs";

        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;
        const source = of(42);

        source.subscribe(nextNonArrow);
               ~~~~~~~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          import { of } from "rxjs";

          function nextNamed(value: number): void { console.log(value); }
          const nextNonArrow = nextNamed;
          const source = of(42);

          source.subscribe({ next: nextNonArrow });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              function nextNamed(value: number): void { console.log(value); }
              const nextNonArrow = nextNamed;
              const source = of(42);

              source.subscribe({ next: nextNonArrow });
            `,
          },
        ],
      },
    ),
    fromFixture(
      'disallow-next; tap; named; next arrow',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const nextArrow = (value: number) => { console.log(value); };
        const source = of(42);

        source.pipe(tap(nextArrow));
                    ~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const nextArrow = (value: number) => { console.log(value); };
          const source = of(42);

          source.pipe(tap({ next: nextArrow }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const nextArrow = (value: number) => { console.log(value); };
              const source = of(42);

              source.pipe(tap({ next: nextArrow }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'disallow-next; tap; named; next named',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        function nextNamed(value: number): void { console.log(value); }
        const source = of(42);

        source.pipe(tap(nextNamed));
                    ~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          function nextNamed(value: number): void { console.log(value); }
          const source = of(42);

          source.pipe(tap({ next: nextNamed }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              function nextNamed(value: number): void { console.log(value); }
              const source = of(42);

              source.pipe(tap({ next: nextNamed }));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'disallow-next; tap; named; next non-arrow',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        function nextNamed(value: number): void { console.log(value); }
        const nextNonArrow = nextNamed;
        const source = of(42);

        source.pipe(tap(nextNonArrow));
                    ~~~ [forbidden suggest]
      `,
      {
        options: [{ allowNext: false }],
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          function nextNamed(value: number): void { console.log(value); }
          const nextNonArrow = nextNamed;
          const source = of(42);

          source.pipe(tap({ next: nextNonArrow }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              function nextNamed(value: number): void { console.log(value); }
              const nextNonArrow = nextNamed;
              const source = of(42);

              source.pipe(tap({ next: nextNonArrow }));
            `,
          },
        ],
      },
    ),
    // #endregion disallow next
    // #region non-arrow functions
    fromFixture(
      'non-arrow functions; next, error',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; next, error, complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; next, complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; error',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); }
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: function (error) { console.log(error); } }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: function (error) { console.log(error); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; error, complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; complete',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);

        source.subscribe(
               ~~~~~~~~~ [forbidden suggest]
          undefined,
          undefined,
          function () { console.log("complete"); }
        );
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";

          const source = of(42);

          source.subscribe(
            { complete: function () { console.log("complete"); } }
          );
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";

              const source = of(42);

              source.subscribe(
                { complete: function () { console.log("complete"); } }
              );
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; tap; next, error',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    // #endregion non-arrow functions
    // #region tap non-arrow functions
    fromFixture(
      'non-arrow functions; tap; next, error, complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          function (value) { console.log(value); },
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: function (value) { console.log(value); }, error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; tap; next, complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          function (value) { console.log(value); },
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { next: function (value) { console.log(value); }, complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; tap; error',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: function (error) { console.log(error); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: function (error) { console.log(error); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; tap; error, complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          function (error) { console.log(error); },
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { error: function (error) { console.log(error); }, complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    fromFixture(
      'non-arrow functions; tap; complete',
      stripIndent`
        import { of } from "rxjs";
        import { tap } from "rxjs/operators";

        const source = of(42);

        source.pipe(tap(
                    ~~~ [forbidden suggest]
          undefined,
          undefined,
          function () { console.log("complete"); }
        )).subscribe();
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          import { tap } from "rxjs/operators";

          const source = of(42);

          source.pipe(tap(
            { complete: function () { console.log("complete"); } }
          )).subscribe();
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { of } from "rxjs";
              import { tap } from "rxjs/operators";

              const source = of(42);

              source.pipe(tap(
                { complete: function () { console.log("complete"); } }
              )).subscribe();
            `,
          },
        ],
      },
    ),
    // #endregion tap non-arrow functions
    // #region identifier
    fromFixture(
      'subscribe identifier; next, error, complete',
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(fn, fn, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ next: fn, error: fn, complete: fn });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ next: fn, error: fn, complete: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe identifier; next, complete',
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(fn, null, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ next: fn, complete: fn });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ next: fn, complete: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe identifier; complete',
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(null, undefined, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ complete: fn });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ complete: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe identifier; error',
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(undefined, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ error: fn });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ error: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      'subscribe identifier; error, null complete',
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(undefined, fn, null);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ error: fn });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ error: fn });
              `,
          },
        ],
      },
    ),
    fromFixture(
      'identifier; super wrong',
      stripIndent`
        import { of } from "rxjs";
        const fn = () => {};

        of(42).subscribe(undefined, fn, fn, fn, fn, fn, fn);
               ~~~~~~~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of } from "rxjs";
          const fn = () => {};

          of(42).subscribe({ error: fn, complete: fn });
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of } from "rxjs";
                const fn = () => {};

                of(42).subscribe({ error: fn, complete: fn });
              `,
          },
        ],
      },
    ),
    // #endregion identifier

    // #region tap identifier
    fromFixture(
      'tap identifier; next, error, complete',
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(fn, fn, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ next: fn, error: fn, complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ next: fn, error: fn, complete: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      'tap identifier; next, complete',
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(fn, null, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ next: fn, complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ next: fn, complete: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      'tap identifier; complete',
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(null, undefined, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ complete: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      'tap identifier; error',
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(undefined, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ error: fn }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ error: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      'tap identifier; error null, complete',
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(undefined, fn, null));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ error: fn }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ error: fn }));
              `,
          },
        ],
      },
    ),
    fromFixture(
      'tap identifier; super wrong',
      stripIndent`
        import { of, tap } from "rxjs";
        const fn = () => {};

        of(42).pipe(tap(undefined, fn, fn, fn, fn, fn, fn));
                    ~~~ [forbidden suggest 0]
      `,
      {
        output: stripIndent`
          import { of, tap } from "rxjs";
          const fn = () => {};

          of(42).pipe(tap({ error: fn, complete: fn }));
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
                import { of, tap } from "rxjs";
                const fn = () => {};

                of(42).pipe(tap({ error: fn, complete: fn }));
              `,
          },
        ],
      },
    ),
    // #endregion tap identifier
  ],
});
