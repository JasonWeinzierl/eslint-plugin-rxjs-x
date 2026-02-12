import { stripIndent } from 'common-tags';
import { noTopromiseRule } from '../../src/rules/no-topromise';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: true }).run('no-topromise', noTopromiseRule, {
  valid: [
    {
      name: 'no toPromise',
      code: stripIndent`
        import { of, Subject } from "rxjs";
        const a = of("a");
        a.subscribe(value => console.log(value));
      `,
    },
    {
      name: 'non-observable toPromise',
      code: stripIndent`
        const a = {
          toPromise() {
            return Promise.resolve("a");
          }
        };
        a.toPromise().then(value => console.log(value));
      `,
    },
    {
      name: 'no imports',
      code: stripIndent`
        class Observable {
          toPromise() {
            return Promise.resolve("a");
          }
        }
        const a = new Observable();
        a.toPromise().then(value => console.log(value));
      `,
    },
  ],
  invalid: [
    fromFixture(
      'observable toPromise',
      stripIndent`
        import { of } from "rxjs";
        const a = of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1 2]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFromWithDefault',
            output: stripIndent`
              import { of, lastValueFrom } from "rxjs";
              const a = of("a");
              lastValueFrom(a, { defaultValue: undefined }).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              import { of, lastValueFrom } from "rxjs";
              const a = of("a");
              lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              import { of, firstValueFrom } from "rxjs";
              const a = of("a");
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'subject toPromise',
      stripIndent`
        import { Subject } from "rxjs";
        const a = new Subject<string>();
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1 2]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFromWithDefault',
            output: stripIndent`
              import { Subject, lastValueFrom } from "rxjs";
              const a = new Subject<string>();
              lastValueFrom(a, { defaultValue: undefined }).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              import { Subject, lastValueFrom } from "rxjs";
              const a = new Subject<string>();
              lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              import { Subject, firstValueFrom } from "rxjs";
              const a = new Subject<string>();
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'weird whitespace',
      stripIndent`
        import { of } from "rxjs";
        const a = { foo$: of("a") };
        a
          .foo$
          .toPromise().then(value => console.log(value))
           ~~~~~~~~~ [forbidden suggest 0 1 2]
          .catch(error => console.error(error));
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFromWithDefault',
            output: stripIndent`
              import { of, lastValueFrom } from "rxjs";
              const a = { foo$: of("a") };
              lastValueFrom(a
                .foo$, { defaultValue: undefined }).then(value => console.log(value))
                .catch(error => console.error(error));
            `,
          },
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              import { of, lastValueFrom } from "rxjs";
              const a = { foo$: of("a") };
              lastValueFrom(a
                .foo$).then(value => console.log(value))
                .catch(error => console.error(error));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              import { of, firstValueFrom } from "rxjs";
              const a = { foo$: of("a") };
              firstValueFrom(a
                .foo$).then(value => console.log(value))
                .catch(error => console.error(error));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'lastValueFrom already imported',
      stripIndent`
        import { lastValueFrom as lvf, of } from "rxjs";
        const a = of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1 2]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFromWithDefault',
            output: stripIndent`
              import { lastValueFrom as lvf, of } from "rxjs";
              const a = of("a");
              lvf(a, { defaultValue: undefined }).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              import { lastValueFrom as lvf, of } from "rxjs";
              const a = of("a");
              lvf(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              import { lastValueFrom as lvf, of, firstValueFrom } from "rxjs";
              const a = of("a");
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'rxjs not already imported',
      stripIndent`
        import { fromFetch } from "rxjs/fetch";

        const a = fromFetch("https://api.some.com");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1 2]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFromWithDefault',
            output: stripIndent`
              import { fromFetch } from "rxjs/fetch";
              import { lastValueFrom } from "rxjs";

              const a = fromFetch("https://api.some.com");
              lastValueFrom(a, { defaultValue: undefined }).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              import { fromFetch } from "rxjs/fetch";
              import { lastValueFrom } from "rxjs";

              const a = fromFetch("https://api.some.com");
              lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              import { fromFetch } from "rxjs/fetch";
              import { firstValueFrom } from "rxjs";

              const a = fromFetch("https://api.some.com");
              firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
    fromFixture(
      'namespace import',
      stripIndent`
        import * as Rx from "rxjs";
        const a = Rx.of("a");
        a.toPromise().then(value => console.log(value));
          ~~~~~~~~~ [forbidden suggest 0 1 2]
      `,
      {
        suggestions: [
          {
            messageId: 'suggestLastValueFromWithDefault',
            output: stripIndent`
              import * as Rx from "rxjs";
              const a = Rx.of("a");
              Rx.lastValueFrom(a, { defaultValue: undefined }).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestLastValueFrom',
            output: stripIndent`
              import * as Rx from "rxjs";
              const a = Rx.of("a");
              Rx.lastValueFrom(a).then(value => console.log(value));
            `,
          },
          {
            messageId: 'suggestFirstValueFrom',
            output: stripIndent`
              import * as Rx from "rxjs";
              const a = Rx.of("a");
              Rx.firstValueFrom(a).then(value => console.log(value));
            `,
          },
        ],
      },
    ),
  ],
});
