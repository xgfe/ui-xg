
export default class {
    constructor() {
        this.result = {};
        this.changeInput = () => {
            console.log('template input change',this.inputValue);
        }
        this.adjTypeList = [{
            name: '描述',
            value: 1
        }, {
            name: '描述1',
            value: 13
        }, {
            name: '描述3',
            value: 43
        }, {
            name: '描述3',
            value: 53
        }];
        this.data = [{
            type: 'input',
            text: '名称'
        }, {
            type: 'input',
            text: 'id'
        }, {
            text: '模板',
            colWidth: 5,
            templateName: 'selectTpl',
            templateUrl: 'selectTpl',
        }];
        this.data1 = [{
            type: 'input',
            text: '名称'
        }, {
            type: 'input',
            text: 'id'
        }, {
            text: '模板',
            templateName: 'selectTpl',
            templateUrl: 'selectTpl',
        }];
        this.data2 = [{
            text: 'customtemplateUrl',
            templateName: 'inlineTpl',
            templateUrl: 'inlineTpl'
        }, {
            text: 'customtemplate',
            templateName: 'inlineTpl3',
            template: `<div>
                            发票审核通过后（T）+<input type="text" ng-model="vm.inputValue" ng-change="vm.changeInput()" class="customer-input">工作日
                        </div>`
        }, {
            type: 'tpl',
            rowWidth: 12,
            templateName: 'inlineTpl1',
            templateUrl: 'inlineTpl1'
        }];
    }
}

