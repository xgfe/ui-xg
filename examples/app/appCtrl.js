import template from './app.html';
import docs from 'examples/ui-xg/docs';

function toCamelCase(str) {
    return str[0].toUpperCase() + str.slice(1);
}

class AppCtrl {
    static $inject = ['$state']
    defaultComponet = `app.components.${docs[0].name}`;
    routerList = {
        intro: [{
            state: 'start',
            name: '快速开始'
        }, {
            state: 'guide',
            name: '开发文档'
        }, {
            state: 'componentDoc',
            name: '组件规范'
        }],
        components: docs.map(({ name, cnName }) => ({
            name: toCamelCase(name),
            state: name,
            cnName: cnName
        }))
    };
    constructor($state) {
        this.$state = $state;
    }
}

export default {
    abstract: true,
    url: '/app',
    template,
    controllerAs: 'vm',
    controller: AppCtrl
};
