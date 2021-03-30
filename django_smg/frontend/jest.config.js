module.exports = {
  moduleNameMapper: {
    // stub all files
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file_mock.js",

    // module aliases
    "^Common(.*)$": "<rootDir>/src/components/common$1",
    "^Actions(.*)$": "<rootDir>/src/actions$1",
    "^Test(.*)$": "<rootDir>/src/test$1",
    "^Styles$": "<rootDir>/src/components/common/styles.jsx",
  },
};
