const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve(dir) {
    return path.resolve(__dirname, '..', dir);
}

module.exports = {
    mode: 'none',
    entry: {
        'ui-xg': './src/ui-xg.js'
    },
    output: {
        path: resolve('dist2'),
        filename: 'js/[name].js',
        // library: 'ui-xg',
        // libraryTarget: 'umd',
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        alias: {
        }
    },
    externals: {
        angular: 'angular'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [resolve('src')],
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                minimize: false
            }
        }, {
            test: /\.css$/,
            // exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: { sourceMap: false }
                }]
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [
                MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        sourceMap: false
                    }
                }, {
                    loader: 'sass-loader',
                    options: {
                    }
                }]
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/ui-xg.css'
        })
    ]
};
