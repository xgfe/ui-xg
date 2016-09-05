/**
 * buttonGroup
 * 按钮组指令
 * Author:penglu02@meituan.com
 * Date:2016-01-23
 */
angular.module('ui.xg.buttonGroup', [])
    .constant('buttonGroupConfig', {
        activeClass: 'active',
        toggleEvent: 'click'
    })
    .controller('buttonGroupController', ['buttonGroupConfig', function (buttonGroupConfig) {
        this.activeClass = buttonGroupConfig.activeClass || 'active';
        this.toggleEvent = buttonGroupConfig.toggleEvent || 'click';
    }])
    .directive('uixButtonRadio', [function () {
        return {
            controller: 'buttonGroupController',
            require: 'uixButtonRadio',
            scope: true,  // 继承父scope的新scope
            link: function (scope, element, attrs, btnRadioCtrl) {
                var uncheckable;
                scope.btnRadioVal = getRealAttr(scope.$parent.$parent, attrs.btnRadioVal, false);

                // 默认值为false
                scope.uncheckable = getRealAttr(scope.$parent.$parent, attrs.uncheckable, false);

                // 控制双向数据绑定
                if (angular.isDefined(attrs.uncheckable)) {
                    uncheckable = attrs.uncheckable;
                    scope.$parent.$parent.$watch(uncheckable, function (val) {
                        scope.uncheckable = val;
                    });
                }
                var render = scope.ngModelCtrl.$render;
                // 重写render方法
                scope.ngModelCtrl.$render = function () {
                    // 第二个参数确定是否添加样式
                    element.toggleClass(btnRadioCtrl.activeClass, angular.equals(scope.ngModelCtrl.$modelValue, scope.btnRadioVal)); // 添加类样式
                    render();
                };

                // 外部触发事件,修改ng-model的值
                element.on(btnRadioCtrl.toggleEvent, function () {
                    if (angular.isDefined(attrs.disabled) || attrs.ngDisabled) {
                        return;
                    }
                    var isActive = element.hasClass(btnRadioCtrl.activeClass);  //获取当前radio激活状态
                    if (!isActive || scope.uncheckable) {  // 非激活状态
                        scope.ngModelCtrl.$setViewValue(isActive ? null : scope.btnRadioVal);
                        scope.$apply(
                            function () {
                                scope.ngModelCtrl.$render();
                            }
                        );
                    }
                });

                /**
                 * 在父作用scope解析属性值
                 * @param {object} scope 变量所在scope域
                 * @param {string} val 从标签上获取的属性值
                 * @param {string} defaultVal 属性默认值
                 * @returns {*}
                 */
                function getRealAttr(scope, val, defaultVal) {
                    if (angular.isDefined(val)) {
                        return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
                    } else {
                        return defaultVal;
                    }
                }
            }
        };
    }])
    .directive('uixButtonCheckbox', function () {
        return {
            require: 'uixButtonCheckbox',
            controller: 'buttonGroupController',
            scope: true,
            link: function (scope, element, attrs, btnCheckboxCtrl) {
                scope.btnCheckboxFalse = getRealAttr(scope.$parent.$parent, attrs.btnCheckboxFalse, false);
                scope.btnCheckboxTrue = getRealAttr(scope.$parent.$parent, attrs.btnCheckboxTrue, true);

                scope.ngModel[attrs.name] = angular.isDefined(scope.ngModel[attrs.name]) ? scope.ngModel[attrs.name] : scope.btnCheckboxFalse; // 初始化model值
                var render = scope.ngModelCtrl.$render;
                scope.ngModelCtrl.$render = function () {
                    var ele = scope.ngModelCtrl.$modelValue ? scope.ngModelCtrl.$modelValue[attrs.name] : null;
                    element.toggleClass(btnCheckboxCtrl.activeClass, angular.equals(ele, scope.btnCheckboxTrue)); // 添加类样式
                    render();
                };

                // 外部触发事件,修改ng-model的值
                element.on(btnCheckboxCtrl.toggleEvent, function () {
                    if (angular.isDefined(attrs.disabled) || attrs.ngDisabled) {
                        return;
                    }
                    var isActive = element.hasClass(btnCheckboxCtrl.activeClass);  //获取当前radio激活状态
                    scope.ngModel[ attrs.name ] = isActive ? scope.btnCheckboxFalse : scope.btnCheckboxTrue;
                    scope.ngModelCtrl.$setViewValue(scope.ngModel);
                    scope.$apply(
                        function () {
                            scope.ngModelCtrl.$render();
                        }
                    );
                });

                /**
                 * 在父作用scope解析属性值
                 * @param {object} scope 变量所在scope域
                 * @param {string} val 从标签上获取的属性值
                 * @param {string} defaultVal 属性默认值
                 * @returns {*}
                 */
                function getRealAttr(scope, val, defaultVal) {
                    if (angular.isDefined(val)) {
                        return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
                    } else {
                        return defaultVal;
                    }
                }

            }
        };
    })
    .directive('uixButtonGroup', ['$compile', '$interpolate', '$parse', function ($compile, $interpolate, $parse) {
        return {
            require: 'ngModel',
            restrict: 'AE',
            scope: {},
            templateUrl: 'templates/buttonGroup.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, ngModelCtrl, transclude) {
                scope.ngModelCtrl = ngModelCtrl;
                scope.ngModel = $parse(attrs.ngModel)(scope.$parent);

                scope.type = getRealAttr(scope.$parent, attrs.bgType, 'radio');


                angular.forEach(transclude(), function (ele) {
                    if (angular.isDefined((ele.outerHTML))) {
                        ele = angular.element($interpolate(ele.outerHTML)(scope.$parent).replace('"{', '"{').replace('}"', '"}"')).attr('uix-button-' + scope.type, '');
                        ele.addClass('btn-item');  // 添加一个公共类
                        element.append($compile(ele)(scope));
                    }
                });

                /**
                 * 在父作用scope解析属性值
                 * @param {object} scope 变量所在scope域
                 * @param {string} val 从标签上获取的属性值
                 * @param {string} defaultVal 属性默认值
                 * @returns {*}
                 */
                function getRealAttr(scope, val, defaultVal) {
                    if (angular.isDefined(val)) {
                        return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
                    } else {
                        return defaultVal;
                    }
                }
            }
        };
    }]);
