module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.m?[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/.pnpm/(?!(ksk-design-system|radix-ui|iconsax-reactjs|@radix-ui\\+[^@]+)@)",
    "node_modules/(?!.pnpm|ksk-design-system|radix-ui|@radix-ui|iconsax-reactjs)",
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/style-mock.cjs",
    "^ksk-design-system/(preset|styles(?:\\.css)?|glass|tokens/(?:primitive|semantic|typography|categorical)|themes/(?:default|blue|orange|green|violet|cobalt))$":
      "<rootDir>/style-mock.cjs",
  },
}
