import { createRecommendedConfig } from '../../src/configs/recommended';

describe('recommended', () => {
  const mockPlugin = {};
  const config = createRecommendedConfig(mockPlugin);

  it('should add the rxjs-x plugin', () => {
    expect(config.plugins).toEqual({ 'rxjs-x': mockPlugin });
  });

  it('should default no-sharereplay to allowConfig: true', () => {
    expect(config.rules).instanceOf(Object);
    expect(config.rules['rxjs-x/no-sharereplay']).toEqual(['error', { allowConfig: true }]);
  });
});
