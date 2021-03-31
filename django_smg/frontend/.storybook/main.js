const songMakerConfig = require("../webpack.config");

module.exports = {
  webpackFinal: (config) => {
    const newConf = {
      ...config,
      resolve: {
        ...config.resolve,
        alias: songMakerConfig.resolve.alias,
      },
    };
    return newConf;
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
};

