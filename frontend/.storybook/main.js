const custom = require('../webpack.config.js');

module.exports = {
  stories: ['../app/heySpace/**/*.stories.[tj]sx'],
  addons: [
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-notes/register',
    '@storybook/addon-links/register',
    'addon-redux',
  ],
  webpackFinal: async (config) => {
    return {
      ...config,
      module: { ...config.module, rules: custom.module.rules },
      resolve: { ...config.resolve, ...custom.resolve },
    };
  },
};
