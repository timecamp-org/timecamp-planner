module.exports = (api) => {
  api.cache(true);

  const isDev = process.env.NODE_ENV === 'development';

  return {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['>0.25%', 'not ie 11', 'not op_mini all', 'not dead'],
          },
          // "modules": false, // webpack 3 should allow this, function hoisting feature
          useBuiltIns: 'usage',
          corejs: 3,
          debug: isDev ? true : false,
          bugfixes: true,
          loose: true,
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: [
      ['@babel/plugin-transform-flow-strip-types'],
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 3,
        },
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-object-rest-spread', { loose: true }],
      ['@babel/plugin-syntax-dynamic-import'],
      ['@babel/plugin-proposal-export-default-from'],
      ['macros'],
    ].filter(Boolean),
    ignore: ['app/HeySpaceMobile', 'node_modules'],
  };
};
