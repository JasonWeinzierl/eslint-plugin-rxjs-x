import fs from 'node:fs/promises';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import rxjsX from '../src';

function isSourceFile(value: string): boolean {
  const ext = path.extname(value);
  return ext === '.ts' && !value.endsWith('.d.ts');
}

describe('package', () => {
  const pkg = path.resolve('src');

  it('exists', () => {
    expect(rxjsX).toBeDefined();
  });

  it('has every rule', async () => {
    const files = await fs.readdir(path.resolve(pkg, 'rules'));
    for (const file of files.filter(isSourceFile)) {
      const ruleName = path.basename(file, path.extname(file));
      expect(rxjsX.rules).toHaveProperty(ruleName);
    }
  });

  it('exports all configs', async () => {
    const files = await fs.readdir(path.resolve(pkg, 'configs'));
    for (const file of files.filter(isSourceFile)) {
      const configName = path.basename(file, path.extname(file));
      expect(rxjsX.configs).toHaveProperty(configName);
    }
  });

  it('has configs only for rules included in the plugin', () => {
    if (!rxjsX.configs) {
      expect.assertions(1);
      expect.fail('No configs found.');
    }
    expect.assertions(Object.values(rxjsX.configs).flatMap(c => Object.keys(c.rules || {})).length);

    const namespace = 'rxjs-x';
    for (const config of Object.values(rxjsX.configs)) {
      if (!config.rules) {
        continue;
      }
      for (const ruleName of Object.keys(config.rules)) {
        expect(rxjsX.rules).toHaveProperty(ruleName.slice(namespace.length + 1));
      }
    }
  });

  it.for(Object.keys(rxjsX.rules))('includes rule %s in configurations based on meta.docs.recommended', (ruleName, { expect }) => {
    const rule = rxjsX.rules[ruleName as keyof typeof rxjsX.rules];
    const namespace = 'rxjs-x';
    const fullRuleName = `${namespace}/${ruleName}`;

    const ruleRec = rule.meta.docs?.recommended;

    if (!ruleRec) {
      // Rule is not included in any configuration.
      expect.assertions(2);
      expect(rxjsX.configs.recommended.rules).not.toHaveProperty(fullRuleName);
      expect(rxjsX.configs.strict.rules).not.toHaveProperty(fullRuleName);
    } else if (typeof ruleRec === 'string') {
      // Rule specifies only a configuration name.
      expect.assertions(3);
      expect(ruleRec).toMatch(/^(recommended|strict)$/);
      if (ruleRec === 'recommended') {
        expect(rxjsX.configs.recommended.rules).toHaveProperty(fullRuleName);
      } else {
        expect(rxjsX.configs.recommended.rules).not.toHaveProperty(fullRuleName);
      }

      // Strict configuration always includes all recommended rules.
      // Not allowed to specify non-default options since rule only specifies a configuration name.
      expect(rxjsX.configs.strict.rules).toHaveProperty(fullRuleName, expect.any(String));
    } else if (typeof ruleRec !== 'object' || !('strict' in ruleRec && Array.isArray(ruleRec.strict))) {
      // Rule has invalid recommended configuration.
      expect.assertions(1);
      expect.fail(`Unexpected type for 'rule.meta.docs.recommended': '${typeof ruleRec}'.`);
    } else {
      // Rule specifies non-default options for strict.
      expect.assertions(2);
      if ('recommended' in ruleRec) {
        expect(rxjsX.configs.recommended.rules).toHaveProperty(fullRuleName);
      } else {
        expect(rxjsX.configs.recommended.rules).not.toHaveProperty(fullRuleName);
      }
      expect(rxjsX.configs.strict.rules).toHaveProperty(fullRuleName, [expect.any(String), ruleRec.strict[0]]);
    }
  });
});
