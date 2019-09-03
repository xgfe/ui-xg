
export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        this.inputValue = 78;
        this.email = '8989';
        // your js code here
        this.data = [{
            text: 'E-mail:',
            type: 'input',
            value: this.email,
            necessary: true,
            textalign: 'right'
        }, {
            text: 'Password',
            type: 'input',
            value: '',
            necessary: true,
            textalign: 'right'
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
            // tpl: `<uix-select ng-model="vm.channelInfo">
            //         <uix-select-match>
            //             {{$select.selected.desc}}
            //         </uix-select-match>
            //         <uix-select-choices repeat="item in vm.channelList | filter:$select.search">
            //             <span>{{item.desc}}</span>
            //         </uix-select-choices>
            //         </uix-select>`
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
            divWidth: 6
            // tplUrl: 'actionTpl'
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
            divWidth: 4,
            necessary: true
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
    click() {
        console.log(this.inputValue);
        // console.log(233);
        // alert('success');
    }
    changeInput() {
        console.log(this.inputValue);
    }
}
