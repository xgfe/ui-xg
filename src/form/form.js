/**
 * form
 * form directive
 * Author: your_email@gmail.com
 * Date:2019-09-02
 */
// const {commonRegUtil} = require('./commonRegUtil')
const commonRegUtil = {

    // url的正则表达式
    // urlObj: new RegExp(urlStr),

    // 邮箱
    emailReg: /^\w+([\-_\.]\w+)*@\w+([\-\.]\w+)*\.\w+([\-\.]\w+)*$/,

    // 字母数字下划线,中横线等合法字符
    validCharacterReg: /[A-Za-z0-9-_]+/,

    // 字母数字
    letterNumberReg: /^[A-Za-z\d]+$/,

    // 手机号,1-12位的数字即可
    mobileRegTwelveNum: /^\d{1,12}$/,

    // 手机号,首位为1,后面十位为数字
    mobileRegFirstOneTenNum: /^1[0-9]{10}$/,

    // 手机号,首位为1,第二位为3,4,5,7,8即可
    mobileRegFirstOneSecondLimit: /^1[3|4|5|7|8]\d{9}$/,

    // 固定电话,带区号010-12345678
    telReg: /^((0\d{2,3})-)(\d{7,8})$/,

    // http或者https开头
    httpFrontReg: /^http:([\s\S]*)|^https:([\s\S]*)/,

    // 首位可以为0的整数数字
    firstCanBeZeroIntReg: /^[0-9]\d*$/,

    // 首位不能为0的整数数字
    firstNotZeroIntReg: /^[1-9]\d*$/,

    // 八位整数,一般用于发票信息验证
    eightIntNumReg: /^\d{8}$/,

    // 单个数字
    singleIntNumReg: /^\d$/,

    // 多个整数数字
    multiIntNumReg: /^\d+$/,

    // 两个数字的整数,首位不能为0
    twoIntNumReg: /^[1-9]\d$/,

    // 1-99之间任意整数
    oneToNinetyNineNumReg: /[1-9][0-9]?$/,

    // 0-99之间任意整数
    zeroToNinetyNineNumReg: /^[1-9]\d$|^\d$/,

    // 数字,可以是整数,也可以是最多保留两位小数的浮点数
    intOrFloatMaxTwoDecimalReg: /^\d+(\.\d{1,2})?$/,

    // 数字,可以是整数,也可以是负数，也可以是最多保留两位小数的浮点数
    intOrFloatMaxTwocanNegativeDecimalReg: /^(-)?\d+(\.\d{1,2})?$/,

    // 数字,可以是整数,也可以是只保留一位小数的浮点数
    intOrFloatOneDecimalReg: /^\d+(\.\d{1})?$/,

    // 数字,可以是整数,也可以是最多保留四位小数的浮点数
    intOrFloatMaxFourDecimalReg: /^\d+(\.\d{1,4})?$/,

    // 数字,可以是整数,也可以是最多保留六位小数的浮点数,一般用于经纬度判断
    longitudeLatitudeReg: /^\d+(\.\d{1,6})?$/,

    // 正浮点型数字
    positiveFloatReg: /^\d+\.\d+$/,

    // 两位小数的浮点数
    twoDecimalsNumReg: /^\d+\.\d{2}$/,

    // 5-20位字母数字下划线,一般用户账号校验
    validCharacterFiveToTwenty: /^[0-9a-zA-Z_]{5,20}$/,

    // 整数或者浮点型数字
    floatNumReg: /^\d+(\.\d+)?$/,

    // 汉字数字和字母
    chineseNumberCharacterReg: /^[\u4e00-\u9fa5|a-zA-Z|0-9]+$/,

    // 非零的两位小数浮点数，可为负数
    nonZeroTwoDecimalsCanNegativeNumReg: /^-?([1-9]\d*\.\d{2}$|0\.\d[1-9]$|0\.[1-9]\d$)/,

    // 两位小数浮点数，可为负数
    twoDecimalsCanNegativeNumReg: /^-?([1-9]\d*|0)\.\d{2}$/
};
angular.module('ui.xg.form', [])
    .controller('uixFormCtrl', ['$scope', '$compile', '$templateCache', '$element', '$q', function ($scope, $compile, $templateCache, $element, $q) {
        $scope.layout = $scope.layout || 'horizontal';
        $scope.finalValue = $scope.finalValue || {};
        $scope.showBtn = $scope.showBtn || true;
        const $form = this;
        $form.copyData = angular.copy($scope.data);
        $form.html = '';
        $form.layout = $scope.layout;
        $form.tplObj = {};
        let compileScope = $scope.$parent.$new();
        $scope.data.map((item) => {
            if (item.key) {
                $scope.finalValue[item.key] = item.value;
            }
        });
        // 渲染模板dom
        $form.renderTpl = (item) => {
            if ($form.tplObj[item.templateName]) {
                return;
            }
            $form.tplObj[item.templateName] = 1;
            let tpl = item.template || $templateCache.get(item.templateUrl);
            $compile(tpl)(compileScope, (clonedElement) => {
                let tableWrap = angular.element($element[0]
                    .querySelector(`.tplHtml${item.templateName}`));
                tableWrap.empty().append(clonedElement);
            });
        };
        // 提交时校验
        $form.confirm = () => {
            if ($scope.checkAll) {
                let arr = [];
                $scope.data.map((item) => {
                    arr.push($form.validor(item, 'confirm'));
                });
                $q.all(arr).then(() => {
                    $form.updateConfirmState();
                });
            }
            if($scope.onConfirm) {
                $scope.onConfirm();
            }
        };
        $form.cancle = () => {
            if ($scope.resetData) {
                $form.tplObj = {};
                $scope.data = $form.copyData;
            }
            if ($scope.onCancel) {
                $scope.onCancel()
            }
        };
        // change事件
        $form.onChange = (item) => {
            if (item.key) {
                $scope.finalValue[item.key] = item.value;
            }
            if (item.onChange) {
                item.onChange(item.value);
            }
            $form.validor(item, 'onChange').then(() => {
                $form.updateConfirmState();
            });
        };
        // 校验
        $form.validor = (item, type) => {
            return $q((resolve)=>{
                // 自定义校验覆盖默认的必填和publicCheck校验
                if (item.validor) {
                    item.validor(item.value).then((res) => {
                        if (type === 'onChange' && !item.immediateCheck) {
                            item.tipInfo = true;
                        } else {
                            item.tipInfo = res;
                        }
                        resolve(item);
                    });
                } else {
                    if (item.value) {
                        item.tipInfo = true;
                    }
                    if (item.necessary && !item.value) {
                        if (type === 'onChange' && !item.immediateCheck) {
                            item.tipInfo = true;
                        } else {
                            item.tipInfo = {message: `${item.text}必填`, type: 'error'};
                        }
                    } else {
                        item.tipInfo = true;
                    }
                    if(item.publicCheck) {
                        if (!commonRegUtil[item.publicCheck].test(item.value)) {
                            if (type === 'onChange' && !item.immediateCheck) {
                                item.tipInfo = true;
                            } else {
                                item.tipInfo = {message: `${item.text}输入不正确`, type: 'error'};
                            }
                        } else {
                            item.tipInfo = true;
                        }
                    }
                    resolve(item);
                }
            });
        };
        $form.updateConfirmState = () => {
            let result = $scope.data.filter((item) => item.tipInfo && item.tipInfo.message);
            if(result && result.length) {
                $scope.disabled = true;
            } else {
                $scope.disabled = false;
            }
        };
    }])
    .directive('uixForm', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/form.html',
            replace: true,
            require: ['uixForm'],
            scope: {
                data: '=', layout: '@?', textalign: '@?', buttonInline: '@?',
                confirmText: '@?', onConfirm: '=?', showBtn: '@?',
                cancelText: '@?', onCancel: '=?', resetData: '@?', checkAll: '@?',
                finalValue: '=?', colon: '@?', cancelButton: '@?', disabled: '@?'
            },
            controller: 'uixFormCtrl',
            controllerAs: '$form',
            link: function ($scope) {
                $scope.layout = $scope.layout ? $scope.layout : 'search';
            }
        };
    })

