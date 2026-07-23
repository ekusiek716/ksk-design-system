module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(ksk-design-system|radix-ui|@radix-ui|iconsax-reactjs)/)",
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/style-mock.cjs",
    "^ksk-design-system/(preset|styles(?:\\.css)?|glass|tokens/(?:primitive|semantic|typography|categorical)|themes/(?:default|blue|orange|green|violet|cobalt))$":
      "<rootDir>/style-mock.cjs",
  },
}
