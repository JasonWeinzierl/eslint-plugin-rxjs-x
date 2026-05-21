/**
 * @file verify that rules do not crash when given arbitrary source text.
 */
import { fc, test } from '@fast-check/vitest';
import { Linter } from 'eslint';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parser as tseslintParser } from 'typescript-eslint';
import rxjsX from '../../src/index';

const tsconfigRootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const fuzzFilename = path.join(tsconfigRootDir, 'file.ts');
const allRules = Object.fromEntries(
  Object.keys(rxjsX.rules).map((rule) => [`rxjs-x/${rule}`, 'error'] as const),
);

const linter = new Linter();

// Similar to rule-tester.ts setup.
const linterConfig = {
  plugins: { 'rxjs-x': rxjsX },
  rules: allRules,
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

test.prop([
  fc.string(),
])('rules do not throw on arbitrary ASCII text', code => {
  linter.verify(code, linterConfig, fuzzFilename);
});

test.prop([
  fc.string({ unit: 'grapheme' }),
])('rules do not throw on arbitrary Unicode text', code => {
  linter.verify(code, linterConfig, fuzzFilename);
});
