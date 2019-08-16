/**
 * 初始化示例文档中的文件，包括
 * ui-xg/directives.scss  组件样式
 * ui-xg/directives.js  组件代码
 * ui-xg/docs.js  组件文档
 * ui-xg/templates.js  组件模板
 */
const path = require('path');
const fs = require('fs');
const ejs = require('ejs')

const src = path.resolve(__dirname, '../..', 'src');
const target = path.resolve(__dirname, '../..', 'examples/ui-xg');
const templateDir = path.resolve(__dirname, 'tpls');

generateTpls('templates.js');
generateDoc('docs.js');
generateDirective('directives.js');
generateScss('directives.scss');

function getDirectives() {
    return fs.readdirSync(src).filter(item => fs.statSync(path.join(src, item)).isDirectory());
}
// 构建样式
function generateScss(output) {
    let template = fs.readFileSync(path.join(templateDir, output + '.ejs'), 'utf8');

    let directives = [];
    getDirectives().forEach(directive => {
        fs.readdirSync(path.join(src, directive))
            .filter(item => item.match(/\.scss$/))
            .forEach(filename => {
                directives.push({
                    name: directive,
                    filename
                })
            });
    });
    fs.writeFileSync(path.join(target, output), ejs.render(template, { directives }), 'utf8');
}
// 构建指令
function generateDirective(output) {
    let template = fs.readFileSync(path.join(templateDir, output + '.ejs'), 'utf8');

    let directives = getDirectives()
        .filter(item => fs.existsSync(path.join(src, item, item + '.js')))
        .map(name => ({
            name
        }));
    fs.writeFileSync(path.join(target, output), ejs.render(template, { directives }), 'utf8');
}
// 构建demo
function generateDoc(output) {
    let template = fs.readFileSync(path.join(templateDir, output + '.ejs'), 'utf8');

    let directives = getDirectives()
        .filter(item => fs.existsSync(path.join(src, item, 'docs')))
        .map(directive => ({
            docName: 'ui' + directive[0].toUpperCase() + directive.slice(1),
            name: directive
        }));
    fs.writeFileSync(path.join(target, output), ejs.render(template, { directives }), 'utf8');
}
// 构建模板
function generateTpls(output) {
    let template = fs.readFileSync(path.join(templateDir, output + '.ejs'), 'utf8');

    let directives = [];
    getDirectives().forEach(directive => {
        let templatesPath = path.join(src, directive, 'templates');
        if (fs.existsSync(templatesPath)) {
            fs.readdirSync(templatesPath)
                .filter(tpl => tpl.match(/\.html$/))
                .forEach(tpl => {
                    directives.push({
                        templateName: `${striping2camel(tpl)}Tpl`,
                        name: directive,
                        filename: tpl
                    });
                });
        }
    });

    fs.writeFileSync(path.join(target, output), ejs.render(template, { directives }), 'utf8');
}
function striping2camel(name) {
    return name.replace(/\.html$/, '').replace(/-(.)/g, function (m, $1) {
        return $1.toUpperCase();
    });
}

