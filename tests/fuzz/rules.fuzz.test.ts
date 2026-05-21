import { fc, test } from '@fast-check/vitest';
import { Linter } from 'eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parser as tseslintParser } from 'typescript-eslint';
import rxjsX from '../../src/index';

/**
 * Property-based fuzz tests: verify that rules do not crash (throw unhandled
 * exceptions) when given arbitrary source text.  Parse errors are acceptable
 * outcomes; only internal rule panics are treated as failures.
 *
 * The OpenSSF Scorecard Fuzzing check detects this file via the
 * `from 'fast-check'` import in a TypeScript source file.
 *
 * All rules are exercised using the same @typescript-eslint/parser +
 * project service setup as the regular rule tests (see tests/rule-tester.ts),
 * so type-aware rules also run through TypeScript's type checker.
 */

const tsconfigRootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

// Use the same virtual filename as @typescript-eslint/rule-tester's default for .ts files
// (see defaultFilenames.ts in the rule-tester source).
const fuzzFilename = path.join(tsconfigRootDir, 'file.ts');

const ruleConfig = Object.fromEntries(
  Object.keys(rxjsX.rules).map((rule) => [`rxjs-x/${rule}`, 'error'] as const),
);

// The Linter instance is stateless between verify() calls, so reusing it
// across test iterations is safe and avoids repeated construction overhead.
// The TypeScript project service is initialized on the first call; on each
// subsequent call the parser internally updates the in-memory file content
// via TypeScript's openClientFile(path, codeContent) API, so the TypeScript
// program always reflects the current code string passed to verify().
const linter = new Linter();

const linterConfig = {
  plugins: { 'rxjs-x': rxjsX },
  rules: ruleConfig,
  languageOptions: {
    parser: tseslintParser,
    parserOptions: {
      projectService: {
        allowDefaultProject: ['*.ts*'],
        defaultProject: 'tsconfig.json',
      },
      tsconfigRootDir,
    },
  },
};

test.prop([fc.string()])(
  'rules do not throw on arbitrary source text',
  (code) => {
    // Linter.verify() returns messages for errors/warnings; it should never
    // throw for any input.  If it does throw, the test will fail.
    linter.verify(code, linterConfig, fuzzFilename);
  },
);

test.prop([fc.string({ unit: 'grapheme' })])(
  'rules do not throw on arbitrary unicode source text',
  (code) => {
    linter.verify(code, linterConfig, fuzzFilename);
  },
);
