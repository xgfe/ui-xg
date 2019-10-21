export default class {
    constructor() {
        this.showBtn = false;
        this.baseResult = {};
        this.colonResult = {};
        this.data = [{
            key: 'email',
            text: 'email',
            type: 'input',
            tipInfo: {message: '最多20个字符', type: 'error'},
            checkTiming: 'change',
            inputLimit: {
                maxlength: 50,
                limitReg: /\d|-/g
            },
            validor: (val) => {
                if (val) {
                    return {isPassed: false, message: '不能随便输入', type: 'error'};
                } else {
                    return {isPassed: true};
                }
            }
        }, {
            key: 'date',
            text: 'test',
            value: '',
            type: 'datepicker',
            placeholder: '测试222',
            checkTiming: ['change'],
            dateFormat: 'yyyy-MM-dd HH:mm:ss',
            relatedCheckKeys: ['input'],
            clearBtn: true,
            showTime: true
        }, {
            key: 'date1',
            text: 'test',
            value: '',
            type: 'dateRange',
            placeholder: '测试222',
            dateFormat: 'yyyy-MM-dd HH:mm:ss'
        }, {
            key: 'select',
            type: 'select',
            value: {
                name: '描述',
                value: null
            },
            publicCheck: ['emailReg'],
            optionKey: 'name',
            checkTiming: ['blur', 'change'],
            onChange: this.change,
            text: '下拉框',
            options: [{
                name: '描述',
                value: null
            }, {
                name: '描述1',
                value: 13
            }, {
                name: '描述3',
                value: 43
            }, {
                name: '描述4',
                value: 53
            }]
        }, {
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
        }];
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
    change() {
        console.log('opopo');
    }
    datepickerChange(val) {
        console.log(val);
    };
    onConfirm() {
        console.log(this.baseResult);
    }
}
