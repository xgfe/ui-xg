var loaderUtils = require('loader-utils');
var path = require('path');

module.exports = function (content) {
    var context = this;
    var options = loaderUtils.getOptions(context) || {};
    var prefix = '';
    var resourcePath = context.resourcePath;
    (options.importFiles || []).forEach(function (filePath) {
        var relaPath = path.relative(path.dirname(resourcePath), filePath);
        prefix += '@import "' + relaPath + '";';
    });
    content = prefix + content;

    return content;
};
