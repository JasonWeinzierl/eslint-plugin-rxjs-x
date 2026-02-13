import { stripIndent } from 'common-tags';
import { finnishRule } from '../../src/rules/finnish';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('finnish', finnishRule, {
  valid: [
    {
      name: 'with $',
      code: stripIndent`
        import { Observable, of, EMPTY } from "rxjs";

        const someObservable$ = of(0);
        const someExpressionObservable$ = (): Observable<never> => EMPTY;

        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };
        const { someKey$ } = someObject;
        const { someKey$: someRenamedKey$ } = someObject;

        const someArray = [someObservable$];
        const [someElement$] = someArray;
        someArray.forEach(function (element$: Observable<any>): void {});
        someArray.forEach((element$: Observable<any>) => {});

        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam$; }
        function someImplicitReturnFunction$(someParam$: Observable<any>) { return someParam$; }

        class SomeClass {
          someProperty$: Observable<any>;
          constructor (someParam$: Observable<any>) {}
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
          set someSetter$(someParam$: Observable<any>) {}
          someMethod$(someParam$: Observable<any>): Observable<any> { return someParam$; }
          someImplicitReturnMethod$(someParam$: Observable<any>) { return someParam$; }
        }

        interface SomeInterface {
          someProperty$: Observable<any>;
          someMethod$(someParam$: Observable<any>): Observable<any>;
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      options: [{}],
    },
    {
      name: 'optional variable with $',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const someOptionalObservable$: Observable<any> | undefined = of();
      `,
      options: [{}],
    },
    {
      name: 'default angular allowlist',
      code: stripIndent`
        import { Observable, of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public somethingChanged: EventEmitter<any>;
          public canActivate(): Observable<any> { return of(); }
          public canActivateChild(): Observable<any> { return of(); }
          public canDeactivate(): Observable<any> { return of(); }
          public canLoad(): Observable<any> { return of(); }
          public intercept(): Observable<any> { return of(); }
          public resolve(): Observable<any> { return of(); }
          public validate(): Observable<any> { return of(); }
        }
      `,
      options: [{}],
    },
    {
      name: 'strict with no false positives',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someExpressionObservable$ = (): Observable<never> => EMPTY;

        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };
        const { someKey$ } = someObject;
        const { someKey$: someRenamedKey$ } = someObject;

        const someArray = [someObservable$];
        const [someElement$] = someArray;
        someArray.forEach(function (element$: Observable<any>): void {});
        someArray.forEach((element$: Observable<any>) => {});

        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam$; }
        function someImplicitReturnFunction$(someParam$: Observable<any>) { return someParam$; }

        class SomeClass {
          someProperty$: Observable<any>;
          constructor (someParam$: Observable<any>) {}
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
          set someSetter$(someParam$: Observable<any>) {}
          someMethod$(someParam$: Observable<any>): Observable<any> { return someParam$; }
          someImplicitReturnMethod$(someParam$: Observable<any>) { return someParam$; }
        }

        interface SomeInterface {
          someProperty$: Observable<any>;
          someMethod$(someParam$: Observable<any>): Observable<any>;
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      options: [{ strict: true }],
    },
    {
      name: 'strict default angular allowlist',
      code: stripIndent`
        import { Observable, of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}

        class Something {
          public somethingChanged: EventEmitter<any>;
          public canActivate(): Observable<any> { return of(); }
          public canActivateChild(): Observable<any> { return of(); }
          public canDeactivate(): Observable<any> { return of(); }
          public canLoad(): Observable<any> { return of(); }
          public intercept(): Observable<any> { return of(); }
          public resolve(): Observable<any> { return of(); }
          public validate(): Observable<any> { return of(); }
        }
      `,
      options: [{ strict: true }],
    },
    {
      name: 'explicit allowlist',
      code: stripIndent`
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;
      `,
      options: [
        {
          types: {
            '^EventEmitter$': false,
          },
        },
      ],
    },
    {
      name: 'strict explicit allowlist',
      code: stripIndent`
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;
      `,
      options: [
        {
          strict: true,
          types: {
            '^EventEmitter$': false,
          },
        },
      ],
    },
    {
      name: 'strict with names allowing specific non-observables',
      code: stripIndent`
        const IS_MOBILE_MODE$ = 'some string value';
        const ALLOWED_PATTERN$ = 42;
        const ALLOWED_WITH_DOLLAR$ = true;
      `,
      options: [
        {
          strict: true,
          names: {
            '^(IS_MOBILE_MODE|ALLOWED_PATTERN)$': true,
            '^(ALLOWED_WITH_DOLLAR\\$)$': true,
          },
        },
      ],
    },
    {
      name: 'strict with types allowing specific non-observables',
      code: stripIndent`
        class ObsClass<T> { }
        class EventEmitter<T> { }

        const token$ = new ObsClass<string>();
        const emitter$ = new EventEmitter<number>();
      `,
      options: [
        {
          strict: true,
          types: {
            '^Obs': true,
            '^EventEmitter$': true,
          },
        },
      ],
    },
    {
      name: 'strict with names and types configurations',
      code: stripIndent`
        class CustomToken<T> { }

        const SPECIAL_TOKEN$ = new CustomToken<string>();
        const ALLOWED_NAME$ = 'some string';
      `,
      options: [
        {
          strict: true,
          names: {
            '^ALLOWED_NAME$': true,
          },
          types: {
            '^CustomToken$': true,
          },
        },
      ],
    },
    {
      name: 'functions without $, but not enforced',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
        function someImplicitReturnFunction(someParam$: Observable<any>) { return someParam$; }
      `,
      options: [{ functions: false }],
    },
    {
      name: 'methods without $, but not enforced',
      code: stripIndent`
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
          someImplicitReturnMethod(someParam$: Observable<any>) { return someParam$; }
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
        }
      `,
      options: [{ methods: false }],
    },
    {
      name: 'parameters without $, but not enforced',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach(function (element: Observable<any>): void {});
        someArray.forEach((element: Observable<any>) => {});

        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam; }

        class SomeClass {
          constructor(someParam: Observable<any>) {}
          set someSetter$(someParam: Observable<any>) {}
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
        }

        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
          new (someParam$: Observable<any>);
          (someParam$: Observable<any>): void;
        }
      `,
      options: [{ parameters: false }],
    },
    {
      name: 'properties without $, but not enforced',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};

        class SomeClass {
          someProperty: Observable<any>;
          get someGetter(): Observable<any> { throw new Error("Some error."); }
          set someSetter(someParam$: Observable<any>) {}
        }

        interface SomeInterface {
          someProperty: Observable<any>;
        }
      `,
      options: [{ properties: false }],
    },
    {
      name: 'object literal keys without $, but not enforced',
      code: stripIndent`
        import { of } from "rxjs";

        const routes = [
          {
            path: 'some-path',
            redirectTo: () => of('/home'),
            resolve: {
              data: of('some data'),
            },
          },
        ];
      `,
      options: [{ objects: false }],
    },
    {
      name: 'variables without $, but not enforced',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable };
        const { someKey$ } = someObject;
        const { someKey$: someRenamedKey } = someObject;
        const someArray = [someObservable];
        const [someElement] = someArray;
      `,
      options: [{ variables: false }],
    },
    {
      name: 'Static observable creators that accept a sources object',
      code: stripIndent`
        import { of, combineLatest, forkJoin } from "rxjs";

        combineLatest({ one: of(0), two: of('a') });
        forkJoin({ one: of(0), two: of('a') });
      `,
    },
    {
      name: 'RxJS built-ins',
      code: stripIndent`
        import { groupBy, of, retry } from "rxjs";

        const grouped$ = of(1,2,3).pipe(
          groupBy(x => x % 2 === 0 ? 'even' : 'odd', {
            duration: () => of(1),
          }),
        );

        const retried$ = of(1,2,3).pipe(
          retry({
            delay: of(1000),
          }),
        );
      `,
    },
    {
      name: 'Angular Route config',
      code: stripIndent`
        import { Routes } from "@angular/router";
        import { of } from "rxjs";

        export const routes: Routes = [
          {
            path: 'some-path',
            redirectTo: () => of('/home'),
            resolve: {
              data: of('some data'),
            },
          },
        ];
      `,
    },
    {
      name: 'override methods',
      code: stripIndent`
        import { Observable } from "rxjs";

        abstract class SomeBase {
          protected abstract someMethod$(someParam$: Observable<any>): Observable<any>;
          protected abstract set someSetter$(someParam$: Observable<any>);
        }

        class SomeDerived extends SomeBase {
          protected override someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
          protected override set someSetter$(someParam: Observable<any>) {}
        }
      `,
    },
  ],
  invalid: [
    // #region invalid; variables
    fromFixture(
      'variables without $',
      stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
              ~~~~~~~~~~~~~~ [shouldBeFinnish]
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
                                                 ~~~~~~~ [shouldBeFinnishProperty]
        const { someKey } = someObject;
                ~~~~~~~ [shouldBeFinnish]
        const { someKey: someRenamedKey } = someObject;
                         ~~~~~~~~~~~~~~ [shouldBeFinnish]
        const someArray = [someObservable];
        const [someElement] = someArray;
               ~~~~~~~~~~~ [shouldBeFinnish]
      `,
    ),
    fromFixture(
      'variables without $, but not enforced',
      stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
                                                 ~~~~~~~ [shouldBeFinnishProperty]
        const { someKey } = someObject;
        const { someKey: someRenamedKey } = someObject;
        const someArray = [someObservable];
        const [someElement] = someArray;
      `,
      { options: [{ variables: false }] },
    ),
    fromFixture(
      'optional variable without $',
      stripIndent`
        import { Observable, of } from "rxjs";

        const someOptionalObservable: Observable<any> | undefined = of();
              ~~~~~~~~~~~~~~~~~~~~~~ [shouldBeFinnish]
      `,
    ),
    fromFixture(
      'explicit allowlist',
      stripIndent`
        import { of, Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any>;
        const foreign = of(1);

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any>;
            ~~~~~~~~~~~ [shouldBeFinnish]
        const finnish = of(1);
              ~~~~~~~ [shouldBeFinnish]
      `,
      {
        options: [
          {
            names: {
              '^finnish$': true,
              '^foreign$': false,
            },
            types: {
              '^EventEmitter$': false,
              '^SomeSubject$': true,
            },
          },
        ],
      },
    ),
    fromFixture(
      'explicit allowlist optional variable',
      stripIndent`
        import { Subject } from "rxjs";

        class EventEmitter<T> extends Subject<T> {}
        let eventEmitter: EventEmitter<any> | undefined;

        class SomeSubject<T> extends Subject<T> {}
        let someSubject: SomeSubject<any> | undefined;
            ~~~~~~~~~~~ [shouldBeFinnish]
      `,
      {
        options: [
          {
            types: {
              '^EventEmitter$': false,
              '^SomeSubject$': true,
            },
          },
        ],
      },
    ),
    fromFixture(
      'non-Observable variable with $',
      stripIndent`
        const answer$ = 42;
              ~~~~~~~ [shouldNotBeFinnish]
      `,
      { options: [{ strict: true }] },
    ),
    fromFixture(
      'strict with names but non-matching patterns should still error',
      stripIndent`
        const NOT_ALLOWED$ = 42;
              ~~~~~~~~~~~~ [shouldNotBeFinnish]
        const IS_MOBILE_MODE$ = 'some string value';
      `,
      {
        options: [
          {
            strict: true,
            names: {
              '^IS_MOBILE_MODE$': true,
            },
          },
        ],
      },
    ),
    fromFixture(
      'strict with types but non-matching types should error',
      stripIndent`
        class AllowedType<T> { }
        class NotAllowedType<T> { }

        const ALLOWED_TOKEN$ = new AllowedType<string>();
        const NOT_ALLOWED$ = new NotAllowedType<string>();
              ~~~~~~~~~~~~ [shouldNotBeFinnish]
      `,
      {
        options: [
          {
            strict: true,
            types: {
              '^AllowedType$': true,
            },
          },
        ],
      },
    ),
    fromFixture(
      'functions assigned to variables should be detected',
      stripIndent`
        import { Observable, EMPTY } from "rxjs";

        function fun$(): Observable<never> { return EMPTY; }

        const var1 = (): Observable<never> => EMPTY;
              ~~~~ [shouldBeFinnish]
        const var2 = fun$;
              ~~~~ [shouldBeFinnish]
        const var3: (() => Observable<never>) | string = fun$;
              ~~~~ [shouldBeFinnish]
      `,
    ),
    fromFixture(
      'type alias',
      stripIndent`
        type Foo = { name: string };
        type Bar = Foo;

        let bar: Bar;
            ~~~ [shouldBeFinnish]
      `,
      {
        options: [{
          types: {
            '^Foo$': true,
          },
        }],
      },
    ),
    // #endregion invalid; variables
    // #region invalid; functions and methods
    fromFixture(
      'functions without $',
      stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
                 ~~~~~~~~~~~~ [shouldBeFinnish]
        function someImplicitReturnFunction(someParam$: Observable<any>) { return someParam$; }
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~ [shouldBeFinnish]
      `,
    ),
    fromFixture(
      'methods without $',
      stripIndent`
        import { Observable } from "rxjs";

        class SomeClass {
          someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
          ~~~~~~~~~~ [shouldBeFinnish]
          someImplicitReturnMethod(someParam$: Observable<any>) { return someParam$; }
          ~~~~~~~~~~~~~~~~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod(someParam$: Observable<any>): Observable<any>;
          ~~~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'functions and methods with non-observable parameters',
      stripIndent`
        import { Observable, of } from "rxjs";

        function someFunction(someValue: any): Observable<any> { return of(someValue); }
                 ~~~~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod(someValue: any): Observable<any> { return of(someValue); }
          ~~~~~~~~~~ [shouldBeFinnish]
          someImplicitReturnMethod(someValue: any) { return of(someValue); }
          ~~~~~~~~~~~~~~~~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod(someValue: any): Observable<any>;
          ~~~~~~~~~~ [shouldBeFinnish]
          (someValue: any): Observable<any>;
        }
      `,
    ),
    fromFixture(
      'abstract methods without $',
      stripIndent`
        import { Observable } from "rxjs";

        abstract class SomeBase {
          abstract someMethod(someParam: Observable<any>): Observable<any>;
                   ~~~~~~~~~~ [shouldBeFinnish]
                              ~~~~~~~~~ [shouldBeFinnish]
          abstract get someGetter(): Observable<any>;
                       ~~~~~~~~~~ [shouldBeFinnish]
          abstract set someSetter(someParam: Observable<any>);
                       ~~~~~~~~~~ [shouldBeFinnish]
                                  ~~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'override methods skip method definition',
      stripIndent`
        import { Observable } from "rxjs";

        abstract class SomeBase {
          protected abstract someMethod(someParam$: Observable<any>): Observable<any>;
                             ~~~~~~~~~~ [shouldBeFinnish]
        }

        class SomeDerived extends SomeBase {
          protected override someMethod(someParam$: Observable<any>): Observable<any> { return someParam$; }
        }
      `,
    ),
    fromFixture(
      'abstract of abstract',
      stripIndent`
        import { Observable } from "rxjs";

        abstract class SomeBase {
          protected abstract someMethod(someParam$: Observable<any>): Observable<any>;
                             ~~~~~~~~~~ [shouldBeFinnish]
        }

        abstract class SomeDerived extends SomeBase {
          protected abstract override someMethod(someParam$: Observable<any>): Observable<any>;
        }
      `,
    ),
    // #endregion invalid; functions and methods
    // #region invalid; parameters
    fromFixture(
      'parameters without $',
      stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        someArray.forEach(function (element: Observable<any>): void {});
                                    ~~~~~~~ [shouldBeFinnish]
        someArray.forEach((element: Observable<any>) => {});
                           ~~~~~~~ [shouldBeFinnish]

        function someFunction$(someParam: Observable<any>): Observable<any> { return someParam; }
                               ~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          constructor(someParam: Observable<any>) {}
                      ~~~~~~~~~ [shouldBeFinnish]
          set someSetter$(someParam: Observable<any>) {}
                          ~~~~~~~~~ [shouldBeFinnish]
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
                      ~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod$(someParam: Observable<any>): Observable<any>;
                      ~~~~~~~~~ [shouldBeFinnish]
          new (someParam: Observable<any>);
               ~~~~~~~~~ [shouldBeFinnish]
          (someParam: Observable<any>): void;
           ~~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'functions and methods not returning observables',
      stripIndent`
        import { Observable } from "rxjs";

        function someFunction(someParam: Observable<any>): void {}
                              ~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod(someParam: Observable<any>): void {}
                     ~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someMethod(someParam: Observable<any>): void;
                     ~~~~~~~~~ [shouldBeFinnish]
          (someParam: Observable<any>): void;
           ~~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'functions and methods with array destructuring',
      stripIndent`
        import { Observable } from "rxjs";

        function someFunction([someParam]: Observable<any>[]): void {}
                               ~~~~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod([someParam]: Observable<any>[]): void {}
                      ~~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'functions and methods with object destructuring',
      stripIndent`
        import { Observable } from "rxjs";

        function someFunction({ source }: Record<string, Observable<any>>): void {}
                                ~~~~~~ [shouldBeFinnish]

        class SomeClass {
          someMethod({ source }: Record<string, Observable<any>>): void {}
                       ~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'function parameters should be detected',
      stripIndent`
        import { Observable, EMPTY } from "rxjs";

        class Cls {
          method2(par: () => Observable<never>): void {}
                  ~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'override methods skip identifier parameters',
      stripIndent`
        import { Observable } from "rxjs";

        class SomeBase {
          someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
                      ~~~~~~~~~ [shouldBeFinnish]
          set someSetter$(someParam: Observable<any>) {}
                          ~~~~~~~~~ [shouldBeFinnish]
        }

        class SomeDerived extends SomeBase {
          override someMethod$(someParam: Observable<any>): Observable<any> { return someParam; }
          override set someSetter$(someParam: Observable<any>) {}
        }
      `,
    ),
    fromFixture(
      'override methods skip array destructured parameters',
      stripIndent`
        import { Observable } from "rxjs";

        class SomeBase {
          someMethod$([someParam]: Observable<any>[]): void {}
                       ~~~~~~~~~ [shouldBeFinnish]
        }

        class SomeDerived extends SomeBase {
          override someMethod$([someParam]: Observable<any>[]): void {}
        }
      `,
    ),
    fromFixture(
      'override methods skip object destructured parameters',
      stripIndent`
        import { Observable } from "rxjs";

        class SomeBase {
          someMethod$({ source }: Record<string, Observable<any>>): void {}
                        ~~~~~~ [shouldBeFinnish]
        }

        class SomeDerived extends SomeBase {
          override someMethod$({ source }: Record<string, Observable<any>>): void {}
        }
      `,
    ),
    // #endregion invalid; parameters
    // #region invalid; properties (and objects)
    fromFixture(
      'properties without $',
      stripIndent`
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };
                                                 ~~~~~~~ [shouldBeFinnishProperty]

        class SomeClass {
          someProperty: Observable<any>;
          ~~~~~~~~~~~~ [shouldBeFinnish]
          get someGetter(): Observable<any> { throw new Error("Some error."); }
              ~~~~~~~~~~ [shouldBeFinnish]
          set someSetter(someParam$: Observable<any>) {}
              ~~~~~~~~~~ [shouldBeFinnish]
        }

        interface SomeInterface {
          someProperty: Observable<any>;
          ~~~~~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'parameter property',
      stripIndent`
        import { Observable } from "rxjs";

        class SomeClass {
          constructor(public someProp: Observable<any>) {}
                             ~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      'functions assigned to properties should be detected',
      stripIndent`
        import { Observable, EMPTY } from "rxjs";

        function fun$(): Observable<never> { return EMPTY; }

        class Cls {
          prop = (): Observable<never> => EMPTY;
          ~~~~ [shouldBeFinnish]
          mthd$(): Observable<never> { return EMPTY; }
        }

        const var3 = new Cls().mthd$;
              ~~~~ [shouldBeFinnish]
      `,
    ),
    fromFixture(
      'override accessors skip property name checks',
      stripIndent`
        import { Observable, of } from "rxjs";

        class SomeBase {
          get someGetter(): Observable<any> { return of(1); }
              ~~~~~~~~~~ [shouldBeFinnish]
          set someSetter(someParam$: Observable<any>) {}
              ~~~~~~~~~~ [shouldBeFinnish]
        }

        class SomeDerived extends SomeBase {
          override get someGetter(): Observable<any> { return of(1); }
          override set someSetter(someParam$: Observable<any>) {}
        }
      `,
    ),
    fromFixture(
      'skip object literals passed to functions and methods',
      stripIndent`
        import { of, Observable } from "rxjs";

        interface SomeOptions {
          foo: () => Observable<number>;
          ~~~ [shouldBeFinnish]
        }

        function someFunction(options: SomeOptions): void {}
        const someArrowFunction = (options: SomeOptions): void => {};
        function someInlineOptionsFunction(options: { foo: () => Observable<number> }): void {}
                                                      ~~~ [shouldBeFinnish]

        someFunction({
          foo: () => of(1),
          // should not error
        });
        someArrowFunction({
          foo: () => of(1),
          // should not error
        });
      `,
    ),
    fromFixture(
      'skip object literals with any parent type annotation',
      stripIndent`
        import { of, Observable } from "rxjs";

        interface SomeObject {
          foo: () => Observable<number>;
          ~~~ [shouldBeFinnish]
          bar: Observable<string>;
          ~~~ [shouldBeFinnish]
        }

        interface SomeWrapperObject {
          baz: SomeObject;
        }

        type SomeArray = Array<SomeWrapperObject>;

        const arr: SomeArray = [
          {
            baz: {
              foo: () => of(1),
              // should not error
              bar: of('a'),
              // should not error
            },
          },
        ];
      `,
    ),
    fromFixture(
      'skip object literals with any parent satisfies',
      stripIndent`
        import { of, Observable } from "rxjs";

        interface SomeObject {
          foo: () => Observable<number>;
          ~~~ [shouldBeFinnish]
          bar: Observable<string>;
          ~~~ [shouldBeFinnish]
        }

        interface SomeWrapperObject {
          baz: SomeObject;
        }

        type SomeArray = Array<SomeWrapperObject>;

        const arr = [
          {
            baz: {
              foo: () => of(1),
              // should not error
              bar: of('a'),
              // should not error
            },
          } satisfies SomeWrapperObject,
        ];
      `,
    ),
    fromFixture(
      'skip object literals with any parent type assertion',
      stripIndent`
        import { of, Observable } from "rxjs";

        interface SomeObject {
          foo: () => Observable<number>;
          ~~~ [shouldBeFinnish]
          bar: Observable<string>;
          ~~~ [shouldBeFinnish]
        }

        interface SomeWrapperObject {
          baz: SomeObject;
        }

        type SomeArray = Array<SomeWrapperObject>;

        const arr = [
          {
            baz: {
              foo: () => of(1),
              // should not error
              bar: of('a'),
              // should not error
            },
          } as SomeWrapperObject,
        ];
      `,
    ),
    // #endregion invalid; properties (and objects)
  ],
});
