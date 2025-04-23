/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  /*
   * "off" 或 0    ==>  关闭规则
   * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
   * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
   */
  rules: {
    'vue/comment-directive': 'off', // 处理index.html
    // 'vue/multi-word-component-names': '0', // 关闭名称校验
    'no-var': 'error' // 要求使用 let 或 const 而不是 var
    // 'prefer-const': 'error', // 首选const
    // eqeqeq: 'error' // 首选 ===
  }
};
