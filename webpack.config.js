const path = require('path'),
    htmlPlugin = require('html-webpack-plugin'),
    cleanPlugin = require('clean-webpack-plugin'),
    workboxPlugin = require('workbox-webpack-plugin'),
    copyWebpackPlugin = require('copy-webpack-plugin'),
    dist = 'dist';

module.exports = {
  entry: {
    index: './src/app.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, dist)
  },
  plugins: [
    new cleanPlugin([dist]),
    new htmlPlugin({
      filename: 'index.html',
      title: 'Offline Demo'
    }),
    new copyWebpackPlugin([{
      from: 'manifest.json',
      toType: 'file'
    }]),
    new workboxPlugin.GenerateSW({
      importWorkboxFrom: 'local',
      swDest: 'sw.js',
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [{
        urlPattern: new RegExp('http://localhost:8080/message'),
        handler: 'staleWhileRevalidate',
        options: {
          broadcastUpdate: {
          channelName: 'message-update-channel',
          }
        }
      }]
    })
  ]
};
