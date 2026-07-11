import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import prettier from 'eslint-plugin-prettier/recommended'

export default defineConfig(
  // `functions/` is a separate Node/Cloud-Functions project with its own tsconfig
  // and lint concerns — the app's React/alias rules don't apply there.
  { ignores: ['dist', 'functions'] },

  // React
  {
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      'react/display-name': 'off',
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' },
      ],
    },
  },
  reactPlugin.configs.flat['jsx-runtime'],
  reactRefresh.configs.vite,

  // Base: JS + TypeScript recommended rules
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks as Record<string, unknown>,
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { ignoreRestSiblings: true, caughtErrors: 'none' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        { rootDir: 'src', prefix: '@' },
      ],
    },
  },

  // Test files & e2e are not HMR boundaries — the react-refresh rule does not apply.
  {
    files: ['**/*.test.{ts,tsx}', 'test/**/*.{ts,tsx}', 'e2e/**/*.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Prettier (must be last to override formatting rules)
  prettier,
)
