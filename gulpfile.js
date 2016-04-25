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
    karmaServer = require('karma').Server,
    marked = require('marked'),
    renderer = new marked.Renderer(),
    highlight = require('highlight.js'),
    ejs = require('ejs');

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
gulp.task('clean:html2js', function () {
    return gulp.src(config.src+'/**/*.html.js', { read: false })
        .pipe(rimraf());
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
    var argumentBlock = false;
    renderer.heading = function (text, level) {
        if(level === 2 && text.toLowerCase() === 'arguments'){
            argumentBlock = true;
            return '<h2>'+text+'</h2>';
        }
        if(argumentBlock){
            argumentBlock = false;
        }
        return '<h' + level + '>' + text + '</h' + level + '>';
    };
    var table = '<table class="table table-striped table-bordered">',
        thead = '<tr><th>Param</th><th>Type</th><th>Default</th><th>Detail</th></tr>',
        tbody = '';
    table += thead+tbody;
    renderer.list = function( body,  ordered){
        var code = body.split('\n').join(''),ul_match,li_match,
            ul_reg = /<li>([\w\(\)]+)[:：](.+?)<ul>(.+?)<\/ul><\/li>/g,
            li_reg = /<li>(\w+)[:：](.+?)<\/li>/g,
            tr = '',cols;
        if(argumentBlock && body.match('<ul>')){
            while((ul_match = ul_reg.exec(code))){
                tr += '<tr>';
                tr += '<td>'+ul_match[1]+'</td>';

                cols = {};
                while((li_match = li_reg.exec(ul_match[3]))){
                    cols[li_match[1]] = _.formatCode(li_match[1],li_match[2]);
                }
                tr += '<td>'+(cols.type?cols.type:'')+'</td>';
                tr += '<td>'+(cols.default?cols.default:'')+'</td>';
                tr += '<td>'+ul_match[2]+'</td>';
                tr += '</tr>';
                tbody += tr;
                tr = '';
            }
            table += tbody+'</table>';
            return table;
        }
        return ordered?'<ol>'+body+'</ol>':'<ul>'+body+'</ul>'
    };
    marked.setOptions({
        highlight: function (code) {
            return highlight.highlightAuto(code).value.replace(/{{(.+?)}}/g, function (m,$1) {
                return '<span>&#123;&#123;</span>'+$1+'&#125;&#125;';
            });
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
    var argvs = process.argv.slice(2);
    var pos = argvs.indexOf('-m');
    var moduleNames = 'all';
    if(~pos && argvs[pos+1]){
        moduleNames = argvs[pos+1].split(',').filter(function (m) {
            return m;
        });
    }
    var modulesPaths;
    if(moduleNames === 'all' || !moduleNames.length){
        modulesPaths = config.src + '/*/';
    }else{
        modulesPaths = config.src + '/*('+moduleNames.join('|')+')/';
    }
    _.matchFile(modulesPaths).forEach(function (dir) {
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
gulp.task('concat:css',['modules','sass'], function () {
    var src = config.modules.map(function (module) {
        return module.name;
    });
    if(src.length){
        var srcPath = config.src + '/*('+src.join('|')+')/*.css';
        return gulp.src(srcPath)
        .pipe(concat(config.filename + '.css'))
        .pipe(gulp.dest('./'+config.dist+'/css/'));
    }
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
    var tplPaths = srcFile.map(function (file) {
        return config.src + '/'+file.split('/')[1]+'/templates/*.js';
    });
    srcFile = srcFile.concat(tplPaths);
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
    gulp.src([config.dist+'/css/*.css','!'+config.dist+'/css/*.min.css'])
        .pipe(nano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(config.dist+'/css'));

    return gulp.src([config.dist+'/js/*.js','!'+config.dist+'/js/*.min.js'])
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
// 复制静态文件
gulp.task('copy',['uglify'], function () {
    // copy assets
    gulp.src(['misc/assets/**/*.html','misc/index.html'])
        .pipe(gulp.dest(config.dist+'/docs'));

    gulp.src(['misc/assets/js/*.js'])
        .pipe(gulp.dest(config.dist+'/docs/js'));

    gulp.src(['misc/assets/js/lib/require.min.js'])
        .pipe(gulp.dest(config.dist+'/docs/js/lib'));

    // copy angular and jquery
    gulp.src(['lib/angular/angular.min.js','lib/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest(config.dist+'/docs/js/lib'));

    // combine js files
    gulp.src(['misc/assets/js/lib/*','!misc/assets/js/lib/require.min.js',config.dist+'/js/'+config.filename+'.min.js'])
        .pipe(concat('lib-comb.js'))
        .pipe(gulp.dest(config.dist+'/docs/js/lib'));

    // combine css files
    gulp.src(['lib/bootstrap/dist/css/bootstrap.min.css','misc/assets/css/github.css',config.dist+'/css/'+config.filename+'.min.css','misc/assets/css/style.css'])
        .pipe(concat('style.css'))
        .pipe(gulp.dest(config.dist+'/docs/css'));

    // copy font files
    return gulp.src(['lib/bootstrap/dist/fonts/*'])
        .pipe(gulp.dest(config.dist+'/docs/fonts'));
});
// 自动构建API网站
gulp.task('docs',['copy'], function () {
    var docPath = config.dist+'/docs/',
        tplPath = 'misc/tpl/';
    if(!_.isExists(docPath+'partials/api')){
        _.mkdir(docPath+'partials/api');
    }
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

    // 没有docs目录的话，生成
    if(!_.isExists(docPath+'partials/docs')){
        _.mkdir(docPath+'partials/docs');
    }
    // 构建组件文档编写规范
    template = _.readFile(tplPath+'start.html.tpl');
    var docsContent = _.readFile('docs/start.md');
    var appContent = marked(docsContent);
    code = ejs.render(template, {appContent:appContent});
    _.writeFile(docPath+'partials/docs/start.html',code);

    // 构建开发者文档和组件文档编写规范
    template = _.readFile(tplPath+'guideDocs.html.tpl');
    docsContent = _.readFile('docs/guide.md');
    appContent = marked(docsContent);
    code = ejs.render(template, {appContent:appContent});
    _.writeFile(docPath+'partials/docs/guide.html',code);

    // 构建组件文档编写规范
    docsContent = _.readFile('docs/directive-docs.md');
    appContent = marked(docsContent);
    code = ejs.render(template, {appContent:appContent});
    _.writeFile(docPath+'partials/docs/directiveDocs.html',code);

});
function createPartial(module,docPath){
    var code = module.docs.md,
        html = module.docs.html,
        js = module.docs.js,
        css = module.docs.css,
        data = {};
    var example_code_tpl = _.readFile('misc/tpl/code-example.html.tpl');
    var template = ejs.compile(example_code_tpl);
    var html_code = highlight.highlightAuto(html).value.replace(/{{(.+?)}}/g, function (m,$1) {
        return '<span>&#123;&#123;</span>'+$1+'&#125;&#125;';
    });
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
// 脚手架
gulp.task('create', function () {
    var newModules = process.argv.slice(3).map(function (argv) {
        return argv.slice(1);
    });
    newModules.forEach(function (module) {
        _.createModuleFiles(module);
    });
});
gulp.task('test',['clean:html2js','html2js','karma']);
gulp.task('build',['clean','eslint','concat:css','concat:js','uglify']);
gulp.task('default',['test'], function () {
    gulp.run('build');
});
