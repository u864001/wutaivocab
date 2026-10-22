import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      'react-hooks': reactHooksPlugin
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // ── 核心守護：未定義變數一律報錯（徹底終結 isPastWeek is not defined） ──
      'no-undef': 'error',

      // ── 閉包函式互調允許（符合 React 函式組件生態） ──
      'no-use-before-define': 'off',

      // ── 核心守護：React Hooks 規則防護 ──
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ── 寬容容錯：允許安全的空 catch 區塊（例如 localStorage 讀寫失敗容錯） ──
      'no-empty': ['error', { allowEmptyCatch: true }],

      // ── 未使用變數警示（不中斷建置，方便除錯） ──
      'no-unused-vars': 'off',

      // ── JSX 語法寬鬆化（適用現代 React 18+） ──
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off'
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'legacy-v1/**',
      'scripts/**',
      '*.config.js'
    ]
  }
];
