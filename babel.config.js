module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/env',
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      runtime: 'automatic',
    }]];

  const plugins = [
    'react-hot-loader/babel',
    '@babel/plugin-transform-runtime',
  ];

  return {
    presets,
    plugins,
  };
};
