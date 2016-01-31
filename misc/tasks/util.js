var glob = require("glob"),
    fs = require('fs'),
    vfs = require('vinyl-fs'),
    spawnSync = require('child_process').spawnSync;

exports.formateDate = function () {
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth()+1,
        day = d.getDate();
    return year + '-' + addZero(month) + '-' + addZero(day);
};
function addZero(num){
    return (num>9?'':'0')+num;
}
exports.matchFile =  function (blobstr,options) {
    return glob.sync(blobstr, options);
};
exports.isExists = fs.existsSync;
exports.readFile = function (filePath) {
    if(fs.existsSync(filePath)){
        return fs.readFileSync(filePath,'utf-8').toString();
    }
    return '';
};
exports.writeFile = function (filePath,data) {
    return fs.writeFileSync(filePath,data,'utf-8');
};
exports.formatCode = function (col,code){
    col = col.toLowerCase();
    code = code.toLowerCase();
    var code_reg = /<code>(\w+)<\/code>/,
        match,result='';
    if(col === 'type'){
        code.split('|').forEach(function (type) {
            type = type.trim();
            if(type){
                match = type.match(code_reg);
                if(match && match[1]){
                    result += '<label class="label label-default label-'+match[1]+'">'+match[1]+'</label>&nbsp;';
                }else{
                    result += '<label class="label label-default label-'+type+'">'+type+'</label>&nbsp;';
                }
            }
        });
        return result;
    }
    return code;
};
exports.mkdir = fs.mkdirSync;

exports.deploy = function () {
    if(hasPagesBranch()){
        spawnSync('git',['branch','-D','gh-pages']);
    }
    spawnSync('git', ['checkout','--orphan','gh-pages']);
    vfs.src('dist/docs/**/*')
        .pipe(vfs.dest('.'))
        .on('end',function(){
            var msg = formatCommitMsg();
            spawnSync('git', ['rm','-rf','.']);
            spawnSync('git', ['add','.']);
            spawnSync('git', ['commit','-m',msg]);
            //spawnSync('git', ['push','--force','origin','gh-pages']);
            //console.log(msg);
            //spawnSync('git', ['checkout','master']);
            //spawnSync('git',['branch','-D','gh-pages']);
        });

    function hasPagesBranch(){
        var branchs = spawnSync('git',['branch']).stdout.toString().split('\n');
        var reg = /\bgh\-pages$/;
        return branchs.some(function(branch){
            return branch && reg.test(branch);
        });
    }
    function formatCommitMsg(){
        var d = new Date(),
            year = d.getFullYear(),
            month = d.getMonth()+1,
            day = d.getDate(),
            hour = d.getHours(),
            min = d.getMinutes(),
            seconds = d.getSeconds();
        return 'Site updated: '+year + '-' + addZero(month) + '-' + addZero(day)+' '+
            addZero(hour)+':'+addZero(min)+':'+addZero(seconds);
    }
};
