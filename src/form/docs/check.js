
export default class {
    static $inject = ['$q'];
    constructor($q) {
        this.result = 8989;
        this.data = [{
            key: 'email',
            text: 'email',
            type: 'input',
            value: '',
            checkTiming: ['change'],
            publicCheck: ['intOrFloatOneDecimalReg', 'firstNotZeroIntReg']
        }, {
            key: 'condition',
            text: '自定义校验',
            type: 'input',
            value: '',
            inputLimit: {
                limit: 'letterNumber',
                maxlength: 12
            },
            checkTiming: 'change',
            onChange: (val) => {
                this.conditionChange(val);
            },
            validor: (val) => {
                return $q((resolve)=> {
                    if (val === 1) {
                        resolve({message: '请重新输入', type: 'error'});
                    }
                    resolve(true);
                });
            }
        }];
        this.data1 = [{
            key: 'email',
            text: 'email',
            type: 'input',
            value: '',
            publicCheck: ['emailReg']
        }, {
            key: 'check',
            text: '关联email校验',
            type: 'input',
            value: '',
            necessary: true,
            relatedCheckKeys: ['email']
        }, {
            key: 'condition',
            text: '自定义校验',
            type: 'input',
            value: '',
            validor: (val) => {
                return $q((resolve)=> {
                    if (+val === 1) {
                        resolve({message: '请重新输入', type: 'error'});
                    }
                    resolve({});
                });
            }
        }];
       
    }
    submit() {
        console.log(this,this.result, 'submit');
    }
    cancel() {
        console.log('cancel');
    }
    conditionChange(val) {
        console.log(val);
    }
}
