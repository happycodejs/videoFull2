module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@babel/eslint-parser', // 添加这行
  parserOptions: {
    requireConfigFile: false, // 添加这行
    ecmaVersion: 2021, // 添加这行
    sourceType: 'module', // 添加这行
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // 允许在 .tsx 和 .ts 文件中使用 JSX
    // 完全关闭文件扩展名检查
    'react/jsx-filename-extension': 'off',
    // 关闭嵌套组件警告
    'react/no-unstable-nested-components': 'off',
    // 关闭最大长度限制
    'max-len': 'off',

    // 允许使用 console
    'no-console': 'off',

    // 关闭强制使用解构
    'prefer-destructuring': 'off',

    // 允许多个空行
    'no-multiple-empty-lines': 'off',

    // 允许未使用的变量（开发时比较有用）
    'no-unused-vars': 'warn',

    // React 相关规则放松
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react-native/no-inline-styles': 'off',

    // 箭头函数可以省略 return
    'arrow-body-style': 'off',

    // 允许空箭头函数
    'no-empty-function': 'off',

    // 允许嵌套三元运算符
    'no-nested-ternary': 'off',

    // 放宽对象属性换行要求
    'object-curly-newline': 'off',

    // 允许++ --运算符
    'no-plusplus': 'off',

    // 允许在 case 子句中声明变量
    'no-case-declarations': 'off',
  },
};
