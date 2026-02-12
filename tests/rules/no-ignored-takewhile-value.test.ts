import { stripIndent } from 'common-tags';
import { noIgnoredTakewhileValueRule } from '../../src/rules/no-ignored-takewhile-value';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-ignored-takewhile-value', noIgnoredTakewhileValueRule, {
  valid: [
    {
      name: 'function',
      code: stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function (value) { return value; })
            ).subscribe();
          }
        };
      `,
    },
    {
      name: 'arrow function',
      code: stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => value)
            ).subscribe();
          }
        };
      `,
    },
    {
      name: 'arrow function with block',
      code: stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => { return value; })
            ).subscribe();
          }
        };
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/75',
      code: stripIndent`
        import {
          equals,
          takeWhile,
          toPairs,
        } from 'remeda'

        return takeWhile(
          sizesAsArray,
          ([_, width]) => w.innerWidth >= width,
        )
      `,
    },
    {
      name: 'https://github.com/cartant/eslint-plugin-rxjs/issues/93',
      code: stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<{ name: string }>) {
            _source.pipe(
              takeWhile(({ name }) => name)
            ).subscribe();
          }
        };
      `,
    },
    {
      name: 'Array destructuring',
      code: stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string[]>) {
            _source.pipe(
              takeWhile(([name]) => name)
            ).subscribe();
          }
        };
      `,
    },
  ],
  invalid: [
    fromFixture(
      'function without value',
      stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function (value) { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `,
    ),
    fromFixture(
      'function without parameter',
      stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(function () { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `,
    ),
    fromFixture(
      'arrow function without value',
      stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => false)
                        ~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `,
    ),
    fromFixture(
      'arrow function without parameter',
      stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => false)
                        ~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `,
    ),
    fromFixture(
      'arrow function with block without value',
      stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(value => { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `,
    ),
    fromFixture(
      'arrow function with block without parameter',
      stripIndent`
        import { Observable } from "rxjs";
        import { takeWhile } from "rxjs/operators";

        class Something {
          constructor(private _source: Observable<string>) {
            _source.pipe(
              takeWhile(() => { return false; })
                        ~~~~~~~~~~~~~~~~~~~~~~~ [forbidden]
            ).subscribe();
          }
        };
      `,
    ),
  ],
});
