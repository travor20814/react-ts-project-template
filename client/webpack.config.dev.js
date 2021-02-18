const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const createConfig = require('./webpack.config.common');

const PORT = 7776;

module.exports = createConfig({
  mode: 'development',
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: PORT,
    hot: true,
    stats: {
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
    },
    historyApiFallback: true,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
  plugins: [new HotModuleReplacementPlugin()],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  /**
   * Let webpack sourcemap warning shut up, and also turn off source maps, because react-hot-loader.
   * https://github.com/gaearon/react-hot-loader#source-maps
   */
  devtool: false,
});
