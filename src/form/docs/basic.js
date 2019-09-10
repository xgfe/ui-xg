export default class {
    constructor() {
        this.result = {};
        this.data = [{
                key: 'input',
                text: 'input',
                type: 'input',
                value: '',
                checkTiming: ['change'],
                publicCheck: ['intOrFloatOneDecimalReg','firstNotZeroIntReg'],
                inputLimit: {
                    limit: 'letterNumber',
                    maxlength: 12
                },
                relatedCheckKeys: ['select']
            }, {
                key: 'date',
                text: 'test',
                value: '',
                type: 'datepicker',
                placeholder: '测试222',
                checkTiming: ['change'],
                publicCheck: ['emailReg'],
                dateFormat: 'yyyy-MM-dd',
                relatedCheckKeys: ['input']
            }, {
                key: 'select',
                type: 'select',
                value: '',
                publicCheck: ['emailReg'],
                text: '下拉框',
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
            },
            {
                key: 'address',
                text: 'address',
                type: 'input',
                value: '',
                disabled: true,
                placeholder: 'placeholder',
                tooltip: {
                    message: 'tooltip message',
                    color: '#ff552e',
                    icon: 'glyphicon glyphicon-ok-sign'
                }
            }
        ]
        this.data1 = [{
            key: 'input',
            text: 'input',
            type: 'input',
            value: '默认值',
            necessary: true,
            placeholder: 'placeholder'
        }, {
            key: 'dateRange',
            type: 'datepicker',
            dateFormat: 'yyyy-MM-dd',
            text: '日期',
            necessary: true,
            value: '',
            onChange: this.datepickerChange
        }];
    };
    datepickerChange(val) {
        console.log(val);
    }
}