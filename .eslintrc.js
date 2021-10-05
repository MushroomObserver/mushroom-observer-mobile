module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['simple-import-sort'],
  rules: {
    // Override our default settings just for this directory
    eqeqeq: 'warn',
    strict: 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
};
