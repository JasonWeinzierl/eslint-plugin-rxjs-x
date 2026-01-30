import { stripIndent } from 'common-tags';
import { finnishRule } from '../../src/rules/finnish';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('finnish', finnishRule, {
  valid: [
    {
      code: stripIndent`
        // with $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);

        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey$: someObservable$ };
        const { someKey$ } = someObject;
        const { someKey$: someRenamedKey$ } = someObject;

        const someArray = [someObservable$];
        const [someElement$] = someArray;
        someArray.forEach(function (element$: Observable<any>): void {});
        someArray.forEach((element$: Observable<any>) => {});

        function someFunction$(someParam$: Observable<any>): Observable<any> { return someParam; }
        function someImplicitReturnFunction$(someParam$: Observable<any>) { return someParam; }

        class SomeClass {
          someProperty$: Observable<any>;
          constructor (someParam$: Observable<any>) {}
          get someGetter$(): Observable<any> { throw new Error("Some error."); }
          set someSetter$(someParam$: Observable<any>) {}
          someMethod$(someParam$: Observable<any>): Observable<any> { return someParam; }
          someImplicitReturnMethod$(someParam$: Observable<any>) { return someParam; }
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
      code: stripIndent`
        // optional variable with $
        import { Observable, of } from "rxjs";

        const someOptionalObservable$: Observable<any> | undefined = of();
      `,
      options: [{}],
    },
    {
      code: stripIndent`
        // default angular whitelist
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
      code: stripIndent`
        // strict default angular whitelist
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
      code: stripIndent`
        // explicit whitelist
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
      code: stripIndent`
        // strict explicit whitelist
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
      code: stripIndent`
        // strict with names allowing specific non-observables
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
      code: stripIndent`
        // strict with types allowing specific non-observables
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
      code: stripIndent`
        // strict with both names and types configurations
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
      code: stripIndent`
        // functions without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someArray = [someObservable$];
        function someFunction(someParam$: Observable<any>): Observable<any> { return someParam$; }
        function someImplicitReturnFunction(someParam$: Observable<any>) { return someParam$; }
      `,
      options: [{ functions: false }],
    },
    {
      code: stripIndent`
        // methods without $, but not enforced
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
      code: stripIndent`
        // parameters without $, but not enforced
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
      code: stripIndent`
        // properties without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };

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
      code: stripIndent`
        // Static observable creators that accept a sources object
        import { of, combineLatest, forkJoin } from "rxjs";

        combineLatest({ one: of(0), two: of('a') });
        forkJoin({ one: of(0), two: of('a') });
      `,
    },
  ],
  invalid: [
    fromFixture(
      stripIndent`
        // optional variable without $
        import { Observable, of } from "rxjs";

        const someOptionalObservable: Observable<any> | undefined = of();
              ~~~~~~~~~~~~~~~~~~~~~~ [shouldBeFinnish]
      `,
    ),
    fromFixture(
      stripIndent`
        // explicit whitelist
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
      stripIndent`
        // explicit whitelist optional variable
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
      stripIndent`
        // functions without $
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
      stripIndent`
        // methods without $
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
      stripIndent`
        // parameters without $
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
      stripIndent`
        // properties without $
        import { Observable, of } from "rxjs";

        const someObservable$ = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable$ };
                                                 ~~~~~~~ [shouldBeFinnish]

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
      stripIndent`
        // variables without $
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
              ~~~~~~~~~~~~~~ [shouldBeFinnish]
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
                                                 ~~~~~~~ [shouldBeFinnish]
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
      stripIndent`
        // variables without $, but not enforced
        import { Observable, of } from "rxjs";

        const someObservable = of(0);
        const someEmptyObject = {};
        const someObject = { ...someEmptyObject, someKey: someObservable };
                                                 ~~~~~~~ [shouldBeFinnish]
        const { someKey } = someObject;
        const { someKey: someRenamedKey } = someObject;
        const someArray = [someObservable];
        const [someElement] = someArray;
      `,
      { options: [{ variables: false }] },
    ),
    fromFixture(
      stripIndent`
        // functions and methods not returning observables
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
      stripIndent`
        // functions and methods with non-observable parameters
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
      stripIndent`
        // functions and methods with array destructuring
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
      stripIndent`
        // functions and methods with object destructuring
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
      stripIndent`
        // parameter property
        import { Observable } from "rxjs";

        class SomeClass {
          constructor(public someProp: Observable<any>) {}
                             ~~~~~~~~ [shouldBeFinnish]
        }
      `,
    ),
    fromFixture(
      stripIndent`
        // non-Observable variable with $
        const answer$ = 42;
              ~~~~~~~ [shouldNotBeFinnish]
      `,
      { options: [{ strict: true }] },
    ),
    fromFixture(
      stripIndent`
        // strict with names but non-matching patterns should still error
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
      stripIndent`
        // strict with types but non-matching types should error
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
  ],
});
