/* eslint angular/log: 0 */
/* eslint angular/foreach: 0 */
/* eslint no-console: 0 */

var childProcess = require('child_process');
var execSync = childProcess.execSync;
var spawnSync = childProcess.spawnSync;
var path = require('path');

var LINT_BIN = path.resolve(__dirname, '../../node_modules/.bin/linter');
var CONFIG_PATH = path.resolve(__dirname, '../../.lintrc');

var files = getDiffFiles();
if (!files.length) {
    quit();
}
/* 待检查的文件相对路径 */
var lintFiles = files.filter(function (file) {
    return toBeLint(file.subpath);
}).map(function (file) {
    return file.path;
});
if (!lintFiles.length) {
    quit();
}

var argv = [];
argv = argv.concat(lintFiles);
argv = argv.concat(['-c', CONFIG_PATH]);
var result = spawnSync(LINT_BIN, argv, {stdio: 'inherit'});
quit(result.status);

/**
 * 获取所有变动的文件,包括增(A)删(D)改(M)重命名(R)复制(C)等
 * @param [type] {string} - 文件变动类型
 * @returns {Array}
 */
function getDiffFiles(type) {
    var DIFF_COMMAND = 'git diff --cached --name-status HEAD';
    var root = process.cwd();
    var files = execSync(DIFF_COMMAND).toString().split('\n');
    var result = [];
    type = type || 'admrc';
    var types = type.split('').map(function (item) {
        return item.toLowerCase();
    });
    files.forEach(function (file) {
        if (!file) {
            return;
        }
        var temp = file.split(/[\n\t]/);
        var status = temp[0].toLowerCase();
        var filepath = root + '/' + temp[1];
        var extName = path.extname(filepath).slice(1);

        if (types.length && ~types.indexOf(status)) {
            result.push({
                // 文件变更状态-AMDRC
                status: status,
                // 文件绝对路径
                path: filepath,
                // 文件相对路径
                subpath: temp[1],
                // 文件后缀名
                extName: extName
            });
        }
    });
    return result;
}
function toBeLint(subpath) {
    return subpath.match(/^src\//) || subpath.match(/^misc\//) || subpath === 'gulpfile.js';
}
/**
 * 退出
 * @param errorCode
 */
function quit(errorCode) {
    if (errorCode) {
        console.log('Commit aborted.');
    }
    process.exit(errorCode || 0);
}
