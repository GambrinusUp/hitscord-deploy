import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginImport from 'eslint-plugin-import';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import prettier from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import path from 'path';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  ...compat.extends('prettier'),
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/dist',
      'src/index.d.ts',
      '**/node_modules',
      '**/*.stories.tsx',
      'eslint.config.js',
      'postcss.config.cjs',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: __dirname,
        projectService: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
  },
  {
    plugins: {
      react,
      'unused-imports': unusedImports,
      prettier,
      'react-hooks': fixupPluginRules(reactHooks),
      'no-relative-import-paths': noRelativeImportPaths,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'type',
            ['builtin', 'external'],
            ['parent', 'sibling', 'index'],
            'internal',
          ],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'react/require-default-props': 'off',
      'import/no-cycle': 'error',

      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: true,
          rootDir: 'src',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'error',
      'react-hooks/rules-of-hooks': 'error',

      'react/jsx-filename-extension': [
        2,
        {
          extensions: ['.ts', '.tsx'],
        },
      ],

      'react/jsx-no-useless-fragment': [
        'error',
        {
          allowExpressions: true,
        },
      ],

      'import/extensions': 'off',
      'import/no-unresolved': 'off',

      curly: ['error', 'multi-line'],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'if',
        },
      ],

      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',

      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      'react/no-array-index-key': 'error',
    },
  },
];
