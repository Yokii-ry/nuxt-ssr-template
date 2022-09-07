module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: ['@nuxtjs/eslint-config-typescript', 'plugin:nuxt/recommended'],

  globals: {
    API: false,
    Vue: false,
    process: false
  },
  plugins: ['@typescript-eslint'],

  // add your custom rules here
  rules: {
    'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
    'no-else-return': 2, // 如果if语句里面有return,后面不能跟else语句
    'no-func-assign': 2, // 禁止重复的函数声明
    'no-multiple-empty-lines': [1, { max: 2 }], // 空行最多不能超过2行
    'no-redeclare': 2, // 禁止重复声明变量
    'no-trailing-spaces': 1, // 一行结束后面不要有空格
    'no-dupe-args': 2, // 函数参数不能重复
    'no-undef': 1, // 不能有未定义的变量
    camelcase: 0, // 强制驼峰法命名
    eqeqeq: 2, // 必须使用全等
    'no-unreachable': 2, // 不能有无法执行的代码
    'no-use-before-define': 2, // 未定义前不能使用
    'space-before-function-paren': 0, // 函数的参数括号前的空格
    '@typescript-eslint/class-name-casing': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-unused-vars': 'off',
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 10,
        multiline: {
          allowFirstLine: false
        }
      }
    ],
    'arrow-parens': 0,
    'prefer-promise-reject-errors': 0,
    'vue/html-self-closing': 0,
    'no-constant-condition': 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    'import/no-mutable-exports': 0,
    'no-console': 'off',
    'vue/html-closing-bracket-newline': 0,
    indent: 0,
    'standard/computed-property-even-spacing': 'off',
    'import/no-webpack-loader-syntax': 'off',
    'no-unused-expressions': 'off',
    'standard/no-callback-literal': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    curly: 0
  }
}
