const config = {
  printWidth: 80,
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.css"],
      options: {
        plugins: [
          "@trivago/prettier-plugin-sort-imports",
          // https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
          "prettier-plugin-tailwindcss", // MUST come last
        ],
        importOrder: [
          "^react(-.+)?",
          "^[^.][@a-z]\/?.+$",
          "^@[^/].+$",
          "^@/.+$",
          "^[./]",
        ],
        // importOrderSeparation: true,
        // importOrderSortSpecifiers: true,
        importOrderGroupNamespaceSpecifiers: true,
        // importOrderCaseInsensitive: true,
        singleQuote: true,
        trailingComma: "es5",
      },
    },
    {
      files: ["*.md"],
      options: {
        proseWrap: "always",
      },
    },
  ],
};
export default config;
