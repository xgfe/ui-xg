
export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        this.inputValue = 78;
        this.email = '8989';
        this.isreset = true;
        setTimeout(() => {
            this.dataSelectOptions = [{desc: '描述',value: 1},{desc: '描述1',value: 13}]
        }, 200)
        // your js code here
        this.data = [{
                text: 'E-mail:',
                type: 'input',
                value: this.email,
                necessary: true,
                textalign: 'right',
                immediateCheck: true,
                publicCheck: 'emailReg',
                onChange: this.emailChange,
                disabled: true
            }, {
                type: 'checkbox',
                text: '复选框',
                value: {},
                options: ['app', 'ios', 'android'],
                validor: (val) => {
                    if (val.app) {
                        return {message: '请重新选择', type: 'error'};
                    }
                    return true;
                }
            },{
                type: 'radio',
                text: '单选框',
                value: {},
                options: [{label:'app', value: 1}, {label:'ios', value: 2}, {label:'android', value: 3}]
            },{
                text: 'Password',
                type: 'input',
                value: '',
                necessary: true,
                textalign: 'right',
                placeholder: 'huhuhuh'
            },{
                divWidth: 9,
                type: 'dateRange',
                dateFormat: 'yyyy-MM-dd',
                text: '日期范围',
                textalign: 'right',
                onChange: this.handel,
                value: {endTime:'',startTime: ''}
            },{
                type: 'multipleSelect',
                text: '下拉框',
                textalign: 'right',
                options: [{desc: '描述',value: 1},{desc: '描述1',value: 13}, {desc: '描述3',value: 43}, {desc: '描述3',value: 53}]
            },
            {
                text: 'address',
                type: 'input',
                value: '',
                necessary: true,
                textalign: 'right'
            }, {
                text: 'template',
                labelWidth: 2,
                divWidth: 6,
                necessary: true,
                textalign: 'right',
                tplUrl: 'actionTpl'
            }];
            this.data2 = [{
                text: 'E-mail:',
                type: 'input',
                value: '',
                isRequired: true
            }, {
                text: 'Password',
                type: 'input',
                value: ''
            },
            {
                text: 'address',
                type: 'input',
                value: ''
            }, {
                text: 'template',
                labelWidth: 2,
                divWidth: 6,
                tplUrl: 'actionTpl'
                // tpl: `<uix-select ng-model="vm.channelInfo">
                //         <uix-select-match>
                //             {{$select.selected.desc}}
                //         </uix-select-match>
                //         <uix-select-choices repeat="item in vm.channelList | filter:$select.search">
                //             <span>{{item.desc}}</span>
                //         </uix-select-choices>
                //         </uix-select>`
            }];
        this.data1 = [{
            text: 'E-mail',
            type: 'input',
            value: '',
            // divWidth: 4,
            necessary: true
        }, {
            type: 'select',
            text: '下拉框',
            textalign: 'right',
            options: [{desc: '描述',value: 1},{desc: '描述1',value: 13}]
        },{
            divWidth: 8,
            type: 'dateRange',
            text: '日期范围',
            value: {endTime:'',startTime: ''}

        }, {
            text: 'Password',
            type: 'datepicker',
            value: '',
            tip: {}
        }, {
            text: 'Password',
            type: 'datepicker',
            value: '',
            tip: {}
        },
        {
            text: 'address',
            type: 'input',
            value: '',
            tip: {} 
        },
        {
            text: 'address',
            type: 'input',
            value: '',
            tip: {} 
        }, {
            text: 'template',
            // type: 'input'
            tplUrl: 'actionTpl'
            // tpl: `<uix-select ng-model="vm.channelInfo">
            //         <uix-select-match>
            //             {{$select.selected.desc}}
            //         </uix-select-match>
            //         <uix-select-choices repeat="item in vm.channelList | filter:$select.search">
            //             <span>{{item.desc}}</span>
            //         </uix-select-choices>
            //         </uix-select>`
        }];
       
    }
    emailChange(value) {
        console.log(value);
    }
    click() {
        console.log('template事件');
    }
    changeInput() {
        console.log('template事件');
    }
    submit() {
        console.log('submit');
    }
    cancel() {
        console.log('cancel');
    }
}
