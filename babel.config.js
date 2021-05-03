module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ],
    "@babel/preset-typescript"
  ],
  plugins: [
    ["module-resolver", {
      alias: {
        "@controllers": "./src/controllers",
        "@tests": "./src/tests",
        "@utils": "./src/utils"
      }
    }]
  ],
  ignore: [
    "**/*.test.ts"
  ]
}