angular.module('ui.xg.rate', [])
    .directive('uixRate', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            require: '?ngModel',
            scope: {
                readOnly: '=?',
                onChange: '&?'
            },
            templateUrl: 'templates/rate.html',
            transclude: true,
            replace: true,
            link: function (scope, element, attrs, ngModelCtrl) {
                var timer = null; //定时器,防抖动
                var oldIdx;
                scope.rates = [];
                // 初始化icon个数.默认5个
                scope.count = getRealAttr(scope.$parent, attrs.count, 5);
                scope.count = scope.count <= 0 ? 5 : scope.count;  // 不能为0个
                scope.ngModel = formatVal(getRealAttr(scope.$parent, attrs.ngModel));  // 获取绑定model
                scope.ngModel = scope.ngModel > scope.count ? scope.count : scope.ngModel; //如果超出指定值,则取最大值
                scope.ngModel = scope.ngModel < 0 ? 0 : scope.ngModel; //如果低于指定值,则取最小值

                scope.$watch('ngModel', function (val) {
                    ngModelCtrl.$setViewValue(val);
                    ngModelCtrl.$render();
                });

                // 设置icon样式,可以理解为'fa fa-icon'即class='fa fa-icon'等
                scope.ratingIcon = getRealAttr(scope.$parent, attrs.ratingIcon, 'glyphicon glyphicon-star');

                // 暂时只考虑遮盖色
                scope.ratingSelectColor = getRealAttr(scope.$parent, attrs.ratingSelectColor, '#f5a623');

                // 点击选中是否可取消,默认不行
                scope.enableReaset = getRealAttr(scope.$parent, attrs.enableReaset, false); // 默认


                // 是否只读,双向数据绑定,默认为false
                scope.readOnly = angular.isDefined(scope.readOnly) ? scope.readOnly : false;

                scope.$watch('ngModel', function (newVal, oldVal) {
                    if (newVal !== oldVal) {  // 评分发生改变
                        scope.onChange({
                            $oldVal: oldVal,
                            $newVal: newVal
                        });
                    }
                });

                // 动态生成icon数组对象
                for (var i = 0; i < scope.count; i++) {
                    var rate = {};
                    rate.ratingIcon = scope.ratingIcon;  // 图标
                    rate.clickNum = 0;   // icon点击次数,默认0次
                    rate.selectFlag = 0;  // 默认不选中,控制是否选中
                    scope.rates.push(rate);
                }


                scope.enterLiFn = function (idx) {
                    if (scope.readOnly) {
                        return;
                    }
                    scope.changeFlag = false;
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                    var i;
                    var ele = element.find('li');
                    // 选中所有
                    for (i = 0; i <= idx; i++) {
                        ele.eq(i).css('color', scope.ratingSelectColor);
                        ele.eq(i).addClass('full-score');
                    }
                    for (i = idx + 1; i < scope.count; i++) {
                        ele.eq(i).removeClass('full-score');
                        ele.eq(i).css('color', '#e9e9e9');
                    }
                    element.find('li').eq(idx).addClass('max-icon');
                    if (oldIdx !== idx) {
                        ele.eq(oldIdx).removeClass('max-icon');
                    }
                };

                scope.leaveLiFn = function (idx) {
                    if (scope.readOnly) {
                        return;
                    }
                    oldIdx = idx;
                    // 防抖动
                    timer = $timeout(function () {
                        if (scope.changeFlag) {  // 选择过
                            return; //不做任何操作
                        }
                        var i;
                        var ele = element.find('li');
                        for (i = 0; i < scope.ngModel; i++) {
                            ele.eq(i).addClass('full-score');
                            ele.eq(i).css('color', scope.ratingSelectColor);
                        }
                        for (i = scope.ngModel; i < scope.count; i++) {
                            ele.eq(i).removeClass('full-score');
                            ele.eq(i).css('color', '#e9e9e9');
                        }
                        ele.eq(idx).removeClass('max-icon');
                    }, 100);
                };

                scope.clickLiFn = function (idx) {
                    if (scope.readOnly) {
                        return;
                    }
                    scope.changeFlag = true; // 改变选择
                    scope.ngModel = idx + 1; //重新赋值
                };

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

                // 所有格式都转换为整数,如果为字符串,则转换为0,小于0的值会转换为0
                function formatVal(val) {
                    if (!angular.isNumber(val)) {
                        val = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
                    }
                    return Math.round(val);
                }

            }
        };
    }]);

