import { stripIndent } from 'common-tags';
import { noExplicitGenericsRule } from '../../src/rules/no-explicit-generics';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-explicit-generics', noExplicitGenericsRule, {
  valid: [
    {
      name: 'without type arguments',
      code: stripIndent`
        import { BehaviorSubject, from, of, Notification } from "rxjs";
        import { scan } from "rxjs/operators";
        const a = of(42, 54);
        const b1 = a.pipe(
          scan((acc: string, value: number) => acc + value, "")
        );
        const b2 = a.pipe(
          scan((acc, value): string => acc + value, "")
        );
        const c = new BehaviorSubject(42);
        const d = from([42, 54]);
        const e = of(42, 54);
        const f = new Notification("N", 42);
        const g = new Notification<number>("E", undefined, "Kaboom!");
        const h = new Notification<number>("C");
      `,
    },
    {
      name: 'with array and object literals',
      code: stripIndent`
        import { BehaviorSubject, Notification } from "rxjs";
        const a = new BehaviorSubject<number[]>([42]);
        const b = new BehaviorSubject<number[]>([]);
        const c = new BehaviorSubject<{ answer: number }>({ answer: 42 });
        const d = new BehaviorSubject<{ answer?: number }>({});
        const e = new Notification<number[]>("N", [42]);
        const f = new Notification<number[]>("N", []);
        const g = new Notification<{ answer: number }>("N", { answer: 42 });
        const h = new Notification<{ answer?: number }>("N", {});
      `,
    },
    {
      name: 'with explicit (AST) union types',
      code: stripIndent`
        import { BehaviorSubject, Notification } from "rxjs";
        const a = new BehaviorSubject<number | null>(null);
        const b = new BehaviorSubject<number | null>(42);
        const c = new BehaviorSubject<{ answer: number } | null>({ answer: 42 });
        const d = new BehaviorSubject<{ answer: number } | null>(null);
        const e = new BehaviorSubject<{ answer?: number }>({});
        const f = new Notification<number | null>("N", 42);
        const g = new Notification<number | null>("N", null);
        const h = new Notification<{ answer: number } | null>("N", { answer: 42 });
        const i = new Notification<{ answer?: number } | null>("N", {});
        const j = new Notification<{ answer?: number } | null>("N", null);
      `,
    },
    {
      name: 'with ALIASED union types (TypeChecker required)',
      code: stripIndent`
        import { BehaviorSubject } from "rxjs";

        type Foo = 1 | 2;
        // Should be valid because '1' infers generic type 'number',
        // but we explicitly want the narrower 'Foo' union.
        const fooSubject$ = new BehaviorSubject<Foo>(1);

        type ComplexUnion = { a: string } | null;
        const complex$ = new BehaviorSubject<ComplexUnion>(null);
      `,
    },
  ],
  invalid: [
    fromFixture(
      'scan with type arguments',
      stripIndent`
        import { of } from "rxjs";
        import { scan } from "rxjs/operators";
        const a = of(42, 54);
        const b = a.pipe(
          scan<number, string>((acc, value) => acc + value, "")
          ~~~~ [forbidden]
        );
      `,
    ),
    fromFixture(
      'simple case',
      stripIndent`
        import { BehaviorSubject } from "rxjs";
        const b = new BehaviorSubject<number>(42);
                      ~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'Simple aliases (not unions) should be forbidden',
      stripIndent`
        import { BehaviorSubject } from "rxjs";
        type Bar = number;
        const b = new BehaviorSubject<Bar>(42);
                      ~~~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'from',
      stripIndent`
        import { from } from "rxjs";
        const f = from<number>([42, 54]);
                  ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'of',
      stripIndent`
        import { of } from "rxjs";
        const o = of<number>(42, 54);
                  ~~ [forbidden]
      `,
    ),
    fromFixture(
      'Notification',
      stripIndent`
        import { Notification } from "rxjs";
        const n = new Notification<number>("N", 42);
                      ~~~~~~~~~~~~ [forbidden]
      `,
    ),
  ],
});
