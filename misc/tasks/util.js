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
exports.setLabel = function (content) {
    if(!content){
        return '<td>'+content+'</td>';
    }
    var labels = content.split(',');
    var html = '<td>',type;
    var mapping = {
        'string':'primary',
        'number':'success',
        'function':'info',
        'boolean':'warning'
    };
    labels.forEach(function (label) {
        label = label.trim();
        if(mapping[label]){
            type = mapping[label];
        }else{
            type = 'default';
        }
        html += '<label class="label label-'+type+'">'+label+'</label>&nbsp;';
    });
    html += '</td>';
    return html;
};

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
            console.log(msg);
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
