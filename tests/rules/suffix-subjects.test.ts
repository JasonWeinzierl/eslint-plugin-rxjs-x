import { stripIndent } from 'common-tags';
import { suffixSubjectsRule } from '../../src/rules/suffix-subjects';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('suffix-subjects', suffixSubjectsRule, {
  valid: [
    {
      name: 'with default suffix',
      code: stripIndent`
      import { Subject } from "rxjs";

      const subject = new Subject<any>();
      const someSubject = new Subject<any>();

      const someObject = {
        subject: new Subject<any>(),
        someSubject: new Subject<any>()
      };

      function someFunction(
        subject: Subject<any>,
        someSubject: Subject<any>
      ) {
        console.log(subject, someSubject);
      }

      class SomeClass {
        subject = new Subject<any>();
        someSubject = new Subject<void>();

        constructor(private ctorSubject: Subject<any>) {}

        someMethod(someSubject: Subject<any>): Subject<any> {
          return someSubject;
        }

        get anotherSubject(): Subject<any> {
          return this.subject;
        }
        set anotherSubject(someSubject: Subject<any>) {
          this.someSubject = someSubject;
        }
      }

      interface SomeInterface {
        subject: Subject<any>;
        someSubject: Subject<any>;
        someMethod(someSubject: Subject<any>): Subject<any>;
        new (someSubject: Subject<any>);
        (someSubject: Subject<any>): void;
      }
    `,
      options: [{}],
    },
    {
      name: 'with default suffix and $',
      code: stripIndent`
      import { Subject } from "rxjs";

      const subject$ = new Subject<any>();
      const someSubject$ = new Subject<any>();

      const someObject = {
        subject$: new Subject<any>(),
        someSubject$: new Subject<any>()
      };

      function someFunction(
        subject$: Subject<any>,
        someSubject$: Subject<any>
      ) {
        console.log(subject$, someSubject$);
      }

      class SomeClass {
        subject$ = new Subject<any>();
        someSubject$ = new Subject<void>();

        constructor(private ctorSubject$: Subject<any>) {}

        someMethod(someSubject$: Subject<any>): Subject<any> {
          return someSubject$;
        }

        get anotherSubject$(): Subject<any> {
          return this.subject$;
        }
        set anotherSubject$(someSubject$: Subject<any>) {
          this.someSubject$ = someSubject$;
        }
      }

      interface SomeInterface {
        subject$: Subject<any>;
        someSubject$: Subject<any>;
        someMethod(someSubject$: Subject<any>): Subject<any>;
        new (someSubject$: Subject<any>);
        (someSubject$: Subject<any>): void;
      }
    `,
      options: [{}],
    },
    {
      name: 'with explicit suffix',
      code: stripIndent`
      import { Subject } from "rxjs";

      const sub = new Subject<any>();
      const someSub = new Subject<any>();

      const someObject = {
        sub: new Subject<any>(),
        someSub: new Subject<any>()
      };

      function someFunction(
        sub: Subject<any>,
        someSub: Subject<any>
      ) {
        console.log(sub, someSub);
      }

      class SomeClass {
        sub = new Subject<any>();
        someSub = new Subject<void>();

        constructor(private ctorSub: Subject<any>) {}

        someMethod(someSub: Subject<any>): Subject<any> {
          return someSub;
        }

        get anotherSub(): Subject<any> {
          return this.sub;
        }
        set anotherSub(someSub: Subject<any>) {
          this.someSub = someSub;
        }
      }

      interface SomeInterface {
        sub: Subject<any>;
        someSub: Subject<any>;
        someMethod(someSub: Subject<any>): Subject<any>;
        new (someSub: Subject<any>);
        (someSub: Subject<any>): void;
      }
    `,
      options: [{ suffix: 'Sub' }],
    },
    {
      name: 'with explicit suffix and $',
      code: stripIndent`
      import { Subject } from "rxjs";

      const sub$ = new Subject<any>();
      const someSub$ = new Subject<any>();

      const someObject = {
        sub$: new Subject<any>(),
        someSub$: new Subject<any>()
      };

      function someFunction(
        sub$: Subject<any>,
        someSub$: Subject<any>
      ) {
        console.log(sub$, someSub$);
      }

      class SomeClass {
        sub$ = new Subject<any>();
        someSub$ = new Subject<void>();

        constructor(private ctorSub$: Subject<any>) {}

        someMethod(someSub$: Subject<any>): Subject<any> {
          return someSub$;
        }

        get anotherSub$(): Subject<any> {
          return this.sub$;
        }
        set anotherSub$(someSub$: Subject<any>) {
          this.someSub$ = someSub$;
        }
      }

      interface SomeInterface {
        sub$: Subject<any>;
        someSub$: Subject<any>;
        someMethod(someSub$: Subject<any>): Subject<any>;
        new (someSub$: Subject<any>);
        (someSub$: Subject<any>): void;

      }
    `,
      options: [{ suffix: 'Sub' }],
    },
    {
      name: 'with EventEmitter',
      code: stripIndent`
      import { Subject } from "rxjs";

      class EventEmitter<T> extends Subject<T> {}
      const emitter = new EventEmitter<any>();
    `,
      options: [{}],
    },
    {
      name: 'with explicit non-enforced type',
      code: stripIndent`
      import { Subject } from "rxjs";

      class Thing<T> extends Subject<T> {}
      const thing = new Thing<any>();
    `,
      options: [
        {
          types: {
            '^Thing$': false,
          },
        },
      ],
    },
    {
      name: 'https://github.com/cartant/rxjs-tslint-rules/issues/88',
      code: stripIndent`
        import { RouterStateSerializer } from '@ngrx/router-store';
        import { Params, RouterStateSnapshot } from '@angular/router';

        /**
         * The RouterStateSerializer takes the current RouterStateSnapshot
         * and returns any pertinent information needed. The snapshot contains
         * all information about the state of the router at the given point in time.
         * The entire snapshot is complex and not always needed. In this case, you only
         * need the URL and query parameters from the snapshot in the store. Other items could be
         * returned such as route parameters and static route data.
         */
        export interface RouterStateUrl {
          url: string;
          queryParams: Params;
        }

        export class CustomRouterStateSerializer implements RouterStateSerializer<RouterStateUrl> {
          serialize(routerState: RouterStateSnapshot): RouterStateUrl {
            const { url } = routerState;
            const queryParams = routerState.root.queryParams;

            return { url, queryParams };
          }
        }
      `,
    },
    {
      name: 'variables without suffix, but not enforced',
      code: stripIndent`
        import { Subject } from "rxjs";

        const one = new Subject<any>();
        const some = new Subject<any>();
      `,
      options: [{ variables: false }],
    },
    {
      name: 'BehaviorSubject with default suffix',
      code: stripIndent`
        import { BehaviorSubject } from "rxjs";

        const subject = new BehaviorSubject<number>(42);
        const someSubject = new BehaviorSubject<number>(54);
      `,
    },
    {
      name: 'MySubject with default suffix',
      code: stripIndent`
        import { Subject } from "rxjs";
        class MySubject extends Subject {}

        const subject = new MySubject<number>();
        const mySubject = new MySubject<number>();
      `,
    },
    {
      name: 'Static observable creators that accept a sources object',
      code: stripIndent`
        import { Subject, BehaviorSubject, combineLatest, forkJoin } from "rxjs";

        combineLatest({ one: new Subject<number>(), two: new BehaviorSubject('a') });
        forkJoin({ one: new Subject<number>(), two: new BehaviorSubject('a') });
      `,
    },
    {
      name: 'object literal keys without suffix, but not enforced',
      code: stripIndent`
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          some: new Subject<any>()
        };
      `,
      options: [{ objects: false }],
    },
    {
      name: 'override methods',
      code: stripIndent`
        import { Subject } from "rxjs";

        abstract class SomeBase {
          protected abstract someMethodSubject(someSubject: Subject<any>): Subject<any>;
        }

        class SomeDerived extends SomeBase {
          protected override someMethodSubject(someSubject: Subject<any>): Subject<any> {
            return someSubject;
          }
        }
      `,
    },
    {
      name: 'override class fields',
      code: stripIndent`
        import { Subject } from "rxjs";

        class SomeBase {
          protected sourceSubject = (valueSubject: Subject<any>): Subject<any> => valueSubject;
        }

        class SomeDerived extends SomeBase {
          protected override source = (valueSubject: Subject<any>): Subject<any> => valueSubject;
        }
      `,
    },
  ],
  invalid: [
    fromFixture(
      'parameters without suffix',
      stripIndent`
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~ [forbidden { "suffix": "Subject" }]
          some: Subject<any>
          ~~~~ [forbidden { "suffix": "Subject" }]
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~ [forbidden { "suffix": "Subject" }]

          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~ [forbidden { "suffix": "Subject" }]
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
                      ~~~~ [forbidden { "suffix": "Subject" }]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~ [forbidden { "suffix": "Subject" }]
          new (some: Subject<any>);
               ~~~~ [forbidden { "suffix": "Subject" }]
          (some: Subject<any>): void;
           ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'parameters without suffix, but not enforced',
      stripIndent`
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          some: Subject<any>
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}

          someMethod(some: Subject<any>): Subject<any> {
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
          new (some: Subject<any>);
          (some: Subject<any>): void;
        }
      `,
      { options: [{ parameters: false }] },
    ),
    fromFixture(
      'parameters without explicit suffix',
      stripIndent`
        import { Subject } from "rxjs";

        function someFunction(
          one: Subject<any>,
          ~~~ [forbidden { "suffix": "Sub" }]
          some: Subject<any>
          ~~~~ [forbidden { "suffix": "Sub" }]
        ) {
          console.log(one, some);
        }

        class SomeClass {
          constructor(ctor: Subject<any>) {}
                      ~~~~ [forbidden { "suffix": "Sub" }]

          someMethod(some: Subject<any>): Subject<any> {
                     ~~~~ [forbidden { "suffix": "Sub" }]
            return some;
          }

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
            return this.ctor;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
                      ~~~~ [forbidden { "suffix": "Sub" }]
            this.ctor = some;
          }
        }

        interface SomeInterface {
          someMethod(some: Subject<any>): Subject<any>;
                     ~~~~ [forbidden { "suffix": "Sub" }]
          new (some: Subject<any>);
               ~~~~ [forbidden { "suffix": "Sub" }]
          (some: Subject<any>): void;
           ~~~~ [forbidden { "suffix": "Sub" }]
        }
      `,
      { options: [{ suffix: 'Sub' }] },
    ),
    fromFixture(
      'properties without suffix',
      stripIndent`
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~ [forbiddenProperty { "suffix": "Subject" }]
          some: new Subject<any>()
          ~~~~ [forbiddenProperty { "suffix": "Subject" }]
        };

        class SomeClass {
          one = new Subject<any>();
          ~~~ [forbidden { "suffix": "Subject" }]
          some = new Subject<void>();
          ~~~~ [forbidden { "suffix": "Subject" }]

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
            return this.subject;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Subject" }]
                      ~~~~ [forbidden { "suffix": "Subject" }]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          ~~~ [forbidden { "suffix": "Subject" }]
          some: Subject<any>;
          ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'properties without suffix, but not enforced',
      stripIndent`
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          some: new Subject<any>()
        };

        class SomeClass {
          one = new Subject<any>();
          some = new Subject<void>();

          get another(): Subject<any> {
            return this.subject;
          }
          set another(some: Subject<any>) {
                      ~~~~ [forbidden { "suffix": "Subject" }]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          some: Subject<any>;
        }
      `,
      { options: [{ objects: false, properties: false }] },
    ),
    fromFixture(
      'properties without explicit suffix',
      stripIndent`
        import { Subject } from "rxjs";

        const someObject = {
          one: new Subject<any>(),
          ~~~ [forbiddenProperty { "suffix": "Sub" }]
          some: new Subject<any>()
          ~~~~ [forbiddenProperty { "suffix": "Sub" }]
        };

        class SomeClass {
          one = new Subject<any>();
          ~~~ [forbidden { "suffix": "Sub" }]
          some = new Subject<void>();
          ~~~~ [forbidden { "suffix": "Sub" }]

          get another(): Subject<any> {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
            return this.subject;
          }
          set another(some: Subject<any>) {
              ~~~~~~~ [forbidden { "suffix": "Sub" }]
                      ~~~~ [forbidden { "suffix": "Sub" }]
            this.some = some;
          }
        }

        interface SomeInterface {
          one: Subject<any>;
          ~~~ [forbidden { "suffix": "Sub" }]
          some: Subject<any>;
          ~~~~ [forbidden { "suffix": "Sub" }]
        }
      `,
      { options: [{ suffix: 'Sub' }] },
    ),
    fromFixture(
      'variables without suffix',
      stripIndent`
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~ [forbidden { "suffix": "Subject" }]
        const some = new Subject<any>();
              ~~~~ [forbidden { "suffix": "Subject" }]
      `,
    ),
    fromFixture(
      'variables without explicit suffix',
      stripIndent`
        import { Subject } from "rxjs";

        const one = new Subject<any>();
              ~~~ [forbidden { "suffix": "Sub" }]
        const some = new Subject<any>();
              ~~~~ [forbidden { "suffix": "Sub" }]
      `,
      { options: [{ suffix: 'Sub' }] },
    ),
    fromFixture(
      'functions and methods with array destructuring',
      stripIndent`
        import { Subject } from "rxjs";

        function someFunction([someParam]: Subject<any>[]): void {}
                               ~~~~~~~~~ [forbidden { "suffix": "Subject" }]

        class SomeClass {
          someMethod([someParam]: Subject<any>[]): void {}
                      ~~~~~~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'functions and methods with object destructuring',
      stripIndent`
        import { Subject } from "rxjs";

        function someFunction({ source }: Record<string, Subject<any>>): void {}
                                ~~~~~~ [forbidden { "suffix": "Subject" }]

        class SomeClass {
          someMethod({ source }: Record<string, Subject<any>>): void {}
                       ~~~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'override methods enforce identifier parameters',
      stripIndent`
        import { Subject } from "rxjs";

        class SomeBase {
          someMethodSubject(some: Subject<any>): Subject<any> { return some; }
                            ~~~~ [forbidden { "suffix": "Subject" }]
          set someSetterSubject(some: Subject<any>) {}
                                ~~~~ [forbidden { "suffix": "Subject" }]
        }

        class SomeDerived extends SomeBase {
          override someMethodSubject(some: Subject<any>): Subject<any> { return some; }
                                     ~~~~ [forbidden { "suffix": "Subject" }]
          override set someSetterSubject(some: Subject<any>) {}
                                         ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'override methods enforce array destructured parameters',
      stripIndent`
        import { Subject } from "rxjs";

        class SomeBase {
          someMethodSubject([someParam]: Subject<any>[]): void {}
                             ~~~~~~~~~ [forbidden { "suffix": "Subject" }]
        }

        class SomeDerived extends SomeBase {
          override someMethodSubject([someParam]: Subject<any>[]): void {}
                                      ~~~~~~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'override methods enforce object destructured parameters',
      stripIndent`
        import { Subject } from "rxjs";

        class SomeBase {
          someMethodSubject({ source }: Record<string, Subject<any>>): void {}
                              ~~~~~~ [forbidden { "suffix": "Subject" }]
        }

        class SomeDerived extends SomeBase {
          override someMethodSubject({ source }: Record<string, Subject<any>>): void {}
                                       ~~~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'override class fields enforce parameters',
      stripIndent`
        import { Subject } from "rxjs";

        class SomeBase {
          protected sourceSubject = (valueSubject: Subject<any>): Subject<any> => valueSubject;
        }

        class SomeDerived extends SomeBase {
          protected override source = (value: Subject<any>): Subject<any> => value;
                                       ~~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'nested callback parameters in override methods are still enforced',
      stripIndent`
        import { Subject } from "rxjs";

        class SomeBase {
          someMethodSubject(sourceSubject: Subject<any>): void {}
        }

        class SomeDerived extends SomeBase {
          override someMethodSubject(sourceSubject: Subject<any>): void {
            [sourceSubject].forEach(function (item: Subject<any>): void {});
                                              ~~~~ [forbidden { "suffix": "Subject" }]
          }
        }
      `,
    ),
    fromFixture(
      'abstract methods without suffix',
      stripIndent`
        import { Subject } from "rxjs";

        abstract class SomeBase {
          abstract someMethod(some: Subject<any>): Subject<any>;
                              ~~~~ [forbidden { "suffix": "Subject" }]
          abstract get some(): Subject<any>;
                       ~~~~ [forbidden { "suffix": "Subject" }]
          abstract set some(valueSubject: Subject<any>);
                       ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'abstract of abstract',
      stripIndent`
        import { Subject } from "rxjs";

        abstract class SomeBase {
          abstract someMethod(some: Subject<any>): Subject<any>;
                              ~~~~ [forbidden { "suffix": "Subject" }]
          abstract get some(): Subject<any>;
                       ~~~~ [forbidden { "suffix": "Subject" }]
          abstract set some(valueSubject: Subject<any>);
                       ~~~~ [forbidden { "suffix": "Subject" }]
        }

        abstract class SomeDerived extends SomeBase {
          abstract override someMethod(some: Subject<any>): Subject<any>;
          abstract override get some(): Subject<any>;
          abstract override set some(valueSubject: Subject<any>);
        }
      `,
    ),
    fromFixture(
      'override accessors skip property name checks',
      stripIndent`
        import { Subject } from "rxjs";

        class SomeBase {
          private _someSubject = new Subject<any>();

          get some(): Subject<any> {
              ~~~~ [forbidden { "suffix": "Subject" }]
            return this._someSubject;
          }
          set some(valueSubject: Subject<any>) {
              ~~~~ [forbidden { "suffix": "Subject" }]
            this._someSubject = valueSubject;
          }
        }

        class SomeDerived extends SomeBase {
          override get some(): Subject<any> {
            return new Subject<any>();
          }
          override set some(valueSubject: Subject<any>) {}
        }
      `,
    ),
    fromFixture(
      'parameter property',
      stripIndent`
        import { Subject } from "rxjs";

        class SomeClass {
          constructor(public some: Subject<any>) {}
                             ~~~~ [forbidden { "suffix": "Subject" }]
        }
      `,
    ),
    fromFixture(
      'BehaviorSubject without suffix',
      stripIndent`
        import { BehaviorSubject } from "rxjs";

        const source = new BehaviorSubject<number>(42);
              ~~~~~~ [forbidden { "suffix": "Subject" }]
      `,
    ),
    fromFixture(
      'BehaviorSubject with $ suffix',
      stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/88
        import { BehaviorSubject } from "rxjs";

        const subject$ = new BehaviorSubject<number>(42);
              ~~~~~~~~ [forbidden { "suffix": "$$" }]
        const someSubject$ = new BehaviorSubject<number>(54);
              ~~~~~~~~~~~~ [forbidden { "suffix": "$$" }]
      `,
      { options: [{ suffix: '$$' }] },
    ),
    fromFixture(
      'Property with $ suffix',
      stripIndent`
        // https://github.com/cartant/eslint-plugin-rxjs/issues/88#issuecomment-1020645186
        import { Subject } from "rxjs";

        class SomeClass {
          public someProperty$: Subject<unknown>;
                 ~~~~~~~~~~~~~ [forbidden { "suffix": "$$" }]
        }
      `,
      { options: [{ suffix: '$$' }] },
    ),
    fromFixture(
      'MySubject without suffix',
      stripIndent`
        import { Subject } from "rxjs";
        class MySubject<T> extends Subject<T> {}

        const source = new MySubject<number>();
              ~~~~~~ [forbidden { "suffix": "Subject" }]
      `,
    ),
    fromFixture(
      'skip object literals passed to functions and methods',
      stripIndent`
        import { Subject } from "rxjs";

        interface SomeOptions {
          foo: Subject<number>;
          ~~~ [forbidden { "suffix": "Subject" }]
        }

        function someFunction(options: SomeOptions): void {}
        const someArrowFunction = (options: SomeOptions): void => {};
        class SomeClass {
          someMethod(options: SomeOptions): void {}
        }
        function someInlineOptionsFunction(options: { foo: Subject<number> }): void {}
                                                      ~~~ [forbidden { "suffix": "Subject" }]

        someFunction({
          foo: new Subject<number>(),
          // should not error
        });
        someArrowFunction({
          foo: new Subject<number>(),
          // should not error
        });
        new SomeClass().someMethod({
          foo: new Subject<number>(),
          // should not error
        });
      `,
    ),
    fromFixture(
      'skip object literals with any parent type annotation',
      stripIndent`
        import { Subject } from "rxjs";

        interface SomeObject {
          foo: Subject<number>;
          ~~~ [forbidden { "suffix": "Subject" }]
          bar: Subject<string>;
          ~~~ [forbidden { "suffix": "Subject" }]
        }

        interface SomeWrapperObject {
          baz: SomeObject;
        }

        type SomeArray = Array<SomeWrapperObject>;

        const arr: SomeArray = [
          {
            baz: {
              foo: new Subject<number>(),
              // should not error
              bar: new Subject<string>(),
              // should not error
            },
          },
        ];
      `,
    ),
    fromFixture(
      'skip object literals with any parent satisfies',
      stripIndent`
        import { Subject } from "rxjs";

        interface SomeObject {
          foo: Subject<number>;
          ~~~ [forbidden { "suffix": "Subject" }]
          bar: Subject<string>;
          ~~~ [forbidden { "suffix": "Subject" }]
        }

        interface SomeWrapperObject {
          baz: SomeObject;
        }

        type SomeArray = Array<SomeWrapperObject>;

        const arr = [
          {
            baz: {
              foo: new Subject<number>(),
              // should not error
              bar: new Subject<string>(),
              // should not error
            },
          } satisfies SomeWrapperObject,
        ];
      `,
    ),
    fromFixture(
      'skip object literals with any parent type assertion',
      stripIndent`
        import { Subject } from "rxjs";

        interface SomeObject {
          foo: Subject<number>;
          ~~~ [forbidden { "suffix": "Subject" }]
          bar: Subject<string>;
          ~~~ [forbidden { "suffix": "Subject" }]
        }

        interface SomeWrapperObject {
          baz: SomeObject;
        }

        type SomeArray = Array<SomeWrapperObject>;

        const arr = [
          {
            baz: {
              foo: new Subject<number>(),
              // should not error
              bar: new Subject<string>(),
              // should not error
            },
          } as SomeWrapperObject,
        ];
      `,
    ),
    fromFixture(
      'type alias not supported because it gets erased',
      stripIndent`
        import { Subject } from "rxjs";

        type Foo = Subject<any>;

        let foo: Foo;
            ~~~ [forbidden { "suffix": "Subject" }]
      `,
      { options: [{ types: { '^Foo$': false } }] },
    ),
  ],
});
