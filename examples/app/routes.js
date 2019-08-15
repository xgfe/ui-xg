import app from 'app';
import components from './components';

function splitReadme(readme) {
    let idx = readme.indexOf('<h2 id="arguments"');
    return {
        doc: readme.slice(0, idx),
        attrs: readme.slice(idx)
            .replace(/<table/g, '<table class="table table-bordered table-striped"')
    };
}

const ROUTES = [];
components.forEach((component) => {
    let readme = splitReadme(component.readme);
    let content = [
        `<div ng-non-bindable>${readme.doc}</div>`,
        '<h2>示例代码</h2>'
    ];
    for (let name in component.demos) {
        let demo = component.demos[name];
        let controllerName = component.name + '_' + name;
        app.controller(controllerName, demo.controller);
        content = content.concat([
            '<h3>' + demo.title + '</h3>',
            demo.description ? '<p>' + demo.description + '</p>' : '',
            '<div class="demo-box">',
            `<div ng-controller="${controllerName} as vm">${demo.template}</div>`,
            '</div>',
            `<code-box template="${encodeURIComponent(demo.template)}" script="${encodeURIComponent(demo.script)}"></code-box>`,
            `<div ng-non-bindable>${readme.attrs}</div>`
        ]);
    }
    ROUTES.push({
        name: component.name,
        template: content.join('')
    });
});
export { ROUTES };
