/* eslint angular/timeout-service:0  */
describe('ui.xg.datepicker', function () {
    var compile,
        scope,
        element,
        dateFilter,
        datepickerConfig,
        $timeout;

    beforeEach(function () {
        module('ui.xg.position');
        module('ui.xg.popover');
        module('ui.xg.tooltip');
        module('ui.xg.stackedMap');
        module('ui.xg.timepanel');
        module('ui.xg.calendar');
        module('ui.xg.datepicker');
        module('timepanel/templates/timepanel.html');
        module('calendar/templates/calendar.html');
        module('datepicker/templates/datepicker.html');
        module('datepicker/templates/datepicker-calendar.html');
        module('popover/templates/popover-template-popup.html');
        inject(function (_$timeout_, $compile, $rootScope, uixDatepickerConfig, _dateFilter_) {
            $timeout = _$timeout_;
            compile = $compile;
            scope = $rootScope.$new();
            datepickerConfig = uixDatepickerConfig;
            dateFilter = _dateFilter_;
        });
    });
    afterEach(function () {
        element.remove();
    });
    function createDatepicker(el) {
        if (!el) {
            el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            scope.time = getDate();
        }
        element = compile(el)(scope);
        scope.$digest();
    }

    // 获取input
    function getInput() {
        return element.find('.uix-datepicker-input');
    }

    // 获取button
    function getToggleButton() {
        return element.find('.uix-datepicker-toggle');
    }

    // 获取clear button
    function getClearButton() {
        return element.find('.uix-datepicker-remove');
    }

    // 获取input的值
    function getInputVal() {
        return getInput().val();
    }

    //获取calendar
    function getCalendarPanel() {
        return element.find('.uix-calendar');
    }

    // 点击输入框
    function clickInput() {
        getInput().click();
        scope.$digest();
    }

    function clickToggleButton() {
        getToggleButton().click();
        scope.$digest();
    }

    function clickClearButton() {
        getClearButton().click();
        scope.$digest();
    }

    // 指定日期为2016-4-15 12:30:30
    function getDate(opt) {
        opt = opt || {};
        var dt = new Date();
        dt.setMonth(0);
        dt.setDate(31); // set date to 1.31 first
        dt.setFullYear(opt.year || 2016);
        dt.setDate(opt.day || 15);
        dt.setMonth(opt.month || 3);
        dt.setHours(opt.hour || 12);
        dt.setMinutes(opt.minute || 30);
        dt.setSeconds(opt.second || 30);
        return dt;
    }

    function getDay(day, outside) {
        var selector = '.uix-cal-day';
        if (outside) {
            selector += '.uix-cal-outside';
        } else {
            selector += ':not(.uix-cal-outside)';
        }
        selector += ':contains("' + day + '")';
        return getCalendarPanel().find(selector);
    }

    /**
     * 点击某一天
     * @param date - 某月的几号
     * @param outside - 是否不是当月,如点击上一月
     */
    function clickDay(date, outside) {
        var day = getDay(date, outside);
        if (day.length) {
            day.eq(0).click();
            scope.$digest();
        }
    }

    // 判断两个时间是否是一样的,只限制到秒级别
    function isSeamTime(timeA, timeB) {
        var foo = dateFilter(timeA, 'yyyy-MM-dd hh:mm:ss');
        var bar = dateFilter(timeB, 'yyyy-MM-dd hh:mm:ss');
        return foo === bar;
    }

    describe('basic usage', function () {
        it('should have uix-datepicker class', function () {
            createDatepicker();
            expect(element).toHaveClass('uix-datepicker');
        });
        it('should have a input and a button by default', function () {
            createDatepicker();
            expect(getInput().length).toBe(1);
            expect(getToggleButton().length).toBe(1);
        });
        it('should show calendar when click input', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            expect(getCalendarPanel().length).toBe(0);
            clickInput();
            expect(getCalendarPanel().length).toBe(1);
        });
        it('should show calendar when click toggle button', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            expect(getCalendarPanel().length).toBe(0);
            clickToggleButton();
            expect(getCalendarPanel().length).toBe(1);
        });
    });

    describe('ngModel attribute', function () {
        it('should do not show input val when ngModel is undefined', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            createDatepicker(el);
            expect(getInputVal()).toBe('');
        });

        it('should change ngModel when click day', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            clickToggleButton();
            clickDay(20);
            var dt = getDate({
                day: 20
            });
            expect(isSeamTime(scope.time, dt)).toBeTruthy();
        });

        it('should not change ngModel if set minDate when click day', function () {
            var el = '<uix-datepicker min-date="minDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            var cache = angular.copy(scope.time);
            scope.minDate = getDate({
                day: 14
            });
            createDatepicker(el);
            clickToggleButton();
            clickDay(10);
            expect(scope.time).toEqual(cache);
        });
        it('should not change ngModel if set maxDate when click day', function () {
            var el = '<uix-datepicker max-date="maxDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            var cache = angular.copy(scope.time);
            scope.maxDate = getDate({
                day: 20
            });
            createDatepicker(el);
            clickToggleButton();
            clickDay(25);
            expect(scope.time).toEqual(cache);
        });
    });

    describe('format attribute', function () {
        it('should show format time by default', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            var dt = getDate();
            scope.time = dt;
            createDatepicker(el);
            var val = getInputVal();
            expect(val).toEqual(dateFilter(dt, datepickerConfig.format));
        });
        it('should show set custom format time', function () {
            var el = '<uix-datepicker format="format" ng-model="time"></uix-datepicker>';
            var dt = getDate();
            scope.time = dt;
            scope.format = 'yyyy-MM-dd hh:mm';
            createDatepicker(el);
            var val = getInputVal();
            expect(val).toEqual(dateFilter(dt, scope.format));
        });
    });

    describe('placeholder attribute', function () {
        it('should not have placeholder by default', function () {
            createDatepicker();
            expect(getInput().attr('placeholder')).toBe('');
        });
        it('should have placeholder when set', function () {
            var el = '<uix-datepicker placeholder="{{ph}}" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.ph = '我是一个placeholder';
            createDatepicker(el);
            expect(getInput().attr('placeholder')).toBe(scope.ph);
        });
    });

    describe('clearBtn attribute', function () {
        it('should have clear button when set clearBtn to be true', function () {
            var el = '<uix-datepicker clear-btn="clearBtn" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.clearBtn = true;
            createDatepicker(el);
            expect(getClearButton().length).toBe(1);
        });
        it('should clear ngModel when click clear button', function () {
            var el = '<uix-datepicker clear-btn="clearBtn" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.clearBtn = true;
            createDatepicker(el);
            clickClearButton();
            expect(scope.time).toBeFalsy();
        });
    });

    describe('ngDisable attribute', function () {
        it('should be disable when set ng-disabled to be true', function () {
            var el = '<uix-datepicker ng-disabled="isDisbaled" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.isDisbaled = true;
            createDatepicker(el);
            expect(getInput()).toHaveAttr('disabled', 'disabled');
            expect(getToggleButton()).toHaveAttr('disabled', 'disabled');
        });
        it('should not show calendar click on input when ng-disabled to be true', function () {
            var el = '<uix-datepicker ng-disabled="isDisbaled" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.isDisbaled = true;
            createDatepicker(el);
            expect(getCalendarPanel().length).toBe(0);
            clickInput();
            expect(getCalendarPanel().length).toBe(0);
        });
        it('should not show calendar click on toggle button when ng-disabled to be true', function () {
            var el = '<uix-datepicker ng-disabled="isDisbaled" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.isDisbaled = true;
            createDatepicker(el);
            expect(getCalendarPanel().length).toBe(0);
            clickToggleButton();
            expect(getCalendarPanel().length).toBe(0);
        });
    });

    describe('autoClose attribute', function () {
        it('should auto close calendar by default when click day in current month', function (done) {
            createDatepicker();
            clickToggleButton();
            expect(getCalendarPanel().length).toBe(1);
            clickDay(15);
            setTimeout(function () {
                $timeout.flush();
                expect(getCalendarPanel().length).toBe(0);
                done();
            }, 200);
        });
        it('should auto close calendar by default when click day in prev month', function (done) {
            createDatepicker();
            clickToggleButton();
            expect(getCalendarPanel().length).toBe(1);
            clickDay(29, true);
            // 默认开启动画,所以设置延迟
            setTimeout(function () {
                $timeout.flush();
                expect(getCalendarPanel().length).toBe(0);
                done();
            }, 200);
        });
        it('should not close calendar when a day is early then minDate', function () {
            var el = '<uix-datepicker min-date="minDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.minDate = getDate({
                day: 14
            });
            createDatepicker(el);
            clickToggleButton();
            clickDay(10);
            expect(getCalendarPanel().length).toBe(1);
        });
        it('should not close calendar when a day is later then maxDate', function () {
            var el = '<uix-datepicker max-date="maxDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.maxDate = getDate({
                day: 20
            });
            createDatepicker(el);
            clickToggleButton();
            clickDay(21);
            expect(getCalendarPanel().length).toBe(1);
        });
    });

    describe('exceptions attribute', function () {
        it('should change ngModel if set minDate and has exceptions', function () {
            var el = '<uix-datepicker exceptions="exceptions" min-date="minDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.minDate = getDate({
                day: 10
            });
            scope.exceptions = getDate({
                day: 5
            });
            createDatepicker(el);
            clickToggleButton();
            clickDay(5);
            expect(isSeamTime(scope.time, scope.exceptions)).toBeTruthy();
        });

        it('should change ngModel if set minDate and has exceptions array', function () {
            var el = '<uix-datepicker exceptions="exceptions" min-date="minDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.minDate = getDate({
                day: 10
            });
            scope.exceptions = [getDate({
                day: 5
            }), getDate({
                month: 2,
                day: 29
            })];
            createDatepicker(el);
            clickToggleButton();
            clickDay(5);
            expect(isSeamTime(scope.time, scope.exceptions[0])).toBeTruthy();
            clickToggleButton();
            clickDay(29, true);
            expect(isSeamTime(scope.time, scope.exceptions[1])).toBeTruthy();
        });

        it('should change ngModel if set maxDate and has exceptions', function () {
            var el = '<uix-datepicker exceptions="exceptions" max-date="maxDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.maxDate = getDate({
                day: 20
            });
            scope.exceptions = getDate({
                day: 25
            });
            createDatepicker(el);
            clickToggleButton();
            clickDay(25);
            expect(isSeamTime(scope.time, scope.exceptions)).toBeTruthy();
        });

        it('should change ngModel if set maxDate and has exceptions array', function () {
            var el = '<uix-datepicker exceptions="exceptions" max-date="maxDate" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.maxDate = getDate({
                day: 20
            });
            scope.exceptions = [getDate({
                day: 25
            }), getDate({
                day: 23
            })];
            createDatepicker(el);
            clickToggleButton();
            clickDay(25);
            expect(isSeamTime(scope.time, scope.exceptions[0])).toBeTruthy();
            clickToggleButton();
            clickDay(23);
            expect(isSeamTime(scope.time, scope.exceptions[1])).toBeTruthy();
        });
    });
    describe('showTime attribute', function () {
        function findTimeHandler() {
            return getCalendarPanel().find('.uix-cal-time');
        }

        it('should show time by default', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            clickToggleButton();
            expect(findTimeHandler().length).toBe(1);
        });
        it('should not show time', function () {
            var el = '<uix-datepicker show-time="false" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            clickToggleButton();
            expect(findTimeHandler().length).toBe(0);
        });
    });
    describe('showSeconds attribute', function () {
        function showTimeHandler() {
            return getCalendarPanel().find('.uix-cal-time').click();
        }

        function findSecondsInput() {
            return getCalendarPanel().find('.uix-timepanel-seconds');
        }

        it('should show seconds by default', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            clickToggleButton();
            showTimeHandler().click();
            expect(findSecondsInput()).not.toHaveClass('ng-hide');
        });
        it('should show seconds when showSecond attr is true', function () {
            var el = '<uix-datepicker ng-model="time" show-seconds="showSeonds"></uix-datepicker>';
            scope.time = getDate();
            scope.showSeonds = true;
            createDatepicker(el);
            clickToggleButton();
            showTimeHandler().click();
            expect(findSecondsInput()).not.toHaveClass('ng-hide');
        });
        it('should not show seconds when showSecond attr is false', function () {
            var el = '<uix-datepicker show-seconds="false" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            clickToggleButton();
            showTimeHandler().click();
            expect(findSecondsInput()).toHaveClass('ng-hide');
        });
    });
    describe('size attribute', function () {
        it('should be middle size by default', function () {
            var el = '<uix-datepicker ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            createDatepicker(el);
            var input = element.find('.uix-datepicker-input');
            expect(input).not.toHaveClass('input-sm');
            expect(input).not.toHaveClass('input-lg');
            var btn = element.find('.input-group-btn > button');
            expect(btn).not.toHaveClass('btn-sm');
            expect(btn).not.toHaveClass('btn-lg');
        });
        it('should be small size', function () {
            var el = '<uix-datepicker size="{{size}}" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.size = 'sm';
            createDatepicker(el);
            var input = element.find('.uix-datepicker-input');
            expect(input).toHaveClass('input-sm');
            var btn = element.find('.input-group-btn > button');
            expect(btn).toHaveClass('btn-sm');
        });
        it('should be large size', function () {
            var el = '<uix-datepicker size="{{size}}" ng-model="time"></uix-datepicker>';
            scope.time = getDate();
            scope.size = 'lg';
            createDatepicker(el);
            var input = element.find('.uix-datepicker-input');
            expect(input).toHaveClass('input-lg');
            var btn = element.find('.input-group-btn > button');
            expect(btn).toHaveClass('btn-lg');
        });
    });
    // dateFilter 属性
    describe('dateFilter', function () {
        it('should disable specific date', function () {
            var el = '<uix-datepicker ng-model="time" date-filter="dateFilter($date)"></uix-datepicker>';
            scope.time = getDate();
            // 星期一不可选
            scope.dateFilter = function ($date) {
                return $date.getDay() !== 1;
            };
            createDatepicker(el);
            clickToggleButton();
            expect(getDay(4)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(11)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(18)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(25)).toHaveClass('uix-cal-day-disabled');
        });
    });
});
