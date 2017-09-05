import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CssoWebpackPlugin from 'csso-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackInlineSourcePlugin from 'html-webpack-inline-source-plugin';
import ReplacePlugin from 'replace-bundle-webpack-plugin';
import path from 'path';
import fs from 'fs';
const ENV = process.env.NODE_ENV || 'development';

module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['.jsx', '.js' ],
    modules: [
      path.resolve(__dirname, "src/lib"),
      path.resolve(__dirname, "node_modules"),
      'node_modules'
    ]
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader?modules&localIdentName=" + (ENV == 'production' ? "[hash:base64:4]" : "[name]__[local]___[hash:base64:5]")
        })
      },
      {
        test: /\.(xml|html|txt|md)$/,
        loader: 'raw-loader'
      }
    ]
  },

  plugins: ([
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV)
    }),
    new ExtractTextPlugin({ filename: 'style.css', allChunks: true, disable: ENV !== 'production' }),
    new HtmlWebpackPlugin({
      template: './index.ejs',
      minify: { collapseWhitespace: true },
      inlineSource: '(.js|.css)$'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ]).concat(ENV === 'production' ? [
    new CssoWebpackPlugin({
      sourceMap: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        drop_console: true,
        unsafe: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true,
        negate_iife: false
      }
    }),
    // strip out babel-helper invariant checks
    new ReplacePlugin([{
      // this is actually the property name https://github.com/kimhou/replace-bundle-webpack-plugin/issues/1
      partten: /throw\s+(new\s+)?[a-zA-Z]+Error\s*\(/g,
      replacement: () => 'return;('
    }])
  ] : []),


  stats: { colors: true },

  node: {
    global: true,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
    setImmediate: false
  },

  devtool: ENV === 'production' ? false : 'cheap-module-eval-source-map',

  devServer: {
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    publicPath: '/',
    contentBase: './src',
    historyApiFallback: true,
    open: false,
    setup(app) {
      var expressWs = require('express-ws')(app);
      var awsIot = require('aws-iot-device-sdk');

      var shadow = awsIot.thingShadow({
         keyPath: '/certificates/iot-Controller.key.pem',
        certPath: '/certificates/iot-Controller.cert.pem',
          caPath: '/certificates/root-CA.cert.pem',
        clientId: 'iot-Controller',
            host: 'a1sjiazdf7qxjd.iot.ap-southeast-2.amazonaws.com'
      });

      shadow.on('connect', function () {
        console.log("Connected. Subscribing...");
        shadow.register("iot-TempSensor01");
      });

      shadow.on('status', function() {
        console.log(arguments);
      });

      // app.ws('/', function(ws, req) {
      //   client.on('message', function (topic, message) {
      //     console.log(message);
      //     ws.send(message);
      //   })
      // })
    }
  }
};
