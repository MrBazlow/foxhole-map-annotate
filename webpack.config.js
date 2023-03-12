const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const stylesHandler = MiniCssExtractPlugin.loader;

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  entry: {
    index: ['./frontend/index.js'],
    main: ['./frontend/main.js'],
    admin: ['./frontend/admin.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'public', 'dist'),
    publicPath: "/dist/",
  },
  module: {
    rules: [ 
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          stylesHandler, 'css-loader', 'postcss-loader'],
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]
};