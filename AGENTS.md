# AGENTS.md - AI Agents Guide for eslint-plugin-rxjs-x

This file provides guidance for AI coding assistants working on the `eslint-plugin-rxjs-x` project.

## Project Overview

This is an ESLint plugin designed to prevent common issues and enforce best practices when working with [RxJS](https://github.com/ReactiveX/rxjs).
The plugin provides 40+ rules that help developers avoid common pitfalls, memory leaks, and anti-patterns in reactive programming.

### Key Characteristics

- **Package Type**: ESLint plugin for npm distribution  
- **Target Audience**: TypeScript developers using RxJS
- **ESLint Version**: Supports ESLint with flat configuration format
- **Scope**: Reactive programming with RxJS observables, operators, and subjects

### Primary Technologies

- **ESLint**: Modern linting with flat configuration support
- **TypeScript**: Full TypeScript support with strict type checking
- **RxJS**: Target library for reactive programming patterns
- **Vitest**: Modern testing framework for unit tests
- **tsup**: Build tool for dual ESM/CommonJS output

## Historical Context

The history of this project is relevant and should be kept in mind.

1. From 2017 to 2021, a TSLint package named `rxjs-tslint-rules` was maintained by "cartant", a member of the RxJS core team.
2. TSLint was deprecated in 2019.
3. In 2020, cartant created two new packages, `eslint-plugin-rxjs` and `eslint-plugin-rxjs-angular`, and re-implemented the TSLint rules in those packages.
4. In 2021, ESLint began developing a new "flat configuration" system. `eslint-plugin-rxjs` was not updated to support this system.
5. `eslint-plugin-rxjs` stopped publishing updates around 2023.
6. In 2024, this current repository was created as a fork from cartant's `eslint-plugin-rxjs`. This fork was reworked to support the new flat config.

When looking for answers about why rules are implemented in certain ways,
it's worthwhile to investigate previous repositories.
See Resources section for links.

## Project Structure

```txt
eslint-plugin-rxjs-x/
├── src/
│   ├── index.ts            # Main entry point exporting all rules and shared configs
│   ├── configs/            # Shared configurations
│   ├── etc/                # Internalized copy of incompatible npm package `eslint-etc`
│   ├── rules/              # Individual rule implementations
│   └── utils/              # Rule creation helpers and common utilities
├── docs/
│   └── rules/              # Markdown documentation for each rule
├── tests/
│   ├── rules/              # Rule-specific tests
│   ├── configs/            # Shared configuration tests
│   ├── etc/                # `eslint-etc` tests
│   └── utils.test.ts       # Utils tests
├── CHANGELOG.md
├── CONTRIBUTING.md         # Human-facing contribution guide
├── eslint.config.mjs       # Developer-facing ESLint config
├── LICENSE
├── package.json
├── README.md
├── tsup.config.ts          # Build configuration
├── vitest.config.mts       # Test configuration
└── yarn.lock               # Packages lockfile
```

## Architecture & Code Structure

### Core Architecture

- **Entry Point**: `src/index.ts` exports all rules and configurations
- **Rule Structure**: Each rule follows the pattern `src/rules/{rule-name}.ts` with tests in `tests/rules/{rule-name}.test.ts`
- **Utilities**:
  - `src/etc/`: Broad utilities for AST manipulation, type checking and detection
  - `src/utils/`: RxJS-specific utilities and rule creation helpers
- **Configurations**: Two shared configs (`recommended` and `strict`) with different rule sets

### `tsutils` and `ts-api-utils`

As part of forking from the upstream repository,
we replaced dependency `tsutils` with `ts-api-utils`.
Notably, this dependency contains several helpers which reduce common ESLint plugin boilerplate.

#### ts-api-utils Usage Patterns

Instead of checking flags manually...

```ts
return (type.flags & ts.TypeFlags.Union) !== 0;
```

...use the utility:

```ts
import * as tsutils from 'ts-api-utils';

return tsutils.isUnionType(type);
```

For historical consistency, alias imports of `ts-api-utils` as `tsutils`.

### `eslint-etc`

As part of forking from the upstream repository,
we brought the utilities of an external dependency, `eslint-etc`, into this repository.
The utilities inside `etc/` may thus appear more broad that this repository needs.

#### etc Usage Patterns

`getTypeServices` is useful for observable checks.

```ts
const { couldBeObservable, couldBeSubject } = getTypeServices(context);
```

`is.ts` wraps around checks against `AST_NODE_TYPES`.
In rule implementations, use these helpers instead of directly importing `AST_NODE_TYPES`.

### `typescript-eslint`

This project uses `typescript-eslint` to build rules.
The base ESLint utilities should not be used when `typescript-eslint` alternatives are available.

The following aliases should be used in order to indicate continuity with the basic ESLint utilities.

```ts
import {
    TSESTree as es,
    TSESLint as eslint,
} from '@typescript-eslint/utils';
```

Instead of using ESLint's parser services...

```ts
const parserServices = context.sourceCode?.parserServices;
```

...use the wrapper to get the type-aware parser service:

```ts
import { ESLintUtils } from '@typescript-eslint/utils';

const parserServices = ESLintUtils.getParserServices(context);
```

### Other Import Aliases

Alias `typescript` as `ts`:

```ts
import * as ts from 'typescript';
```

### Internal Utilities (`src/utils/`)

- **`ruleCreator`**: Consistent rule creation with proper TypeScript types and package URLs

### Rule Implementation Pattern

```ts
import { TSESTree as es } from '@typescript-eslint/utils';
import { getTypeServices } from '../etc';
import { ruleCreator } from '../utils';

const defaultOptions: readonly {
  allowSomething?: boolean;
}[] = [];

export const ruleName = ruleCreator({
  defaultOptions,
  meta: {
    docs: {
      description: 'Rule description',
      recommended: 'recommended', // or 'strict' or false or { recommended: true, strict: {...stricterOptions} }
      requiresTypeChecking: true, // if TypeScript info needed (e.g importing getTypeServices)
    },
    messages: {
      messageId: 'Error message with {{interpolation}}',
    },
    schema: [ // JSON schema for options
      {
        properties: {
          allowSomething: { type: 'boolean', description: 'Allows something.', default: false },
        },
        type: 'object',
      },
    ],
    type: 'problem' | 'suggestion' | 'layout', // "problem" identifies code that causes errors or unexpected behavior; "suggestion" identifies something that could be done better; "layout" is stylistic outside the AST
    fixable: 'code' | 'whitespace', // if auto-fixable
    hasSuggestions: true, // if reported issues have suggestions
  },
  name: 'rule-name',
  create: (context) => {
    const { couldBeObservable, couldBeType } = getTypeServices(context);
    
    // Rule logic in small readable functions here.
    
    return {
      CallExpression(node) {
        // Rule functions called here.
      }
    };
  },
});
```

Note that the above example will be very costly, performance-wise,
because `CallExpression` will check every single call expression in a codebase.
Prefer using more specific CSS selectors to narrow what ESLint checks.

### Testing Utilities

- Import `stripIndent` from `common-tags` to avoid whitespace problems.
- For unit tests of "valid" cases, no other utilities should be necessary.
- **`/tests/etc/fromFixture`**: Consistent unit test creation with visual error builder for "invalid" cases
  - Typically, ESLint plugin unit tests must specify `line`, `column`, `endLine`, `endColumn` to assert on messages and suggestions.
  - Instead, this project uses a custom utility to visually indicate where messages and suggestions are expected. A continuous line of tilde characters (`~`) is used to indicate start and end.
  - The position of these tildes is sensitive; tests will fail if even one character is off.
  - Following the line of tildes, a custom bracketed annotation is expected: `[{id} {data} suggest {indices}]`.
    - `{id}`: a messageId as defined in the rule implementation.
    - `{data}`: optional. A JSON object indicating message interpolation parameters.
    - `suggest`: optional. Indicates that a suggestion should be expected.
    - `{indices}`: optional. If there are multiple suggestions passed into `fromFixture`, these zero-indexed, space-separated indices indicate which suggestion is expected.
    - If no interpolation or suggestions are expected, the annotation may be as simple as `[forbidden]`.
- **`/tests/rule-tester`**: Consistent test suite creation with parameters for customizing test setup

### Testing Pattern

```ts
import { stripIndent } from 'common-tags';
import { myRule } from '../../src/rules/my-rule';
import { fromFixture } from '../etc';
import { ruleTester } from '../rule-tester';

ruleTester({
  types: true, // if type checking is necessary
  jsx: false, // if JSX rule
}).run('my-rule', myRule, {
  valid: [
    // Simple test using default options:
    stripIndent`
      // test title here
    `,
    // Test with custom options:
    { 
      code: stripIndent`
        // another test title
      `,
      options: [{ setting: true }] ,
      only: true, // development-time flag to focus this rule. Revert before finished
    },
  ],
  invalid: [
    // Simple test using default options:
    fromFixture(
      stripIndent`
        // test for error
        const source = of(42);
                       ~~ [forbidden]
      `,
    ),
    // Test with fixers and suggestions:
    fromFixture(
      stripIndent`
        // another test
        const source = of<number>(42);
                       ~~~~~~~~~~ [forbidden suggest]
      `,
      {
        // Expected output after applying the auto-fixer (if any)
        output: stripIndent`
          // another test
          const source = of(42);
        `,
        // Expected output(s) after applying a suggestion (if any)
        suggestions: [
          {
            messageId: 'mySuggest',
            output: stripIndent`
              // another test
              const source = of(42);
            `,
          },
        ],
      },
    ),
  ],
});
```

## Development Workflow

Throughout this process, pay attention to type checking and linting warnings/errors.

### Test-Driven Development (TDD)

Write tests first.

1. Every rule must have comprehensive test coverage at: `tests/rules/{rule-name}.test.ts`.
2. Cover both valid and invalid cases. Include edge cases and complex RxJS patterns.
3. Use the recommended patterns, as documented above.

### Rule Development Process

After writing tests, implement the rule:

1. Implement the rule at: `src/rules/{rule-name}.ts`.
2. Export the rule as `{ruleName}Rule` (e.g., `noAsyncSubscribeRule`).
3. Use the recommended patterns, as documented above.
4. Import and add to the rules object in `src/index.ts`.
5. If it should be enabled by default, add to appropriate config in `src/configs/`.

### Documentation Process

This project uses `eslint-doc-generator`, so some portions are automatically maintained.

1. Write documentation at: `docs/rules/{rule-name}.md`.
    1. Insert `<!-- end auto-generated rule header -->` for the header.
        - Note that a "start" tag is not required for this; the document's first line is considered the "start".
        - The first line must start with a pound sign (`#`) character.
    2. After the header, describe the rule.
    3. The "Rule details" section contains examples of **incorrect** and **correct** code. Add comments sparingly.
    4. The "Options" section is only allowed if the rule has options.
        - Generate a table of all options with `<!-- begin auto-generated rule options list -->` and `<!-- end auto-generated rule options list -->`.
        - Further detail is only required if options are complex and need examples.
    5. The "When Not To Use It" section contains reasons, if any, why the rule may not be used.
        - If type information is required for the rule, include the following reason: "Type checked lint rules are more powerful than traditional lint rules, but also require configuring type checked linting.".
    6. The optional "Further reading" section contains external links to related information.
    7. The optional "Related To" section contains repository links to any related rules.
    8. The "Resources" section contains repository links to "Rule source" and "Test source".
2. Execute `yarn build` and then `yarn docs` to populate automatic documentation.

## Development Commands

This project uses `yarn` for scripts.
Read [CONTRIBUTING.md](CONTRIBUTING.md) for documentation.

- Use `yarn test --run` to run tests once; optionally add a filename for filtered tests.
- Use `yarn lint-js --fix` to automatically fix lint issues in code.

## Semantic Commit Messages

This project uses semantic commits.
Read [CONTRIBUTING.md](CONTRIBUTING.md) for documentation.
Agents may look through historical git commits to gain context.

## Resources

- [cartant/eslint-plugin-rxjs](https://github.com/cartant/eslint-plugin-rxjs) (original ESLint plugin)
- [cartant/rxjs-tslint-rules](https://github.com/cartant/rxjs-tslint-rules) (original TSLint rules)

---

This documentation should be kept updated as the architecture and practices evolve.
When making significant changes, update this guide to help future AI agents understand the codebase.
