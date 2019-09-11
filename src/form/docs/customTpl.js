
export default class {
    constructor() {
        this.result = {};
        this.changeInput = () => {
            console.log('template input change',this.inputValue);
        }
        this.data = [{
            text: 'customtemplateUrl',
            templateName: 'inlineTpl',
            templateUrl: 'inlineTpl'
        },{
            text: 'customtemplate',
            templateName: 'inlineTpl3',
            template: `<div>
                            发票审核通过后（T）+<input type="text" ng-model="vm.inputValue" ng-change="vm.changeInput()" class="customer-input">工作日
                        </div>`
        },{
            type: 'tpl',
            rowWidth: 12,
            templateName: 'inlineTpl1',
            templateUrl: 'inlineTpl1'
        }];
        
    }
}
