/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ["./configs/base.eslintrc.cjs", "./configs/warnings.eslintrc.cjs", "./configs/errors.eslintrc.cjs"],
  ignorePatterns: [
    "**/{node_modules,lib}",
    "**/.eslintrc.js",
    "extensions/**/generated",
    "**/*jest.config.js",
    "**/*.eslintrc.js",
    "**/*.eslintrc.cjs",
    "**/language-server/generated/**",
    "language-server/generated/**",
    "jest.config.cjs",
    "jest.setup.js",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.eslint.json",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // turn import issues off as eslint cannot handle ES modules
    "import/no-unresolved": "off",
  },
};
