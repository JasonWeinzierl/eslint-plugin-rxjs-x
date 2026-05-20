import { fc, test } from '@fast-check/vitest';
import { Linter } from 'eslint';
import rxjsX from '../../src/index';

/**
 * Property-based fuzz tests: verify that rules do not crash (throw unhandled
 * exceptions) when given arbitrary source text.  Parse errors are acceptable
 * outcomes; only internal rule panics are treated as failures.
 *
 * The OpenSSF Scorecard Fuzzing check detects this file via the
 * `from 'fast-check'` import in a TypeScript source file.
 */

// Rules that do not require TypeScript type information can be exercised
// with ESLint's plain Linter (no parserServices needed).
const nonTypeCheckRules = [
  'ban-observables',
  'just',
  'no-ignored-replay-buffer',
  'no-ignored-takewhile-value',
  'no-index',
  'no-internal',
  'no-sharereplay',
  'no-sharereplay-before-takeuntil',
  'prefer-root-operators',
] as const;

const ruleConfig = Object.fromEntries(
  nonTypeCheckRules.map((rule) => [`rxjs-x/${rule}`, 'error'] as const),
);

// The Linter instance is stateless between verify() calls, so reusing it
// across test iterations is safe and avoids repeated construction overhead.
const linter = new Linter();

test.prop([fc.string()])(
  'rules do not throw on arbitrary source text',
  (code) => {
    // Linter.verify() returns messages for errors/warnings; it should never
    // throw for any input.  If it does throw, the test will fail.
    linter.verify(code, {
      plugins: { 'rxjs-x': rxjsX },
      rules: ruleConfig,
    });
  },
);

test.prop([fc.string({ unit: 'grapheme' })])(
  'rules do not throw on arbitrary unicode source text',
  (code) => {
    linter.verify(code, {
      plugins: { 'rxjs-x': rxjsX },
      rules: ruleConfig,
    });
  },
);
