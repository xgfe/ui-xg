/**
 * form
 * form directive
 * Author: your_email@gmail.com
 * Date:2019-09-02
 */
(function () {
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
        .controller('uixFormCtrl', ['$scope', '$compile', '$templateCache', '$element', '$q', '$timeout', function ($scope, $compile, $templateCache, $element, $q, $timeout) {
            const INPUTLIMIT = {
                number: /\d/g,
                letter: /[a-zA-Z]/g,
                letterNumber: /[A-Za-z\d]/g
            };
            let timer = null;
            let compileScope = $scope.$parent.$new();
            const $form = this;
            $scope.finalValue = $scope.finalValue || {};
            $scope.showBtn = angular.isUndefined($scope.showBtn) ? true : $scope.showBtn;
            if ($scope.data) {
                syncFinalValue();
                if ($scope.onFinalValueReady) {
                    $scope.onFinalValueReady();
                }
            }
            $form.layout = $scope.layout || 'horizontal';
            $form.copyData = angular.copy($scope.data);
            $form.html = '';
            $form.tplObj = {};
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
                        arr.push($form.validor(item));
                    });
                    $q.all(arr).then(() => {
                        $form.updateConfirmState();
                    });
                }
                if($scope.onConfirm) {
                    $scope.onConfirm({AllPassCheck: !$scope.disabled});
                }
            };
            $form.cancle = () => {
                if ($scope.resetData) {
                    $form.tplObj = {};
                    $scope.data = angular.copy($form.copyData);
                }
                syncFinalValue();
                if ($scope.onCancel) {
                    $scope.onCancel();
                }
            };
            // change事件
            $form.onChange = (item, from = 'front') => {
                // input限制输入（包括提示信息，数字字母，长度限制）
                if (item.type === 'input' && item.inputLimit) {
                    let {limit, limitReg, maxlength} = item.inputLimit;
                    // 输入限制
                    let reg = limit ? INPUTLIMIT[limit] : limitReg ? limitReg : '';
                    if (reg && item.value) {
                        item.value = (item.value.toString().match(reg) || []).join('');
                    }
                    // 长度校验
                    let len = charLengthTrim(item.value);
                    if (maxlength && len > maxlength) {
                        item.value = item.value.slice(0, maxlength);
                    }
                }
                if (item.key) {
                    $scope.finalValue[item.key] = item.value;
                }
                if (item.onChange) {
                    item.onChange(item.value);
                }
                // 校验
                if ((item.checkTiming && item.checkTiming.includes('change')) || from === 'relatedCheck' || $scope.checkAll) {
                    $form.validor(item).then(() => {
                        $form.updateConfirmState();
                    });
                }
                // 关联校验项
                $form.relatedCheck(item, 'onChange');
            };
            // Focus
            $form.onFocus = (item) => {
                // 获取焦点展示输入提示信息
                if (item.type === 'input' && item.inputLimit) {
                    let {limitInfo} = item.inputLimit;
                    if (limitInfo && limitInfo.message) {
                        item.promptInformation = limitInfo;
                    }
                }
                if (item.onFocus) {
                    item.onFocus(item.value);
                }
                if (item.checkTiming && item.checkTiming.includes('focus')) {
                    $form.validor(item).then(() => {
                        $form.updateConfirmState();
                    });
                }
                // 关联校验项
                $form.relatedCheck(item, 'onFocus');
            };
            // blur
            $form.onBlur = (item) => {
                // 失焦去掉limitinfo
                item.promptInformation = item.tipInfo;
                if (item.onBlur) {
                    item.onBlur(item.value);
                }
                if (item.checkTiming && item.checkTiming.includes('blur')) {
                    $form.validor(item).then(() => {
                        $form.updateConfirmState();
                    });
                }
                // 关联校验项
                $form.relatedCheck(item, 'onBlur');
            };

            // 校验
            $form.validor = (item) => {
                return $q((resolve)=>{
                    // 自定义校验覆盖默认的必填和publicCheck校验
                    if (item.validor) {
                        clearTimeout(timer);
                        timer = $timeout(() => {
                            let checkResult = item.validor(item.value);
                            if (checkResult.then) {
                                checkResult.then((res) => {
                                    item.errorInfo = res;
                                    item.passCheck = res.isPassed || false;
                                    resolve(item);
                                });
                            } else {
                                item.errorInfo = checkResult;
                                item.passCheck = checkResult.isPassed || false;
                                resolve(item);
                            }
                        }, 300);
                    } else {
                        if (item.value) {
                            item.errorInfo = {isPassed: true};
                        }
                        if (item.necessary && !item.value) {
                            item.errorInfo = {isPassed: false, message: `${item.text}必填`, type: 'error'};
                        } else {
                            item.errorInfo = {isPassed: true};
                        }
                        if(item.publicCheck && item.publicCheck.length) {
                            item.publicCheck.some((list) => {
                                if (!commonRegUtil[list].test(item.value)) {
                                    item.errorInfo = {isPassed: false, message: `${item.text}输入不正确`, type: 'error'};
                                    return true;
                                } else {
                                    item.errorInfo = {isPassed: true};
                                    return false;
                                }
                            });
                        }
                        item.passCheck = item.errorInfo.isPassed || false;
                        resolve(item);
                    }
                });
            };
            $form.updateConfirmState = () => {
                let result = $scope.data.filter((item) => !item.passCheck);
                if(result && result.length) {
                    $scope.disabled = true;
                } else {
                    $scope.disabled = false;
                }
            };
            // a item校验调用b item的校验方法（关联校验）
            $form.relatedCheck = (item, eventType) => {
                if (item.relatedCheckKeys && item.relatedCheckKeys.length) {
                    item.relatedCheckItems = item.relatedCheckKeys.reduce((res, relatedKey) => {
                        let relatedItem = $scope.data.find(({key}) => (key === relatedKey));
                        if (relatedItem && relatedItem.key) {
                            res.push(relatedItem);
                        }
                        return res;
                    }, []);
                    item.relatedCheckItems.forEach((relatedItem) => {
                        $form[eventType](relatedItem, 'relatedCheck');
                    });
                }
            };
            function syncFinalValue() {
                $scope.data.map((item) => {
                    if (item.key) {
                        $scope.finalValue[item.key] = item.value;
                    }
                    if (item.tipInfo) {
                        item.promptInformation = item.tipInfo;
                    }
                    item.passCheck = angular.isDefined(item.passCheck) ? item.passCheck : true;
                });
            }
            function charLengthTrim(input) {
                if(input) {
                    return input.toString().replace(/(^\s*)|(\s*$)/g, '').replace(/[^\x00-\xff]/g, 'aa').length;
                }
            }
        }])
        .directive('uixForm', function () {
            return {
                restrict: 'AE',
                templateUrl: 'templates/form.html',
                replace: true,
                require: ['uixForm'],
                scope: {
                    data: '=', layout: '@?', textalign: '@?', buttonInline: '@?',
                    confirmText: '@?', onConfirm: '&?', showBtn: '=?', onFinalValueReady: '&?',
                    cancelText: '@?', onCancel: '&?', resetData: '@?', checkAll: '@?',
                    finalValue: '=?', colon: '@?', cancelButton: '@?', disabled: '=?'
                },
                controller: 'uixFormCtrl',
                controllerAs: '$form',
                link: function () {
                }
            };
        });
})();


