import { stripIndent } from 'common-tags';
import { noUnsafeCatchRule } from '../../src/rules/no-unsafe-catch';
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
  const that = { actions };
`.replace(/\n/g, '');

ruleTester({ types: true }).run('no-unsafe-catch', noUnsafeCatchRule, {
  valid: [
    {
      name: 'actions with caught',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      name: 'actions property with caught',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      name: 'epic with caught',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError((error, caught) => caught)
        );
      `,
    },
    {
      name: 'actions nested',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      name: 'actions property nested',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      name: 'epic nested',
      code: stripIndent`
        ${setup}
        const safePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY.pipe(catchError(() => EMPTY)))
        );
      `,
    },
    {
      name: 'non-matching options',
      code: stripIndent`
        ${setup}
        const effect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          catchError(() => EMPTY)
        );
      `,
      options: [{ observable: 'foo' }],
    },
  ],
  invalid: [
    fromFixture(
      'unsafe actions',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeEffect = actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'unsafe actions property',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeEffect = that.actions.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'unsafe epic',
      stripIndent`
        ${setup}
        const unsafePipedOfTypeEpic = (action$: Actions) => action$.pipe(
          ofType("DO_SOMETHING"),
          tap(() => {}),
          switchMap(() => EMPTY),
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
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
          catchError(() => EMPTY)
          ~~~~~~~~~~ [forbidden]
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
    fromFixture(
      'https://github.com/cartant/rxjs-tslint-rules/issues/96',
      stripIndent`
        import { Observable } from "rxjs";
        import { catchError, map } from "rxjs/operators";

        class SomeComponent {

          actions$: Observable<Action>;

          @Effect()
          initialiseAppointments$ = this.actions$.pipe(
            ofType(AppointmentsActions.Type.Initialise),
            this.getAppointmentSessionParametersFromURL(),
            this.updateAppointmentSessionIfDeprecated(),
            map(
              (appointmentSession: AppointmentSession) =>
                new AppointmentsActions.InitialiseSuccess(appointmentSession)
            ),
            catchError(() => of(new AppointmentsActions.InitialiseError())),
            ~~~~~~~~~~ [forbidden]
          );
        }
      `,
    ),
  ],
});
