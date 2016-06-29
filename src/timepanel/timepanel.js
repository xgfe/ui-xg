/**
 * timepanel
 * timepanel directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.xg.timepanel', [])
    .constant('uixTimepanelConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        showSeconds: true,
        mousewheel: true,
        arrowkeys: true,
        readonlyInput: false
    })
    .controller('uixTimepanelCtrl', ['$scope', '$element', '$attrs', '$parse', '$log', 'uixTimepanelConfig', function ($scope, $element, $attrs, $parse, $log, timepanelConfig) {
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

        // show seconds
        $scope.showSeconds = timepanelConfig.showSeconds;
        if ($attrs.showSeconds) {
            $scope.$parent.$watch($parse($attrs.showSeconds), function (value) {
                $scope.showSeconds = !!value;
                if (!$scope.showSeconds) {
                    $scope.panelStyles = {width: '75px'};
                } else {
                    $scope.panelStyles = {width: '50px'};
                }
            });
        }
        // readonly input
        $scope.readonlyInput = timepanelConfig.readonlyInput;
        if ($attrs.readonlyInput) {
            $scope.$parent.$watch($parse($attrs.readonlyInput), function (value) {
                $scope.readonlyInput = !!value;
            });
        }
        // 使用对象存储是否可以点击某一个时间进行增长或减少
        $scope.isMaxTime = {};
        $scope.isMinTime = {};
        //减少时/分/秒
        $scope.decrease = function (type) {
            if ($scope.isMinTime[type]) {
                return;
            }
            var step = parseInt($scope[type + 'Step']);
            var oldVal = parseInt($scope[type], 10);
            var smallerVal = $scope['smaller' + type[0].toUpperCase() + type.slice(1)];
            if (timeIsOutOfRange(type, smallerVal)) {
                return;
            }
            $scope[type] = smallerVal;
            if (oldVal - step < 0) {
                carryTime(type, 'decrease');
            }
            changeHandler();
        };
        //增加时/分/秒
        $scope.increase = function (type) {
            if ($scope.isMaxTime[type]) {
                return;
            }
            var maxValue = type === 'minute' || type === 'second' ? 60 : 24;
            var step = parseInt($scope[type + 'Step']);
            var oldVal = parseInt($scope[type], 10);
            var largerValue = $scope['larger' + type[0].toUpperCase() + type.slice(1)];
            if (timeIsOutOfRange(type, largerValue)) {
                return;
            }
            $scope[type] = largerValue;
            if (oldVal + step >= maxValue) {
                carryTime(type, 'increase');
            }
            changeHandler();
        };
        $scope.$watch('hour', function (newVal) {
            var step = parseInt($scope.hourStep);
            $scope.smallerHour = getSmallerVal(newVal, step, 24);
            $scope.largerHour = getLargerVal(newVal, step, 24);
        });
        $scope.$watch('minute', function (newVal) {
            var step = parseInt($scope.minuteStep);
            $scope.smallerMinute = getSmallerVal(newVal, step, 60);
            $scope.largerMinute = getLargerVal(newVal, step, 60);
        });
        $scope.$watch('second', function (newVal) {
            var step = parseInt($scope.secondStep);
            $scope.smallerSecond = getSmallerVal(newVal, step, 60);
            $scope.largerSecond = getLargerVal(newVal, step, 60);
        });
        function getSmallerVal(val, step, maxValue) {
            var result = parseInt(val, 10) - parseInt(step, 10);
            if (result < 0) {
                result = maxValue + result;
            }
            if (result < 10) {
                result = '0' + result;
            }
            return result;
        }

        function getLargerVal(val, step, maxValue) {
            var result = parseInt(val, 10) + parseInt(step, 10);
            if (result >= maxValue) {
                result = result - maxValue;
            }
            if (result < 10) {
                result = '0' + result
            }
            return result;
        }

        // 时间进位,秒和分钟满60进一
        var timeCarrys = {
            hour: null,
            minute: 'hour',
            second: 'minute'
        };

        function carryTime(type, dir) {
            var val = timeCarrys[type];
            if (!val) {
                return;
            }
            $scope[dir](val);
        }

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

            hoursInputEl.on('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('hour') : $scope.decrease('hour'));
                e.preventDefault();
            });

            minutesInputEl.on('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('minute') : $scope.decrease('minute'));
                e.preventDefault();
            });

            secondsInputEl.on('mousewheel wheel', function (e) {
                $scope.$apply(isScrollingUp(e) ? $scope.increase('second') : $scope.decrease('second'));
                e.preventDefault();
            });
        };

        this.setupArrowkeyEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
            hoursInputEl.on('keydown', arrowkeyEventHandler('hour'));
            minutesInputEl.on('keydown', arrowkeyEventHandler('minute'));
            secondsInputEl.on('keydown', arrowkeyEventHandler('second'));
        };
        function changeHandler() {
            var dt = angular.copy(ngModelCtrl.$modelValue);
            if(timeIsInvalid(dt)){
                dt = new Date();
            }
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

        // 判断time是否是时间对象
        function timeIsInvalid(time) {
            var dt = new Date(time);
            return isNaN(dt.getTime());
        }

        /**
         * 判断时间是否超出min和max设置的时间范围
         * @param type - 类型,hour,minute,second
         * @param value - 需要改变的值
         * @returns {boolean}
         */
        function timeIsOutOfRange(type, value) {
            var method = 'set' + type[0].toUpperCase() + type.slice(1) + 's';
            var result = false;
            var currentTime, minTime, maxTime;
            if (angular.isDefined($attrs.minTime) && angular.isDefined($scope.minTime)) {
                if (timeIsInvalid($scope.minTime)) {
                    $log.warn('Timepicker directive: "min-time" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                } else {
                    currentTime = buildDate();
                    minTime = new Date($scope.minTime);
                    currentTime[method](value);
                    result = currentTime < minTime;
                }
            }
            if (result) {
                return true;
            }
            if (angular.isDefined($attrs.maxTime) && angular.isDefined($scope.maxTime)) {
                if (timeIsInvalid($scope.maxTime)) {
                    $log.warn('Timepicker directive: "max-time" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                } else {
                    currentTime = buildDate();
                    maxTime = new Date($scope.maxTime);
                    currentTime[method](value);
                    result = currentTime > maxTime;
                }
            }
            return result;
        }

        // 根据输入框的内容生成时间
        function buildDate() {
            var dt = new Date();
            dt.setHours($scope.hour);
            dt.setMinutes($scope.minute);
            dt.setSeconds($scope.second);
            return dt;
        }

        function arrowkeyEventHandler(type) {
            return function (e) {
                if (e.which === 38) { // up
                    e.preventDefault();
                    $scope.increase(type);
                    $scope.$apply();
                } else if (e.which === 40) { // down
                    e.preventDefault();
                    $scope.decrease(type);
                    $scope.$apply();
                }
            }
        }

        function addZero(value) {
            return value > 9 ? value : '0' + value;
        }
    }])
    .directive('uixTimepanel', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/timepanel.html',
            replace: true,
            require: ['uixTimepanel', 'ngModel'],
            scope: {
                onChange: '&',
                minTime: '=?',
                maxTime: '=?'
            },
            controller: 'uixTimepanelCtrl',
            link: function (scope, el, attrs, ctrls) {
                var timepanelCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                timepanelCtrl.init(ngModelCtrl, el.find('input'));
            }
        }
    });