export default class {
    constructor() {
        this.result = {};
        this.data = [{
            key: 'dateRange',
            colWidth: 6,
            // labelWidth: 7,
            type: 'dateRange',
            dateFormat: 'yyyy-MM-dd',
            text: '日期范围',
            necessary: true,
            onChange: this.handel,
            value: {
                endTime: '',
                startTime: ''
            }
        }, {
            key: 'input',
            text: 'input',
            type: 'input',
            value: '初始化值',
            colWidth: 4,
            placeholder: 'placeholder'
        }, {
            key: 'select',
            type: 'multipleSelect',
            text: '多选',
            value: [{
                desc: '描述',
                value: 1
            }],
            options: [{
                desc: '描述',
                value: 1
            }, {
                desc: '描述1',
                value: 13
            }, {
                desc: '描述3',
                value: 43
            }, {
                desc: '描述3',
                value: 53
            }]
        }, {
            key: 'input',
            text: 'input',
            type: 'input',
            value: '',
            necessary: true,
            placeholder: 'placeholder'
        }, {
            key: 'input',
            text: 'input',
            type: 'input',
            value: '',
            necessary: true,
            placeholder: 'placeholder'
        }, {
            key: 'input',
            text: 'input',
            type: 'input',
            value: '',
            necessary: true,
            placeholder: 'placeholder'
        }];
        this.data1 = [{
            key: 'input',
            text: 'input',
            type: 'input',
            value: '',
            necessary: true,
            placeholder: 'placeholder'
        }, {
            key: 'condition',
            text: 'condition',
            type: 'input',
            value: '',
            necessary: true
        }, {
            key: 'select',
            type: 'select',
            text: '下拉框',
            necessary: true,
            options: [{
                desc: '描述',
                value: 1
            }, {
                desc: '描述1',
                value: 13
            }, {
                desc: '描述3',
                value: 43
            }, {
                desc: '描述3',
                value: 53
            }]
        }, {
            key: 'address',
            text: 'address',
            type: 'input',
            colWidth: 12,
            labelWidth: 2,
            value: '',
            necessary: true
        }, {
            key: 'dateRange',
            colWidth: 12,
            labelWidth: 2,
            type: 'dateRange',
            dateFormat: 'yyyy-MM-dd',
            text: '日期范围',
            necessary: true,
            onChange: this.handel,
            value: {
                endTime: '',
                startTime: ''
            }
        }];
        this.data2 = [{
            key: 'input',
            text: 'input',
            type: 'input',
            value: '',
            necessary: true,
            labelWidth: 3,
            placeholder: 'placeholder'
        }, {
            key: 'multipleSelect',
            type: 'multipleSelect',
            text: '多选',
            textalign: 'right',
            labelWidth: 3,
            options: [{
                desc: '描述',
                value: 1
            }, {
                desc: '描述1',
                value: 13
            }, {
                desc: '描述3',
                value: 43
            }, {
                desc: '描述3',
                value: 53
            }]
        }, {
            key: 'checkbox',
            type: 'checkbox',
            text: '复选框',
            labelWidth: 3,
            value: '',
            options: ['app', 'ios', 'android']
        }, {
            key: 'radio',
            type: 'radio',
            text: '单选框',
            value: '1',
            labelWidth: 3,
            options: [{
                label: 'app',
                value: 1
            }, {
                label: 'ios',
                value: 2
            }, {
                label: 'android',
                value: 3
            }]
        }, {
            key: 'datepicker',
            type: 'datepicker',
            dateFormat: 'yyyy-MM-dd',
            text: '日期',
            necessary: false,
            labelWidth: 3,
            value: ''
        }];
    }
    submit() {
        console.log(this.result, 'submit');
    }
    cancel() {
        console.log('cancel');
    }
    ready() {
        console.log(this.result);
    }
}
