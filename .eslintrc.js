module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    '@react-native-community',
    'plugin:vue/essential',
    '@vue/typescript/recommended', // corrects the 'no-unused-vars'

    '@vue/prettier',
    '@vue/prettier/@typescript-eslint', // for prettier to work
  ],
  rules: {
    // Override our default settings just for this directory
    eqeqeq: 'warn',
    strict: 'off',
    'prettier/prettier': 2, // Means error
  },
};
