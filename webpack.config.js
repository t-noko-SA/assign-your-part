/* eslint-disable linebreak-style */
module.exports = {
  context: `${__dirname}/app`,
  entry: './entry',
  output: {
    path: `${__dirname}/public/javascripts`,
    filename: 'bundle.js',
  },
  mode: 'none',
  module: {
    rules: [
      { exclude: [/node_modules/], use: 'babel-loader', test: /\.js?$/ },
      { use: 'style-loader, css-loader', test: /\.css$/ },
      { use: 'url-loader', test: /\.gif$/ },
      { use: 'file-loader', test: /\.(ttf|eot|svg)$/ },
    ],
  },
  resolve: {
    alias: {
      config$: './configs/app-config.js',
    },
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      'bower_components',
      'shared',
      '/shared/vendor/modules',
    ],
  },
};
