import fs from 'node:fs/promises';
import path from 'node:path';
import plugin from '../src';

function isSourceFile(value: string): boolean {
  const ext = path.extname(value);
  return ext === '.ts' && !value.endsWith('.d.ts');
}

describe('package', () => {
  const pkg = path.resolve('src');

  it('exists', () => {
    expect(plugin).toBeDefined();
  });

  it('has every rule', async () => {
    const files = await fs.readdir(path.resolve(pkg, 'rules'));
    for (const file of files.filter(isSourceFile)) {
      const ruleName = path.basename(file, path.extname(file));
      expect(plugin.rules).toHaveProperty(ruleName);
    }
  });

  it('exports all configs', async () => {
    const files = await fs.readdir(path.resolve(pkg, 'configs'));
    for (const file of files.filter(isSourceFile)) {
      const configName = path.basename(file, path.extname(file));
      expect(plugin.configs).toHaveProperty(configName);
    }
  });

  it('has configs only for rules included in the plugin', () => {
    if (!plugin.configs) {
      expect.fail('No configs found.');
    }

    const namespace = 'rxjs-x';
    for (const config of Object.values(plugin.configs)) {
      if (!config.rules) {
        continue;
      }
      for (const ruleName of Object.keys(config.rules)) {
        expect(plugin.rules).toHaveProperty(ruleName.slice(namespace.length + 1));
      }
    }
  });

  it('has rules flagged according to their configs', () => {
    if (!plugin.configs) {
      expect.fail('No configs found.');
    }

    const namespace = 'rxjs-x';
    const recommendedRules = plugin.configs.recommended.rules;
    const strictRules = plugin.configs.strict.rules;

    for (const [ruleName, rule] of Object.entries(plugin.rules)) {
      const fullRuleName = `${namespace}/${ruleName}`;
      const ruleRec = rule.meta.docs?.recommended;

      if (!ruleRec) {
        // Rule is not part of any config.
        expect(recommendedRules).not.toHaveProperty(fullRuleName);
        expect(strictRules).not.toHaveProperty(fullRuleName);
      } else if (typeof ruleRec === 'string') {
        // Rule is part of a single config.
        if (ruleRec === 'recommended') {
          expect(recommendedRules).toHaveProperty(fullRuleName);
        } else if (ruleRec === 'strict') {
          expect(strictRules).toHaveProperty(fullRuleName);
          expect(strictRules[fullRuleName as keyof typeof strictRules]).toBe('error');
          expect(recommendedRules).not.toHaveProperty(fullRuleName);
        } else {
          expect.fail(`Invalid recommended value for rule ${fullRuleName}: ${ruleRec}`);
        }
      } else {
        // Rule is part of several configs.
        if (ruleRec.recommended) {
          expect(recommendedRules).toHaveProperty(fullRuleName);
        } else {
          expect(recommendedRules).not.toHaveProperty(fullRuleName);
        }
        expect(strictRules).toHaveProperty(fullRuleName);
        expect(strictRules[fullRuleName as keyof typeof strictRules]).toBeInstanceOf(Array);
        expect(strictRules[fullRuleName as keyof typeof strictRules][1]).toEqual(ruleRec.strict[0]);
      }
    }
  });
});
