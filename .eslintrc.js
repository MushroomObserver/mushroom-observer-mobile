module.exports = {
  root: true,
  extends: [
    "@react-native-community",
    "plugin:vue/essential",
    "@vue/typescript/recommended", // corrects the 'no-unused-vars'

    "@vue/prettier",
    "@vue/prettier/@typescript-eslint", // for prettier to work
  ],
  rules: {
    // Override our default settings just for this directory
    eqeqeq: "warn",
    strict: "off",
  },
};
