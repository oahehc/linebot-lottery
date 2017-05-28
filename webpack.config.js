'use strict'

const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: path.join(__dirname, 'index.ts')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'commonjs',
        path: path.join(__dirname, 'dist')
    },
    module: {
        loaders: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }]
    },
    node: {
        net: 'empty',
        fs: 'empty'
    }
}