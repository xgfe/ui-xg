/**
 * timepicker
 * timepicker directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.fugu.timepicker', ['ui.fugu.timepanel', 'ui.fugu.position'])
    .constant('fuguTimepickerConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        readonlyInput: false,
        format: 'HH:mm:ss',
        size: 'md',
        showSeconds: false
    })
    .service('fuguTimepickerService', ['$document', function ($document) {
        var openScope = null;
        this.open = function (timepickerScope) {
            if (!openScope) {
                $document.on('click', closeTimepicker);
            }
            if (openScope && openScope !== timepickerScope) {
                openScope.showTimepanel = false;
            }
            openScope = timepickerScope;
        };

        this.close = function (timepickerScope) {
            if (openScope === timepickerScope) {
                openScope = null;
                $document.off('click', closeTimepicker);
            }
        };

        function closeTimepicker(evt) {
            if (!openScope) {
                return;
            }
            var panelElement = openScope.getTimepanelElement();
            var toggleElement = openScope.getToggleElement();
            if (panelElement && panelElement.contains(evt.target) ||
                toggleElement && toggleElement.contains(evt.target)) {
                return;
            }
            openScope.showTimepanel = false;
            openScope.$apply();
        }

    }])
    .controller('fuguTimepickerCtrl', ['$scope', '$element', '$compile', '$attrs', '$parse', '$log', 'fuguTimepickerService', 'fuguTimepickerConfig', 'dateFilter', '$timeout', '$fuguPosition',
        function ($scope, $element, $compile, $attrs, $parse, $log, fuguTimepickerService, timepickerConfig, dateFilter, $timeout, $fuguPosition) {
            var ngModelCtrl = {$setViewValue: angular.noop};
            var template = '<div class="fugu-timepicker-popover popover" ng-class="{in:showTimepanel}">' +
                '<div class="arrow"></div>' +
                '<div class="popover-inner">' +
                '<fugu-timepanel readonly-input="readonlyInput" hour-step="hourStep" minute-step="minuteStep" second-step="secondStep"class="fugu-timepicker-timepanel-bottom" ng-model="selectedTime" on-change="changeTime"min-time="minTime" max-time="maxTime" show-seconds="showSeconds"></fugu-timepanel>' +
                '</div></div>';
            this.init = function (_ngModelCtrl) {
                ngModelCtrl = _ngModelCtrl;
                ngModelCtrl.$render = this.render;
                ngModelCtrl.$formatters.unshift(function (modelValue) {
                    return modelValue ? new Date(modelValue) : null;
                });
                var timepanelDOM = $compile(template)($scope);
                $element.after(timepanelDOM);
            };
            var _this = this;
            /*
             fix 父组件的controller优先于子组件初始化,hourStep三个属性需要在子组件初始化的时候就传递进去
             不能在父组件执行link(link函数一般都是postLink函数)函数的时候执行
             http://xgfe.github.io/2015/12/22/penglu/link-controller/
             */
            $scope.hourStep = angular.isDefined($attrs.hourStep) ? $scope.$parent.$eval($attrs.hourStep) : timepickerConfig.hourStep;
            $scope.minuteStep = angular.isDefined($attrs.minuteStep) ? $scope.$parent.$eval($attrs.minuteStep) : timepickerConfig.minuteStep;
            $scope.secondStep = angular.isDefined($attrs.secondStep) ? $scope.$parent.$eval($attrs.secondStep) : timepickerConfig.secondStep;

            // readonly input
            $scope.readonlyInput = timepickerConfig.readonlyInput;
            if ($attrs.readonlyInput) {
                $scope.$parent.$watch($parse($attrs.readonlyInput), function (value) {
                    $scope.readonlyInput = !!value;
                });
            }
            // show-seconds
            $scope.showSeconds = timepickerConfig.showSeconds;
            if ($attrs.showSeconds) {
                $scope.$parent.$watch($parse($attrs.showSeconds), function (value) {
                    $scope.showSeconds = !!value;
                });
            }

            $scope.showTimepanel = false;
            this.toggle = function (open) {
                var show = arguments.length ? !!open : !$scope.showTimepanel;
                if (show) {
                    adjustPosition();
                }
                $scope.showTimepanel = show;
            };
            this.showTimepanel = function () {
                return $scope.showTimepanel;
            };
            var format = angular.isDefined($attrs.format) ? $scope.$parent.$eval($attrs.format) : timepickerConfig.format;
            this.render = function () {
                var date = ngModelCtrl.$viewValue;
                if (isNaN(date)) {
                    $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                } else if (date) {
                    $scope.selectedTime = date;
                    $scope.inputValue = dateFilter(date, format);
                }
            };
            // 这里使用onChange，而不是watch selectedTime属性，因为watch的话，会出现循环赋值，待解决
            $scope.changeTime = function (time) {
                ngModelCtrl.$setViewValue(time);
                ngModelCtrl.$render();
                var fn = $scope.onChange ? $scope.onChange() : angular.noop();
                if (angular.isDefined(fn)) {
                    fn();
                }
            };
            $scope.toggleTimepanel = function (evt) {
                $element.find('input')[0].blur();
                evt.preventDefault();
                if (!$scope.isDisabled) {
                    _this.toggle();
                }
            };
            $scope.getTimepanelElement = function () {
                return $element.next('.fugu-timepicker-popover')[0];
            };
            $scope.getToggleElement = function () {
                return $element[0].querySelector('.input-group');
            };
            $scope.$watch('showTimepanel', function (showTimepanel) {
                if (showTimepanel) {
                    fuguTimepickerService.open($scope);
                } else {
                    fuguTimepickerService.close($scope);
                }
            });
            $scope.$on('$locationChangeSuccess', function () {
                $scope.showTimepanel = false;
            });
            function adjustPosition() {
                var popoverEle = $element.next('.popover');
                var elePosition = $fuguPosition.positionElements($element, popoverEle, 'auto bottom-left');
                popoverEle.removeClass('top bottom');
                if (elePosition.placement.indexOf('top') !== -1) {
                    popoverEle.addClass('top');
                } else {
                    popoverEle.addClass('bottom');
                }
                popoverEle.css({
                    top: elePosition.top + 'px',
                    left: elePosition.left + 'px'
                });
            }
        }])
    .directive('fuguTimepicker', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/timepicker.html',
            replace: true,
            require: ['fuguTimepicker', 'ngModel'],
            scope: {
                isDisabled: '=?ngDisabled',
                minTime: '=?',
                maxTime: '=?',
                size: '@',
                placeholder: '@',
                onChange: '&?'
            },
            controller: 'fuguTimepickerCtrl',
            link: function (scope, el, attrs, ctrls) {
                var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                timepickerCtrl.init(ngModelCtrl);
            }
        }
    });