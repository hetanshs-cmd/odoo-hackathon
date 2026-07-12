module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // Enforce conventional commit-friendly code style
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    // No console.log leaking into production — use the logger utility
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // Enforce async/await over callbacks
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
  },
  // Test files are excluded from the lint command (src/**/*.ts only).
  // Full type safety for tests is provided by Jest's ts-jest compilation.
  ignorePatterns: ['dist/', 'dist-tests/', 'node_modules/', 'tests/', '*.js'],
};

