/**
 * button
 * 按钮指令
 * Author:penglu02@meituan.com
 * Date:2016-01-12
 */
angular.module('ui.xg.button', [])
    .directive('uixButton', [function () {
        return {
            restrict: 'E',
            scope: {
                loading: '=?'
            },
            replace: true,
            transclude: true,
            templateUrl: 'templates/button.html',
            link: function (scope, element, attrs) {

                // 默认值处理
                if (angular.isUndefined(attrs.loading)) {
                    scope.loading = false;
                }

                scope.type = getRealAttr(scope.$parent, attrs.bType, 'button');

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
