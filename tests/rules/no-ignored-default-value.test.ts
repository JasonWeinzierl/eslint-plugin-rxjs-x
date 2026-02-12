import { stripIndent } from 'common-tags';
import { noIgnoredDefaultValueRule } from '../../src/rules/no-ignored-default-value';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-default-value', noIgnoredDefaultValueRule, {
  valid: [
    {
      name: 'firstValueFrom with default value',
      code: stripIndent`
        import { firstValueFrom, of } from "rxjs";

        firstValueFrom(of(42), { defaultValue: 0 });
        firstValueFrom(of(42), { defaultValue: null });
        firstValueFrom(of(42), { defaultValue: undefined });
        function getValue(obs) {
          return firstValueFrom(obs, { defaultValue: "hello" });
        }
        class Foo {
          getValue(obs) {
            return firstValueFrom(obs, { defaultValue: "world" });
          }
        }
      `,
    },
    {
      name: 'lastValueFrom with default value',
      code: stripIndent`
        import { lastValueFrom, of } from "rxjs";

        lastValueFrom(of(42), { defaultValue: 0 });
        lastValueFrom(of(42), { defaultValue: null });
        lastValueFrom(of(42), { defaultValue: undefined });
      `,
    },
    {
      name: 'first with default value',
      code: stripIndent`
        import { first, of } from "rxjs";

        of(42).pipe(first(x => x, { defaultValue: 0 }));
        of(42).pipe(first(x => x, { defaultValue: null }));
        of(42).pipe(first(x => x, { defaultValue: undefined }));
      `,
    },
    {
      name: 'last with default value',
      code: stripIndent`
        import { last, of } from "rxjs";

        of(42).pipe(last(x => x, { defaultValue: 0 }));
        of(42).pipe(last(x => x, { defaultValue: null }));
        of(42).pipe(last(x => x, { defaultValue: undefined }));
      `,
    },
    {
      name: 'other operators',
      code: stripIndent`
        import { of, map, filter, refCount } from "rxjs";

        of(42).pipe(map(x => x), filter(x => x > 0), shareReplay({ bufferSize: 1, refCount: true }));
      `,
    },
    {
      name: 'non-RxJS firstValueFrom',
      code: stripIndent`
        // non-RxJS firstValueFrom
        import { of } from "rxjs";

        function firstValueFrom(obs) {}
        firstValueFrom(of(42));

        class Foo {
          firstValueFrom(obs) {}
        }
        const myFoo = new Foo();
        myFoo.firstValueFrom(of(42));
      `,
    },
    {
      name: 'non-RxJS lastValueFrom',
      code: stripIndent`
        import { of } from "rxjs";

        function lastValueFrom(obs) {}
        lastValueFrom(of(42));
      `,
    },
    {
      name: 'non-RxJS first',
      code: stripIndent`
        import { of } from "rxjs";

        function first() {}
        of(42).pipe(first());
      `,
    },
    {
      name: 'non-RxJS last',
      code: stripIndent`
        import { of } from "rxjs";

        function last() {}
        of(42).pipe(last());
      `,
    },
  ],
  invalid: [
    fromFixture(
      'firstValueFrom ignored',
      stripIndent`
        import { firstValueFrom, of } from "rxjs";

        firstValueFrom(of(42));
        ~~~~~~~~~~~~~~ [forbidden]
        firstValueFrom(of(42), {});
                               ~~ [forbidden]
        const config = {};
        firstValueFrom(of(42), config);
                               ~~~~~~ [forbidden]
        const config2 = { config: {} };
        firstValueFrom(of(42), config2.config);
                                       ~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'lastValueFrom ignored',
      stripIndent`
        import { lastValueFrom, of } from "rxjs";

        lastValueFrom(of(42));
        ~~~~~~~~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'first ignored',
      stripIndent`
        import { first, of } from "rxjs";

        of(42).pipe(first());
                    ~~~~~ [forbidden]
        of(42).pipe(first({}));
                          ~~ [forbidden]
        const config = {};
        of(42).pipe(first(config));
                          ~~~~~~ [forbidden]
        const config2 = { config: {} };
        of(42).pipe(first(config2.config));
                                  ~~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'last ignored',
      stripIndent`
        import { last, of } from "rxjs";

        of(42).pipe(last());
                    ~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'namespace import',
      stripIndent`
        import * as Rx from "rxjs";

        Rx.firstValueFrom(Rx.of(42));
           ~~~~~~~~~~~~~~ [forbidden]
        Rx.of(42).pipe(Rx.first());
                          ~~~~~ [forbidden]
      `,
    ),
    fromFixture(
      'operators import (deprecated)',
      stripIndent`
        import { of } from "rxjs";
        import { first, last } from "rxjs/operators";

        of(42).pipe(first());
                    ~~~~~ [forbidden]
        of(42).pipe(last());
                    ~~~~ [forbidden]
      `,
    ),
  ],
});
