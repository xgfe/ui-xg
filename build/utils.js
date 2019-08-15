const path = require('path');

exports.resolve = function resolve(dir) {
    return path.resolve(__dirname, '..', dir);
};
