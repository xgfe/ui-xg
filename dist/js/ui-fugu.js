/*
 * angular-ui-fugu
 * Version: 0.0.1 - 2016-03-25
 * License: ISC
 */
<<<<<<< HEAD
angular.module("ui.fugu", ["ui.fugu.tpls","ui.fugu.alert","ui.fugu.button","ui.fugu.buttonGroup","ui.fugu.timepanel","ui.fugu.calendar","ui.fugu.datepicker","ui.fugu.dropdown","ui.fugu.modal","ui.fugu.pager","ui.fugu.searchBox","ui.fugu.sortable","ui.fugu.switch","ui.fugu.timepicker","ui.fugu.tree"]);
angular.module("ui.fugu.tpls", ["alert/templates/alert.html","button/templates/button.html","buttonGroup/templates/buttonGroup.html","timepanel/templates/timepanel.html","calendar/templates/calendar.html","datepicker/templates/datepicker.html","dropdown/templates/dropdown-choices.html","dropdown/templates/dropdown.html","modal/templates/backdrop.html","modal/templates/window.html","pager/templates/pager.html","searchBox/templates/searchBox.html","switch/templates/switch.html","timepicker/templates/timepicker.html","tree/templates/tree-node.html","tree/templates/tree.html"]);
=======
angular.module("ui.fugu", ["ui.fugu.tpls","ui.fugu.alert","ui.fugu.button","ui.fugu.buttonGroup","ui.fugu.timepanel","ui.fugu.calendar","ui.fugu.datepicker","ui.fugu.dropdown","ui.fugu.notification","ui.fugu.pager","ui.fugu.searchBox","ui.fugu.switch","ui.fugu.timepicker","ui.fugu.tree"]);
angular.module("ui.fugu.tpls", ["alert/templates/alert.html","button/templates/button.html","buttonGroup/templates/buttonGroup.html","timepanel/templates/timepanel.html","calendar/templates/calendar.html","datepicker/templates/datepicker.html","dropdown/templates/dropdown-choices.html","dropdown/templates/dropdown.html","notification/templates/alert.html","notification/templates/notification.html","pager/templates/pager.html","searchBox/templates/searchBox.html","switch/templates/switch.html","timepicker/templates/timepicker.html","tree/templates/tree-node.html","tree/templates/tree.html"]);
>>>>>>> feat(notification): add notification
/**
 * alert
 * 警告提示指令
 * Author:heqingyang@meituan.com
 * Date:2015-01-11
 */
angular.module('ui.fugu.alert',[])
.controller('fuguAlertCtrl',['$scope','$attrs', '$timeout','$interpolate', function ($scope,$attrs,$timeout,$interpolate) {

    //指令初始化
    function initConfig(){
        if($scope.close&&($scope.close=="true"||$scope.close=="1")) {$scope.closeable=true;}
        else {$scope.closeable = false;}
        $scope.defaultclose = false;
        $scope.hasIcon = $attrs.hasIcon&&$attrs.hasIcon=="true";
    }
    initConfig();

    //添加默认close方法
    if(!$attrs.closeFunc){
        $scope.closeFunc = function(){
            $scope.defaultclose = true;
        }
    }

    //判断是否显示图标
    var type = angular.isDefined($attrs.type)? $interpolate($attrs.type)($scope.$parent): null;

    if($scope.hasIcon) {
    switch(type){
        case 'danger':
            $scope.iconClass = 'remove-sign';
            break;
        case 'success':
            $scope.iconClass = 'ok-sign';
            break;
        case 'info':
            $scope.iconClass = 'info-sign';
            break;
        default:
            $scope.iconClass = 'exclamation-sign';
            break;
        }
    }

    //判断是否有时间参数
    var dismissOnTimeout = angular.isDefined($attrs.dismissOnTimeout)?
        $interpolate($attrs.dismissOnTimeout)($scope.$parent): null;
    if(dismissOnTimeout) {
        $timeout(function(){
            $scope.closeFunc();
        },parseInt(dismissOnTimeout, 10))
    }
}])
.directive('fuguAlert',function () {
    return {
        restrict: 'E',
        templateUrl: function(element, attrs){
            return attrs.templateUrl || 'templates/alert.html';
        },
        replace:true,
        transclude:true,
        scope:{
            type:'@',
            close : '@',
            closeFunc : '&',
            closeText : '@'
        },
        controller:'fuguAlertCtrl',
        controllerAs: 'alert'
    }
});
/**
 * button
 * 按钮指令
 * Author:penglu02@meituan.com
 * Date:2016-01-12
 */
angular.module('ui.fugu.button', [])
    .constant('buttonConfig', {

    })
    .directive('fuguButton', [function(){
        return {
            restrict: 'AE',
            scope:{
                disabled: '=?',   // 对于不是必须传递需要使用?
                loading: '=?',
                onClick : '&?click'
            },
            replace:false,
            templateUrl: 'templates/button.html',
            controller: 'buttonController',
            link: function(scope, element, attrs){
               element = angular.element(element.children()[0]);
               var btnClass = getAttrValue(attrs.btnclass, 'default'), // 样式:primary|info等,默认default
                    size  = getAttrValue(attrs.size, 'default'), // 大小:x-small,small等,默认为default
                    block = getAttrValue(attrs.block, false), //是否按100%的width填充父标签,默认为false
                    active = getAttrValue(attrs.active, false),// 激活状态,默认为false
                    type = getAttrValue(attrs.type, 'button'), // 按钮类型:button|submit|reset,默认为button
                    text = getAttrValue(attrs.text, 'button'), //按钮显示文本,默认为Button
                    icon = getAttrValue(attrs.icon, ''); //按钮图标,默认没有
                scope.text = scope.initText = text;
                scope.type = type;
                scope.icon = 'glyphicon-' + icon;
                scope.iconFlag = icon !== ''  ? true : false;
                scope.disabled =  scope.initDisabled =angular.isDefined(scope.disabled) ?  scope.disabled : false; // 是否不可用,默认为false
                scope.loading = angular.isDefined(scope.loading) ?  scope.loading : false; // 是否有加载效果,默认为false
               /**
                 * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
                 * @param {string} attributeValue 标签绑定数据(可解析|定值)
                 * @param {string | boolean} defaultValue 默认值
                 * @returns {*} 最终值
                 */
               function getAttrValue(attributeValue, defaultValue){
                    var val = scope.$parent.$eval(attributeValue);   //变量解析
                    return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
               }
               element.addClass('btn-' + btnClass); //设置按钮样式

               // 设置按钮大小
               switch(size)
               {
                    case 'large':
                        size = 'lg';
                        break;
                    case 'small':
                        size = 'sm';
                        break;
                    case 'x-small':
                        size = 'xs';
                        break;
                    default:
                        size = 'default';
                        break;
               }

               element.addClass('btn-' + size); //设置按钮大小

               // 设置block
               if(block){
                    element.addClass('btn-block');
               }

               // 设置active状态
               if(active){
                    element.addClass('active');
               }

               scope.$watch('disabled', function(val){
                    if(val){
                        element.attr('disabled', 'disabled');
                    }else{
                        element.removeAttr('disabled');
                    }
               });

               // button绑定click事件
               element.bind('click', function(){
                    if(scope.onClick){
                        scope.onClick();
                        scope.$parent.$apply();
                    }
               });
               scope.$watch('loading', function(val){
                    var spanEle = element.children('span.glyphicon-refresh-animate'),
                        ele = null;
                   if(val){
                        scope.disabled = val;
                        if(spanEle.length > 0){
                            spanEle.removeClass('hidden');
                        }else{
                            scope.text = 'isLoading...';
                            ele = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';
                            element.prepend(ele);
                        }
                    }else{
                        scope.disabled = scope.initDisabled;
                        scope.text = scope.initText;
                        if(spanEle.length > 0){
                            spanEle.addClass('hidden');
                        }
                    }
               });
            }
        }
    }])
    .controller('buttonController', ['$scope', function($scope){
        $scope.btnClassArr = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'];  // 所有可设置样式
        $scope.sizeArr = ['large', 'small', 'x-small', 'default'];  // 所有可设置大小
        $scope.typeArr = ['button', 'reset', 'submit'];  // 所有可设置类型
    }]);

/**
 * button
 * 按钮组指令
 * Author:penglu02@meituan.com
 * Date:2016-01-23
 */
angular.module('ui.fugu.buttonGroup', [])
    .constant('buttonGroupConfig', {
        size : 'default',   // 按钮组大小:x-small,small,default,larger
        type : 'radio',  // 按钮组类型:radio 或者 checkbox类型
        showClass : 'default', //按钮组样式:danger | warning | default | success | info ｜ primary
        checkboxTrue : true, // 按钮选中对应ngModel的值
        checkboxFalse : false, //按钮不选对应ngModel的值
        disabled : false  // 按钮组不可用状态
    })
    .controller('buttonGroupController',['$transclude', '$scope', '$element', '$attrs', 'buttonGroupConfig', function($transclude, $scope, $element, $attrs, buttonGroupConfig){
        var transcludeEles = $transclude(),// 获取嵌入元素 TODO:1.2.25版本不需要传入$scope，否则会报错
            i = 0,
            tagName,
            childElements = [],
            btnObj = {};

        // 根据插入按钮，生成嵌入元素数据对象
        for (;i < transcludeEles.length; i++ ){
            tagName = transcludeEles[i].tagName;
            if(tagName && tagName.toLocaleLowerCase() === 'button'){
                btnObj = {};
                btnObj.value = transcludeEles[i].innerText;   // 获取button显示内容
                btnObj.btnRadio = getAttrValue(angular.element(transcludeEles[i]).attr('btn-radio'), "");  //获取btn-radio属性对应值:控制选中状态
                btnObj.btnCheckbox = getAttrValue(angular.element(transcludeEles[i]).attr('btn-checkbox'), "");  //获取btn-checkbox属性对应值:控制勾选状态
                childElements.push(btnObj);
            }
        }

        $scope.buttonGroup = {};
        $scope.buttons = childElements;
        $scope.type = getAttrValue($attrs.type, buttonGroupConfig.type);  //按钮组类型:radio | checkbox
        $scope.size = getAttrValue($attrs.size, buttonGroupConfig.size);  // 按钮组大小
        $scope.showClass = getAttrValue($attrs.showClass, buttonGroupConfig.showClass); //按钮组样式
        $scope.checkboxTrue = getAttrValue($attrs.checkboxTrue, buttonGroupConfig.checkboxTrue);   //checkbox选中对应model值
        $scope.checkboxFalse = getAttrValue($attrs.checkboxFalse, buttonGroupConfig.checkboxFalse);   //checkbox不选对应model值
        $scope.disabled = getAttrValue($attrs.disabled, buttonGroupConfig.disabled);

        // 设置按钮大小,转变成class
        switch($scope.size)
        {
            case 'large':
                $scope.size = 'btn-lg';
                break;
            case 'small':
                $scope.size = 'btn-sm';
                break;
            case 'x-small':
                $scope.size = 'btn-xs';
                break;
            default:
                $scope.size = 'btn-default';
                break;
        }

        // 设置按钮样式类型,转变成class
        $scope.showClass = "btn-" + $scope.showClass;

        // 设置不可用
        if($scope.disabled) {
            $scope.disabled = 'disabled';
        }
        /**
         * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
         * @param {string} attributeValue 标签绑定数据(可解析|定值)
         * @param {string | boolean} defaultValue 默认值
         * @returns {*} 最终值
         */
        function getAttrValue(attributeValue, defaultValue){
            var val = $scope.$parent.$eval(attributeValue);   //变量解析
            return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
        }
    }])
    .directive('fuguButtonGroup', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                ngModel: '@'
            },
            require: '^ngModel',
            templateUrl: 'templates/buttonGroup.html',
            transclude:true,
            controller: 'buttonGroupController',
            link: function (scope, element, attrs, ngModelCtrl) {
                var _scope = scope,
                    o, i;
                if(scope.type === 'radio'){   //radio类型

                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        if(ngModelCtrl.$viewValue){
                            scope.modelObj = ngModelCtrl.$viewValue;  // 获取元素的model
                        }
                        angular.forEach(scope.buttons, function(val){
                            if(!val.btnRadio){  // 没有设置btn-radio,使用元素的text作为默认值
                                val.btnRadio = val.value;
                            }

                            // 判断按钮组是否选中:btn-radio设置model值
                            if(angular.equals(ngModelCtrl.$viewValue, val.btnRadio)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                            }
                        });

                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }
                        ngModelCtrl.$setViewValue(btn.btnRadio); // 修改选中对应model值
                        ngModelCtrl.$render();
                    };
                }else{    // checkbox类型
                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        if(ngModelCtrl.$viewValue){
                            scope.modelObj = ngModelCtrl.$viewValue;   // 获取元素的model
                        }
                        angular.forEach(scope.buttons, function(val, idx){
                            i = 0;
                            if(!val.btnCheckbox){  // 没有设置值,则使用对应ng-model的key作为默认值
                                for(o in scope.modelObj){
                                    if(i === idx){
                                        val.btnCheckbox = o;
                                        break;
                                    }else{
                                        i++;
                                    }
                                }
                            }

                            // 判断给定当前checkbox状态是否选中model的值(btn-checkbox对应model中的值是否为true)
                            // btn-checkbox值的设置为ng-model对应对象的key
                            if(angular.equals(scope.modelObj[val.btnCheckbox], scope.checkboxTrue)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                                val.active = '';
                            }
                        });
                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }

                        if(btn.active){
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxFalse; // 修改选中状态:选中->不选,对应model值
                        }else{
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxTrue; //修改选中状态:不选->选中,对应model值
                        }
                        ngModelCtrl.$setViewValue(scope.modelObj);  // 修改model
                        ngModelCtrl.$render();
                    };
                }
            }
        }
    }]);

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
                $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else {
                $scope.hour = date ? addZero(date.getHours()) : null;
                $scope.minute = date ? addZero(date.getMinutes()) : null;
                $scope.second = date ? addZero(date.getSeconds()) : null;
            }
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
/**
 * calendar
 * calendar directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-14
 */
angular.module('ui.fugu.calendar', ['ui.fugu.timepanel'])
    .constant('fuguCalendarConfig',{
        startingDay:0, // 一周的开始天,0-周日,1-周一,以此类推
        showTime:true, // 是否显示时间选择
        minDate: null, // 最小可选日期
        maxDate: null, // 最大可选日期
        exceptions:[]  // 不可选日期中的例外,比如3月份的日期都不可选,但是3月15日却是可选择的
    })
    .provider('fuguCanlendar', function () {
        var FORMATS = {};
        this.setFormats = function (formats,subFormats) {
            if(subFormats){
                FORMATS[formats] = subFormats;
            }else{
                FORMATS = formats;
            }
        };

        this.$get  = ['$locale','$log',function ($locale,$log) {
            return {
                getFormats: function () {
                    FORMATS = angular.extend(angular.copy($locale.DATETIME_FORMATS),FORMATS)
                    if(!angular.isArray(FORMATS.SHORTMONTH) ||
                        FORMATS.SHORTMONTH.length!=12 ||
                        !angular.isArray(FORMATS.MONTH) ||
                        FORMATS.MONTH.length!=12 ||
                        !angular.isArray(FORMATS.SHORTDAY) ||
                        FORMATS.SHORTDAY.length!=7
                    ){
                        $log.warn('invalid date time formats');
                        FORMATS = $locale.DATETIME_FORMATS;
                    }
                    return FORMATS;
                }
            }
        }]
    })
    .controller('fuguCalendarCtrl', ['$scope', '$attrs','$log','fuguCanlendar','fuguCalendarConfig',
        function ($scope, $attrs,$log,fuguCanlendarProvider,calendarConfig) {
        var FORMATS = fuguCanlendarProvider.getFormats();
        var MONTH_DAYS = [31,28,31,30,31,30,31,31,30,31,30,31]; //每个月的天数,2月会根据闰年调整
        var ngModelCtrl = {$setViewValue: angular.noop};

        $scope.FORMATS = FORMATS;
        $scope.panels = {
            year:false,
            month:false,
            day:true,
            time:false
        };
        var self = this;
        angular.forEach(['startingDay','minDate','maxDate','exceptions'], function(key) {
            self[key] = angular.isDefined($attrs[key]) ? angular.copy($scope.$parent.$eval($attrs[key])) : calendarConfig[key];
        });
        $scope.showTime = angular.isDefined($attrs.showTime) ?
            $scope.$parent.$eval($attrs.showTime) : calendarConfig.showTime;


        if(self.startingDay > 6 || self.startingDay <0){
            self.startingDay = calendarConfig.startingDay;
        }

        $scope.dayNames = dayNames(this.startingDay);
        $scope.allDays = [];
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function (modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
        };
        this.render = function () {
            var date = ngModelCtrl.$modelValue;
            if (isNaN(date) || !date) {
                $log.warn('Calendar directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else {
                $scope.selectDate = ngModelCtrl.$modelValue;

                $scope.currentYear = $scope.selectDate.getFullYear();
                $scope.currentMonth = $scope.selectDate.getMonth();
                $scope.currentDay = $scope.currentYear+'-'+$scope.currentMonth+'-'+$scope.selectDate.getDate();

                $scope.allDays = getDays($scope.selectDate);
            }
        };
        // 选择某一个面板
        $scope.selectPanel = function (panel) {
            angular.forEach($scope.panels, function (a,i) {
                $scope.panels[i] = false;
            });
            $scope.panels[panel] = true;
        };
        // 切换上一个月
        $scope.prevMonth = function () {
            if($scope.currentMonth === 0){
                $scope.currentYear -= 1;
                $scope.currentMonth = 11;
            }else {
                $scope.currentMonth -= 1;
            }
            buildDayPanel();
        };
        // 切换到下一个月
        $scope.nextMonth = function () {
            if($scope.currentMonth === 11){
                $scope.currentYear += 1;
                $scope.currentMonth = 0;
            }else {
                $scope.currentMonth += 1;
            }
            buildDayPanel();
        };
        // 选择日期
        $scope.selectDayHandler = function (day) {
            if(day.isDisabled){
                return;
            }
            $scope.selectDate.setFullYear(day.year);
            $scope.selectDate.setMonth(day.month);
            $scope.selectDate.setDate(day.day);
            if(!day.inMonth){
                if(day.isNext){
                    $scope.nextMonth();
                }else{
                    $scope.prevMonth();
                }
            }
            $scope.currentDay = $scope.currentYear+'-'+$scope.currentMonth+'-'+$scope.selectDate.getDate();
            fireRender();
        };
        // 选择今天
        $scope.chooseToday = function () {
            var today = splitDate(new Date());

            $scope.selectDate.setFullYear(today.year);
            $scope.selectDate.setMonth(today.month);
            $scope.selectDate.setDate(today.day);

            $scope.currentYear = today.year;
            $scope.currentMonth = today.month;
            $scope.currentDay = $scope.currentYear+'-'+$scope.currentMonth+'-'+$scope.selectDate.getDate();

            buildDayPanel();
            fireRender();
        };
        var cacheTime;
        // 点击时间进入选择时间面板
        $scope.selectTimePanelHandler = function () {
            $scope.selectPanel('time');
            cacheTime = angular.copy($scope.selectDate);
        };

        // 时间面板返回
        $scope.timePanelBack = function () {
            $scope.selectDate = angular.copy(cacheTime);
            $scope.selectPanel('day');
        };
        // 确定选择时间
        $scope.timePanelOk = function () {
            $scope.selectPanel('day');
            fireRender();
        };
        // 选择此刻
        $scope.timePanelSelectNow = function () {
            var dt = new Date();
            var date = angular.copy($scope.selectDate);
            date.setHours(dt.getHours());
            date.setMinutes(dt.getMinutes());
            date.setSeconds(dt.getSeconds());
            $scope.selectDate = date;
        };
        // 获取所有月份,分4列
        $scope.allMonths = (function(){
            var res = [],
                MONTHS  = FORMATS.MONTH,
                temp = [];
            for(var i= 0,len=MONTHS.length;i<len;i++){
                if(temp.length>=3){
                    res.push(temp);
                    temp = [];
                }
                temp.push({
                    name:MONTHS[i],
                    index:i
                });
            }
            res.push(temp);
            return res;
        })();
        // 在月份视图显示某一月份
        $scope.chooseMonthHandler = function (month) {
            $scope.currentMonth = month;
            buildDayPanel();
            $scope.selectPanel('day');
        };

        $scope.allYears = [];
        $scope.selectYearPanelHandler = function () {
            $scope.selectPanel('year');
            var year = $scope.currentYear;
            $scope.allYears = getYears(year);
        };
        // 获取上一个12年
        $scope.prev12Years = function () {
            var year = $scope.allYears[0][0]-8;
            $scope.allYears = getYears(year);
        };
        // 获取下一个12年
        $scope.next12Years = function () {
            var year = $scope.allYears[3][2]+5;
            $scope.allYears = getYears(year);
        };
        // 在月份视图显示某一月份
        $scope.chooseYearHandler = function (year) {
            $scope.currentYear = year;
            buildDayPanel();
            $scope.selectPanel('month');
        };

        function fireRender(){
            var fn = $scope.onChange();
            if(fn && angular.isFunction(fn)){
                fn($scope.selectDate);
            }
            ngModelCtrl.$setViewValue($scope.selectDate);
            ngModelCtrl.$render();
        }

        // 根据年,月构建日视图
        function buildDayPanel(){
            var date = createDate($scope.currentYear,$scope.currentMonth);
            $scope.allDays = getDays(date);
        }
        // 获取所有的最近的12年
        function getYears(year){
            var res = [],temp = [];
            for(var i=-4;i<8;i++){
                if(temp.length>=3){
                    res.push(temp);
                    temp = [];
                }
                temp.push(year + i);
            }
            res.push(temp);
            return res;
        }

        // 获取周一到周日的名字
        function dayNames(startingDay){
            var shortDays = angular.copy(FORMATS.SHORTDAY).map(function (day) {
                return day
            });
            var delDays = shortDays.splice(0,startingDay);
            return shortDays.concat(delDays);
        }
        // 根据日期获取当月的所有日期
        function getDays(date){
            var dayRows = [];
            var currentYear = date.getFullYear();
            var currentMonth = date.getMonth();
            // 添加当月之前的天数
            var firstDayOfMonth = createDate(currentYear,currentMonth,1);
            var day =  firstDayOfMonth.getDay();
            var len = day>=self.startingDay?day-self.startingDay:(7-self.startingDay+day);
            for(var i= 0;i<len;i++){
                pushDay(dayRows,dayBefore(firstDayOfMonth,len-i));
            }
            // 添加本月的天
            var lastDayOfMonth = getLastDayOfMonth(currentYear,currentMonth);
            var tempDay;
            for(var j= 1;j<=lastDayOfMonth;j++){
                tempDay = createDate(currentYear,currentMonth,j);
                pushDay(dayRows,tempDay);
            }
            // 补全本月之后的天
            len = 7 - dayRows[dayRows.length-1].length;
            for(var k=1;k<=len;k++){
                pushDay(dayRows,dayAfter(tempDay,k));
            }
            return dayRows;
        }
        // 存储计算出的日期
        function pushDay(dayRows,date){
            var hasInsert = false;
            angular.forEach(dayRows, function (row) {
                if(row && row.length<7){
                    row.push(formatDate(date));
                    hasInsert = true;
                }
            });
            if(hasInsert){
                return;
            }
            dayRows.push([formatDate(date)]);
        }
        // 根据日期date获取gapDay之后的日期
        function dayAfter(date,gapDay){
            gapDay = gapDay || 1;
            var time = date.getTime();
            time += gapDay * 24 * 60 * 60 * 1000;
            return new Date(time);
        }
        // 根据日期date获取gapDay之前几天的日期
        function dayBefore(date,gapDay){
            gapDay = gapDay || 1;
            var time = date.getTime();
            time -= gapDay * 24 * 60 * 60 * 1000;
            return new Date(time);
        }
        //获取一个月里最后一天是几号
        function getLastDayOfMonth(year,month){
            var months = MONTH_DAYS.slice(0);
            if(year % 100===0 && year % 400===0 || year % 100 !==0&& year % 4===0){
                months[1] = 29;
            }
            return months[month];
        }
        //创建日期
        function createDate(year, month, day){
            var date = new Date();
            date.setFullYear(year);
            date.setMonth(month || 0);
            date.setDate(day || 1);
            return date;
        }
        //对日期进行格式化
        function formatDate(date){
            var tempDate = splitDate(date);
            var selectedDt = splitDate($scope.selectDate);
            var today = splitDate(new Date());
            var isToday =tempDate.year===today.year&&tempDate.month===today.month&&tempDate.day===today.day;
            var isSelected =tempDate.year===selectedDt.year&&tempDate.month===selectedDt.month
                &&tempDate.day===selectedDt.day;
            var isDisabled = (self.minDate && date.getTime()<self.minDate.getTime() && !isExceptionDay(date))
                || (self.maxDate && date.getTime()>self.maxDate.getTime() && !isExceptionDay(date));
            var day = date.getDay();
            return {
                date:date,
                year:tempDate.year,
                month:tempDate.month,
                day:tempDate.day,
                isWeekend:day===0||day===6,
                isToday:isToday,
                inMonth:tempDate.month===$scope.currentMonth,
                isNext:tempDate.month>$scope.currentMonth,
                isSelected:isSelected,
                isDisabled:isDisabled,
                index:tempDate.year+'-'+tempDate.month+'-'+tempDate.day
            }
        }
        function isExceptionDay(date){
            self.exceptions = [].concat(self.exceptions);
            var day1,day2 = splitDate(date);
            return self.exceptions.some(function (excepDay) {
                day1 = splitDate(excepDay);
                return day1.year === day2.year&&day1.month === day2.month&&day1.day === day2.day;
            });
        }
        function splitDate(date){
            return {
                year:date.getFullYear(),
                month:date.getMonth(),
                day:date.getDate()
            }
        }
    }])
    .directive('fuguCalendar', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/calendar.html',
            replace: true,
            require: ['fuguCalendar','ngModel'],
            scope: {
                onChange:'&'
            },
            controller: 'fuguCalendarCtrl',
            link: function (scope, el, attrs, ctrls) {
                var calendarCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                calendarCtrl.init(ngModelCtrl);
            }
        }
    });
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
/**
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.fugu.dropdown',[])
.constant('fuguDropdownConfig', {
    eachItemWidth: 120, //每一个项目的宽度
    openClass:'open', //打开dropdown的calss
    multiColClass: 'fugu-dropdown' //控制多列显示的calss
})
.provider('fuguDropdown', function () {
    var _colsNum = 3;
    this.setColsNum = function (num) {
        _colsNum = num || 3;
    };
    this.$get  = function () {
        return {
            getColsNum: function () {
                return _colsNum;
            }
        }
    }
})
.service('fuguDropdownService', ['$document', function($document) {
    var openScope = null;
    this.open = function(dropdownScope) {
        if (!openScope) {
            $document.on('click', closeDropdown);
        }
        if (openScope && openScope !== dropdownScope) {
            openScope.isOpen = false;
        }
        openScope = dropdownScope;
    };

    this.close = function(dropdownScope) {
        if (openScope === dropdownScope) {
            openScope = null;
            $document.off('click', closeDropdown);
        }
    };

    function closeDropdown(evt) {
        if (!openScope) { return; }
        var toggleElement = openScope.getToggleElement();
        if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
            return;
        }
        openScope.isOpen = false;
        openScope.$apply();
    }

}])
.controller('fuguDropdownCtrl',['$scope','$rootScope','$element','fuguDropdownConfig','fuguDropdownService','fuguDropdown', function ($scope,$rootScope,$element,fuguDropdownConfig,fuguDropdownService,fuguDropdownProvider) {
    $scope.colsNum = fuguDropdownProvider.getColsNum();
    $scope.eachItemWidth = fuguDropdownConfig.eachItemWidth;
    $scope.openClass = fuguDropdownConfig.openClass;
    $scope.multiColClass = fuguDropdownConfig.multiColClass;

    var _this = this;

    $scope.toggleDropdown = function (event) {
        event.preventDefault();
        if (!$scope.isDisabled) {
            _this.toggle();
        }
    };
    this.toggle = function(open) {
        var result = $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
        return result;
    };
    this.isOpen = function() {
        return $scope.isOpen;
    };
    this.init = function () {
        $scope.isDisabled = $scope.isDisabled || !!$element.attr('disabled') || $element.hasClass('disabled');
    };

    $scope.$watch('isOpen', function(isOpen) {
        if (isOpen) {
            fuguDropdownService.open($scope);
        } else {
            fuguDropdownService.close($scope);
        }
    });
    $scope.getToggleElement = function () {
        return $element.find('.dropdown-toggle');
    };
    $scope.count = 0;
    this.addChild = function () {
        $scope.count ++;
        if($scope.count>$scope.colsNum){
            $element.find('.dropdown-menu > li').css('width',100/$scope.colsNum+'%');
        }
    };

    $scope.$on('$locationChangeSuccess', function() {
        $scope.isOpen = false;
    });
}])
.directive('fuguDropdown',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/dropdown.html',
        replace:true,
        require:'^fuguDropdown',
        transclude:true,
        scope:{
            isOpen:'=?',
            isDisabled:'=?ngDisabled',
            btnValue:'@?'
        },
        controller:'fuguDropdownCtrl',
        link: function (scope,el,attrs,fuguDropdownCtrl) {
            fuguDropdownCtrl.init();
        }
    }
})
.directive('fuguDropdownChoices',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/dropdown-choices.html',
        require:'^fuguDropdown',
        replace:true,
        transclude:true,
        scope:true,
        link: function (scope,el,attrs,fuguDropdownCtrl) {
            fuguDropdownCtrl.addChild();
        }
    }
});
/**
<<<<<<< HEAD
 * modal
 * modal directive
 * 不太会写,基本是照搬的 ui-bootstrap v0.12.1 https://github.com/angular-ui/bootstrap/blob/0.12.1/src/modal/modal.js
 * 先抄着,后面再写吧,心好累
 *
 * Author: yjy972080142@gmail.com
 * Date:2016-03-23
 */
angular.module('ui.fugu.modal', [])
    /**
     * $transition service provides a consistent interface to trigger CSS 3 transitions and to be informed when they complete.
     */
    .factory('$transition', ['$q', '$timeout', '$rootScope', function($q, $timeout, $rootScope) {

        var $transition = function(element, trigger, options) {
            options = options || {};
            var deferred = $q.defer();
            var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

            function transitionEndHandler(){
                $rootScope.$apply(function() {
                    element.unbind(endEventName, transitionEndHandler);
                    deferred.resolve(element);
                });
            }

            if (endEventName) {
                element.bind(endEventName, transitionEndHandler);
            }

            // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
            $timeout(function() {
                if ( angular.isString(trigger) ) {
                    element.addClass(trigger);
                } else if ( angular.isFunction(trigger) ) {
                    trigger(element);
                } else if ( angular.isObject(trigger) ) {
                    element.css(trigger);
                }
                //If browser does not support transitions, instantly resolve
                if ( !endEventName ) {
                    deferred.resolve(element);
                }
            });

            // Add our custom cancel function to the promise that is returned
            // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
            // i.e. it will therefore never raise a transitionEnd event for that transition
            deferred.promise.cancel = function() {
                if ( endEventName ) {
                    element.unbind(endEventName, transitionEndHandler);
                }
                deferred.reject('Transition cancelled');
            };

            return deferred.promise;
        };

        // Work out the name of the transitionEnd event
        var transElement = document.createElement('trans');
        var transitionEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'transition': 'transitionend'
        };
        var animationEndEventNames = {
            'WebkitTransition': 'webkitAnimationEnd',
            'MozTransition': 'animationend',
            'OTransition': 'oAnimationEnd',
            'transition': 'animationend'
        };
        function findEndEventName(endEventNames) {
            for (var name in endEventNames){
                if (!angular.isUndefined(transElement.style[name])) {
                    return endEventNames[name];
                }
            }
        }
        $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
        $transition.animationEndEventName = findEndEventName(animationEndEventNames);
        return $transition;
    }])
    /**
     * A helper, internal data structure that acts as a map but also allows getting / removing
     * elements in the LIFO order
     */
    .factory('$$stackedMap', function () {
        return {
            createNew: function () {
                var stack = [];

                return {
                    add: function (key, value) {
                        stack.push({
                            key: key,
                            value: value
                        });
                    },
                    get: function (key) {
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                return stack[i];
                            }
                        }
                    },
                    keys: function() {
                        var keys = [];
                        for (var i = 0; i < stack.length; i++) {
                            keys.push(stack[i].key);
                        }
                        return keys;
                    },
                    top: function () {
                        return stack[stack.length - 1];
                    },
                    remove: function (key) {
                        var idx = -1;
                        for (var i = 0; i < stack.length; i++) {
                            if (key == stack[i].key) {
                                idx = i;
                                break;
                            }
                        }
                        return stack.splice(idx, 1)[0];
                    },
                    removeTop: function () {
                        return stack.splice(stack.length - 1, 1)[0];
                    },
                    length: function () {
                        return stack.length;
                    }
                };
            }
        };
    })

    /**
     * A helper directive for the $fgModal service. It creates a backdrop element.
     */
    .directive('fuguModalBackdrop', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/backdrop.html',
            link: function (scope, element, attrs) {
                scope.backdropClass = attrs.backdropClass || '';

                scope.animate = false;

                //trigger CSS transitions
                $timeout(function () {
                    scope.animate = true;
                });
            }
        };
    }])

    .directive('fuguModalWindow', ['$fgModalStack', '$timeout', function ($fgModalStack, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                index: '@',
                animate: '='
            },
            replace: true,
            transclude: true,
            templateUrl: 'templates/window.html',
            link: function (scope, element, attrs) {
                element.addClass(attrs.windowClass || '');
                scope.size = attrs.size;

                $timeout(function () {
                    // trigger CSS transitions
                    scope.animate = true;

                    /**
                     * Auto-focusing of a freshly-opened modal element causes any child elements
                     * with the autofocus attribute to lose focus. This is an issue on touch
                     * based devices which will show and then hide the onscreen keyboard.
                     * Attempts to refocus the autofocus element via JavaScript will not reopen
                     * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                     * the modal element if the modal does not contain an autofocus element.
                     */
                    if (!element[0].querySelectorAll('[autofocus]').length) {
                        element[0].focus();
                    }
                });

                scope.close = function (evt) {
                    var modal = $fgModalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop != 'static' && (evt.target === evt.currentTarget)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $fgModalStack.dismiss(modal.key, 'backdrop click');
                    }
                };
            }
        };
    }]) /// TODO 修改变量

    .directive('fuguModalTransclude', function () {
        return {
            link: function($scope, $element, $attrs, controller, $transclude) {
                // TODO 这个$transclude是自动注入的吗?
                $transclude($scope.$parent, function(clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        };
    })

    .factory('$fgModalStack', ['$transition', '$timeout', '$document', '$compile', '$rootScope', '$$stackedMap',
        function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

            var OPENED_MODAL_CLASS = 'modal-open';

            var backdropDomEl, backdropScope;
            var openedWindows = $$stackedMap.createNew();
            var $fgModalStack = {};

            function backdropIndex() {
                var topBackdropIndex = -1;
                var opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++) {
                    if (openedWindows.get(opened[i]).value.backdrop) {
                        topBackdropIndex = i;
                    }
                }
                return topBackdropIndex;
            }

            $rootScope.$watch(backdropIndex, function(newBackdropIndex){
                if (backdropScope) {
                    backdropScope.index = newBackdropIndex;
                }
            });

            function removeModalWindow(modalInstance) {

                var body = $document.find('body').eq(0);
                var modalWindow = openedWindows.get(modalInstance).value;
                //clean up the stack
                openedWindows.remove(modalInstance);

                //remove window DOM element
                removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function() {
                    modalWindow.modalScope.$destroy();
                    body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
                    checkRemoveBackdrop();
                });
            }

            function checkRemoveBackdrop() {
                //remove backdrop if no longer needed
                if (backdropDomEl && backdropIndex() == -1) {
                    var backdropScopeRef = backdropScope;
                    removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
                        backdropScopeRef.$destroy();
                        backdropScopeRef = null;
                    });
                    backdropDomEl = null;
                    backdropScope = null;
                }
            }

            function removeAfterAnimate(domEl, scope, emulateTime, done) {
                // Closing animation
                scope.animate = false;

                var transitionEndEventName = $transition.transitionEndEventName;
                if (transitionEndEventName) {
                    // transition out
                    var timeout = $timeout(afterAnimating, emulateTime);

                    domEl.bind(transitionEndEventName, function () {
                        $timeout.cancel(timeout);
                        afterAnimating();
                        scope.$apply();
                    });
                } else {
                    // Ensure this call is async
                    $timeout(afterAnimating);
                }

                function afterAnimating() {
                    if (afterAnimating.done) {
                        return;
                    }
                    afterAnimating.done = true;

                    domEl.remove();
                    if (done) {
                        done();
                    }
                }
            }

            $document.bind('keydown', function (evt) {
                var modal;
                // 点击ESC关闭
                if (evt.which === 27) {
                    modal = openedWindows.top();
                    if (modal && modal.value.keyboard) {
                        evt.preventDefault();
                        $rootScope.$apply(function () {
                            $fgModalStack.dismiss(modal.key, 'escape key press');
                        });
                    }
                }
            });

            $fgModalStack.open = function (modalInstance, modal) {

                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    modalScope: modal.scope,
                    backdrop: modal.backdrop,
                    keyboard: modal.keyboard
                });

                var body = $document.find('body').eq(0),
                    currBackdropIndex = backdropIndex();

                // 保证只会插入一次蒙版
                if (currBackdropIndex >= 0 && !backdropDomEl) {
                    backdropScope = $rootScope.$new(true);
                    backdropScope.index = currBackdropIndex;
                    var angularBackgroundDomEl = angular.element('<div fugu-modal-backdrop></div>');
                    angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
                    backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
                    body.append(backdropDomEl);
                }

                var angularDomEl = angular.element('<div fugu-modal-window></div>');
                angularDomEl.attr({
                    'window-class': modal.windowClass,
                    'size': modal.size,
                    'index': openedWindows.length() - 1,
                    'animate': 'animate'
                }).html(modal.content);
                var modalDomEl = $compile(angularDomEl)(modal.scope);
                openedWindows.top().value.modalDomEl = modalDomEl;
                body.append(modalDomEl);
                body.addClass(OPENED_MODAL_CLASS);
            };

            $fgModalStack.close = function (modalInstance, result) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.resolve(result);
                    removeModalWindow(modalInstance);
                }
            };

            $fgModalStack.dismiss = function (modalInstance, reason) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.reject(reason);
                    removeModalWindow(modalInstance);
                }
            };

            $fgModalStack.dismissAll = function (reason) {
                var topModal = this.getTop();
                while (topModal) {
                    this.dismiss(topModal.key, reason);
                    topModal = this.getTop();
                }
            };

            $fgModalStack.getTop = function () {
                return openedWindows.top();
            };

            return $fgModalStack;
        }])

    .provider('$fgModal', function () {
        var self = this;
        this.options = {
            backdrop: true, //can be also false or 'static'
            keyboard: true
        };
        this.$get = ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$fgModalStack',
            function ($injector, $rootScope, $q, $http, $templateCache, $controller, $fgModalStack) {
                /**
                 * 获取模板
                 * @param options - 配置信息
                 * @returns {*|Promise}
                 */
                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template) :
                        $http.get(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                            {cache: $templateCache})
                        .then(function (result) {
                                return result.data;
                            });
                }

                /**
                 * TODO 不明白是干啥的,好像是获取modalInstance依赖的
                 * @param resolves
                 * @returns {Array}
                 */
                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function (value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                    });
                    return promisesArr;
                }
                return {
                    open: function (modalOptions) {
                        var modalResultDeferred = $q.defer();
                        var modalOpenedDeferred = $q.defer();

                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            close: function (result) {
                                $fgModalStack.close(modalInstance, result);
                            },
                            dismiss: function (reason) {
                                $fgModalStack.dismiss(modalInstance, reason);
                            }
                        };

                        //merge and clean up options
                        modalOptions = angular.extend({}, self.options, modalOptions);
                        modalOptions.resolve = modalOptions.resolve || {};

                        //verify options
                        if (!modalOptions.template && !modalOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

                        templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                            var modalScope = (modalOptions.scope || $rootScope).$new();
                            modalScope.$close = modalInstance.close;
                            modalScope.$dismiss = modalInstance.dismiss;

                            var ctrlInstance, ctrlLocals = {};
                            var resolveIter = 1;

                            //controllers
                            if (modalOptions.controller) {
                                // 使用$controller创建controller并注入$scope,$fgModalInstance和resolve
                                ctrlLocals.$scope = modalScope;
                                ctrlLocals.$fgModalInstance = modalInstance;
                                angular.forEach(modalOptions.resolve, function (value, key) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                });

                                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                if (modalOptions.controllerAs) {
                                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                                }
                            }
                            $fgModalStack.open(modalInstance, {
                                scope: modalScope,
                                deferred: modalResultDeferred,
                                content: tplAndVars[0],
                                backdrop: modalOptions.backdrop,
                                keyboard: modalOptions.keyboard,
                                backdropClass: modalOptions.backdropClass,
                                windowClass: modalOptions.windowClass,
                                size: modalOptions.size
                            });

                        }, function resolveError(reason) {
                            modalResultDeferred.reject(reason);
                        });

                        templateAndResolvePromise.then(function () {
                            modalOpenedDeferred.resolve(true);
                        }, function () {
                            modalOpenedDeferred.reject(false);
                        });

                        return modalInstance;
                    }
                };
            }];
    });
=======
 * notification
 * 通知指令
 * Author:penglu02@meituan.com
 * Date:2016-03-22
 */
angular.module('ui.fugu.notification', ['ui.fugu.alert'])
    .service('notificationServices', ['$sce', '$interval', '$interpolate', function($sce, $interval, $interpolate){
        var self = this;
        this.directive = {};

        this.initDirective = function (limitNum) {
            this.directive.limitNum = limitNum;
            this.directive.notifications = [];
            return this.directive;
        };

        this.addNotifications = function(notification){
            var notifications, unique = true, notificationText;

            // 错误类型处理
            if (notification.type === 'error') {
                notification.type = 'danger';
            }
            // 内容处理
            notification.text = $interpolate(notification.text)(notification.variables);  //{{}}插值解析

            // TODO:使用alert不存在ng-bind-html，因此不需要对其进行特殊处理
            //notification.text = $sce.trustAsHtml(String( notification.text));   // html内容处理，用于ng-bind-html等

            notifications = this.directive.notifications;

            // 提示信息是否不重复,this.unique在provider中设置
            if(this.unique){
                angular.forEach(notifications, function(notify){
                    notificationText = notify.text;

                    //// 处理内容获取:trustAsHtml与getTrustedHtml对变量进行了一次包裹
                    //notificationText = $sce.getTrustedHtml(notify.text);

                    // 通过对比:提示内容，提示类型，提示标题来判断两个通知是否相同
                    if(notification.text === notificationText && notification.title === notify.title && notification.type === notify.type){
                        unique = false;
                    }
                });
                if(!unique){
                    return;
                }
            }

            if(notification.duration && notification.duration !== -1){ // 设置持续显示时间,-1表示一直显示
                //  持续时间之后直接删除
                $interval(angular.bind(this, function(){
                    self.deleteNotifications(notification);
                }), notification.duration, 1);
            }

            // 如果有长度限制，则移除超过长度的
            if(angular.isDefined(this.directive.limitNum)){
                var diff = notifications.length - (this.directive.limitNum - 1);
                if(diff > 0){
                    notifications.splice(0, diff);
                }
            }
            notifications.push(notification); //插入新数值
            return notification;
        };


        /**
         * 删除传入通知对象
         * @param {object} notification
         */
        this.deleteNotifications = function(notification){
            var notifications = this.directive.notifications, //获取所有通知
                index = notifications.indexOf(notification);
            if(index !== -1){
                notifications.splice(index, 1); //删除
            }
        }
    }])
    .controller('notificationController', ['$scope', '$interval', 'notification', 'notificationServices', function($scope, $interval, notification, notificationServices){
        notificationServices.initDirective($scope.limitNum);
        $scope.notifications = notificationServices.directive.notifications;

        $scope.$watch('limitNum', function(limitNum){
            var directive = notificationServices.directive;
            if(angular.isDefined(limitNum) && angular.isDefined(directive)){
                directive.limitNum = limitNum;
            }
        });

        $scope.closeFn = function(notification){
            notificationServices.deleteNotifications(notification);
        }
    }])
    .directive('fuguNotice', [function(){
        return {
            restrict: 'A',
            replace: false,
            scope: {
                limitNum: '='
            },
            templateUrl: 'templates/notification.html',
            controller: 'notificationController'
        }
    }])
    .provider('notification', [function(){

        // private variables
        var _types = {
                success: null,
                error: null,
                warning: null,
                info: null
            },
            _unique = true,
            _disableCloseBtn = false,
            _disableIcon = false;


        // this绑定的方法是可以在注入之前进行调用设置
        /**
         * 设置通知全局持续显示时间
         * @param {number} duration 持续时间毫秒,如果为-1则表示一直显示
         */
        this.globalDurationTime = function (duration){
            if(typeof duration === 'object'){
                // 以对象的形式分开设置持续时间
                for (var key in duration){
                    if(duration.hasOwnProperty(key)){
                        _types[key] = duration[key];
                    }
                }
            } else {
                // 统一设置
                for(var type in _types){
                    if(_types.hasOwnProperty(type)) {
                        _types[type] = duration;
                    }
                }
            }
            return this;
        };

        /**
         * 统一配置是否显示关闭按钮
         * @param {boolean} disableCloseBtn
         * @returns {*}
         */
        this.globalDisableCloseBtn = function (disableCloseBtn){
            _disableCloseBtn = disableCloseBtn;
            return this;
        };

        /**
         * 统一配置是否显示图标
         * @param {boolean} disableIcon
         * @returns {*}
         */
        this.globalDisableIcon = function (disableIcon) {
            _disableIcon = disableIcon;
            return this;
        };


        /**
         * 统一配置提示框是否重复显示
         * @param {boolean} unique
         * @returns {*}
         */
        this.globalUnique = function(unique) {
            _unique = unique;
            return this;
        };


        // $get方法返回的内容,注入的时候可以获取
        this.$get = [
            '$rootScope',
            '$interpolate',
            '$sce',
            '$filter',
            '$interval',
            'notificationServices',
            function ($rootScope, $interpolate, $sce, $filter, $interval, notificationServices) {
                notificationServices.unique = _unique;  //根据当前配置，设置显示的唯一性(统一)

                function sendNotification(text, config, type) {
                    var _config = config || {}, notification, addNotification;

                    // 组装新添加通知信息
                    notification = {
                        text: text,
                        type: type,
                        duration: _config.duration || _types[type],
                        disableCloseBtn: angular.isDefined(_config.disableCloseBtn) ? _config.disableCloseBtn : _disableCloseBtn,
                        disableIcon: angular.isDefined(_config.disableIcon) ? _config.disableIcon : _disableIcon,
                        variables: _config.variables || {},   // 解析text中{{}}中变量
                        destory: function () {
                            notificationServices.deleteNotifications(notification);
                        },
                        setText: function (newText) {
                            //// 对内容进行包裹用于ng-bind-html显示,后期使用getTrustedHtml获取
                            //this.text = $sce.trustAsHtml(String(newText));

                            this.text = newText;
                        }
                    };

                    addNotification = notificationServices.addNotifications(notification);
                    return addNotification;
                }

                function warning(text, config){
                    return sendNotification(text, config, 'warning');
                }

                function error(text, config){
                    return sendNotification(text, config, 'error');
                }

                function info(text, config){
                    return sendNotification(text, config, 'info');
                }

                function success(text, config){
                    return sendNotification(text, config, 'success');
                }

                function common(text, config, type){
                    var noticeType = type ? type.toLowerCase() : 'error';  // 默认为‘error’提示框
                    return sendNotification(text, config, noticeType);
                }

                return {
                    warning: warning,
                    error: error,
                    info: info,
                    success: success,
                    common: common
                };
            }
        ]
    }]);
>>>>>>> feat(notification): add notification


angular.module('ui.fugu.pager',[])
.constant('fuguPagerConfig', {
    itemsPerPage: 20, //默认每页数目为20
    maxSize:5, //默认分页最大显示数目为5
    firstText:'首页',
    lastText:'尾页',
    previousText:'上一页',
    nextText:'下一页'
})
.controller('fuguPagerCtrl',['$scope', function ($scope) {

    var pageOffset = 0,
        initialized = false;

    this.init = function (fuguPagerConfig) {
        $scope.itemsPerPage = $scope.itemsPerPage || fuguPagerConfig.itemsPerPage;
        $scope.maxSize = $scope.maxSize || fuguPagerConfig.maxSize;
        $scope.getText = function (key){
            return $scope[key + 'Text'] || fuguPagerConfig[key + 'Text'];
        };
    };

    $scope.pages = [];
    $scope.currentPage = 0;
    $scope.totalPages = 1;

    $scope.$watch('pageNo', function (val) {
        $scope.selectPage(val-1 || 0)
    });
    $scope.$watch("totalItems", function (val) {
        if($scope.currentPage === -1){
            return;
        }
        $scope.totalPages = Math.ceil(val / $scope.itemsPerPage);
        if ($scope.totalPages <= 0 || isNaN($scope.totalPages)) {
            $scope.totalPages = 1;
        }
        if (initialized) {
            if (pageOffset > $scope.totalPages) {
                pageOffset = 0;
                if ($scope.currentPage < pageOffset
                    || $scope.currentPage >= pageOffset + $scope.pages.length) {
                    $scope.currentPage = 0;
                }
            }
        }
        resetPageList();
        initialized = true;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
        }
        $scope.selectPage($scope.currentPage);
    });

    function getOffset(page) {
        var offset = Math.min(page - Math.floor($scope.maxSize / 2), $scope.totalPages - $scope.maxSize);
        if (offset < 0 || isNaN(offset)) {
            offset = 0;
        }
        return offset;
    }

    function resetPageList() {
        $scope.pages = [];
        var last = Math.min(pageOffset + $scope.maxSize, $scope.totalPages),i;
        for (i = pageOffset; i < last; i++) {
            $scope.pages.push({
                text: i,
                pageIndex: i,
                active: false
            });
        }
    }

    $scope.isFirst = function () {
        return $scope.currentPage <= 0;
    };

    $scope.isLast = function () {
        return $scope.currentPage >= $scope.totalPages - 1;
    };

    $scope.selectPage = function (value) {
        if (value >= $scope.totalPages || value < 0) {
            return;
        }
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = false;
        }
        var offset = getOffset(value),oldPage = $scope.currentPage;
        if (offset != pageOffset) {
            pageOffset = offset;
            resetPageList();
        }
        $scope.currentPage = value;
        $scope.pageNo = value+1;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
        }
        var fn;
        if(angular.isDefined($scope.pageChanged) && oldPage !== $scope.currentPage){
            fn = $scope.pageChanged();
            if(fn && typeof fn === 'function'){
                fn($scope.currentPage+1);
            }
        }
    };

    $scope.first = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage(0);
    };

    $scope.last = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.totalPages - 1);
    };

    $scope.previous = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage($scope.currentPage - 1);
    };

    $scope.next = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.currentPage + 1);
    };
}])
.directive('fuguPager', ['fuguPagerConfig', function (fuguPagerConfig) {
    return {
        restrict: 'E',
        templateUrl:'templates/pager.html',
        replace:true,
        require:'fuguPager',
        scope:{
            itemsPerPage:'=?',
            totalItems:'=',
            pageNo:'=',
            maxSize:'=?',
            firstText:'@?',
            lastText:'@?',
            previousText:'@?',
            nextText:'@?',
            pageChanged:'&?'
        },
        controller:'fuguPagerCtrl',
        link: function (scope,el,attrs,fuguPagerCtrl) {
            fuguPagerCtrl.init(fuguPagerConfig);
        }
    }
}]);
/**
 * searchBox
 * 搜索框
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-25
 */
angular.module('ui.fugu.searchBox',[])
.constant('fuguSearchBoxConfig', {
    btnText: '搜索', // 默认搜索按钮文本
    showBtn: true   // 默认显示按钮
})
.controller('fuguSearchBoxCtrl',['$scope','$attrs','fuguSearchBoxConfig', function ($scope,$attrs,fuguSearchBoxConfig) {
    var ngModelCtrl = { $setViewValue: angular.noop };
    $scope.searchBox = {};
    this.init = function (_ngModelCtrl) {
        if(_ngModelCtrl){
            ngModelCtrl = _ngModelCtrl;
        }
        ngModelCtrl.$render = this.render;
        $scope.showBtn = angular.isDefined($attrs.showBtn) ? $scope.$parent.$eval($attrs.showBtn) : fuguSearchBoxConfig.showBtn;
    };
    var btnText;
    $scope.getText = function () {
        if(btnText){
            return btnText;
        }
        btnText = angular.isDefined($attrs.btnText) ? $attrs.btnText : fuguSearchBoxConfig.btnText;
        return btnText;
    };
    $scope.$watch('searchBox.query', function (val) {
        ngModelCtrl.$setViewValue(val);
        ngModelCtrl.$render();
    });
    $scope.keyUpToSearch = function (evt) {
        if (evt && evt.keyCode === 13) {
            evt.preventDefault();
            evt.stopPropagation();
            $scope.doSearch();
        }
    };
    $scope.doSearch = function () {
        if(angular.isDefined($scope.search) && typeof $scope.search === 'function'){
            $scope.search();
        }
    };
    this.render = function() {
        if(ngModelCtrl.$viewValue){
            $scope.searchBox.query = ngModelCtrl.$viewValue;
        }
    };
}])
.directive('fuguSearchBox',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/searchBox.html',
        replace:true,
        require:['fuguSearchBox', '?ngModel'],
        scope:{
            btnText:'@?',
            showBtn:'=?',
            placeholder:'@?',
            search:'&?'
        },
        controller:'fuguSearchBoxCtrl',
        link: function (scope,el,attrs,ctrls) {
            var searchBoxCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            searchBoxCtrl.init(ngModelCtrl);
        }
    }
});
/**
 * sortable
 * sortable directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.fugu.sortable', [])
    .service('fuguSortableService', function () {return {};})
    .directive('fuguSortable', ['$parse', '$timeout', 'fuguSortableService',
        function ($parse, $timeout, fuguSortableService) {
        return {
            restrict: 'AE',
            scope: {
                fuguSortable:'='
            },
            link: function (scope, element) {
                var self = this;
                if(scope.fuguSortable){
                    scope.$watch('fuguSortable.length', function() {
                        // Timeout to let ng-repeat modify the DOM
                        $timeout(function() {
                            self.refresh();
                        }, 0, false);
                    });
                }
                self.refresh = function () {
                    var children = element.children();
                    children.off('dragstart dragend');
                    element.off('dragenter dragover drop dragleave');
                    angular.forEach(children,function (item,i) {
                        var child = angular.element(item);
                        child.attr('draggable', 'true').css({cursor:'move'}).on('dragstart', function (event) {
                                event = event.originalEvent || event;
                                if (element.attr('draggable') == 'false') {
                                    return;
                                }
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setDragImage(item,10, 10);

                                $timeout(function() {
                                    //child.hide();
                                    item.originDisplay = item.style.display;
                                    item.style.display = 'none';
                                }, 0);

                                fuguSortableService.isDragging = true;
                                fuguSortableService.dragIndex = i;
                                fuguSortableService.placeholder = getPlaceholder(child);
                                event.stopPropagation();
                            })
                            .on('dragend', function (event) {
                                event = event.originalEvent || event;

                                $timeout(function() {
                                    //child.show();
                                    item.style.display = item.originDisplay;
                                }, 0);
                                fuguSortableService.isDragging = false;
                                fuguSortableService.dragIndex = null;
                                fuguSortableService.placeholder = null;
                                event.stopPropagation();
                                event.preventDefault();
                            });
                    });

                    //父元素绑定drop事件
                    var listNode = element[0],placeholder,placeholderNode;
                    element.on('dragenter', function (event) {
                            event = event.originalEvent || event;
                            if (!fuguSortableService.isDragging) {
                                return false;
                            }
                            placeholder = fuguSortableService.placeholder;
                            placeholderNode = placeholder[0];
                            event.preventDefault();
                        })
                        .on('dragover', function (event) {
                            event = event.originalEvent || event;
                            if (!fuguSortableService.isDragging) {
                                return false;
                            }
                            if (placeholderNode.parentNode != listNode) {
                                element.append(placeholder);
                            }
                            if (event.target !== listNode) {
                                var listItemNode = event.target;
                                while (listItemNode.parentNode !== listNode && listItemNode.parentNode) {
                                    listItemNode = listItemNode.parentNode;
                                }
                                if (listItemNode.parentNode === listNode && listItemNode !== placeholderNode) {
                                    if (isMouseInFirstHalf(event, listItemNode)) {
                                        listNode.insertBefore(placeholderNode, listItemNode);
                                    } else {
                                        listNode.insertBefore(placeholderNode, listItemNode.nextSibling);
                                    }
                                }
                            } else {
                                if (isMouseInFirstHalf(event, placeholderNode, true)) {
                                    while (placeholderNode.previousElementSibling
                                    && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true)
                                    || placeholderNode.previousElementSibling.offsetHeight === 0)) {
                                        listNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
                                    }
                                } else {
                                    while (placeholderNode.nextElementSibling &&
                                    !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                                        listNode.insertBefore(placeholderNode,
                                            placeholderNode.nextElementSibling.nextElementSibling);
                                    }
                                }
                            }
                            element.addClass("fugu-sortable-dragover");
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        })
                        .on('drop', function (event) {
                            event = event.originalEvent || event;

                            if (!fuguSortableService.isDragging) {
                                return true;
                            }
                            var dragIndex = fuguSortableService.dragIndex;
                            var placeholderIndex = getPlaceholderIndex(placeholderNode,listNode,dragIndex);
                            scope.$apply(function() {
                                // 改变数据,由angular进行DOM修改
                                var dragObj = scope.fuguSortable[dragIndex];
                                scope.fuguSortable.splice(dragIndex,1);
                                scope.fuguSortable.splice(placeholderIndex,0,dragObj)
                            });
                            placeholder.remove();
                            element.removeClass("fugu-sortable-dragover");
                            event.stopPropagation();
                            return false;
                        })
                        .on('dragleave', function(event) {
                            event = event.originalEvent || event;
                            element.removeClass("fugu-sortable-dragover");
                            $timeout(function() {
                                if(!element.hasClass('fugu-sortable-dragover')){
                                    placeholder.remove();
                                }
                            }, 0);
                        });
                };
                /**
                 * 获取placeholder的索引
                 * @param placeholderNode - placeholder的节点
                 * @param listNode - 列表节点
                 * @param dragIndex - 被拖拽的节点索引
                 * @returns {number}
                 */
                function getPlaceholderIndex(placeholderNode,listNode,dragIndex) {
                    var index = Array.prototype.indexOf.call(listNode.children, placeholderNode);
                    return index > dragIndex?--index:index;
                }

                /**
                 * 判断鼠标位置是否在targetNode上一半
                 */
                function isMouseInFirstHalf(event, targetNode, relativeToParent) {
                    var mousePointer = event.offsetY || event.layerY;
                    var targetSize = targetNode.offsetHeight;
                    var targetPosition = targetNode.offsetTop;
                    targetPosition = relativeToParent ? targetPosition : 0;
                    return mousePointer < targetPosition + targetSize / 2;
                }

                /**
                 * 获取placeholder元素
                 * @param ele
                 * @returns {*}
                 */
                function getPlaceholder(ele){
                    var placeholder = ele.clone();
                    placeholder.html('');
                    placeholder.css({
                        listStyle: 'none',
                        border: '1px dashed #CCC',
                        minHeight:'10px',
                        height:ele[0].offsetHeight+'px',
                        width:ele[0].offsetWidth+'px',
                        background:'transparent'
                    });
                    return placeholder;
                }
            }
        }
    }]);
/**
 * switch
 * 开关
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-31
 */
angular.module('ui.fugu.switch', [])
    .constant('fuguSwitchConfig', {
        type: 'default',
        size: 'md',
        isDisabled: false
    })
    .controller('fuguSwitchCtrl', ['$scope', '$attrs','fuguSwitchConfig', function ($scope, $attrs,fuguSwitchConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        $scope.switchObj = {};
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            $scope.switchObj.isDisabled = getAttrValue('ngDisabled','isDisabled');
            $scope.switchObj.type = $scope.type || fuguSwitchConfig.type;
            $scope.switchObj.size = $scope.size || fuguSwitchConfig.size;
        };
        $scope.$watch('switchObj.query', function (val,old) {
            ngModelCtrl.$setViewValue(val);
            ngModelCtrl.$render();
            if(val !== old && $scope.onChange){
                $scope.onChange();
            }
        });
        this.render = function () {
            $scope.switchObj.query = ngModelCtrl.$viewValue;
        };
        function getAttrValue(attributeValue,defaultValue) {
            var val = $scope.$parent.$eval($attrs[attributeValue]);   //变量解析
            return val ? val : fuguSwitchConfig[defaultValue||attributeValue];
        }
    }])
    .directive('fuguSwitch', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/switch.html',
            replace: true,
            require: ['fuguSwitch', 'ngModel'],
            scope: {
                type:'@?',
                size:'@?',
                onChange:'&?'
            },
            controller: 'fuguSwitchCtrl',
            link: function (scope, el, attrs, ctrls) {
                var switchCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                switchCtrl.init(ngModelCtrl);
            }
        }
    });
/**
 * timepicker
 * timepicker directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.fugu.timepicker', ['ui.fugu.timepanel'])
    .constant('fuguTimepickerConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        format:'HH:mm:ss'
    })
    .service('fuguTimepickerService', ['$document', function($document) {
        var openScope = null;
        this.open = function(timepickerScope) {
            if (!openScope) {
                $document.on('click', closeTimepicker);
            }
            if (openScope && openScope !== timepickerScope) {
                openScope.showTimepanel = false;
            }
            openScope = timepickerScope;
        };

        this.close = function(timepickerScope) {
            if (openScope === timepickerScope) {
                openScope = null;
                $document.off('click', closeTimepicker);
            }
        };

        function closeTimepicker(evt) {
            if (!openScope) { return; }
            var panelElement = openScope.getTimepanelElement();
            var toggleElement = openScope.getToggleElement();
            if(panelElement && panelElement[0].contains(evt.target) ||
                toggleElement && toggleElement[0].contains(evt.target)){
                return;
            }
            openScope.showTimepanel = false;
            openScope.$apply();
        }

    }])
    .controller('fuguTimepickerCtrl', ['$scope', '$element', '$attrs', '$parse', '$log', 'fuguTimepickerService', 'fuguTimepickerConfig','dateFilter', function($scope, $element, $attrs, $parse, $log, fuguTimepickerService, timepickerConfig,dateFilter) {
        var ngModelCtrl = { $setViewValue: angular.noop };
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            ngModelCtrl.$formatters.unshift(function(modelValue) {
                return modelValue ? new Date(modelValue) : null;
            });
            $scope.hourStep = angular.isDefined($attrs.hourStep) ? $scope.$parent.$eval($attrs.hourStep) : timepickerConfig.hourStep;
            $scope.minuteStep = angular.isDefined($attrs.minuteStep) ? $scope.$parent.$eval($attrs.minuteStep) : timepickerConfig.minuteStep;
            $scope.secondStep = angular.isDefined($attrs.secondStep) ? $scope.$parent.$eval($attrs.secondStep) : timepickerConfig.secondStep;
        };
        var _this = this;
        $scope.showTimepanel = false;
        this.toggle = function(open) {
            $scope.showTimepanel = arguments.length ? !!open : !$scope.showTimepanel;
        };
        this.showTimepanel = function() {
            return $scope.showTimepanel;
        };
        var format = angular.isDefined($attrs.format) ? $scope.$parent.$eval($attrs.format) : timepickerConfig.format;
        this.render = function () {
            var date = ngModelCtrl.$viewValue;
            if (isNaN(date)) {
                $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
            } else if(date){
                $scope.selectedTime = date;
                $scope.inputValue = dateFilter(date,format);
            }
        };
        // 这里使用onChange，而不是watch selectedTime属性，因为watch的话，会出现循环赋值，待解决
        $scope.changeTime = function (time) {
            ngModelCtrl.$setViewValue(time);
            ngModelCtrl.$render();
        };
        $scope.toggleTimepanel = function (evt) {
            $element.find('input')[0].blur();
            evt.preventDefault();
            if (!$scope.isDisabled) {
                _this.toggle();
            }
        };
        $scope.getTimepanelElement = function () {
            return $element.find('.fugu-timepanel');
        };
        $scope.getToggleElement = function () {
            return $element.find('.input-group');
        };
        $scope.$watch('showTimepanel', function(showTimepanel) {
            if (showTimepanel) {
                fuguTimepickerService.open($scope);
            } else {
                fuguTimepickerService.close($scope);
            }
        });
        $scope.$on('$locationChangeSuccess', function() {
            $scope.showTimepanel = false;
        });
    }])
    .directive('fuguTimepicker', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/timepicker.html',
            replace: true,
            require: ['fuguTimepicker','ngModel'],
            scope: {
                isDisabled:'=?ngDisabled',
                placeholder:'@'
            },
            controller: 'fuguTimepickerCtrl',
            link: function (scope, el, attrs, ctrls) {
                var timepickerCtrl = ctrls[0],ngModelCtrl = ctrls[1];
                timepickerCtrl.init(ngModelCtrl);
            }
        }
    });
/**
 * tree
 * 树形菜单指令
 * Author:penglu02@meituan.com
 * Date:2016-01-28
 */
angular.module('ui.fugu.tree', [])
    .constant('fuguTreeConfig', {
        showIcon: true,
        checkable: true,
        collapsedAll: false,
        editable: false
    })
    .controller('treeController', ['$scope', '$element', '$attrs', 'fuguTreeConfig', function ($scope, $element, $attrs, fuguTreeConfig) {
        var flag = true;
        this.checkedNodes = {}; // 选中节点集合
        // 变量初始化,如果没有设置,则使用默认值
        this.showIcon = angular.isDefined($scope.showIcon) ? $scope.showIcon : fuguTreeConfig.showIcon;
        this.checkable = angular.isDefined($scope.checkable) ? $scope.checkable : fuguTreeConfig.checkable;
        this.expandAll = angular.isDefined($scope.expandAll) ? !$scope.expandAll : fuguTreeConfig.collapsedAll;
        this.editable = angular.isDefined($scope.editable) ? $scope.editable : fuguTreeConfig.editable;
        $scope.nodes = checkNodesStyle($scope.$parent.$eval($attrs.ngModel)) ? $scope.$parent.$eval($attrs.ngModel) : [];  // 获取ng-model绑定节点对象

        /**
         *  检查传递的树结构数组是否正确,如果结构正确返回true否则返回false
         * @param {array} nodes ngModel绑定树结构数组对象
         */
        function checkNodesStyle(nodes){
            var i = 0;
            if(nodes instanceof Array){
                for(i=0; i<nodes.length; i++){
                    if(!nodes[i].label){
                        flag = false;
                    }else{
                        if(nodes[i].children && nodes[i].children.length > 0){
                            return checkNodesStyle(nodes[i].children);
                        }else{
                            if(Object.getOwnPropertyNames(nodes[i]).length > 1){
                                flag = false;
                            }
                         }
                    }
                }
                return flag;
            }else{
                return false;  // 非对象格式
            }
        }
    }])
    .directive('fuguTree', ['fuguTreeConfig', '$parse', function () {
        return {
            restrict: 'AE',
            scope: {
                showIcon: '=?',
                checkable: '=?',
                expandAll: '=?',
                editable: '=?',
                onClick: '&?',
                onCheckChange: '&?'
            },
            replace: true,
            require: ['ngModel'],
            templateUrl: 'templates/tree.html',
            controller: 'treeController',
            link: function (scope) {
                var clickFn = scope.onClick(),  //获取绑定在tree上的click事件回调
                    checkFn = scope.onCheckChange();  //获取绑定在tree上的check事件回调
                /**
                 * 捕获click事件，进行绑定事件处理
                 */
                scope.$on('on-click', function (e, data) {
                    if (angular.isDefined(clickFn)) {
                        clickFn(data);
                    }
                });

                /**
                 * 捕获check改变事件，绑定事件处理
                 */
                scope.$on('on-check', function(e, data){
                    if (angular.isDefined(checkFn)) {
                        checkFn(data);
                    }
                });
            }
        }
    }])
    .controller('treeNodeController', ['$scope', function ($scope) {


        /**
         * 阻止事件传播
         * @param {object} event 事件对象
         */
        $scope.preventClick = function (event) {
            event.stopPropagation();
        };

        /**
         * 向上派发单击事件,传递当前单击对象节点信息以及其子节点
         * @param {object} e 事件对象
         */
        $scope.clickFn = function (e) {
            $scope.$emit('on-click', e.node); // 向上派发事件,同时暴露出当前点击节点信息
        };

        $scope.toggleCollapsed = function(e, scope){
            e.stopPropagation();
            if(scope.node.children && scope.node.children.length > 0){
                $scope.collapsed = !$scope.collapsed;  // 闭合元素
            }
        };

        /**
         * 向上|向下派发事件(注意节点自身派发出去的事件，会被自身先捕获一次)
         * @param {boolean} selected checkbox选中|取消状态
         * @param self 选中|取消checkbox自己
         */
        $scope.checkFn = function (selected) {
            // 派发的先后顺序对代码执行会有影响
            $scope.$broadcast('check-change', selected);   // 向下派发事件
            $scope.$emit('check-change', selected);  // 向上派发事件
            $scope.$emit('on-check', $scope.treeCtrl.checkedNodes);  // 向上派发事件,同时向上暴露选中节点集合
        };

        /**
         * 捕获勾选状态修改事件,执行勾选|取消勾选操作,修改勾选集合
         */
        $scope.$on('check-change', function (event, selected) {
            var currentScope = event.currentScope,    //当前事件节点scope
                targetScope = event.targetScope,    // 原始触发选中|取消节点scope
                leafFlag = !(currentScope.node.children && currentScope.node.children.length > 0),  // 叶子节点标识
                parentFlag = false,   //子节点触发父节点(true)｜父节点触发子节点(false)标识
                selfFlag = true,    //节点本身勾选|不选标识
                targetParentScope = targetScope.$parent.$parent,  // 获取当前节点的父节点scope
                checkNodes = currentScope.treeCtrl.checkedNodes,  // 选中节点集合
                i = 0,
                childrensEle = null,   //当前节点非叶子节点时的孩子节点
                selectFlag = true,    // 孩子节点是否全部勾选标识
                childrenScope = null,  //遍历孩子节点的scope
                subElements = null;   //子节点对象集合

            // 判断是父节点触发还是子节点触发,还是自身触发
            if (targetScope.$id === currentScope.$id) {  //通过勾选|取消勾选触发
                parentFlag = false;
                selfFlag = true;
            } else {
                selfFlag = false;

                // 判断是否为子节点触发父节点:向上触发
                while (targetParentScope) {
                    if (targetParentScope.$id === currentScope.$id) {  // 目标触发节点是父节点
                        parentFlag = true;
                        break;
                    } else {
                        targetParentScope = targetParentScope.$parent ? targetParentScope.$parent.$parent : targetParentScope.$parent;   //获取父scope
                    }
                }
            }

            // 节点分为叶子节点和非叶子节点进行处理
            if (!leafFlag) {  // 非叶子节点

                if (selected) {   // 选中

                    // 判断是够为向上触发:子触发父
                    if (parentFlag) {
                        childrensEle = currentScope.ele.children('ol').children('li');  // 获取子节点
                        for (i = 0; i < childrensEle.length; i++) {
                            childrenScope = childrensEle.eq(i).children('div').children('div').children('input').scope();  // 获取当前遍历节点勾选框的scope
                            if (childrenScope.selected !== selected) { //判断孩子节点是否为选中状态
                                selectFlag = false;   //存在未否选孩子节点
                                break;
                            }
                        }
                        // 子选父:子节点全部勾选,则选中父节点
                        if (selectFlag) {
                            reselect(childrensEle, checkNodes);  //重新保存选中集合(父加入集合，则需要移除原有的子孙集合)
                            currentScope.selected = selected;
                            currentScope.ele.children('div').children('input').checked = selected;  // 实现勾选
                            checkNodes[currentScope.$id] = currentScope.node;  // 保存节点信息到集合
                        }
                    }

                    //判断是否为向下触发:父选择触发子选择
                    if (!parentFlag && !selfFlag) { //触发子非叶子节点
                        // 只需要修改勾选状态
                        event.currentScope.selected = selected;
                        event.currentScope.ele.children('div').children('input').checked = selected;
                    }

                    // 自己勾选触发事件
                    if (selfFlag) {
                        event.currentScope.selected = selected;  //修改勾选状态
                        event.currentScope.ele.children('div').children('input').checked = selected;
                        checkNodes[event.currentScope.$id] = event.currentScope.node;   // 保存节点信息
                        reselect(event.currentScope.ele.children('ol').children('li'), checkNodes);  //重新保存选中集合(父加入集合，则需要移除原有的子孙集合)
                    }

                } else {
                    // 修改勾选状态
                    currentScope.selected = selected;
                    currentScope.ele.children('div').children('input').checked = selected;
                    if (angular.isDefined(checkNodes[currentScope.$id])) {  // 判断当前节点是否再勾选集合中
                        delete  checkNodes[event.currentScope.$id];  // 删除勾选集合中当前元素
                    }

                    // 取消勾选子触发父节点也不选中
                    if (parentFlag) {
                        childrensEle = event.currentScope.ele.children('ol').children('li'); // 获取当前节点的孩子节点
                        for (i = 0; i < childrensEle.length; i++) {
                            subElements = childrensEle.eq(i).children('div').children('div').children('input');
                            if (subElements.scope().selected) {  // 判断子节点是否为选中
                                // 选中子节点的节点信息存入选中集合
                                checkNodes[subElements.scope().$id] = subElements.scope().node;
                            }
                        }
                    }
                }

            } else {   // 叶子节点

                // 父选子:向下触发,只需改变勾选状态,不用修改节点集合
                if (!parentFlag && !selfFlag) {
                    event.currentScope.selected = selected;
                    event.currentScope.ele.children('div').children('input').checked = selected;
                }

                // 自己选自己:修改勾选状态
                if (selfFlag) {
                    event.currentScope.selected = selected;
                    event.currentScope.ele.children('div').children('input').checked = selected;
                    if (selected) {  // 勾选的保存信息到节点集合
                        checkNodes[event.currentScope.$id] = event.currentScope.node;  // 保存节点信息
                    }
                }

                // 取消勾选时,从勾选节点集合中移除
                if (!selected) {
                    if (angular.isDefined(checkNodes[event.currentScope.$id])) {
                        delete  checkNodes[event.currentScope.$id];
                    }
                }
            }
        });

        /**
         * 选中父节点时,需要对选中节点数组进行重新选择，保证数组中出现的节点不重复(添加父亲node，则无需添加子node)
         * @param {array} ele:子元素对象数组
         * @param {array} checkNodes:tree选中节点数组集合
         */
        function reselect(ele, checkNodes) {
            var i = 0,
                subElements = null,
                subScope = null,
                innerEle = null;
            for (; i < ele.length; i++) {
                subElements = ele.eq(i).children('div').children('div').children('input');  // 获取子节点选择框
                subScope = subElements.scope(); //获取子节点
                if (subElements.length > 0 && angular.isDefined(checkNodes[subScope.$id])) {  // 判断取消节点是否为当前节点
                    delete checkNodes[subScope.$id]; // 如果当前子节点选中，则存入
                } else {
                    innerEle = ele.eq(i).children('div').children('ol').children('li');
                    if (innerEle.length > 0) {
                        reselect(innerEle, checkNodes);
                    }
                }
            }
        }
    }])
    .directive('treeNode', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'AE',
            scope: {
                node: '='
            },
            replace: true,
            require: ['^fuguTree'],
            templateUrl: 'templates/tree-node.html',
            controller: 'treeNodeController',
            link: function (scope, element, attrs, ctrls) {
                var tpl = null,
                    htmlTpl = null;
                scope.treeCtrl = ctrls[0];  // 保存树ctrl
                scope.ele = element;  // 保存节点元素
                scope.collapsed = scope.treeCtrl.expandAll;  // 文件夹展开|收起标识
                scope.showIcon = scope.treeCtrl.showIcon;  // 是否显示图标标识
                scope.checkable = scope.treeCtrl.checkable;  // 是否勾选标识

                // 动态插入子节点
                if (scope.node.children && scope.node.children.length > 0) {
                    tpl = '<li ng-repeat="node in  node.children"><tree-node data-node="node"></tree-node><ol></ol></li>';
                    htmlTpl = $compile(tpl)(scope);
                    element.find('ol').append(htmlTpl);
                }
            }
        }
    }]);
angular.module("alert/templates/alert.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/alert.html",
    "<div ng-show=\"!defaultclose\" class=\"alert fugu-alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">"+
    "    <div ng-show=\"hasIcon\" class=\"alert-icon\">"+
    "        <span class=\"alert-icon-span glyphicon\" ng-class=\"'glyphicon-'+iconClass\"></span>"+
    "    </div>"+
    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"closeFunc({$event: $event})\">"+
    "        <span ng-if=\"!closeText\">&times;</span>"+
    "        <span class=\"cancel-text\" ng-if=\"closeText\">{{closeText}}</span>"+
    "    </button>"+
    "    <div ng-class=\"[hasIcon?'show-icon' : null]\" ng-transclude></div>"+
    "</div>");
}]);
angular.module("button/templates/button.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/button.html",
    "<button class=\"btn\" type=\"{{type}}\" ng-class=\"{'btn-addon': iconFlag}\"><i class=\"glyphicon\" ng-class=\"icon\" ng-show=\"iconFlag\"></i>{{text}}</button>");
}]);
angular.module("buttonGroup/templates/buttonGroup.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/buttonGroup.html",
    "<div class=\"btn-group\">"+
    "    <label class=\"btn  btn-default\"  ng-class=\"[showClass, size, disabled, btn.active]\" ng-repeat=\"btn in buttons\" ng-click=\"clickFn(btn, $event)\">{{btn.value}}</label>"+
    "</div>");
}]);
angular.module("calendar/templates/calendar.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/calendar.html",
    "<div class=\"fugu-calendar\">"+
    "    <div class=\"fugu-cal-panel-day\" ng-show=\"panels.day\">"+
    "        <div class=\"fugu-cal-month\">"+
    "            <i class=\"fugu-cal-pre-button glyphicon glyphicon-chevron-left\" ng-click=\"prevMonth()\"></i>"+
    "            <span class=\"fugu-cal-month-name\">"+
    "                <a href=\"javascript:;\" ng-click=\"selectPanel('month')\">{{FORMATS.SHORTMONTH[currentMonth]}}</a>"+
    "                <a href=\"javascript:;\" ng-click=\"selectYearPanelHandler()\">{{currentYear}}</a>"+
    "            </span>"+
    "            <i class=\"fugu-cal-next-button glyphicon glyphicon-chevron-right\" ng-click=\"nextMonth()\"></i>"+
    "        </div>"+
    "        <div class=\"fugu-cal-header clearfix\">"+
    "            <div ng-repeat=\"day in dayNames track by $index\">{{day}}</div>"+
    "        </div>"+
    "        <div class=\"fugu-cal-body\">"+
    "            <div class=\"fugu-cal-row\" ng-repeat=\"row in allDays\">"+
    "                <div ng-class=\"{'fugu-cal-select':day.index===currentDay,'fugu-cal-outside':!day.inMonth,'fugu-cal-weekday':day.isWeekend,'fugu-cal-day-today':day.isToday,'fugu-cal-day-disabled':day.isDisabled}\""+
    "                     class=\"fugu-cal-day\" ng-repeat=\"day in row\" ng-click=\"selectDayHandler(day)\">"+
    "                    <span class=\"fugu-cal-day-inner\">{{day.day}}</span>"+
    "                </div>"+
    "            </div>"+
    "        </div>"+
    "        <div class=\"fugu-cal-footer\">"+
    "            <div class=\"fugu-cal-time\" ng-click=\"selectTimePanelHandler()\" ng-if=\"showTime\">"+
    "                <span class=\"glyphicon glyphicon-time\"></span>"+
    "                {{selectDate | date:'shortTime'}}"+
    "            </div>"+
    "            <div class=\"fugu-cal-today-btn\" ng-click=\"chooseToday()\">Today</div>"+
    "        </div>"+
    "    </div>"+
    "    <div class=\"fugu-cal-panel-time\" ng-show=\"panels.time\"> <!--这里要用ng-show,不能用ng-if-->"+
    "        <fugu-timepanel ng-model=\"selectDate\"></fugu-timepanel>"+
    "        <div class=\"btn-group clearfix\">"+
    "            <button class=\"btn btn-sm btn-default fugu-cal-time-cancal\" ng-click=\"timePanelBack()\">返回</button>"+
    "            <button class=\"btn btn-sm btn-default fugu-cal-time-now\" ng-click=\"timePanelSelectNow()\">此刻</button>"+
    "            <button class=\"btn btn-sm btn-default fugu-cal-time-ok\" ng-click=\"timePanelOk()\">确定 </button>"+
    "        </div>"+
    "    </div>"+
    "    <div class=\"fugu-cal-panel-month\" ng-show=\"panels.month\">"+
    "        <div class=\"fugu-cal-month\">"+
    "            <span class=\"fugu-cal-month-name\">"+
    "                <a href=\"javascript:;\" ng-click=\"selectYearPanelHandler()\">{{currentYear}}</a>"+
    "            </span>"+
    "        </div>"+
    "        <div class=\"fugu-cal-body\">"+
    "            <table class=\"fugu-cal-month-table\">"+
    "                <tr ng-repeat=\"monthRow in allMonths\">"+
    "                    <td class=\"fugu-cal-month-item\""+
    "                        ng-repeat=\"month in monthRow\""+
    "                        ng-click=\"chooseMonthHandler(month.index)\""+
    "                        ng-class=\"{'fugu-cal-month-select':month.index === currentMonth}\">"+
    "                        <span class=\"fugu-cal-month-inner\">{{month.name}}</span>"+
    "                    </td>"+
    "                </tr>"+
    "            </table>"+
    "        </div>"+
    "    </div>"+
    "    <div class=\"fugu-cal-panel-year\" ng-show=\"panels.year\">"+
    "        <div class=\"fugu-cal-month\">"+
    "            <i class=\"fugu-cal-pre-button glyphicon glyphicon-chevron-left\" ng-click=\"prev12Years()\"></i>"+
    "            <span class=\"fugu-cal-month-name\">"+
    "                <a href=\"javascript:;\">{{allYears[0][0]}}-{{allYears[3][2]}}</a>"+
    "            </span>"+
    "            <i class=\"fugu-cal-next-button glyphicon glyphicon-chevron-right\" ng-click=\"next12Years()\"></i>"+
    "        </div>"+
    "        <div class=\"fugu-cal-body\">"+
    "            <table class=\"fugu-cal-month-table\">"+
    "                <tr ng-repeat=\"yearRow in allYears track by $index\">"+
    "                    <td class=\"fugu-cal-month-item fugu-cal-year-item\""+
    "                        ng-repeat=\"year in yearRow track by $index\""+
    "                        ng-click=\"chooseYearHandler(year)\""+
    "                        ng-class=\"{'fugu-cal-month-select':year === currentYear}\">"+
    "                        <span class=\"fugu-cal-month-inner\">{{year}}</span>"+
    "                    </td>"+
    "                </tr>"+
    "            </table>"+
    "        </div>"+
    "    </div>"+
    "</div>");
}]);
angular.module("dropdown/templates/dropdown-choices.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/dropdown-choices.html",
    "<li>"+
    "    <a href=\"javascript:;\" ng-transclude></a>"+
    "</li>");
}]);
angular.module("dropdown/templates/dropdown.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/dropdown.html",
    "<div class=\"btn-group dropdown\" ng-class=\"[{true:multiColClass}[count>colsNum],{true:openClass}[isOpen]]\">"+
    "    <button type=\"button\" ng-click=\"toggleDropdown($event)\" ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-primary dropdown-toggle\">"+
    "        {{btnValue}}&nbsp;<span class=\"caret\"></span>"+
    "    </button>"+
    "    <ul class=\"dropdown-menu\" ng-style=\"{width:count>colsNum?colsNum*eachItemWidth:'auto'}\" ng-transclude></ul>"+
    "</div>");
}]);
angular.module("datepicker/templates/datepicker.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/datepicker.html",
    "<div class=\"fugu-datepicker\">"+
    "    <div class=\"input-group\">"+
    "        <input type=\"text\" ng-disabled=\"isDisabled\" class=\"input-sm form-control fugu-datepicker-input\" ng-click=\"toggleCalendarHandler($event)\" placeholder=\"{{placeholder}}\" ng-model=\"inputValue\">"+
    "        <span class=\"input-group-btn\" ng-if=\"clearBtn\">"+
    "            <button ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-default fugu-datepicker-remove\" type=\"button\" ng-click=\"clearDateHandler($event)\">"+
    "                <i class=\"glyphicon glyphicon-remove\"></i>"+
    "            </button>"+
    "        </span>"+
    "        <span class=\"input-group-btn\">"+
    "            <button ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"toggleCalendarHandler($event)\">"+
    "                <i class=\"glyphicon glyphicon-calendar\"></i>"+
    "            </button>"+
    "        </span>"+
    "    </div>"+
    "    <fugu-calendar class=\"fugu-datepicker-cal-bottom\" ng-model=\"selectDate\" ng-show=\"showCalendar\" on-change=\"changeDateHandler\""+
    "                   exceptions=\"exceptions\" min-date=\"minDate\" max-date=\"maxDate\"></fugu-calendar>"+
    "</div>"+
    "");
}]);
angular.module("modal/templates/backdrop.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/backdrop.html",
    "<div class=\"modal-backdrop fade {{ backdropClass }}\""+
    "     ng-class=\"{in: animate}\""+
    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\""+
    "></div>"+
    "");
}]);
angular.module("modal/templates/window.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/window.html",
    "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">"+
    "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg'}\">"+
    "        <div class=\"modal-content\" fugu-modal-transclude></div>"+
    "    </div>"+
    "</div>");
}]);
angular.module("notification/templates/alert.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/alert.html",
    "<div ng-show=\"!defaultclose\" class=\"alert fugu-alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">"+
    "    <div ng-show=\"hasIcon\" class=\"alert-icon\">"+
    "        <span class=\"alert-icon-span glyphicon\" ng-class=\"'glyphicon-'+iconClass\"></span>"+
    "    </div>"+
    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"closeFunc({$event: $event})\">"+
    "        <span ng-if=\"!closeText\">&times;</span>"+
    "        <span class=\"cancel-text\" ng-if=\"closeText\">{{closeText}}</span>"+
    "    </button>"+
    "    <div ng-class=\"[hasIcon?'show-icon' : null]\" ng-transclude></div>"+
    "</div>");
}]);
angular.module("notification/templates/notification.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/notification.html",
    "<div class=\"notice-container\">"+
    "    <div class=\"notice-item\" ng-repeat=\"notification in notifications\">"+
    "        <!--<fugu-alert type=\"{{notification.type}}\" has-icon=\"{{notification.disableIcon}}\" close=\"{{!notification.disableCloseBtn}}\" close-func=\"closeFn(notification)\" class=\"media-heading\">{{notification.text}}</fugu-alert>-->"+
    "        <fugu-alert type=\"{{notification.type}}\" has-icon=\"true\" close=\"{{!notification.disableCloseBtn}}\" close-func=\"closeFn(notification)\" class=\"media-heading\">{{notification.text}}</fugu-alert>"+
    "    </div>"+
    "</div>");
}]);
angular.module("pager/templates/pager.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/pager.html",
    "<ul class=\"pagination pagination-sm m-t-none m-b-none\">"+
    "    <li ng-class=\"{disabled: isFirst()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"first()\">{{getText('first')}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isFirst()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"previous()\">{{getText('previous')}}</a>"+
    "    </li>"+
    "    <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"selectPage(page.pageIndex)\">{{page.pageIndex + 1}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"next()\">{{getText('next')}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"last()\">{{getText('last')}}</a>"+
    "    </li>"+
    "    <li class=\"disabled\">"+
    "        <a href=\"javascript:void(0)\">共{{totalPages}}页 / {{totalItems}}条</a>"+
    "    </li>"+
    "</ul>");
}]);
angular.module("searchBox/templates/searchBox.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/searchBox.html",
    "<div ng-class=\"{'input-group':showBtn}\">"+
    "    <input type=\"text\" class=\"input-sm form-control\" ng-keyup=\"keyUpToSearch($event)\" placeholder=\"{{placeholder}}\" ng-model=\"searchBox.query\">"+
    "    <span class=\"input-group-btn\" ng-if=\"showBtn\">"+
    "        <button class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"doSearch()\">{{getText()}}</button>"+
    "    </span>"+
    "</div>"+
    "");
}]);
angular.module("switch/templates/switch.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/switch.html",
    "<label class=\"fugu-switch\" ng-class=\"['fugu-switch-'+switchObj.type,'fugu-switch-'+switchObj.size]\">"+
    "    <input type=\"checkbox\" ng-disabled=\"switchObj.isDisabled\" ng-model=\"switchObj.query\"/>"+
    "    <i></i>"+
    "</label>");
}]);
angular.module("timepanel/templates/timepanel.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/timepanel.html",
    "<div class=\"fugu-timepanel\">"+
    "    <div class=\"fugu-timepanel-col\">"+
    "        <div class=\"fugu-timepanel-top\" ng-click=\"decrease('hour',23)\">{{hour | smallerValue:23:hourStep}}</div>"+
    "        <div class=\"fugu-timepanel-middle clearfix\">"+
    "            <input class=\"fugu-timepanel-input\" type=\"text\" ng-change=\"changeInputValue('hour',23)\" ng-model=\"hour\" placeholder=\"HH\"/>"+
    "            <span class=\"fugu-timepanel-label\">时</span>"+
    "        </div>"+
    "        <div class=\"fugu-timepanel-bottom\" ng-click=\"increase('hour',23)\">{{hour | largerValue:23:hourStep}}</div>"+
    "    </div>"+
    "    <div class=\"fugu-timepanel-col\">"+
    "        <div class=\"fugu-timepanel-top\" ng-click=\"decrease('minute',59)\">{{minute | smallerValue:59:minuteStep}}</div>"+
    "        <div class=\"fugu-timepanel-middle clearfix\">"+
    "            <input class=\"fugu-timepanel-input\" type=\"text\" ng-change=\"changeInputValue('minute',59)\" ng-model=\"minute\" placeholder=\"MM\"/>"+
    "            <span class=\"fugu-timepanel-label\">分</span>"+
    "        </div>"+
    "        <div class=\"fugu-timepanel-bottom\" ng-click=\"increase('minute',59)\">{{minute | largerValue:59:minuteStep}}</div>"+
    "    </div>"+
    "    <div class=\"fugu-timepanel-col\" ng-show=\"showSeconds\">"+
    "        <div class=\"fugu-timepanel-top\" ng-click=\"decrease('second',59)\">{{second | smallerValue:59:secondStep}}</div>"+
    "        <div class=\"fugu-timepanel-middle clearfix\">"+
    "            <input class=\"fugu-timepanel-input\" type=\"text\" ng-change=\"changeInputValue('second',59)\" ng-model=\"second\" placeholder=\"SS\"/>"+
    "            <span class=\"fugu-timepanel-label\">秒</span>"+
    "        </div>"+
    "        <div class=\"fugu-timepanel-bottom\" ng-click=\"increase('second',59)\">{{second | largerValue:59:secondStep}}</div>"+
    "    </div>"+
    "</div>"+
    "");
}]);
angular.module("timepicker/templates/timepicker.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/timepicker.html",
    "<div class=\"fugu-timepicker\">"+
    "    <div class=\"input-group\">"+
    "        <input type=\"text\" ng-disabled=\"isDisabled\" class=\"input-sm form-control fugu-timepicker-input\" ng-click=\"toggleTimepanel($event)\" placeholder=\"{{placeholder}}\" ng-model=\"inputValue\">"+
    "        <span class=\"input-group-btn\">"+
    "            <button ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"toggleTimepanel($event)\">"+
    "                <i class=\"glyphicon glyphicon-time\"></i>"+
    "            </button>"+
    "        </span>"+
    "    </div>"+
    "    <fugu-timepanel hour-step=\"hourStep\" minute-step=\"minuteStep\" second-step=\"secondStep\" class=\"fugu-timepicker-timepanel-bottom\" ng-model=\"selectedTime\" on-change=\"changeTime\" ng-show=\"showTimepanel\"></fugu-timepanel>"+
    "</div>"+
    "");
}]);
angular.module("tree/templates/tree-node.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/tree-node.html",
    "<div>"+
    "    <div class=\"cur\" ng-click=\"clickFn(this)\">"+
    "        <input type=\"checkbox\" ng-model=\"selected\" ng-change=\"checkFn(selected)\" ng-click=\"preventClick($event)\" ng-show=\"checkable\"/>"+
    "        <span ng-if=\"node.children && node.children.length > 0\" ng-click=\"toggleCollapsed($event, this)\">"+
    "            <i class=\"glyphicon\" ng-class=\"{'glyphicon-folder-close': collapsed&&showIcon, 'glyphicon-folder-open': !collapsed&&showIcon}\" ></i>"+
    "        </span>"+
    "        <span ng-if=\"!node.children || node.children.length == 0\" ng-click=\"preventClick($event)\">"+
    "            <i class=\"glyphicon glyphicon-file\" ng-show=\"showIcon\"></i>"+
    "        </span>"+
    "        {{node.label}}"+
    "        <span ng-show=\"editable\">"+
    "            <span class=\"btn btn-xs m-10-neg\" ng-click=\"add($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-plus-sign\"></i>"+
    "            </span>"+
    "            <span class=\"btn btn-xs m-10-neg\" ng-click=\"delete($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-trash\"></i>"+
    "            </span>"+
    "             <span class=\"btn btn-xs\" ng-click=\"edit($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-edit\"></i>"+
    "            </span>"+
    "        </span>"+
    "    </div>"+
    "    <ol ng-show=\"!collapsed\">"+
    "    </ol>"+
    "</div>");
}]);
angular.module("tree/templates/tree.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/tree.html",
    "<div class=\"tree\">"+
    "    <ol ng-show=\"nodes && nodes.length > 0 && !collapsedAll\" class=\"tree-content\">"+
    "        <li ng-repeat=\"node in nodes\">"+
    "            <tree-node  data-node=\"node\" ng-if=\"node.children && node.children.length > 0\"></tree-node>"+
    "            <tree-node data-node=\"node\" ng-if=\"!node.children || node.children.length == 0\"></tree-node>"+
    "        </li>"+
    "    </ol>"+
    "</div>");
}]);