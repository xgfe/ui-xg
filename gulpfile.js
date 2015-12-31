var gulp = require('gulp'),
    _ = require('./tasks/util'),
    html2js = require('gulp-ng-html2js'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    uglify = require('gulp-uglify'),
    nano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    rimraf = require('gulp-rimraf'),
    karmaServer = require('karma').Server;

var config = {
    modules: [],
    srcModules:[],
    tplModules:[],
    moduleName:'ui.fugu',
    pkg: require('./package.json'),
    src :'src',
    dist: 'dist',
    filename: 'ui-fugu'
};
config.getBanner = function(){
    var banner = ['/*', ' * '+config.pkg.name+'', ' * Version: '+config.pkg.version+' - '+ _.formateDate()+'', ' * License: '+config.pkg.license+'', ' */\n'].join('\n'),
        modules = 'angular.module("'+config.moduleName+'", ["'+config.moduleName+'.tpls",'+config.srcModules.toString()+']);\n',
        tplmodules = 'angular.module("'+config.moduleName+'.tpls", ['+config.tplModules.toString()+']);\n';
    return banner + modules + tplmodules;
};

gulp.task('eslint', function () {
    gulp.src(['gulpfile.js','tasks/util.js',config.src+ '/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
/**
 * karma 执行测试用例，可单独测试某一个模块
 */
gulp.task('karma',['html2js'], function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
/**
 * 将angular的模板文件转化为js
 */
gulp.task('html2js', function () {
    return gulp.src(config.src + '/*/templates/*.html')
        .pipe(html2js({
            useUglify:true,
            moduleName:function(filename,subpath){
                return subpath.replace(/^src\//,'');
            },
            templateUrl: function (filename) {
                return 'templates/'+filename;
            },
            rename:function(fileName){
                return fileName+'.js';
            }
        }))
        .pipe(gulp.dest(config.src));
});
var foundModules = {};
function findModule(name) {
    if (foundModules[name]) {
        return;
    }
    foundModules[name] = true;

    function enquote(str) {
        return '"' + str + '"';
    }
    function getTplModule(str){
        return enquote(str.replace(new RegExp('^'+config.src+'\/'),''));
    }
    var module = {
        name: name,
        moduleName: enquote(config.moduleName + '.' + name),
        srcFiles: _.matchFile(config.src + '/' + name + '/*.js'),
        cssFiles: _.matchFile(config.src + '/' + name + '/*.css'),
        tplFiles: _.matchFile(config.src + '/'+name+'/templates/*.html'),
        tpljsFiles: _.matchFile(config.src + '/'+name+'/templates/*.html.js'),
        tplModules: _.matchFile(config.src + '/'+name+'/templates/*.html').map(getTplModule),
        dependencies: dependenciesForModule(name)
    };
    module.dependencies.forEach(findModule);
    config.modules.push(module);
}
function dependenciesForModule(name) {
    var deps = [];
    _.matchFile(config.src+'/' + name + '/*.js').map(_.readFile).forEach(function (contents) {
        var moduleDeclIndex = contents.indexOf('angular.module(');
        var depArrayStart = contents.indexOf('[', moduleDeclIndex);
        var depArrayEnd = contents.indexOf(']', depArrayStart);
        var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
        var depName;
        dependencies.split(',').forEach(function (dep) {
            if (dep.indexOf(config.moduleName+'.') > -1) {
                depName = dep.trim().replace(config.moduleName+'.', '').replace(/['"]/g, '');
                if (deps.indexOf(depName) < 0) {
                    deps.push(depName);
                    deps = deps.concat(dependenciesForModule(depName));
                }
            }
        });
    });
    return deps;
}
/**
 * 获取所有模块
 */
gulp.task('modules',['html2js'], function () {
    _.matchFile(config.src + '/*/').forEach(function (dir) {
        findModule(dir.split('/')[1]);
    });
    config.modules.forEach(function (module) {
        config.srcModules.push(module.moduleName);
        config.tplModules = config.tplModules.concat(module.tplModules);
    });
});
/**
 * 拼接js和css
 */
gulp.task('concat',['concat:js','concat:css']);
gulp.task('sass', function () {
    return gulp.src(config.src + '/*/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.src));
});
gulp.task('concat:css',['sass'], function () {
    return gulp.src(config.src + '/*/*.css')
    .pipe(concat(config.filename + '.css'))
    .pipe(gulp.dest('./'+config.dist+'/css/'));
});
gulp.task('concat:js',['modules'], function () {
    function getFileMapping(){
        var mapping = [];
        config.modules.forEach(function (module) {
            mapping = mapping.concat(module.srcFiles);
        });
        return mapping;
    }
    var srcFile = [];
    srcFile = srcFile.concat(getFileMapping());
    srcFile.push(config.src + '/*/templates/*.js');
    return gulp.src(srcFile)
        .pipe(concat(config.filename + '.js'))
        .pipe(insert.transform(function (contents) {
            return config.getBanner() + contents;
        }))
        .pipe(gulp.dest('./'+config.dist+'/js'));
});
/**
 * 压缩js和css
 */
gulp.task('uglify',['concat'], function () {
    gulp.src(config.dist+'/css/*.css')
        .pipe(nano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist+'/css'));

    gulp.src(config.dist+'/js/*.js')
        .pipe(uglify({
            output:{
                comments: function (comments,token) {
                    return token.line === 1;
                }
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist+'/js'));

});
/**
 * 清空构建目录
 */
gulp.task('clean', function() {
    return gulp.src(config.dist, { read: false })
        .pipe(rimraf());
});
gulp.task('test',['html2js','karma']);
gulp.task('build',['clean','eslint','concat','uglify']);
gulp.task('default',['test','build']);
