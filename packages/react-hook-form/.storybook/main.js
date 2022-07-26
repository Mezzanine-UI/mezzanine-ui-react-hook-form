const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const ROOT_PATH = path.resolve(__dirname, '..', '..', '..');
const PACKAGES_PATH = path.resolve(ROOT_PATH, 'packages');
const CORE_PATH = path.resolve(PACKAGES_PATH, 'core');
const REACT_HOOK_FORM_PATH = path.resolve(PACKAGES_PATH, 'react-hook-form');
const TS_CONFIG = path.resolve(REACT_HOOK_FORM_PATH, 'tsconfig.dev.json');

module.exports = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    {
      name: 'storybook-addon-sass-postcss',
      options: {
        sassLoaderOptions: {
          implementation: require('sass'),
        },
      },
    },
  ],
  features: {
    storyStoreV7: true,
  },
  typescript: {
    check: false, // this will run fork-ts-checker-webpack-plugin which only available in webpack4
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: TS_CONFIG,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        const { parent } = prop;

        if (parent) {
          if (
            /node_modules/.test(parent.fileName) ||
            /**
             * For windows
             */
            parent.fileName === 'react/index.d.ts'
          ) {
            return false;
          }
        }

        return true;
      },
    },
  },
  reactOptions: {
    fastRefresh: true,
  },
  core: {
    builder: 'webpack5',
  },
  webpackFinal: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@mezzanine-ui/react-hook-form-core': path.resolve(CORE_PATH, 'src'),
    };
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        configFile: TS_CONFIG,
      }),
    ];
    config.stats = {
      ...config.stats,
      assets: false,
      children: false,
      chunks: false,
      chunkModules: false,
      colors: true,
      entrypoints: false,
      hash: false,
      modules: false,
      timings: false,
      version: false,
    };

    return config;
  }
};
