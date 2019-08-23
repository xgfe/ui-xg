// 创建组件脚手架脚本

const fs = require('fs');
const path = require('path');

let moduleName = process.argv[2];
let cnName = process.argv[3];

if (moduleName) {
    create(moduleName, cnName);
} else {
    console.log('请输入指令名称');
}
function formateDate() {
    var d = new Date(),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate();
    return year + '-' + addZero(month) + '-' + addZero(day);
}
function addZero(num) {
    return (num > 9 ? '' : '0') + num;
}

function create(name, cnName) {
    var target = path.join(process.cwd(), 'src', name);
    if (fs.existsSync(target)) {
        console.log('[INFO]:' + module + ' exists\n');
        return;
    }
    let data = {
        module: name,
        humpModule: name[0].toUpperCase() + name.slice(1),
        dashModule: name.replace(/[A-Z]/g, function (match) {
            return '-' + match.toLowerCase();
        }),
        cnName,
        date: formateDate()
    };
    fs.mkdirSync(target);
    fs.mkdirSync(path.join(target, 'docs'));
    fs.mkdirSync(path.join(target, 'templates'));
    fs.mkdirSync(path.join(target, 'test'));
    createFile('directive.js.ejs', `${name}.js`);
    createFile('doc-index.js.ejs', 'docs/index.js');
    createFile('doc-script.js.ejs', 'docs/basic.js');
    createFile('doc-template.html.ejs', 'docs/basic.html');
    createFile('readme.md.ejs', 'docs/readme.md');
    createFile('template.html.ejs', `templates/${name}.html`);

    function replaceTemplate(template) {
        var reg = /<%([^%>]+)%>/g;
        return template.replace(reg, function (match, $1) {
            return data[$1.trim()];
        });
    }

    function createFile(filename, targetFile) {
        let filepath = path.join(__dirname, 'tpls', filename);
        let content = fs.readFileSync(filepath, 'utf8');
        fs.writeFileSync(path.join(target, targetFile), replaceTemplate(content), 'utf8');
    }
}
