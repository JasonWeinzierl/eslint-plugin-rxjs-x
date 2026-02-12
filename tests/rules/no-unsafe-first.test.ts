import { stripIndent } from 'common-tags';
import { noUnsafeFirstRule } from '../../src/rules/no-unsafe-first';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

const setup = stripIndent`
  import { EMPTY, Observable, of } from "rxjs";
  import { first, switchMap, take, tap } from "rxjs/operators";

  function ofType<T>(type: string, ...moreTypes: string[]): (source: Observable<T>) => Observable<T> {
    return source => source;
  }

  type Actions = Observable<any>;
  const actions = of({});
  const actions$ = of({});
  const that = { actions };
`.replace(/\n/g, '');

ruleTester({ types: true }).run('no-unsafe-first', noUnsafeFirstRule, {
  valid: [
    {
      name: 'actions nested first',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      name: 'actions nested take',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      name: 'actions property nested first',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      name: 'actions property nested take',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      name: 'epic nested first',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(first()))
        );
      `,
    },
    {
      name: 'epic nested take',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(take(1)))
        );
      `,
    },
    {
      name: 'non-matching options',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeFirstEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: 'foo' }],
    },
    {
      name: 'mid-identifier action',
      code: stripIndent`
        ${setup}
        const safe = transactionSource.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          first()
        );
      `,
      options: [{ observable: 'foo' }],
    },
    {
      name: 'non-matching observable name',
      code: stripIndent`
        import { of } from "rxjs";
        import { first, tap } from "rxjs/operators";
        const transactionSource = of();
        const safe = transactionSource.pipe(
          tap(() => {}),
          first()
        );
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/89',
      code: stripIndent`
        ${setup}
        const safeEffect$ = actions$.pipe(
          ofType("SAVING"),
          mergeMap(({ entity }) =>
            actions$.pipe(
              ofType("ADDED", "MODIFIED"),
              tap(() => {}),
              first(),
              tap(() => {}),
            ),
          ),
        );
      `,
    },
  ],
  invalid: [
    fromFixture(
      'actions first',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeFirstEffect = actions$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'actions take',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeTakeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'actions property first',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeFirstEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'actions property take',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeTakeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'epic first',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeFirstEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          first()
          ~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'epic take',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeTakeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'matching options',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeTakeEpic = (foo: Actions) => foo.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          take(1)
          ~~~~ [forbidden]
        );
      `,
      {
        options: [
          {
            observable: 'foo',
          },
        ],
      },
    ),
  ],
});
