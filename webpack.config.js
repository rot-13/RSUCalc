const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const src = path.resolve(__dirname, 'src');
const build = path.resolve(__dirname, 'build');
const extractSass = new ExtractTextPlugin({
    filename: '[name].css'
});

const config = {
    context: src,
    entry: ['./js/index.js', './scss/style.scss'],
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
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [ {loader: 'css-loader'}, {loader: 'sass-loader'} ]
                })
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/'
                }
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
        ]),
        extractSass
    ],
    devServer: {
        open: true,
        openPage: '',
        contentBase: build
    },
    devtool: process.env.NODE_ENV === 'production' ? undefined : 'eval-source-map'
}

module.exports = config;