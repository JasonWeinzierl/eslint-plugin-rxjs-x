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

    for (const [ruleName, rule] of Object.entries(plugin.rules)) {
      const fullRuleName = `${namespace}/${ruleName}`;
      const ruleRec = rule.meta.docs?.recommended;

      if (!ruleRec) {
        // Rule is not part of any config.
        expect(plugin.configs.recommended.rules).not.toHaveProperty(fullRuleName);
        expect(plugin.configs.strict.rules).not.toHaveProperty(fullRuleName);
      } else if (typeof ruleRec === 'string') {
        // Rule is part of a single config.
        if (ruleRec === 'recommended') {
          expect(plugin.configs.recommended.rules).toHaveProperty(fullRuleName);
        } else if (ruleRec === 'strict') {
          expect(plugin.configs.strict.rules).toHaveProperty(fullRuleName);
        } else {
          expect.fail(`Invalid recommended value for rule ${fullRuleName}: ${ruleRec}`);
        }
      } else {
        // Rule is part of several configs.
        if (ruleRec.recommended) {
          expect(plugin.configs.recommended.rules).toHaveProperty(fullRuleName);
        }
        expect(plugin.configs.strict.rules).toHaveProperty(fullRuleName);
      }
    }
  });
});
