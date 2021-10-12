const path = require('path');
const {
  DefinePlugin,
  IgnorePlugin,
} = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const sass = require('sass');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const PORT = 7776;
// const SERVER_PORT_CONFIG = 7777;
const BUNDLE_ANALYZE_PORT = 7778;

const {
  ANALYZE = 'false',
  NODE_ENV = 'development',
  // SERVER_PORT = NODE_ENV === 'production' ? '' : `:${SERVER_PORT_CONFIG}`,
  // HTTP_HOST = NODE_ENV === 'production' ? '' : 'http://localhost',
  // GRAPHQL_HOST = `${HTTP_HOST}${SERVER_PORT}/graphql`,
  // STATIC_HOST = `${HTTP_HOST}${SERVER_PORT}/files`,
} = process.env;

const SRC_PATH = path.resolve(__dirname, 'src');
const NODE_MODULES_PATH = path.resolve(__dirname, '..', 'node_modules');

const isProduction = NODE_ENV === 'production';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: 'inline-source-map',
  entry: {
    app: [path.resolve(SRC_PATH, 'main.tsx')],
  },
  output: {
    clean: true, // use this instead of using clean-webpack-plugin
    filename: '[id].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // HTML 中的引用起始路徑
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
        exclude: [NODE_MODULES_PATH],
        include: [SRC_PATH],
      },
      {
        test: /\.(css|s[ac]ss)$/,
        include: [SRC_PATH],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: `${isProduction ? '' : '[name]__[local]--'}[hash:base64:5]`,
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sass, // 強制使用 sass (原名: dart-sass) (而不是 node-sass)
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        include: [NODE_MODULES_PATH],
        exclude: [SRC_PATH],
      },
      {
        test: /\.(jpe?g|png|gif|svg|mp4|mjpeg|zip)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]',
            },
          },
        ],
        include: [SRC_PATH],
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100000,
              name: '[id].[ext]',
            },
          },
        ],
        include: [SRC_PATH],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      NODE_ENV: DefinePlugin.runtimeValue(() => `'${NODE_ENV}'`, true),
      // GRAPHQL_HOST: DefinePlugin.runtimeValue(() => `'${GRAPHQL_HOST}'`, true),
      // STATIC_HOST: DefinePlugin.runtimeValue(() => `'${STATIC_HOST}'`, true),
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: { mode: 'write-references' },
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(SRC_PATH, 'index.html'),
      inject: 'body',
      filename: 'index.html',
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
        quoteCharacter: "'",
        removeComments: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: ANALYZE === 'true' ? 'server' : 'disabled',
      analyzerHost: 'localhost',
      analyzerPort: BUNDLE_ANALYZE_PORT,
    }),
  ],
  optimization: {
    moduleIds: isProduction ? 'deterministic' : 'named',
    minimize: isProduction,
    emitOnErrors: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            comparisons: false,
          },
          mangle: true,
          output: {
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          priority: 1,
        },
      },
    },
  },
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
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
      watch: true,
    },
    port: PORT,
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      '@@core': path.resolve(SRC_PATH, 'core'),
    },
  },
};
