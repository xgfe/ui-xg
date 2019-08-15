const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    mode: 'none',
    entry: {
        main: './examples/main.js'
    },
    output: {
        path: utils.resolve('site/ui-xg'),
        filename: 'assets/[name].js',
        publicPath: '/ui-xg/'
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
                loader: 'style-loader'
            }, {
                loader: 'css-loader',
                options: { sourceMap: false }
            }]
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            use: [{
                loader: 'style-loader'
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
                name: 'img/[name].[ext]'
            }
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1,
                name: 'fonts/[name].[hash:5].[ext]'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'examples/index.html'
        })
    ]
};

