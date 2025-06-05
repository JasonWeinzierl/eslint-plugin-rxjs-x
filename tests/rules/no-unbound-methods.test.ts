import { RunTests } from '@typescript-eslint/rule-tester';
import { stripIndent } from 'common-tags';
import { noUnboundMethodsRule } from '../../src/rules/no-unbound-methods';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

type Tests = RunTests<
  keyof typeof noUnboundMethodsRule['meta']['messages'],
  typeof noUnboundMethodsRule['defaultOptions']
>;

const arrowTests: Tests = {
  valid: [
    stripIndent`
      // arrows
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      function userland<T>(selector: (t: T) => T) { return map(selector); }

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(value => this.map(value)),
            userland(value => this.map(value)),
            takeUntil(this.someObservable),
            catchError(error => this.catchError(error))
          ).subscribe(
            value => this.next(value),
            error => this.error(error),
            () => this.complete()
          );
          const subscription = new Subscription(() => this.tearDown);
          subscription.add(() => this.tearDown);
        }
        catchError(error: any): Observable<never> { return throwError(error); }
        complete(): void {}
        error(error: any): void {}
        map<T>(t: T): T { return t; }
        next<T>(t: T): void {}
        tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const boundTests: Tests = {
  valid: [
    stripIndent`
      // bound
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      function userland<T>(selector: (t: T) => T) { return map(selector); }

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(this.map.bind(this)),
            userland(this.map.bind(this)),
            takeUntil(this.someObservable),
            catchError(this.catchError.bind(this))
          ).subscribe(
            this.next.bind(this),
            this.error.bind(this),
            this.complete.bind(this)
          );
          const subscription = new Subscription(this.tearDown.bind(this));
          subscription.add(this.tearDown.bind(this));
        }
        catchError(error: any): Observable<never> { return throwError(error); }
        complete(): void {}
        error(error: any): void {}
        map<T>(t: T): T { return t; }
        next<T>(t: T): void {}
        tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const deepTests: Tests = {
  valid: [],
  invalid: [
    fromFixture(
      stripIndent`
        // deep
        import { Observable, of, throwError, NEVER } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          deep = {
            catchError(error: any): Observable<never> { return throwError(error); },
            complete(): void {},
            error(error: any): void {},
            map<T>(t: T): T { return t; },
            next<T>(t: T): void {},
          }
          someObservable = NEVER;
          constructor() {
            const ob = of(1).pipe(
              map(this.deep.map),
                  ~~~~~~~~~~~~~ [forbidden]
              userland(this.deep.map),
                       ~~~~~~~~~~~~~ [forbidden]
              takeUntil(this.someObservable),
              catchError(this.deep.catchError)
                         ~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe(
              this.deep.next,
              ~~~~~~~~~~~~~~ [forbidden]
              this.deep.error,
              ~~~~~~~~~~~~~~~ [forbidden]
              this.deep.complete
              ~~~~~~~~~~~~~~~~~~ [forbidden]
            );
          }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // deep teardowns
        import { Subscription } from "rxjs";
        import { takeUntil } from "rxjs/operators";

        class Something {
          deep = {
            tearDown(): void {}
          }
          constructor() {
            const subscription = new Subscription(this.deep.tearDown);
                                                  ~~~~~~~~~~~~~~~~~~ [forbidden]
            subscription.add(this.deep.tearDown);
                             ~~~~~~~~~~~~~~~~~~ [forbidden]
          }
        }
      `,
    ),
  ],
};

const staticTests: Tests = {
  valid: [
    stripIndent`
      // static
      import { NEVER, Observable, of, Subscription, throwError } from "rxjs";
      import { catchError, map, takeUntil } from "rxjs/operators";

      function userland<T>(selector: (t: T) => T) { return map(selector); }

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            map(Something.map),
            userland(Something.map),
            takeUntil(this.someObservable),
            catchError(Something.catchError)
          ).subscribe(
            Something.next,
            Something.error,
            Something.complete
          );
          const subscription = new Subscription(Something.tearDown);
          subscription.add(Something.tearDown);
        }
        static catchError(error: any): Observable<never> { return throwError(error); }
        static complete(): void {}
        static error(error: any): void {}
        static map<T>(t: T): T { return t; }
        static next<T>(t: T): void {}
        static tearDown(): void {}
      }
    `,
  ],
  invalid: [],
};

const unboundTests: Tests = {
  valid: [
    stripIndent`
      // unbound observable
      import { NEVER, of } from "rxjs";
      import { takeUntil } from "rxjs/operators";

      class Something {
        someObservable = NEVER;
        constructor() {
          const ob = of(1).pipe(
            takeUntil(this.someObservable),
          ).subscribe(console.log);
        }
      }
    `,
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // unbound operator arguments
        import { Observable, of, throwError } from "rxjs";
        import { catchError, map, takeUntil } from "rxjs/operators";

        function userland<T>(selector: (t: T) => T) { return map(selector); }

        class Something {
          constructor() {
            const ob = of(1).pipe(
              map(this.map),
                  ~~~~~~~~ [forbidden]
              userland(this.map),
                       ~~~~~~~~ [forbidden]
              catchError(this.catchError)
                         ~~~~~~~~~~~~~~~ [forbidden]
            )
          }
          map<T>(t: T): T { return t; }
          catchError(error: any): Observable<never> { return throwError(error); }
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // unbound subscribe arguments
        import { of } from "rxjs";

        class Something {
          constructor() {
            const ob = of(1).subscribe(
              this.next,
              ~~~~~~~~~ [forbidden]
              this.error,
              ~~~~~~~~~~ [forbidden]
              this.complete,
              ~~~~~~~~~~~~~ [forbidden]
            );
          }
          next<T>(t: T): void {}
          error(error: any): void {}
          complete(): void {}
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // unbound teardowns
        import { Subscription } from "rxjs";

        class Something {
          constructor() {
            const subscription = new Subscription(this.tearDown);
                                                  ~~~~~~~~~~~~~ [forbidden]
            subscription.add(this.tearDown);
                             ~~~~~~~~~~~~~ [forbidden]
          }
          tearDown(): void {}
        }
      `,
    ),
  ],
};

const allowTypesTests: Tests = {
  valid: [
    {
      code: stripIndent`
        // allowed types
        import { of, tap } from "rxjs";

        interface Signal<T> extends Function {
          (): T;
        }
        interface WritableSignal<T> extends Signal<T> {
          set(value: T): void;
        }

        function customLog<T>(signal: Signal<T>) {
          return tap((value: T) => console.log(value, signal()));
        }
        function customSet<T>(signal: WritableSignal<T>) {
          return tap((value: T) => signal.set(value));
        }

        class Something {
          private readonly x: Signal<string>;
          private readonly y: WritableSignal<number>;

          constructor() {
            of(1).pipe(
              customLog(this.x),
              customSet(this.y),
            ).subscribe();
          }
        }
      `,
      options: [{
        allowTypes: ['Signal'],
      }],
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // unbound signal without allowed types
        import { of, tap } from "rxjs";

        interface Signal<T> extends Function {
          (): T;
        }

        function customOperator<T>(signal: Signal<T>) {
          return tap((value: T) => console.log(value, signal()));
        }

        class Something {
          private readonly x: Signal<string>;

          constructor() {
            of(1).pipe(
              customOperator(this.x),
                             ~~~~~~ [forbidden]
            ).subscribe();
          }
        }
      `,
    ),
  ],
};

ruleTester({ types: true }).run('no-unbound-methods', noUnboundMethodsRule, {
  valid: [
    ...arrowTests.valid,
    ...boundTests.valid,
    ...deepTests.valid,
    ...staticTests.valid,
    ...unboundTests.valid,
    ...allowTypesTests.valid,
  ],
  invalid: [
    ...arrowTests.invalid,
    ...boundTests.invalid,
    ...deepTests.invalid,
    ...staticTests.invalid,
    ...unboundTests.invalid,
    ...allowTypesTests.invalid,
  ],
});
