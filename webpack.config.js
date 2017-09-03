const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const build = path.resolve(__dirname, 'build')

const config = {
    context: src,
    entry: './js/index.js',
    output: {
        path: build,
        filename: 'bundle.js',
        publicPath: '/RSUCalc/'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: src,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html')
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'images'),
                to: 'images'
            }
        ])
    ],
    devServer: {
        open: true,
        openPage: '',
        contentBase: build
    },
    devtool: process.env.NODE_ENV === 'production' ? undefined : 'eval-source-map'
}

module.exports = config;