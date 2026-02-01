import { createLegacyRecommendedConfig, createRecommendedConfig } from '../../src/configs/recommended';

describe('recommended', () => {
  const mockPlugin = {};
  const config = createRecommendedConfig(mockPlugin);

  it('should add the rxjs-x plugin', () => {
    expect(config.plugins).toEqual({ 'rxjs-x': mockPlugin });
  });

  it('should use the defaults of each rule', () => {
    expect(config.rules).instanceOf(Object);
    for (const ruleEntry of Object.values(config.rules)) {
      expect(ruleEntry).toEqual('error');
    }
  });

  it('should be named', () => {
    expect(config.name).toEqual('rxjs-x/recommended');
  });
});

describe('recommended-legacy', () => {
  const config = createLegacyRecommendedConfig();

  it('should add the rxjs-x plugin', () => {
    expect(config.plugins).toEqual(['rxjs-x']);
  });

  it('should use the defaults of each rule', () => {
    expect(config.rules).instanceOf(Object);
    for (const ruleEntry of Object.values(config.rules)) {
      expect(ruleEntry).toEqual('error');
    }
  });

  it('should have no other properties', () => {
    const allowedKeys = ['rules', 'plugins'];
    expect(Object.keys(config)).toEqual(allowedKeys);
  });
});
