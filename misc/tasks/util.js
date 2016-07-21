var glob = require('glob'),
    fs = require('fs');

exports.formateDate = function () {
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate();
    return year + '-' + addZero(month) + '-' + addZero(day);
};
function addZero(num) {
    return (num > 9 ? '' : '0') + num;
}
exports.matchFile = function (blobstr, options) {
    return glob.sync(blobstr, options);
};
exports.isExists = fs.existsSync;
exports.readDir = fs.readdirSync;
exports.readFile = function (filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf-8').toString();
    }
    return '';
};
exports.writeFile = function (filePath, data) {
    return fs.writeFileSync(filePath, data, 'utf-8');
};
exports.formatCode = function (col, code) {
    col = col.toLowerCase();
    code = code.toLowerCase();
    var codeReg = /<code>(\w+)<\/code>/,
        match, result = '';
    if (col === 'type') {
        code.split('|').forEach(function (type) {
            type = type.trim();
            if (type) {
                match = type.match(codeReg);
                if (match && match[1]) {
                    result += '<label class="label label-default label-' + match[1] + '">' + match[1] + '</label>&nbsp;';
                } else {
                    result += '<label class="label label-default label-' + type + '">' + type + '</label>&nbsp;';
                }
            }
        });
        return result;
    }
    return code;
};
exports.mkdir = fs.mkdirSync;
exports.createModuleFiles = function (module) {
    var modulePath = process.cwd() + '/src/' + module, template;
    if (exports.isExists(modulePath)) {
        exports.log('[INFO]:' + module + ' exists\n');
        return;
    }
    var data = {
        module: module,
        humpModule: module[0].toUpperCase() + module.slice(1),
        dashModule: module.replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
        }),
        date: exports.formateDate()
    };
    exports.mkdir(modulePath);
    template = exports.readFile(__dirname + '/module.js.tpl');
    exports.writeFile(modulePath + '/' + module + '.js', replaceTemplate(template));
    exports.mkdir(modulePath + '/docs');
    template = exports.readFile(__dirname + '/docs-index.html.tpl');
    exports.writeFile(modulePath + '/docs/index.html', replaceTemplate(template));
    template = exports.readFile(__dirname + '/docs-script.js.tpl');
    exports.writeFile(modulePath + '/docs/script.js', replaceTemplate(template));
    template = exports.readFile(__dirname + '/docs-readme.md.tpl');
    exports.writeFile(modulePath + '/docs/readme.md', replaceTemplate(template));
    exports.mkdir(modulePath + '/templates');
    exports.writeFile(modulePath + '/templates/' + module + '.html', '<div></div>');
    exports.mkdir(modulePath + '/test');
    template = exports.readFile(__dirname + '/test.js.tpl');
    exports.writeFile(modulePath + '/test/' + module + '.spec.js', replaceTemplate(template));
    function replaceTemplate(template) {
        var reg = /<%([^%>]+)%>/g;
        return template.replace(reg, function (match, $1) {
            return data[$1.trim()];
        });
    }
};

exports.log = function (msg) {
    process.stdout.write(msg + '\n');
};
