/* eslint-disable */
const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isPublish = process.env.MODE === 'publish';
const publicPath = isPublish ? '/ui-xg/' : '/';

module.exports = {
    mode: isPublish ? 'production' : 'none',
    entry: {
        main: './examples/main.js'
    },
    output: {
        path: utils.resolve('publish/ui-xg'),
        filename: `assets/js/[name]${isPublish ? '.[hash]' : ''}.js`,
        publicPath
    },
    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            automaticNameMaxLength: 30,
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            utils.resolve('src'),
            utils.resolve('node_modules')
        ],
        alias: {
            app: utils.resolve('examples/app/app.js'),
            '@': utils.resolve('.'), // root dir
            'src': utils.resolve('src'),
            'examples': utils.resolve('examples')
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }, {
            test: /\.md$/,
            use: [{
                loader: 'html-loader'
            }, {
                loader: 'markdown-loader',
                options: {
                    /* your options here */
                }
            }]
        }, {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                minimize: false
            }
        }, {
            test: /\.css$/,
            // exclude: /node_modules/,
            use: [{
                loader: isPublish ? MiniCssExtractPlugin.loader : 'style-loader'
            }, {
                loader: 'css-loader',
                options: { sourceMap: false }
            }]
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [{
                loader: isPublish ? MiniCssExtractPlugin.loader : 'style-loader'
            }, {
                loader: 'css-loader',
                options: {
                    sourceMap: false
                }
            }, {
                loader: 'sass-loader',
                options: {
                }
            }]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1,
                name: 'assets/img/[name].[hash:5].[ext]'
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1,
                name: 'assets/fonts/[name].[hash:5].[ext]'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'examples/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[hash].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new webpack.DefinePlugin({
            PUBLISH_TO_GITHUB: JSON.stringify(isPublish && process.env.TARGET === 'github'),
        })
    ],
    devServer: {
        historyApiFallback: {
            rewrites: [
                { from: /^\/app\//, to: publicPath }
            ]
        }
    }
};

