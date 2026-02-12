import { stripIndent } from 'common-tags';
import { noMisusedObservablesRule } from '../../src/rules/no-misused-observables';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-misused-observables', noMisusedObservablesRule, {
  valid: [
    {
      name: 'all checks disabled',
      code: stripIndent`
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => of(i));

        const source = of(42);
        const foo = { ...source };
      `,
      options: [{ checksVoidReturn: false, checksSpreads: false }],
    },
    // #region valid; void return argument
    {
      name: 'void return argument; explicitly allowed',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> => { return of(i); });
        [1, 2, 3].forEach(i => of(i));

        class Foo {
          constructor(x: () => void) {}
        }
        new Foo(() => of(42));
      `,
      options: [{ checksVoidReturn: { arguments: false } }],
    },
    {
      name: 'void return argument; unrelated',
      code: stripIndent`
        [1, 2, 3].forEach(i => i);
        [1, 2, 3].forEach(i => { return i; });

        class Foo {
          constructor(x: () => void, y: number) {}
        }
        new Foo(() => 42, 0);
        new Foo;
      `,
    },
    // #endregion valid; void return argument
    // #region valid; void return attribute
    {
      name: 'void return attribute; explicitly allowed',
      code: stripIndent`
        import { of } from "rxjs";

        interface Props {
          foo: () => void;
        }
        declare function Component(props: Props): any;

        const _ = <Component foo={() => of(42)} />;
      `,
      options: [{ checksVoidReturn: { attributes: false } }],
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    {
      name: 'void return attribute; not void',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        interface Props {
          foo: () => Observable<number>;
        }
        declare function Component(props: Props): any;

        const _ = <Component foo={() => of(42)} />;
      `,
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    {
      name: 'void return attribute; unrelated',
      code: stripIndent`

        interface Props {
          foo: () => void;
          bar: boolean;
        }
        declare function Component(props: Props): any;

        const _ = <Component foo={() => 42} bar />;
      `,
      languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    // #endregion valid; void return attribute
    // #region valid; void return inherited method
    {
      name: 'void return inherited method; explicitly allowed',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        class Foo {
          foo(): void {}
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
        }

        const Baz = class extends Foo {
          foo(): Observable<number> { return of(42); }
        }

        interface Qux extends Foo {
          foo(): Observable<number>;
        }
      `,
      options: [{ checksVoidReturn: { inheritedMethods: false } }],
    },
    {
      name: 'void return inherited method; not void',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        class Foo {
          foo(): Observable<number> { return of(42); }
          s(): void {}
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(43); }
          static s(): Observable<number> { return of(43); }
        }

        const Baz = class extends Foo {
          foo(): Observable<number> { return of(44); }
        }

        interface Qux extends Foo {
          foo(): Observable<45>;
        }
      `,
    },
    {
      name: 'void return inherited method; static accessor properties',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        class Foo {
          public foo = (): void => {};
        }

        class Bar extends Foo {
          public static accessor foo = (): Observable<number> => of(42);
        }
      `,
    },
    {
      name: 'void return inherited method; static accessor properties; unrelated',
      code: stripIndent`
        class Foo {
          public foo = (): void => {};
        }

        class Bar extends Foo {
          public static accessor foo = (): void => {};
        }
      `,
    },
    {
      name: 'void return inherited method; unrelated',
      code: stripIndent`
        class Foo {
          foo(): void {}
        }

        class Bar extends Foo {
          foo(): number { return 42; }
        }
      `,
    },
    // #endregion valid; void return inherited method
    // #region valid; void return property
    {
      name: 'void return property; explicitly allowed',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = { a: () => void, b: () => void, c: () => void };
        const b: () => Observable<number> = () => of(42);
        const foo: Foo = {
          a: (): Observable<number> => of(42),
          b,
          c(): Observable<number> { return of(42); },
        };
      `,
      options: [{ checksVoidReturn: { properties: false } }],
    },
    {
      name: 'void return property; not void',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = { a: () => Observable<number>, b: () => Observable<number>, c: () => Observable<number> };
        const b: () => Observable<number> = () => of(42);
        const foo: Foo = {
          a: () => of(42),
          b,
          c(): Observable<number> { return of(42); },
          d(): Observable<number> { return of(42); },
        };
      `,
    },
    {
      name: 'void return property; unrelated',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = { a: () => void, b: () => void, c: () => void };
        const b: () => number = () => 42;
        const foo: Foo = {
          a: () => 42,
          b,
          ['c'](): number { return 42; },
        };
        const bar = {
          a(): Observable<number> { return of(42); },
        }
      `,
    },
    {
      name: 'computed property name for method declaration is not supported',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = { a: () => void };
        const foo: Foo = {
          ['a'](): Observable<number> { return of(42); },
        };
      `,
    },
    {
      name: 'void return property; union type',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        interface Hook {
          onInit?: ((field: string) => void) | ((field: string) => Observable<any>);
        }

        const hook: Hook = {
          onInit: field => of(field),
        };
      `,
    },
    // #endregion valid; void return property
    // #region valid; void return return value
    {
      name: 'void return return value; explicitly allowed',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        function foo(): () => void {
          return (): Observable<number> => of(42);
        }
      `,
      options: [{ checksVoidReturn: { returns: false } }],
    },
    {
      name: 'void return return value; not void',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        function foo(): () => Observable<number> {
          return (): Observable<number> => of(42);
        }
      `,
    },
    {
      name: 'void return return value; unrelated',
      code: stripIndent`
        function foo(): () => number {
          return (): number => 42;
        }
        function bar(): () => void {
          return (): number => 42;
        }
        function baz(): () => void {
          return (): void => { return; };
        }
      `,
    },
    // #endregion valid; void return return value
    // #region valid; void return variable
    {
      name: 'void return variable; explicitly allowed',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        let foo: () => void;
        foo = (): Observable<number> => of(42);
        const bar: () => void = (): Observable<number> => of(42);
      `,
      options: [{ checksVoidReturn: { variables: false } }],
    },
    {
      name: 'void return variable; not void',
      code: stripIndent`
        import { Observable, of } from "rxjs";

        let foo: () => Observable<number>;
        foo = () => of(42);
      `,
    },
    {
      name: 'void return variable; unrelated',
      code: stripIndent`
        let foo: () => void;
        foo = (): number => 42;
      `,
    },
    // #endregion valid; void return variable
    // #region valid; spread
    {
      name: 'spread; explicitly allowed',
      code: stripIndent`
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
      `,
      options: [{ checksSpreads: false }],
    },
    {
      name: 'spread; unrelated',
      code: stripIndent`
        // spread; unrelated
        const foo = { bar: 42 };
        const baz = { ...foo };
      `,
    },
    // #endregion valid; spread
  ],
  invalid: [
    // #region invalid; void return argument
    fromFixture(
      'void return argument; block body',
      stripIndent`
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> => { return of(i); });
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      'void return argument; inline body',
      stripIndent`
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => of(i));
                          ~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      'void return argument; block body; implicit return type',
      stripIndent`
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => { return of(i); });
                          ~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      'void return argument; block body; union return',
      stripIndent`
        import { Observable, of } from "rxjs";

        [1, 2, 3].forEach((i): Observable<number> | number => { if (i > 1) { return of(i); } else { return i; } });
                          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      'void return argument; inline body; union return',
      stripIndent`
        import { of } from "rxjs";

        [1, 2, 3].forEach(i => i > 1 ? of(i) : i);
                          ~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    fromFixture(
      'void return argument; constructor',
      stripIndent`
        import { of } from "rxjs";

        class Foo {
          constructor(x: () => void) {}
        }
        new Foo(() => of(42));
                ~~~~~~~~~~~~ [forbiddenVoidReturnArgument]
      `,
    ),
    // #endregion invalid; void return argument
    // #region invalid; void return attribute
    fromFixture(
      'void return attribute; block body',
      stripIndent`
        import { Observable, of } from "rxjs";

        interface Props {
          foo: () => void;
        }
        declare function Component(props: Props): any;

        const _ = <Component foo={(): Observable<number> => { return of(42); }} />;
                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnAttribute]
      `,
      {
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      },
    ),
    fromFixture(
      'void return attribute; inline body',
      stripIndent`
        import { Observable, of } from "rxjs";

        interface Props {
          foo: () => void;
        }
        declare function Component(props: Props): any;

        const _ = <Component foo={() => of(42)} />;
                                 ~~~~~~~~~~~~~~ [forbiddenVoidReturnAttribute]
      `,
      {
        languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
      },
    ),
    // #endregion invalid; void return attribute
    // #region invalid; void return inherited method
    fromFixture(
      'void return inherited method; class declaration; extends',
      stripIndent`
        import { Observable, of } from "rxjs";

        class Foo {
          foo(): void {}
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; abstract extends',
      stripIndent`
        import { Observable } from "rxjs";

        class Foo {
          foo(): void {}
        }

        abstract class Bar extends Foo {
          abstract foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; extends abstract',
      stripIndent`
        import { Observable, of } from "rxjs";

        abstract class Foo {
          abstract foo(): void;
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; abstract extends abstract',
      stripIndent`
        import { Observable } from "rxjs";

        abstract class Foo {
          abstract foo(): void;
        }

        abstract class Bar extends Foo {
          abstract foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; implements',
      stripIndent`
        import { Observable, of } from "rxjs";

        interface Foo {
          foo(): void;
        }

        class Bar implements Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; abstract implements',
      stripIndent`
        import { Observable } from "rxjs";

        interface Foo {
          foo(): void;
        }

        abstract class Bar implements Foo {
          abstract foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; implements type intersection',
      stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = { foo(): void } & { bar(): void };

        class Bar implements Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
          bar(): void {}
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; extends and implements',
      stripIndent`
        import { Observable, of } from "rxjs";

        interface Foo {
          foo(): Observable<void>;
        }

        interface Bar {
          foo(): void;
        }

        class Baz {
          foo(): void {}
        }

        class Qux extends Baz implements Foo, Bar {
          foo(): Observable<void> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Baz" }]
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Bar" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class declaration; extends class expression',
      stripIndent`
        import { Observable, of } from "rxjs";

        const Foo = class {
          foo(): void {}
        }

        class Bar extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class expression; extends',
      stripIndent`
        import { Observable, of } from "rxjs";

        const Foo = class {
          foo(): void {}
        }

        const Bar = class extends Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; class expression; implements',
      stripIndent`
        import { Observable, of } from "rxjs";

        interface Foo {
          foo(): void;
        }

        const Bar = class implements Foo {
          foo(): Observable<number> { return of(42); }
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends class',
      stripIndent`
        import { Observable } from "rxjs";

        class Foo {
          foo(): void {}
        }

        interface Bar extends Foo {
          foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends abstract',
      stripIndent`
        import { Observable } from "rxjs";

        abstract class Foo {
          abstract foo(): void;
        }

        interface Bar extends Foo {
          foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends interface',
      stripIndent`
        import { Observable } from "rxjs";

        interface Foo {
          foo(): void;
        }

        interface Bar extends Foo {
          foo(): Observable<number>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends conditional type',
      stripIndent`
        import { Observable } from "rxjs";

        type Foo<IsRx extends boolean = true> = IsRx extends true
          ? { foo(): Observable<void> }
          : { foo(): void };

        interface Bar extends Foo<false> {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "{ foo(): void; }" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends multiple',
      stripIndent`
        import { Observable } from "rxjs";

        interface Foo {
          foo(): void;
        }

        interface Bar {
          foo(): void;
        }

        interface Baz extends Foo, Bar {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Bar" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends multiple classes',
      stripIndent`
        import { Observable } from "rxjs";

        class Foo {
          foo(): void {}
        }

        class Bar {
          foo(): void {}
        }

        interface Baz extends Foo, Bar {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Bar" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends typeof class',
      stripIndent`
        import { Observable } from "rxjs";

        const Foo = class {
          foo(): void {}
        }

        type Bar = typeof Foo;

        interface Baz extends Bar {
          foo(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "typeof Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends function, index, constructor',
      stripIndent`
        import { Observable } from "rxjs";

        interface Foo {
          (): void;
          (arg: string): void;
          new (): void;
          [key: string]: () => void;
          [key: number]: () => void;
          myMethod(): void;
        }

        interface Bar extends Foo {
          (): Observable<void>;
          (arg: string): Observable<void>;
          new (): Observable<void>;
          [key: string]: () => Observable<void>;
          [key: number]: () => Observable<void>;
          myMethod(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Foo" }]
        }
      `,
    ),
    fromFixture(
      'void return inherited method; interface; extends multiple function, index, constructor',
      stripIndent`
        import { Observable } from "rxjs";

        interface Foo {
          (): void;
          (arg: string): void;
        }

        interface Bar {
          [key: string]: () => void;
          [key: number]: () => void;
        }

        interface Baz {
          new (): void;
          new (arg: string): void;
        }

        interface Qux {
          doSyncThing(): void;
          doOtherSyncThing(): void;
          syncMethodProperty: () => void;
        }

        interface Quux extends Foo, Bar, Baz, Qux {
          (): void;
          (arg: string): Observable<void>;
          new (): void;
          new (arg: string): void;
          [key: string]: () => Observable<void>;
          [key: number]: () => void;
          doSyncThing(): Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Qux" }]
          doRxThing(): Observable<void>;
          syncMethodProperty: () => Observable<void>;
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnInheritedMethod { "heritageTypeName": "Qux" }]
        }
      `,
    ),
    // #endregion invalid; void return inherited method
    // #region invalid; void return property
    fromFixture(
      'void return property; arrow function',
      stripIndent`
        import { of } from "rxjs";

        type Foo = { bar: () => void };
        const foo: Foo = {
          bar: () => of(42),
                  ~~ [forbiddenVoidReturnProperty]
        };
      `,
    ),
    fromFixture(
      'void return property; function',
      stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = { bar: () => void };
        const foo: Foo = {
          bar(): Observable<number> { return of(42); },
                 ~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnProperty]
        };
      `,
    ),
    fromFixture(
      'void return property; union variable',
      stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = {
          bar: () => void,
          baz: () => void,
        };
        const bar = (() => of(42)) as (() => Observable<number>) | (() => string);
        const baz: (() => Observable<number>) | (() => string) = () => of(42);
        const foo: Foo = {
          bar,
          ~~~ [forbiddenVoidReturnProperty]
          baz: baz,
               ~~~ [forbiddenVoidReturnProperty]
        };
      `,
    ),
    fromFixture(
      'void return property; union signature',
      stripIndent`
        import { Observable, of } from "rxjs";

        type Foo = {
          bar: () => void,
        } | undefined;
        const foo: Foo = {
          bar() { return of(42); },
          ~~~ [forbiddenVoidReturnProperty]
        };
      `,
    ),
    // #endregion invalid; void return property
    // #region invalid; void return return value
    fromFixture(
      'void return return value; arrow function',
      stripIndent`
        import { Observable, of } from "rxjs";

        function foo(): () => void {
          return (): Observable<number> => of(42);
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnReturnValue]
        }
      `,
    ),
    fromFixture(
      'void return return value; function',
      stripIndent`
        import { Observable, of } from "rxjs";

        function foo(): () => void {
          return function(): Observable<number> { return of(42); };
                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbiddenVoidReturnReturnValue]
        }
      `,
    ),
    // #endregion invalid; void return return value
    // #region invalid; void return variable
    fromFixture(
      'void return variable; reassign',
      stripIndent`
        import { of } from "rxjs";

        let foo: () => void;
        foo = () => of(42);
              ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    fromFixture(
      'void return variable; const',
      stripIndent`
        import { of } from "rxjs";

        const foo: () => void = () => of(42);
                                ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
        const bar = () => of(42), baz: () => void = () => of(42);
                                                    ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    fromFixture(
      'void return variable; nested',
      stripIndent`
        import { of } from "rxjs";

        const foo: {
          bar?: () => void;
        } = {};
        foo.bar = () => of(42);
                  ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    fromFixture(
      'void return variable; Record',
      stripIndent`
        import { of } from "rxjs";

        const foo: Record<string, () => void> = {};
        foo.bar = () => of(42);
                  ~~~~~~~~~~~~ [forbiddenVoidReturnVariable]
      `,
    ),
    // #endregion invalid; void return variable
    // #region invalid; spread
    fromFixture(
      'spread variable',
      stripIndent`
        import { of } from "rxjs";

        const source = of(42);
        const foo = { ...source };
                         ~~~~~~ [forbiddenSpread]
      `,
    ),
    fromFixture(
      'spread call function',
      stripIndent`
        import { of } from "rxjs";

        function source() {
          return of(42);
        }
        const foo = { ...source() };
                         ~~~~~~~~ [forbiddenSpread]
      `,
    ),
    // #endregion invalid; spread
  ],
});
