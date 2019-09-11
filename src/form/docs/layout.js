export default class {
    constructor() {
        this.result = {};
        this.data = [{
            key: 'input',
            text: 'input',
            type: 'input',
            value: '初始化值',
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
            value: '',
            necessary: true
        }, {
            key: 'dateRange',
            rowWidth: 12,
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
            placeholder: 'placeholder'
        }, {
            key: 'multipleSelect',
            type: 'multipleSelect',
            text: '多选',
            textalign: 'right',
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
            value: '',
            options: ['app', 'ios', 'android']
        }, {
            key: 'radio',
            type: 'radio',
            text: '单选框',
            value: '1',
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
            value: ''
        }];
    }
    submit() {
        console.log(this.result, 'submit');
    }
    cancel() {
        console.log('cancel');
    }
}