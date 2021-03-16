module.exports = {
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file_mock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/style_mock.js",
  },
};
