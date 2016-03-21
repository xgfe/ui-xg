/**
 * datepicker
 * datepicker directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.fugu.datepicker', ['ui.fugu.calendar'])
    .constant('fuguDatepickerConfig',{
        minDate: null, // 最小可选日期
        maxDate: null, // 最大可选日期
        exceptions:[],  // 不可选日期中的例外,比如3月份的日期都不可选,但是3月15日却是可选择的
        format:'yyyy-MM-dd hh:mm:ss a' // 日期格式化
    })
    .service('fuguDatepickerService', ['$document', function($document) {
        var openScope = null;
        this.open = function(datepickerScope) {
            if (!openScope) {
                $document.on('click', closeDatepicker);
            }
            if (openScope && openScope !== datepickerScope) {
                openScope.showCalendar = false;
            }
            openScope = datepickerScope;
        };

        this.close = function(datepickerScope) {
            if (openScope === datepickerScope) {
                openScope = null;
                $document.off('click', closeDatepicker);
            }
        };

        function closeDatepicker(evt) {
            if (!openScope) { return; }
            var panelElement = openScope.getCanledarElement();
            var toggleElement = openScope.getToggleElement();
            if(panelElement && panelElement[0].contains(evt.target) ||
                toggleElement && toggleElement[0].contains(evt.target) ||
                angular.element(evt.target).hasClass('fugu-cal-day-inner') || // 选择下一个月的时候,会重新绘制日历面板,contains方法无效
                angular.element(evt.target).hasClass('fugu-cal-day')
            ){
                return;
            }
            openScope.showCalendar = false;
            openScope.$apply();
        }

    }])
    .controller('fuguDatepickerCtrl', ['$scope', '$element','$attrs','$log','dateFilter','fuguDatepickerService','fuguDatepickerConfig',
        function ($scope,$element, $attrs,$log,dateFilter,fuguDatepickerService,fuguDatepickerConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        var self = this;
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function (modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
        };
        $scope.showCalendar = false;
        this.toggle = function(open) {
            $scope.showCalendar = arguments.length ? !!open : !$scope.showCalendar;
        };
        this.showCalendar = function() {
            return $scope.showCalendar;
        };
        angular.forEach(['minDate','maxDate','exceptions','clearBtn'], function(key) {
            $scope[key] = angular.isDefined($attrs[key]) ? angular.copy($scope.$parent.$eval($attrs[key])) : fuguDatepickerConfig[key];
        });
        var format = angular.isDefined($attrs.format) ? $scope.$parent.$eval($attrs.format) : fuguDatepickerConfig.format;

        this.render = function () {
            var date = ngModelCtrl.$modelValue;
            if (isNaN(date)) {
                $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else {
                $scope.selectDate = ngModelCtrl.$modelValue;
                $scope.inputValue = dateFilter(date,format);
            }
        };
        // 显示隐藏日历
        $scope.toggleCalendarHandler  = function (evt) {
            $element.find('input')[0].blur();
            if(evt){
                evt.preventDefault();
            }
            if (!$scope.isDisabled) {
                self.toggle();
            }
        };

        // 获取日历面板和被点击的元素
        $scope.getCanledarElement = function () {
            return $element.find('.fugu-calendar');
        };
        $scope.getToggleElement = function () {
            return $element.find('.input-group');
        };
        // 清除日期
        $scope.clearDateHandler = function () {
            $scope.inputValue = null;
            $scope.selectDate = null;
            ngModelCtrl.$setViewValue(null);
            ngModelCtrl.$render();
        };
        $scope.$watch('showCalendar', function(showCalendar) {
            if (showCalendar) {
                fuguDatepickerService.open($scope);
            } else {
                fuguDatepickerService.close($scope);
            }
        });
        // 选择日期
        $scope.changeDateHandler = function (date) {
            $scope.inputValue = dateFilter(date,format);
            $scope.selectDate = date;
            ngModelCtrl.$setViewValue(date);
            ngModelCtrl.$render();
        };
        $scope.$on('$locationChangeSuccess', function() {
            $scope.showCalendar = false;
        });

    }])
    .directive('fuguDatepicker', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/datepicker.html',
            replace: true,
            require: ['fuguDatepicker','ngModel'],
            scope: {
                placeholder:'@',
                isDisabled:'=?ngDisabled'
            },
            controller: 'fuguDatepickerCtrl',
            link: function (scope, el, attrs, ctrls) {
                var datepickerCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                datepickerCtrl.init(ngModelCtrl);
            }
        }
    });