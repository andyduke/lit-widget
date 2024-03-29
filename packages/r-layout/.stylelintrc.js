module.exports = {
  extends: [
    'stylelint-config-standard-scss',
  ],
  rules: {
    'import-notation': null,
    'media-feature-range-notation': 'prefix',
    'no-descending-specificity': null,
    'at-rule-empty-line-before': null,
    'declaration-empty-line-before': null,
    'rule-empty-line-before': 'always',
    'declaration-block-no-redundant-longhand-properties': null,
    'shorthand-property-no-redundant-values': null,
    'font-family-name-quotes': 'always-unless-keyword',
    'alpha-value-notation': 'number',
    'color-hex-length': 'long',
    'color-function-notation': 'legacy',
    'comment-empty-line-before': null,
    'scss/comment-no-empty': null,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/dollar-variable-empty-line-before': null,
    'scss/at-rule-conditional-no-parentheses': null,
    'scss/at-if-no-null': null,

    'at-rule-name-case': 'lower',
    'at-rule-name-space-after': 'always-single-line',
    'at-rule-semicolon-newline-after': 'always',

    //'block-closing-brace-newline-after': 'always',
    'block-closing-brace-newline-before': 'always',
    'block-opening-brace-newline-after': 'always',
    'block-opening-brace-space-before': 'always',
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'declaration-colon-newline-after': 'always-multi-line',
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'function-comma-space-after': 'always',
    'function-comma-space-before': 'never',
    'function-parentheses-space-inside': 'never',
    'function-whitespace-after': 'always',
    'media-feature-colon-space-after': 'always',
    'media-feature-colon-space-before': 'never',

    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    'media-query-list-comma-newline-after': 'always-multi-line',
    'media-query-list-comma-space-after': 'always-single-line',
    'media-query-list-comma-space-before': 'never',

    'selector-attribute-brackets-space-inside': 'never',
    'selector-attribute-operator-space-after': 'never',
    'selector-attribute-operator-space-before': 'never',

    'selector-combinator-space-after': 'always',
    'selector-combinator-space-before': 'always',
    //'selector-list-comma-newline-after': 'always',
    'selector-list-comma-space-before': 'never',
    'selector-max-empty-lines': 0,
    'selector-pseudo-class-case': 'lower',
    'selector-pseudo-class-parentheses-space-inside': 'never',
    'selector-pseudo-element-case': 'lower',
    'selector-pseudo-element-colon-notation': 'double',
    'selector-type-case': 'lower',
    'string-quotes': 'double',
    'unit-case': 'lower',
    'value-keyword-case': 'lower',
    'value-list-comma-newline-after': 'always-multi-line',
    'value-list-comma-space-after': 'always-single-line',
    'value-list-comma-space-before': 'never',
  }
}