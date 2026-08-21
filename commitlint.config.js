export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
    'header-max-length': [0],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'docs',
        'feat',
        'fix',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
