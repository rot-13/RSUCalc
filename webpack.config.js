const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const src = path.resolve(__dirname, 'src');
const build = path.resolve(__dirname, 'build');
const extractSass = new ExtractTextPlugin({
    filename: '[name].css'
});
const plugins = [
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
];
if (isProduction) {
    plugins.unshift(new CleanWebpackPlugin(['build']));
}

const config = {
    context: src,
    entry: ['./js/index.js', './scss/style.scss'],
    output: {
        path: build,
        filename: 'bundle.js'
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
    plugins,
    devServer: {
        open: true,
        openPage: '',
        contentBase: build
    },
    devtool: isProduction ? undefined : 'eval-source-map'
}

module.exports = config;