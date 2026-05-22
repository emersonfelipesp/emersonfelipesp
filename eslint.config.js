// @ts-check
const nextConfig = require("eslint-config-next");

module.exports = [
  ...nextConfig,
  {
    ignores: [
      ".claude/**",
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
];
