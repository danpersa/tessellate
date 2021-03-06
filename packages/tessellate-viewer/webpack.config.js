const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')

/**
 * Externalize node_modules.
 */
function nodeModules() {
  return fs.readdirSync('node_modules')
           .filter(dir => ['.bin'].indexOf(dir) === -1)
           .reduce((modules, m) => {
             modules[m] = 'commonjs2 ' + m
             return modules
           }, {})
}

module.exports = {
  entry: './src/server.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: 'server.js'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
        presets: [
          'latest-minimal'
        ],
        plugins: [
          'syntax-flow',
          'transform-flow-strip-types'
        ]
      }
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: './static/', to: 'static'
    }])
  ],
  externals: nodeModules(),
  node: {
    __dirname: false
  }
}
