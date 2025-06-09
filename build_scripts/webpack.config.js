/*
 * Copyright (c) 2002-2021 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Neo4j is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const path = require('path')
const getPlugins = require('./webpack-plugins')
const rules = require('./webpack-rules')
const helpers = require('./webpack-helpers')
const webpack = require('webpack')

module.exports = {
  mode: helpers.isProduction ? 'production' : 'development',
  node: {
    fs: 'empty'
  },
  entry: [path.resolve(helpers.browserPath, 'index.tsx')],
  output: {
    filename: 'neo4j-browser.bundle.js', // Single bundle output
    publicPath: '',
    path: helpers.buildPath,
    globalObject: 'this'
  },
  module: {
    rules
  },
  resolve: {
    symlinks: false,
    alias: {
      'react-dom': '@hot-loader/react-dom',
      'project-root': path.resolve(__dirname, '../'),
      services: path.resolve(helpers.sourcePath, 'shared/services'),
      'browser-services': path.resolve(helpers.browserPath, 'services'),
      shared: path.resolve(helpers.sourcePath, 'shared'),
      'browser-components': path.resolve(helpers.browserPath, 'components'),
      'browser-hooks': path.resolve(helpers.browserPath, 'hooks'),
      browser: path.resolve(helpers.browserPath),
      'browser-styles': path.resolve(helpers.browserPath, 'styles'),
      'neo4j-arc/graph-visualization$': path.resolve(
        helpers.sourcePath,
        'neo4j-arc/graph-visualization'
      ),
      'neo4j-arc/common$': path.resolve(helpers.sourcePath, 'neo4j-arc/common'),
      'neo4j-arc/cypher-language-support$': path.resolve(
        helpers.sourcePath,
        'neo4j-arc/cypher-language-support'
      )
    },
    extensions: ['.tsx', '.ts', '.js']
  },
  optimization: {
    splitChunks: false,
    runtimeChunk: false
  },
  plugins: [
    ...getPlugins(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })
  ],
  devtool: helpers.isProduction ? false : 'eval-cheap-module-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    hot: !helpers.isProduction
  }
}
