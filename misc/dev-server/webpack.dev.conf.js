var path = require('path');

function resolve(dir) {
    return path.join(__dirname, '..', dir);
}

module.exports = {
    entry: {},
    mode: 'development',
    output: {
        path: resolve('dist'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.scss$/,
            loader: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test: /\.css$/,
            loader: ['style-loader', 'css-loader']
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader'
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader'
        }]
    },
    resolve: {
        extensions: ['.js'],
        modules: [
            resolve('src'),
            resolve('node_modules'),
            resolve('bower_components')
        ]
    },
    plugins: []
};
