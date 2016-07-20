module.exports = {
  entry: [
    './static/js/app.js'
  ],
  output: {
    path: __dirname + '/static/dist',
    filename: 'app.js',
  },
  module: {
    loaders: [
      // ES6 javascript, jsx
      {
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
        loaders: ['babel-loader'],
      },
      // SASS
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }
    ]
  },
  eslint: {
    configFile: '.eslintrc',
  },
}