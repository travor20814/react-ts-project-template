const createConfig = require('./webpack.config.common');

module.exports = createConfig({
  devtool: false,
  mode: 'production',
});
