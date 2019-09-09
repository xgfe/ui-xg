
export default class {
    static $inject = ['$scope', '$q'];
    constructor($scope, $q) {
        this.result = {};
        this.submit = this.submit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.data = [{
            key: 'email',
            text: 'email',
            type: 'input'
        }, {
            key: 'condition',
            text: '自定义校验',
            type: 'input',
            value: '',
            immediateCheck: true,
            validor: (val) => {
                return $q((resolve)=> {
                    if (val === 1) {
                        resolve({message: '请重新输入', type: 'error'});
                    }
                    resolve(true);
                })
                
            }
        }];
        this.data1 = [{
            key: 'email',
            text: 'email',
            type: 'input',
            value: '',
            publicCheck: 'emailReg'
        },
        {
            key: 'check',
            text: '默认空值校验',
            type: 'input',
            value: '',
            necessary: true
        },{
            key: 'condition',
            text: '自定义校验',
            type: 'input',
            value: '',
            validor: (val) => {
                return $q((resolve)=> {
                    if (val === 1) {
                        resolve({message: '请重新输入', type: 'error'});
                    }
                    resolve({});
                })
                
            }
        }];
       
    }
    submit() {
        console.log(this.result, 'submit');
    }
    cancel() {
        console.log('cancel');
    }
}
