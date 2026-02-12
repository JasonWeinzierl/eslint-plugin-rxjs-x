import { stripIndent } from 'common-tags';
import { noInternalRule } from '../../src/rules/no-internal';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({ types: false }).run('no-internal', noInternalRule, {
  valid: [
    {
      name: 'no internal double quote',
      code: stripIndent`
        import { concat } from "rxjs";
        import { map } from "rxjs/operators";
      `,
    },
    {
      name: 'no internal single quote',
      code: stripIndent`
        import { concat } from 'rxjs';
        import { map } from 'rxjs/operators';
      `,
    },
  ],
  invalid: [
    fromFixture(
      'internal double quote',
      stripIndent`
        import { concat } from "rxjs/internal/observable/concat";
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 0]
        import { map } from "rxjs/internal/operators/map";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 1]
      `,
      {
        output: stripIndent`
          import { concat } from "rxjs";
          import { map } from "rxjs/operators";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { concat } from "rxjs";
              import { map } from "rxjs/internal/operators/map";
            `,
          },
          {
            messageId: 'suggest',
            output: stripIndent`
              import { concat } from "rxjs/internal/observable/concat";
              import { map } from "rxjs/operators";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal single quote',
      stripIndent`
        import { concat } from 'rxjs/internal/observable/concat';
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 0]
        import { map } from 'rxjs/internal/operators/map';
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest 1]
      `,
      {
        output: stripIndent`
          import { concat } from 'rxjs';
          import { map } from 'rxjs/operators';
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { concat } from 'rxjs';
              import { map } from 'rxjs/internal/operators/map';
            `,
          },
          {
            messageId: 'suggest',
            output: stripIndent`
              import { concat } from 'rxjs/internal/observable/concat';
              import { map } from 'rxjs/operators';
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal ajax',
      stripIndent`
        import { ajax } from "rxjs/internal/observable/ajax/ajax";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { ajax } from "rxjs";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { ajax } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal fetch',
      stripIndent`
        import { fromFetch } from "rxjs/internal/observable/dom/fetch";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { fromFetch } from "rxjs/fetch";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { fromFetch } from "rxjs/fetch";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal webSocket',
      stripIndent`
        import { webSocket } from "rxjs/internal/observable/dom/webSocket";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { webSocket } from "rxjs/webSocket";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { webSocket } from "rxjs/webSocket";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal observable',
      stripIndent`
        import { concat } from "rxjs/internal/observable/concat";
                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { concat } from "rxjs";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { concat } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal operator',
      stripIndent`
        import { map } from "rxjs/internal/operators/map";
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { map } from "rxjs/operators";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { map } from "rxjs/operators";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal scheduled',
      stripIndent`
        import { scheduled } from "rxjs/internal/scheduled/scheduled";
                                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { scheduled } from "rxjs";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { scheduled } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal scheduler',
      stripIndent`
        import { asap } from "rxjs/internal/scheduler/asap";
                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { asap } from "rxjs";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { asap } from "rxjs";
            `,
          },
        ],
      },
    ),
    fromFixture(
      'internal testing',
      stripIndent`
        import { TestScheduler } from "rxjs/internal/testing/TestScheduler";
                                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [forbidden suggest]
      `,
      {
        output: stripIndent`
          import { TestScheduler } from "rxjs/testing";
        `,
        suggestions: [
          {
            messageId: 'suggest',
            output: stripIndent`
              import { TestScheduler } from "rxjs/testing";
            `,
          },
        ],
      },
    ),
  ],
});
