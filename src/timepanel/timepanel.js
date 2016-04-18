/**
 * timepanel
 * timepanel directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.fugu.timepanel', [])
    .constant('fuguTimepanelConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        showSeconds: true,
        mousewheel: true,
        arrowkeys: true
    })
    .filter('smallerValue', function () {
        return function (input, maxValue, step) {
            input = parseInt(input, 10) - parseInt(step, 10);
            if (input < 0) {
                input = maxValue;
            }
            if (input < 10) {
                input = '0' + input;
            }
            return input;
        }
    })
    .filter('largerValue', function () {
        return function (input, maxValue, step) {
            input = parseInt(input, 10) + parseInt(step, 10);
            if (input > maxValue) {
                input = 0;
            }
            if (input < 10) {
                input = '0' + input
            }
            return input;
        }
    })
    .controller('fuguTimepanelCtrl', ['$scope', '$attrs', '$parse','$log', 'fuguTimepanelConfig', 'smallerValueFilter', 'largerValueFilter', function ($scope, $attrs, $parse,$log, timepanelConfig, smallerValueFilter, largerValueFilter) {
        var ngModelCtrl = {$setViewValue: angular.noop};

        this.init = function (_ngModelCtrl, inputs) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function (modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
            //$scope.$$postDigest(function(){}); // 如果showSeconds用的是ng-if，此时second还没有插入DOM，无法获取元素和绑定事件
            var hoursInputEl = inputs.eq(0),
                minutesInputEl = inputs.eq(1),
                secondsInputEl = inputs.eq(2);
            hoursInputEl.on('focus', function () {
                hoursInputEl[0].select();
            });
            minutesInputEl.on('focus', function () {
                minutesInputEl[0].select();
            });
            secondsInputEl.on('focus', function () {
                secondsInputEl[0].select();
            });

            var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepanelConfig.mousewheel;
            if (mousewheel) {
                this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
            }
            var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepanelConfig.arrowkeys;
            if (arrowkeys) {
                this.setupArrowkeyEvents(hoursInputEl, minutesInputEl, secondsInputEl);
            }
        };

        $scope.hourStep = angular.isDefined($attrs.hourStep) ? $scope.$parent.$eval($attrs.hourStep) : timepanelConfig.hourStep;
        $scope.minuteStep = angular.isDefined($attrs.minuteStep) ? $scope.$parent.$eval($attrs.minuteStep) : timepanelConfig.minuteStep;
        $scope.secondStep = angular.isDefined($attrs.secondStep) ? $scope.$parent.$eval($attrs.secondStep) : timepanelConfig.secondStep;
        $scope.showSeconds = timepanelConfig.showSeconds;
        if ($attrs.showSeconds) {
            $scope.$parent.$watch($parse($attrs.showSeconds), function (value) {
                $scope.showSeconds = !!value;
            });
        }
        $scope.decrease = function (type, maxValue) {
            $scope[type] = smallerValueFilter($scope[type], maxValue, $scope[type + 'Step']);
            changeHandler();
        };
        $scope.increase = function (type, maxValue) {
            $scope[type] = largerValueFilter($scope[type], maxValue, $scope[type + 'Step']);
            changeHandler();
        };
        $scope.changeInputValue = function (type, maxValue) {
            if (isNaN($scope[type])) {
                return;
            }
            $scope[type] = parseInt($scope[type], 10);
            if ($scope[type] < 0) {
                $scope[type] = 0;
            }
            if ($scope[type] > maxValue) {
                $scope[type] = maxValue;
            }
            $scope[type] = addZero($scope[type]);
            changeHandler();
        };
        this.render = function () {
            var date = ngModelCtrl.$modelValue;

            if (isNaN(date)) {
                $log.warn('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                date = new Date(); // fix #1 如果没有传入日期,或者清空的话,设置当前time
            }
            $scope.hour = date ? addZero(date.getHours()) : null;
            $scope.minute = date ? addZero(date.getMinutes()) : null;
            $scope.second = date ? addZero(date.getSeconds()) : null;
        };
        this.setupMousewheelEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
            var isScrollingUp = function (e) {
                if (e.originalEvent) {
                    e = e.originalEvent;
                }
                var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
                return e.detail || delta > 0;
            };

            hoursInputEl.bind('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('hour', 23) : $scope.decrease('hour', 23));
                e.preventDefault();
            });

            minutesInputEl.bind('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('minute', 59) : $scope.decrease('minute', 59));
                e.preventDefault();
            });

            secondsInputEl.bind('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('second', 59) : $scope.decrease('second', 59));
                e.preventDefault();
            });
        };

        this.setupArrowkeyEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
            hoursInputEl.bind('keydown', arrowkeyEventHandler('hour', 23));
            minutesInputEl.bind('keydown', arrowkeyEventHandler('minute', 59));
            secondsInputEl.bind('keydown', arrowkeyEventHandler('second', 59));
        };
        function changeHandler() {
            var dt = angular.copy(ngModelCtrl.$modelValue);
            dt.setHours($scope.hour);
            dt.setMinutes($scope.minute);
            dt.setSeconds($scope.second);
            if ($scope.onChange) {
                var fn = $scope.onChange();
                if (angular.isFunction(fn)) {
                    fn(dt);
                }
            }
            ngModelCtrl.$setViewValue(dt);
            ngModelCtrl.$render();
        }

        function arrowkeyEventHandler(type, maxValue) {
            return function (e) {
                if (e.which === 38) { // up
                    e.preventDefault();
                    $scope.increase(type, maxValue);
                    $scope.$apply();
                } else if (e.which === 40) { // down
                    e.preventDefault();
                    $scope.decrease(type, maxValue);
                    $scope.$apply();
                }
            }
        }

        function addZero(value) {
            return value > 9 ? value : '0' + value;
        }
    }])
    .directive('fuguTimepanel', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/timepanel.html',
            replace: true,
            require: ['fuguTimepanel', 'ngModel'],
            scope: {
                onChange: '&'
            },
            controller: 'fuguTimepanelCtrl',
            link: function (scope, el, attrs, ctrls) {
                var timepanelCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                timepanelCtrl.init(ngModelCtrl, el.find('input'));
            }
        }
    });