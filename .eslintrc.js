module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:vue/essential',
    '@vue/typescript/recommended', // corrects the 'no-unused-vars'

    '@vue/prettier',
    '@vue/prettier/@typescript-eslint', // for prettier to work
  ],
  plugins: ['simple-import-sort'],
  rules: {
    // Override our default settings just for this directory
    eqeqeq: 'warn',
    strict: 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
