const path = require('path'); // Импортируем модуль "path" для работы с путями файлов
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js', // Точка входа для сборки проекта

  output: {
    path: path.resolve(__dirname, './build'), // Путь для выходного файла сборки
    filename: 'bundle.[contenthash].js', // Имя выходного файла сборки
    
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ]
  },
  
  plugins: [
    new HtmlPlugin({
        template: 'public/index.html',
      }),
    new CopyPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              ignore: ['**/index.html'],
            },
          },
        ],
      }),
    ],

  mode: 'development', // Режим сборки
  devtool: 'source-map',
};