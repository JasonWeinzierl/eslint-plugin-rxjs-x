export function createRegExpForWords(
  config: string | string[],
): RegExp | undefined {
  if (!config?.length) {
    return undefined;
  }
  const flags = 'i';
  if (typeof config === 'string') {
    return new RegExp(config, flags);
  }
  const words = config;
  const joined = words.map((word) => String.raw`(\b|_)${word}(\b|_)`).join('|');
  return new RegExp(`(${joined})`, flags);
}
