export function escapeRegExp(text: string): string {
  // https://stackoverflow.com/a/3561711/6680611
  return text.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
