var gulp = require('gulp'),
    _ = require('./misc/tasks/util'),
    html2js = require('gulp-angular-html2js'),
    eslint = require('gulp-eslint'),
    concat = require('gulp-concat'),
    insert = require('gulp-insert'),
    uglify = require('gulp-uglify'),
    nano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    rimraf = require('gulp-rimraf'),
    replace = require('gulp-replace'),
    karmaServer = require('karma').Server,
    marked = require('marked'),
    renderer = new marked.Renderer(),
    highlight = require('highlight.js'),
    ejs = require('ejs'),
    execSync = require('child_process').execSync;

var config = {
    modules: [],
    srcModules:[],
    tplModules:[],
    moduleName:'ui.fugu',
    pkg: require('./package.json'),
    src :'src',
    dist: 'dist',
    filename: 'ui-fugu',
    repo:'https://github.com/xgfe/angular-ui-fugu.git',
    branch:'gh-pages'
};
config.getBanner = function(){
    var banner = ['/*', ' * '+config.pkg.name+'', ' * Version: '+config.pkg.version+' - '+ _.formateDate()+'', ' * License: '+config.pkg.license+'', ' */\n'].join('\n'),
        modules = 'angular.module("'+config.moduleName+'", ["'+config.moduleName+'.tpls",'+config.srcModules.toString()+']);\n',
        tplmodules = 'angular.module("'+config.moduleName+'.tpls", ['+config.tplModules.toString()+']);\n';
    return banner + modules + tplmodules;
};

gulp.task('eslint', function () {
    return gulp.src(['gulpfile.js','tasks/util.js',config.src+ '/**/*.js','!'+config.src+ '/*/docs/*.js'])
        .pipe(eslint())
        .pipe(eslint.formatEach())
        .pipe(eslint.failOnError());
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
        dependencies: dependenciesForModule(name),
        docs:{
            md:getDocsReadme(name),
            html:getDocsFile(name,'index.html'),
            js:getDocsFile(name,'script.js'),
            css:getDocsFile(name,'style.css')
        }
    };
    module.dependencies.forEach(findModule);
    config.modules.push(module);
}
function getDocsReadme(name){
    var path = config.src+'/'+name+'/docs/readme.md';
    var content = _.readFile(path,'utf-8');
    renderer.heading = function (text, level) {
        if(level === 1){
            return '<h1 class="heading-directive-name">'+text+'</h1>';
        }
        var escapedText = text.toLowerCase();
        return '<h' + level + ' class="heading-'+escapedText+'">' +
            text + '</h' + level + '>';
    };
    renderer.table = function (header,body) {
        header = header.replace(/ style="text\-align:center"/g,'');
        body = body.replace(/ style="text\-align:center"/g,'');
        return '<table class="table table-striped table-bordered">'+header+body+'</table>';
    };
    var count=-2;
    renderer.tablecell = function (content,flags) {
        count++;
        if(flags.header){
            return '<th>'+content+'</th>';
        }
        if(count % 4 === 0){
            return _.setLabel(content);
        }
        return '<td>'+content+'</td>';
    };
    marked.setOptions({
        highlight: function (code) {
            return highlight.highlightAuto(code).value;
        }
    });
    return marked(content,{
        renderer: renderer
    });
}
function getDocsFile(name,filename){
    var path = config.src+'/'+name+'/docs/'+filename;
    return _.readFile(path);
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
gulp.task('concat:js',['modules','eslint'], function () {
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
gulp.task('uglify',['concat:css','concat:js'], function () {
    gulp.src(config.dist+'/css/*.css')
        .pipe(nano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist+'/css'));

    return gulp.src(config.dist+'/js/*.js')
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
/**
 * 自动构建README
 */
gulp.task('readme',['modules'], function () {
    var directives = config.modules.map(function (module) {
        return '- ['+module.name+'](./src/'+module.name+'/example.html)';
    }).join('\n');
    var data = {
        filename:config.pkg.name,
        directives:directives
    };
    return gulp.src('misc/tasks/README.tpl')
        .pipe(replace(/<%([^%>]+)%>/g, function (m,$1) {
            return data[$1.trim()];
        }))
        .pipe(rename({extname: '.md'}))
        .pipe(gulp.dest('./'));
});
// 复制静态文件
gulp.task('copy',['concat:css','concat:js'], function () {
    gulp.src(['misc/assets/**/*','misc/index.html'])
        .pipe(gulp.dest(config.dist+'/docs'));
    gulp.src(['lib/angular/angular.min.js','lib/jquery/dist/jquery.min.js',config.dist+'/js/'+config.filename+'.js'])
        .pipe(gulp.dest(config.dist+'/docs/js/lib'));
    gulp.src(['lib/bootstrap/dist/css/bootstrap.min.css',config.dist+'/css/'+config.filename+'.css'])
        .pipe(gulp.dest(config.dist+'/docs/css'));
    return gulp.src(['lib/bootstrap/dist/fonts/*'])
        .pipe(gulp.dest(config.dist+'/docs/fonts'));
});
// 自动构建API网站
gulp.task('docs',['modules','copy'], function () {
    var docPath = config.dist+'/docs/',
        tplPath = 'misc/tpl/';
    var moduleNames=[],template,code;
    config.modules.forEach(function (module) {
        // 构建组件文档页面
        createPartial(module,docPath);
        moduleNames.push(module.name);
    });
    // 构建aside
    template = _.readFile(tplPath+'aside.html.tpl');
    code = ejs.render(template, {modules:moduleNames});
    _.writeFile(docPath+'partials/aside.html',code);

    // 构建路由控制js文件
    template = _.readFile(tplPath+'routers.js.tpl');
    code = ejs.render(template, {modules:moduleNames});
    _.writeFile(docPath+'js/routers.js',code);

    // 构建导航栏组件跳转链接
    template = _.readFile(tplPath+'app.html.tpl');
    var firstModule = config.modules.length?config.modules[0].name:'';
    code = ejs.render(template, {module:firstModule});
    _.writeFile(docPath+'partials/app.html',code);
});
// 预览文档网站
gulp.task('preview', function () {
    execSync('node node_modules/.bin/http-server '+config.dist+'/docs -p 9001 -o -c -1');
});
// 部署文章网站
gulp.task('deploy', function () {
    _.deploy();
});
function createPartial(module,docPath){
    var code = module.docs.md,
        html = module.docs.html,
        js = module.docs.js,
        css = module.docs.css,
        data = {};
    var example_code_tpl = _.readFile('misc/tpl/code-example.html.tpl');
    var template = ejs.compile(example_code_tpl);
    var html_code = highlight.highlightAuto(html).value;
    var js_code = highlight.highlightAuto(js).value;
    var css_code = highlight.highlightAuto(css).value;
    data.html = html_code || '';
    data.js = js_code || '';
    data.css = css_code || '';
    var result = template(data);
    if(html){
        code += '<hr><h2>Example</h2><div>'+result+'</div>';
    }
    if(css){
        code += '<style>'+css+'</style>';
    }
    if(html){
        code += '<div class="example">'+html+'</div>';
    }
    if(js){
        code += '<script>'+js+'</script>';
    }
    _.writeFile(docPath+'partials/api/'+module.name+'.html',code);
}
gulp.task('test',['html2js','karma']);
gulp.task('build',['clean','eslint','concat:css','concat:js','uglify','readme']);
gulp.task('default',['test'], function () {
    gulp.run('build');
});
