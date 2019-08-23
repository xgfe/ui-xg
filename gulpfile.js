/* eslint-disable angular/log */
/* eslint-disable no-console */
var gulp = require('gulp'),
    runSequence = require('run-sequence').use(gulp),
    _ = require('./misc/tasks/util'),
    html2js = require('gulp-angular-html2js'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    rimraf = require('gulp-rimraf'),
    KarmaServer = require('karma').Server,
    conventionalChangelog = require('gulp-conventional-changelog'),
    babel = require('gulp-babel'),
    path = require('path');

var config = {
    modules: [],
    srcModules: [],
    tplModules: [],
    moduleName: 'ui.xg',
    pkg: require('./package.json'),
    scene: 'scene',
    src: 'src',
    dist: 'dist',
    filename: 'ui-xg',
    repo: 'https://github.com/xgfe/ui-xg.git',
    branch: 'gh-pages'
};
config.getBanner = function () {
    var banner = [
        '/*',
        ' * ' + config.pkg.name + '',
        ' * Version: ' + config.pkg.version + ' - ' + _.formateDate() + '',
        ' * License: ' + config.pkg.license + '', ' */\n'
    ].join('\n');
    var modules = 'angular.module("' + config.moduleName +
        '", ["' + config.moduleName + '.tpls",' +
        config.srcModules.toString() + ']);\n';
    var tplmodules = 'angular.module("' + config.moduleName + '.tpls", [' +
        config.tplModules.toString() + ']);\n';

    return banner + modules + tplmodules;
};

gulp.task('eslint', function () {
    return gulp.src(
        [
            'gulpfile.js',
            'misc/tasks/util.js',
            'misc/test-lib/matchers.js',
            config.src + '/**/*.js',
            '!' + config.src + '/*/templates/*.html.js'
        ])
        .pipe(eslint())
        .pipe(eslint.formatEach())
        .pipe(eslint.failOnError());
});
/**
 * karma 执行测试用例，可单独测试某一个模块
 */
var karmaConfig = {
    set: function (configuration) {
        this.configuration = configuration;
    },
    LOG_DISABLE: 'OFF',
    LOG_ERROR: 'ERROR',
    LOG_WARN: 'WARN',
    LOG_INFO: 'INFO',
    LOG_DEBUG: 'DEBUG'
};
gulp.task('karma', ['html2js'], function (done) {
    var module = process.argv.slice(3).map(function (argv) {
        return argv.slice(1);
    })[0];
    var configPath = __dirname + '/karma.conf.js';
    var configuration = {
        configFile: configPath,
        singleRun: true
    };
    var index;
    if (module) {
        require(configPath)(karmaConfig);
        configuration = karmaConfig.configuration;
        ['src/*/*.js', 'src/*/templates/*.js', 'src/*/test/*.js'].forEach(function (file) {
            index = configuration.files.indexOf(file);
            configuration.files.splice(index, 1);
        });
        var deps = [module].concat(dependenciesForModule(module, {}));
        var globExp = '+(' + deps.join('|') + ')';
        configuration.files.push('src/' + globExp + '/*.js');
        configuration.files.push('src/' + globExp + '/templates/*.js');
        configuration.files.push('src/' + globExp + '/test/*.js');
    }
    new KarmaServer(configuration, done).start();
});
gulp.task('clean:html2js', function () {
    return gulp.src(config.src + '/**/*.html.js', { read: false })
        .pipe(rimraf());
});
/**
 * 将angular的模板文件转化为js
 */
gulp.task('html2js', ['clean:html2js'], function () {
    return gulp.src(config.src + '/*/templates/*.html')
        .pipe(html2js({
            moduleName: function (filename, subpath) {
                return subpath.replace(/^src\//, '');
            },
            templateUrl: function (filename) {
                return 'templates/' + filename;
            },
            rename: function (fileName) {
                return fileName + '.js';
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

    function getTplModule(str) {
        return enquote(str.replace(new RegExp('^' + config.src + '/'), ''));
    }

    var module = {
        name: name,
        moduleName: enquote(config.moduleName + '.' + name),
        srcFiles: _.matchFile(config.src + '/' + name + '/*.js'),
        cssFiles: _.matchFile(config.src + '/' + name + '/*.css'),
        scssFiles: _.matchFile(config.src + '/' + name + '/*.scss'),
        tplFiles: _.matchFile(config.src + '/' + name + '/templates/*.html'),
        tpljsFiles: _.matchFile(config.src + '/' + name + '/templates/*.html.js'),
        tplModules: _.matchFile(config.src + '/' + name + '/templates/*.html').map(getTplModule),
        dependencies: dependenciesForModule(name, {}),
        docs: {
            md: '',
            html: '',
            js: '',
            css: ''
        }
    };
    module.dependencies.forEach(findModule);
    config.modules.push(module);
}
function dependenciesForModule(name, depModuleMapping) {
    if (depModuleMapping[name]) {
        return [];
    }
    depModuleMapping[name] = true;
    var deps = [];
    _.matchFile(config.src + '/' + name + '/*.js').map(_.readFile).forEach(function (contents) {
        var moduleDeclIndex = contents.indexOf('angular.module(');
        var depArrayStart = contents.indexOf('[', moduleDeclIndex);
        var depArrayEnd = contents.indexOf(']', depArrayStart);
        var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
        var depName;
        dependencies.split(',').forEach(function (dep) {
            if (dep.indexOf(config.moduleName + '.') > -1) {
                depName = dep.trim().replace(config.moduleName + '.', '').replace(/['"]/g, '');
                if (deps.indexOf(depName) === -1 && depName !== name) {
                    deps.push(depName);
                    dependenciesForModule(depName, depModuleMapping).forEach(function (value) {
                        if (deps.indexOf(value) === -1 && value !== name) {
                            deps.push(value);
                        }
                    });
                }
            }
        });
    });
    return deps;
}
/**
 * 获取所有模块
 */
gulp.task('modules', function () {
    var modulesPaths = config.src + '/*/';
    config.modules = [];
    _.matchFile(modulesPaths).forEach(function (dir) {
        findModule(dir.split('/')[1]);
    });
    config.srcModules = [];
    config.tplModules = [];
    config.modules.forEach(function (module) {
        config.srcModules.push(module.moduleName);
        config.tplModules = config.tplModules.concat(module.tplModules);
    });
});
/**
 * 拼接js和css
 */
gulp.task('sass', function () {

    var variables = path.resolve(config.src, 'variables.scss');
    var mixins = path.resolve(config.src, 'mixins.scss');

    return gulp.src([
        'lib/normalize.css/normalize.css',
        config.src + '/base.scss',
        config.src + '/*/**.scss'
    ])
        .pipe(insert.transform(function (contents, file) {
            var dirname = path.dirname(file.path);
            var prefix = [
                '@import "' + path.relative(dirname, variables) + '";',
                '@import "' + path.relative(dirname, mixins) + '";'
            ].join('');
            return prefix + contents;
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat(config.filename + '.css'))
        .pipe(gulp.dest('./' + config.dist + '/css/'));
});
gulp.task('concatJs', function () {
    function getFileMapping() {
        var mapping = [];
        config.modules.forEach(function (module) {
            mapping = mapping.concat(module.srcFiles);
        });
        return mapping;
    }

    var srcFile = [];
    srcFile = srcFile.concat(getFileMapping());
    var tplPaths = srcFile.map(function (file) {
        return config.src + '/' + file.split('/')[1] + '/templates/*.js';
    });
    srcFile = srcFile.concat(tplPaths);
    return gulp.src(srcFile)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat(config.filename + '.js'))
        .pipe(insert.transform(function (contents) {
            return config.getBanner() + contents;
        }))
        .pipe(gulp.dest('./' + config.dist + '/js'));
});
/**
 * 压缩js和css
 */
gulp.task('uglify', function () {
    gulp.src([config.dist + '/css/*.css', '!' + config.dist + '/css/*.min.css'])
        .pipe(cleanCss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dist + '/css'));

    return gulp.src([config.dist + '/js/*.js', '!' + config.dist + '/js/*.min.js'])
        .pipe(uglify({
            output: {
                comments: function (comments, token) {
                    return token.line === 1;
                }
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dist + '/js'));
});
/**
 * 清空构建目录
 */
gulp.task('clean', function () {
    return gulp.src(config.dist, { read: false })
        .pipe(rimraf());
});

// 脚手架
gulp.task('create', function () {
    console.log('Please use 「npm run new module 中文名」 instead');
});
//自动生成CHANGELOG.md
gulp.task('changelog', function () {
    return gulp.src('CHANGELOG.md', { buffer: false })
        .pipe(conventionalChangelog({
            preset: 'angular'
        }))
        .pipe(gulp.dest('./'));
});
// 启动本地服务
gulp.task('serve', function () {
    console.log('Please use 「npm start」 instead');
});
gulp.task('test', ['karma']);
gulp.task('build', function (done) {
    runSequence(
        ['clean', 'clean:html2js'],
        // 'eslint',
        'html2js',
        ['sass', 'modules'],
        ['concatJs'],
        'uglify',
        done);
});
gulp.task('default', function (done) {
    runSequence('test', 'build', done);
});
