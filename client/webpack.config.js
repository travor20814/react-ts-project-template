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
const PAGES_PATH = path.resolve(__dirname, 'src/pages');
const THEME_PATH = path.resolve(__dirname, 'src/theme');
const CORE_PATH = path.resolve(__dirname, 'src/core');
const ASSETS_PATH = path.resolve(__dirname, 'src/assets');
const ROUTES_PATH = path.resolve(__dirname, 'src/routes');
const STORE_PATH = path.resolve(__dirname, 'src/store');
const LOCALE_PATH = path.resolve(__dirname, 'src/locales');
const HOOKS_PATH = path.resolve(__dirname, 'src/hooks');
const NODE_MODULES_PATH = path.resolve(__dirname, '..', 'node_modules');

const isProduction = NODE_ENV === 'production';

const sassRegex = /\.(css|scss|sass)$/;
const sassModuleRegex = /\.module\.(css|scss|sass)$/;

const getSassLoaders = (cssOptions) => [
  'style-loader',
  {
    loader: 'css-loader',
    ...(cssOptions ? {
      options: cssOptions,
    } : {}),
  },
  {
    loader: 'sass-loader',
    options: {
      implementation: sass,
      sourceMap: false,
    },
  },
];

module.exports = {
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? false : 'cheap-module-source-map',
  entry: {
    app: [path.resolve(SRC_PATH, 'main.tsx')],
  },
  output: {
    clean: true, // use this instead of using clean-webpack-plugin
    filename: '[name].[contenthash].js',
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
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getSassLoaders(),
      },
      {
        test: sassModuleRegex,
        use: getSassLoaders({
          importLoaders: 1,
          modules: {
            localIdentName: `${isProduction ? '' : '[name]__[local]--'}[hash:base64:5]`,
          },
        }),
      },
      {
        test: /\.(jpe?g|png|gif|svg|mp4|mjpeg|zip)$/i,
        type: 'asset/resource',
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
      typescript: {
        mode: 'write-references',
        configFile: path.resolve(__dirname, 'tsconfig.json'),
      },
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
    loggingDebug: ['sass-loader'], // 允許 sass 使用 @debug
  },
  devServer: {
    open: `http://localhost:${PORT}`,
    static: {
      directory: path.resolve(__dirname, 'dist'),
      watch: true,
    },
    port: PORT,
    hot: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: '/',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@@theme': THEME_PATH,
      '@@pages': PAGES_PATH,
      '@@core': CORE_PATH,
      '@@assets': ASSETS_PATH,
      '@@routes': ROUTES_PATH,
      '@@store': STORE_PATH,
      '@@locales': LOCALE_PATH,
      '@@hooks': HOOKS_PATH,
    },
  },
};
