// @ts-check

/** @type {import('eslint-doc-generator').GenerateOptions} */
export default {
  ignoreConfig: [
    'recommended-legacy',
  ],
  ruleDocTitleFormat: 'desc-parens-prefix-name',
  ruleDocNotices: [
    'deprecated',
    'configs',
    'fixableAndHasSuggestions',
    'requiresTypeChecking',
  ],
};
