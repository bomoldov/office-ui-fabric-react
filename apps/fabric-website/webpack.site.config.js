'use strict';

/** Note: this require may need to be fixed to point to the build that exports the gulp-core-build-webpack instance. */
let webpackTaskResources = require('@microsoft/web-library-build').webpack.resources;
let webpack = webpackTaskResources.webpack;
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let path = require('path');

// Create an array of configs, prepopulated with a debug (non-minified) build.
let configs = [
  createConfig(false)
];

// Create a production config if applicable.
if (process.argv.indexOf('--production') > -1) {
  configs.push(createConfig(true));
}

// Helper to create the config.
function createConfig(isProduction) {
  let minFileNamePart = isProduction ? '.min' : '';
  let webpackConfig = {

    entry: {
      'fabric-site': './lib/root.js'
    },

    output: {
      path: path.join(__dirname, '/dist'),
      publicPath: 'https://static2.sharepointonline.com/files/fabric/fabric-website/dist/',
      filename: `[name]${minFileNamePart}.js`,
      chunkFilename: `fabric-site-[name]${minFileNamePart}.js`
    },

    devServer: {
      stats: 'none'
    },

    externals: [
      {
        'react': 'React'
      },
      {
        'react-dom': 'ReactDOM'
      },
    ],

    module: {
      noParse: [/autoit.js/],

      loaders: [
        {
          test: /\.js$/,
          loader: 'source-map-loader',
          enforce: 'pre'
        }
      ],
    },

    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'fabric-site.stats.html',
        openAnalyzer: false
      })
    ]
  };

  if (isProduction) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }));
  }

  return webpackConfig;
}

module.exports = configs;