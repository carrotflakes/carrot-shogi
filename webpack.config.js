var vue = require('vue-loader');

module.exports = {
  entry: {
    build: './src/app.js',
  },
  output: {
    path: __dirname + "/dist",
    filename: "app.js",
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
		  {
		    test: /\.vue$/,
		    loader: vue.withLoaders({
		      // apply babel transform to all javascript
		      // inside *.vue files.
		      js: 'babel?optional[]=runtime'
		    })
		  },
    ]
  },
  externals: {
  	"vue": "Vue",
  },
};

