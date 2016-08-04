describe('ui.xg.calendar', function () {
    var compile,
        scope,
        element,
        calendarConfig,
        calendarProvider,
        $locale;

    beforeEach(function () {
        module('ui.xg.timepanel');
        module('ui.xg.calendar', ['uixCalendarProvider', function (uixCalendarProvider) {
            calendarProvider = uixCalendarProvider;
        }]);
        module('calendar/templates/calendar.html');
        module('timepanel/templates/timepanel.html');
        inject(function ($compile, $rootScope, uixCalendarConfig, _$locale_) {
            compile = $compile;
            scope = $rootScope.$new();
            calendarConfig = uixCalendarConfig;
            $locale = _$locale_;
        });
    });
    afterEach(function () {
        element.remove();
    });

    function createCalendar(el) {
        if (!el) {
            el = '<uix-calendar ng-model="time"></uix-calendar>';
            scope.time = getDate();
        }
        element = compile(el)(scope);
        scope.$digest();
    }

    function getAllWeekdays(year, month) {
        var firstDay = getDate({
            year: year,
            month: month,
            day: 1
        });
        var result = [];
        var day = 1;
        var firstDayWeek = firstDay.getDay();
        var lastDay = getLastDayOfMonth(year, month);
        if (firstDayWeek === 0) {
            while (day < lastDay) {
                result.push(day);
                if (day + 6 < lastDay) {
                    result.push(day + 6);
                }
                day += 7;
            }
        } else if (firstDayWeek === 6) {
            while (day < lastDay) {
                result.push(day);
                if (day + 1 < lastDay) {
                    result.push(day + 1);
                }
                day += 7;
            }
        } else {
            day = day + 6 - firstDayWeek;
            while (day < lastDay) {
                result.push(day);
                if (day + 1 < lastDay) {
                    result.push(day + 1);
                }
                day += 7;
            }
        }
        return result;
    }

    //获取一个月里最后一天是几号
    function getLastDayOfMonth(year, month) {
        var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //每个月的天数,2月会根据闰年调整
        var months = MONTH_DAYS.slice(0);
        if (year % 100 === 0 && year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
            months[1] = 29;
        }
        return months[month];
    }

    // 获取星期名称
    function getShortDay() {
        var res = [];
        var days = element.find('.uix-cal-panel-day .uix-cal-header').children();
        days.each(function () {
            res.push($(this).text().trim());
        });
        return res;
    }

    // 获取当月所有可选的天数
    function getAllDays() {
        var res = [];
        element.find('.uix-cal-panel-day .uix-cal-day:not(.uix-cal-outside)').each(function () {
            res.push($(this).text().trim());
        });
        return res;
    }

    // 指定日期为2016-3-15 12:30:30
    function getDate(opt) {
        opt = opt || {};
        var dt = new Date();
        dt.setFullYear(opt.year || 2016);
        dt.setMonth(angular.isDefined(opt.month) ? opt.month : 2);
        dt.setDate(opt.day || 15);
        dt.setHours(opt.hour || 12);
        dt.setMinutes(opt.minute || 30);
        dt.setSeconds(opt.second || 30);
        return dt;
    }

    function getDay(day, outside) {
        var selector = '.uix-cal-panel-day .uix-cal-day';
        if (outside) {
            selector += '.uix-cal-outside';
        } else {
            selector += ':not(.uix-cal-outside)';
        }
        selector += ':contains("' + day + '")';
        return element.find(selector);
    }

    // 选择当月某一天
    function selectDay(day, outside) {
        var d = getDay(day, outside);
        if (d) {
            d.click();
            scope.$digest();
        }
    }

    // 获取月的显示文本
    function getMonthText() {
        return element.find('.uix-cal-panel-day .uix-cal-month-name > a').eq(0).text();
    }

    function getYearText() {
        return element.find('.uix-cal-panel-day .uix-cal-month-name > a').eq(1).text();
    }

    // 选择上一个月
    function clickPrevMonth() {
        element.find('.uix-cal-panel-day .uix-cal-pre-button').click();
        scope.$digest();
    }

    function clickNextMonth() {
        element.find('.uix-cal-panel-day .uix-cal-next-button').click();
        scope.$digest();
    }

    // day panel to month panel
    function day2month() {
        var monthPanelButton = element.find('.uix-cal-panel-day .uix-cal-month-name > a').eq(0);
        monthPanelButton.click();
        scope.$digest();
    }

    // day panel to year panel
    function day2year() {
        var yearPanelButton = element.find('.uix-cal-panel-day .uix-cal-month-name > a').eq(1);
        yearPanelButton.click();
        scope.$digest();
    }

    describe('basic usage', function () {
        it('should have four panel', function () {
            createCalendar();
            expect(element.children().length).toBe(4);
        });
        it('should show day panel', function () {
            createCalendar();
            var panel = element.find('.uix-cal-panel-day');
            expect(panel).not.toBeHidden();
        });
    });
    // 日期选择面板的相关功能
    describe('calendar day panel', function () {
        it('should have month header', function () {
            createCalendar();
            var month = $locale.DATETIME_FORMATS.SHORTMONTH[scope.time.getMonth()];
            var year = scope.time.getFullYear();
            expect(getMonthText()).toBe(month);
            expect(getYearText()).toBe('' + year);
        });
        it('should get day names', function () {
            createCalendar();
            var shortDay = getShortDay();
            expect($locale.DATETIME_FORMATS.SHORTDAY).toEqual(shortDay);
        });
        it('should select ngModel day', function () {
            createCalendar();
            var day = scope.time.getDate();
            var selectDay = getDay(day);
            expect(selectDay).toHaveClass('uix-cal-select');
        });
        it('should have class in today', function () {
            var today = new Date();
            var el = '<uix-calendar ng-model="time"></uix-calendar>';
            scope.time = today;
            createCalendar(el);
            expect(getDay(today.getDate())).toHaveClass('uix-cal-day-today');
        });
        it('should be correct for all days in month', function () {
            createCalendar();
            var allDays = getAllDays();
            var lastDay = getLastDayOfMonth(scope.time.getFullYear(), scope.time.getMonth());
            expect(allDays.length).toBe(lastDay);
        });
        it('should get all weekdays', function () {
            createCalendar();
            var day = scope.time;
            var weekday = getAllWeekdays(day.getFullYear(), day.getMonth());
            var divs = [];
            element.find('.uix-cal-panel-day .uix-cal-weekday:not(.uix-cal-outside)').each(function () {
                divs.push(parseInt($(this).text().trim(), 10));
            });
            expect(weekday).toEqual(divs);
        });
        it('should have today button on buttom', function () {
            createCalendar();
            var button = element.find('.uix-cal-today-btn').eq(0);
            expect(button).toBeDefined();
            expect(button.text().trim()).toBe('today');
        });
        it('should select day', function () {
            createCalendar();
            selectDay(10);
            expect(scope.time.getDate()).toBe(10);
            expect(getDay(15)).not.toHaveClass('uix-cal-select');
            expect(getDay(10)).toHaveClass('uix-cal-select');
        });
        it('should change day panel when select a outside day', function () {
            createCalendar();
            selectDay(28, true); // select prev month
            expect(scope.time.getDate()).toBe(28);
            expect(scope.time.getMonth()).toBe(1);
        });
        it('should change month days when select a outside day', function () {
            createCalendar();
            var oldMonth = scope.time.getMonth();
            selectDay(28, true); // select prev month
            var allDays = getAllDays();
            var lastDay = getLastDayOfMonth(scope.time.getFullYear(), scope.time.getMonth());
            expect(allDays.length).toBe(lastDay);
            var newMonth = $locale.DATETIME_FORMATS.SHORTMONTH[oldMonth - 1];
            expect(getMonthText()).toBe(newMonth);
        });
        it('should select prev month and across a year', function () {
            var el = '<uix-calendar ng-model="time"></uix-calendar>';
            scope.time = getDate({
                month: 0
            });
            createCalendar(el);
            selectDay(28, true); // select prev month
            var year = getYearText();
            expect(year).toBe('2015');
        });
        it('select prev month', function () {
            createCalendar();
            clickPrevMonth();
            var month = getMonthText();
            expect(month).toBe($locale.DATETIME_FORMATS.SHORTMONTH[scope.time.getMonth() - 1]);
        });
        it('select prev month and cross prev year', function () {
            var el = '<uix-calendar ng-model="time"></uix-calendar>';
            scope.time = getDate({
                month: 0
            });
            createCalendar(el);
            clickPrevMonth();
            var month = getMonthText();
            var year = getYearText();
            expect(month).toBe($locale.DATETIME_FORMATS.SHORTMONTH[11]);
            expect(year).toBe('2015');
        });
        it('select next month', function () {
            createCalendar();
            clickNextMonth();
            var month = getMonthText();
            expect(month).toBe($locale.DATETIME_FORMATS.SHORTMONTH[scope.time.getMonth() + 1]);
        });
        it('select next month and cross next year', function () {
            var el = '<uix-calendar ng-model="time"></uix-calendar>';
            scope.time = getDate({
                month: 11
            });
            createCalendar(el);
            clickNextMonth();
            var month = getMonthText();
            var year = getYearText();
            expect(month).toBe($locale.DATETIME_FORMATS.SHORTMONTH[0]);
            expect(year).toBe('2017');
        });
    });
    // 时间选择面板的相关功能
    describe('calendar time panel', function () {
        var timePanel;

        function clickToTimePanel() {
            var timeButton = element.find('.uix-cal-panel-day .uix-cal-time');
            timeButton.click();
            scope.$digest();
            timePanel = element.find('.uix-cal-panel-time');
        }

        function clickBackBtn() {
            var backButton = timePanel.find('.uix-cal-time-cancal');
            backButton.click();
            scope.$digest();
        }

        function clickOkBtn() {
            var okButton = timePanel.find('.uix-cal-time-ok');
            okButton.click();
            scope.$digest();
        }

        function clickNowBtn() {
            var nowButton = timePanel.find('.uix-cal-time-now');
            nowButton.click();
            scope.$digest();
        }

        function changeTime(opt) {
            var inputs = timePanel.find('.uix-timepanel-input');
            if (angular.isDefined(opt.hour)) {
                inputs.eq(0).val(opt.hour);
                inputs.eq(0).change();
            }
            if (angular.isDefined(opt.minute)) {
                inputs.eq(1).val(opt.minute);
                inputs.eq(1).change();
            }
            if (angular.isDefined(opt.second)) {
                inputs.eq(2).val(opt.second);
                inputs.eq(2).change();
            }
        }

        it('day panel to time panel', function () {
            createCalendar();
            clickToTimePanel();
            expect(element.find('.uix-cal-panel-day')).toBeHidden();
            expect(element.find('.uix-cal-panel-time')).not.toBeHidden();
        });
        it('show have correct DOM', function () {
            createCalendar();
            clickToTimePanel();
            var timepanel = timePanel.find('.uix-timepanel');
            expect(timepanel.length).toBe(1);
            expect(timepanel).not.toBeHidden();
            var buttons = timePanel.find('.btn-group > button');
            expect(buttons.length).toBe(3);
            expect(buttons).not.toBeHidden();
        });
        it('should show correct time value', function () {
            createCalendar();
            clickToTimePanel();
            var inputs = timePanel.find('.uix-timepanel-input');
            expect(inputs.eq(0).val()).toBe('' + scope.time.getHours());
            expect(inputs.eq(1).val()).toBe('' + scope.time.getMinutes());
            expect(inputs.eq(2).val()).toBe('' + scope.time.getSeconds());
        });
        it('should return day panel when click back button', function () {
            createCalendar();
            clickToTimePanel();
            var timepanel = element.find('.uix-cal-panel-time');
            var daypanel = element.find('.uix-cal-panel-day');
            expect(timepanel).not.toBeHidden();
            expect(daypanel).toBeHidden();
            clickBackBtn();
            timepanel = element.find('.uix-cal-panel-time');
            daypanel = element.find('.uix-cal-panel-day');
            expect(timepanel).toBeHidden();
            expect(daypanel).not.toBeHidden();
        });
        it('should not change ngModel when click back button', function () {
            createCalendar();
            clickToTimePanel();
            changeTime({
                hour: 16,
                minute: 12,
                second: 45
            });
            var cache = angular.copy(scope.time);
            clickBackBtn();
            expect(scope.time).toEqual(cache);
            clickToTimePanel();
            var inputs = timePanel.find('.uix-timepanel-input');
            expect(inputs.eq(0).val()).toBe('' + cache.getHours());
            expect(inputs.eq(1).val()).toBe('' + cache.getMinutes());
            expect(inputs.eq(2).val()).toBe('' + cache.getSeconds());
        });
        it('should select now when click now button', function () {
            createCalendar();
            clickToTimePanel();
            clickNowBtn();
            // TODO 测试方法需要调整
            // 由于是在点击之后定位时间到now,所以测试里无法拿到点击的时候设置的时间,这里做个折中
            // 对比点击之后输入框显示的时间和dt能差多少
            // 相差不大于1秒,也就应该能大概知道时间到底变没变,当然,这个方法还是存在误差的
            var dt = new Date();
            var inputs = timePanel.find('.uix-timepanel-input');
            var hour = inputs.eq(0).val();
            var minute = inputs.eq(1).val();
            var second = inputs.eq(2).val();
            var passTime = angular.copy(dt);
            passTime.setHours(hour);
            passTime.setMinutes(minute);
            passTime.setSeconds(second);
            var gapTime = dt.getTime() - passTime.getTime();
            expect(gapTime).toBeLessThan(1000);
        });
        it('should change modelValue when click ok button', function () {
            createCalendar();
            clickToTimePanel();
            changeTime({
                hour: 16,
                minute: 12,
                second: 45
            });
            clickOkBtn();
            expect(scope.time.getHours()).toBe(16);
            expect(scope.time.getMinutes()).toBe(12);
            expect(scope.time.getSeconds()).toBe(45);
            clickToTimePanel();
            var inputs = timePanel.find('.uix-timepanel-input');
            expect(inputs.eq(0).val()).toBe('16');
            expect(inputs.eq(1).val()).toBe('12');
            expect(inputs.eq(2).val()).toBe('45');
        });
    });
    // 月份选择面板
    describe('calendar month panel', function () {
        it('day panel to month panel', function () {
            createCalendar();
            day2month();
            expect(element.find('.uix-cal-panel-day')).toBeHidden();
            expect(element.find('.uix-cal-panel-month')).not.toBeHidden();
        });
        it('should show current year in header', function () {
            createCalendar();
            day2month();
            var year = element.find('.uix-cal-panel-month .uix-cal-month-name > a').text().trim();
            expect(year).toBe('' + scope.time.getFullYear());
        });
        it('should have a table to show all month', function () {
            createCalendar();
            day2month();
            var table = element.find('.uix-cal-panel-month .uix-cal-month-table');
            expect(table).not.toBeHidden();
            expect(table.length).toBe(1);
            expect(table.find('tr').length).toBe(4);
            expect(table.find('td').length).toBe(12);
        });
        it('should have a select class on current month', function () {
            createCalendar();
            day2month();
            var selectMonth = element.find('.uix-cal-panel-month .uix-cal-month-select').text().trim();
            var currentMonth = scope.time.getMonth();
            expect(selectMonth).toBe($locale.DATETIME_FORMATS.MONTH[currentMonth]);
        });
        it('should show day panel when select a month', function () {
            createCalendar();
            day2month();
            var selectMonth = 5; // 选择六月
            element.find('.uix-cal-panel-month .uix-cal-month-item').eq(selectMonth).click();
            scope.$digest();
            expect(element.find('.uix-cal-panel-day')).not.toBeHidden();
            expect(element.find('.uix-cal-panel-month')).toBeHidden();
        });
        it('should show June when click June', function () {
            createCalendar();
            day2month();
            var selectMonth = 5; // 选择六月
            element.find('.uix-cal-panel-month .uix-cal-month-item').eq(selectMonth).click();
            scope.$digest();
            expect(getMonthText()).toBe($locale.DATETIME_FORMATS.SHORTMONTH[selectMonth]);
            var weekday = getAllWeekdays(getYearText(), selectMonth);
            var divs = [];
            element.find('.uix-cal-panel-day .uix-cal-weekday:not(.uix-cal-outside)').each(function () {
                divs.push(parseInt($(this).text().trim(), 10));
            });
            expect(weekday).toEqual(divs);
        });

        it('should select July when select July and return', function () {
            createCalendar();
            day2month();
            var selectMonth = 6; // 选择July
            element.find('.uix-cal-panel-month .uix-cal-month-item').eq(selectMonth).click();
            scope.$digest();
            day2month();
            var selectMonthName = element.find('.uix-cal-panel-month .uix-cal-month-select').text().trim();
            expect(selectMonthName).toBe($locale.DATETIME_FORMATS.MONTH[selectMonth]);
        });
    });
    // 年选择面板
    describe('calendar year panel', function () {
        function getYearRange() {
            return element.find('.uix-cal-panel-year .uix-cal-month-name > a').text();
        }

        function clickYear(year) {
            element.find('.uix-cal-panel-year .uix-cal-month-item:contains("' + year + '")').click();
            scope.$digest();
        }

        it('day panel to year panel', function () {
            createCalendar();
            day2year();
            expect(element.find('.uix-cal-panel-day')).toBeHidden();
            expect(element.find('.uix-cal-panel-year')).not.toBeHidden();
        });
        it('month panel to year panel', function () {
            createCalendar();
            day2month();
            var yearPanelButton = element.find('.uix-cal-panel-month .uix-cal-month-name > a').eq(0);
            yearPanelButton.click();
            scope.$digest();
            expect(element.find('.uix-cal-panel-month')).toBeHidden();
            expect(element.find('.uix-cal-panel-year')).not.toBeHidden();
        });
        it('should show correct header text', function () {
            createCalendar();
            day2year();
            var year = scope.time.getFullYear();
            var range = (year - 4) + '-' + (year + 7);
            expect(getYearRange()).toBe(range);
        });
        it('should have two arrows', function () {
            createCalendar();
            day2year();
            var prevBtn = element.find('.uix-cal-pre-button');
            var nextBtn = element.find('.uix-cal-next-button');
            expect(prevBtn).not.toBeHidden();
            expect(nextBtn).not.toBeHidden();
        });
        it('should have a table to show 12 years', function () {
            createCalendar();
            day2year();
            var table = element.find('.uix-cal-panel-year .uix-cal-month-table');
            expect(table).not.toBeHidden();
            expect(table.length).toBe(1);
            expect(table.find('tr').length).toBe(4);
            expect(table.find('td').length).toBe(12);
        });
        it('should have a select class on current year', function () {
            createCalendar();
            day2year();
            var selectYear = element.find('.uix-cal-panel-year .uix-cal-month-select').text().trim();
            var currentYear = scope.time.getFullYear();
            expect(selectYear).toBe('' + currentYear);
        });
        it('should change to month panel when click a year', function () {
            createCalendar();
            day2year();
            clickYear(2017);
            expect(element.find('.uix-cal-panel-year')).toBeHidden();
            expect(element.find('.uix-cal-panel-month')).not.toBeHidden();
        });
        it('should show the select year when click a year', function () {
            createCalendar();
            day2year();
            clickYear(2017);
            var year = element.find('.uix-cal-panel-month .uix-cal-month-name > a');
            expect(year).not.toBeHidden();
            expect(year.text().trim()).toBe('2017');
        });
        it('should show the select year when return to year panel', function () {
            createCalendar();
            day2year();
            clickYear(2017);
            var year = element.find('.uix-cal-panel-month .uix-cal-month-name > a');
            year.click();
            scope.$digest();
            var range = '2013-2024';
            expect(getYearRange()).toBe(range);
            var selectYear = element.find('.uix-cal-panel-year .uix-cal-month-select').text().trim();
            expect(selectYear).toBe('2017');
        });
        it('should show a month when click a year and a month', function () {
            createCalendar();
            day2year();
            clickYear(2017);
            var selectMonth = 5; // 选择2017年6月
            element.find('.uix-cal-panel-month .uix-cal-month-item').eq(selectMonth).click();
            scope.$digest();
            var weekday = getAllWeekdays(2017, selectMonth);
            var divs = [];
            element.find('.uix-cal-panel-day .uix-cal-weekday:not(.uix-cal-outside)').each(function () {
                divs.push(parseInt($(this).text().trim(), 10));
            });
            expect(weekday).toEqual(divs);
        });
        it('should show prev range', function () {
            createCalendar();
            day2year();
            var prevBtn = element.find('.uix-cal-pre-button');
            prevBtn.click();
            scope.$digest();
            var year = scope.time.getFullYear();
            var range = (year - 16) + '-' + (year - 5);
            expect(getYearRange()).toBe(range);
            var tds = element.find('.uix-cal-panel-year .uix-cal-month-item');
            expect(tds.eq(0).text().trim()).toBe(String(year - 16));
            expect(tds.eq(11).text().trim()).toBe(String(year - 5));
        });
        it('should show next range', function () {
            createCalendar();
            day2year();
            var nextBtn = element.find('.uix-cal-next-button');
            nextBtn.click();
            scope.$digest();
            var year = scope.time.getFullYear();
            var range = (year + 8) + '-' + (year + 19);
            expect(getYearRange()).toBe(range);
            var tds = element.find('.uix-cal-panel-year .uix-cal-month-item');
            expect(tds.eq(0).text().trim()).toBe(String(year + 8));
            expect(tds.eq(11).text().trim()).toBe(String(year + 19));
        });
    });
    // showTime 属性
    describe('show time attribute', function () {
        it('should have time by default', function () {
            createCalendar();
            var button = element.find('.uix-cal-panel-day .uix-cal-time');
            expect(button.length).toBe(1);
            expect(button.text().trim()).toBe('12:30 PM');
        });
        it('should have not show time when set showTime to be false', function () {
            var el = '<uix-calendar ng-model="time" show-time="showTime"></uix-calendar>';
            scope.time = getDate();
            scope.showTime = false;
            createCalendar(el);
            var button = element.find('.uix-cal-panel-day .uix-cal-time');
            expect(button.length).toBe(0);
        });
    });
    // startingDay 属性
    describe('starting day attribute', function () {
        it('should start with sunday by default', function () {
            createCalendar();
            var days = getShortDay();
            expect(days[0]).toBe($locale.DATETIME_FORMATS.SHORTDAY[calendarConfig.startingDay]);
        });
        it('should start with monday when set starting day to be 1', function () {
            var el = '<uix-calendar ng-model="time" starting-day="startingDay"></uix-calendar>';
            scope.startingDay = 1;
            scope.time = getDate();
            createCalendar(el);
            var days = getShortDay();
            expect(days[0]).toBe($locale.DATETIME_FORMATS.SHORTDAY[scope.startingDay]);
        });
        it('should start with sunday when set starting day to be larger than 6', function () {
            var el = '<uix-calendar ng-model="time" starting-day="startingDay"></uix-calendar>';
            scope.startingDay = 10;
            scope.time = getDate();
            createCalendar(el);
            var days = getShortDay();
            expect(days[0]).toBe($locale.DATETIME_FORMATS.SHORTDAY[0]);
        });
        it('should start with sunday when set starting day to be smaller than 0', function () {
            var el = '<uix-calendar ng-model="time" starting-day="startingDay"></uix-calendar>';
            scope.startingDay = -2;
            scope.time = getDate();
            createCalendar(el);
            var days = getShortDay();
            expect(days[0]).toBe($locale.DATETIME_FORMATS.SHORTDAY[0]);
        });
    });
    // provider
    describe('uixCalendar provider', function () {
        it('should set SHORTDAY', function () {
            var SHORTDAY = ['日', '一', '二', '三', '四', '五', '六'];
            calendarProvider.setFormats('SHORTDAY', SHORTDAY);
            createCalendar();
            var shortDay = getShortDay();
            expect(SHORTDAY).toEqual(shortDay);
        });
        it('should show custom shortmonth name', function () {
            var SHORTMONTH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            calendarProvider.setFormats('SHORTMONTH', SHORTMONTH);
            createCalendar();
            var month = getMonthText();
            expect(month).toEqual(SHORTMONTH[scope.time.getMonth()]);
        });
        it('should show custom full month name', function () {
            var MONTH = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            calendarProvider.setFormats('MONTH', MONTH);
            createCalendar();
            day2month();
            var months = [];
            element.find('.uix-cal-panel-month .uix-cal-month-item').each(function () {
                months.push($(this).text().trim());
            });
            expect(months).toEqual(MONTH);
        });
    });
    // minDate 属性
    describe('min date attribute', function () {
        it('should be disabled when a day is earlier than minDate', function () {
            var el = '<uix-calendar ng-model="time" min-date="minDate"></uix-calendar>';
            scope.minDate = getDate({
                day: 8 // 8 is the min date
            });
            scope.time = getDate();
            createCalendar(el);
            expect(getDay(7)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(8)).not.toHaveClass('uix-cal-day-disabled');
        });
        it('should be disabled in earlier month', function () {
            var el = '<uix-calendar ng-model="time" min-date="minDate"></uix-calendar>';
            scope.minDate = getDate({
                day: 8 // 8 is the min date
            });
            scope.time = getDate();
            createCalendar(el);
            clickPrevMonth();
            expect(element.find('.uix-cal-panel-day .uix-cal-day')).toHaveClass('uix-cal-day-disabled');
        });
        it('should not select a day is earlier than minDate', function () {
            var el = '<uix-calendar ng-model="time" min-date="minDate"></uix-calendar>';
            scope.minDate = getDate({
                day: 8 // 8 is the min date
            });
            scope.time = getDate();
            var cache = angular.copy(scope.time);
            createCalendar(el);
            selectDay(5);
            expect(scope.time).toEqual(cache);
        });
        it('should not select a day is earlier than minDate and in prev month', function () {
            var el = '<uix-calendar ng-model="time" min-date="minDate"></uix-calendar>';
            scope.minDate = getDate({
                day: 8 // 8 is the min date
            });
            scope.time = getDate();
            var cache = angular.copy(scope.time);
            createCalendar(el);
            selectDay(28, true);
            expect(scope.time).toEqual(cache);
        });
    });
    // maxDate 属性
    describe('max date attribute', function () {
        it('should be disabled when a day is later than maxDate', function () {
            var el = '<uix-calendar ng-model="time" max-date="maxDate"></uix-calendar>';
            scope.maxDate = getDate({
                day: 25 // 25 is the max date
            });
            scope.time = getDate();
            createCalendar(el);
            expect(getDay(28)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(25)).not.toHaveClass('uix-cal-day-disabled');
        });
        it('should be disabled in later month', function () {
            var el = '<uix-calendar ng-model="time" max-date="maxDate"></uix-calendar>';
            scope.maxDate = getDate({
                day: 25 // 25 is the max date
            });
            scope.time = getDate();
            createCalendar(el);
            clickNextMonth();
            expect(element.find('.uix-cal-panel-day .uix-cal-day')).toHaveClass('uix-cal-day-disabled');
        });
        it('should not select a day is later than maxDate', function () {
            var el = '<uix-calendar ng-model="time" max-date="maxDate"></uix-calendar>';
            scope.maxDate = getDate({
                day: 25 // 25 is the max date
            });
            scope.time = getDate();
            var cache = angular.copy(scope.time);
            createCalendar(el);
            selectDay(28);
            expect(scope.time).toEqual(cache);
        });
        it('should not select a day is later than maxDate and in next month', function () {
            var el = '<uix-calendar ng-model="time" max-date="maxDate"></uix-calendar>';
            scope.maxDate = getDate({
                day: 25 // 25 is the max date
            });
            scope.time = getDate();
            var cache = angular.copy(scope.time);
            createCalendar(el);
            selectDay(1, true);
            expect(scope.time).toEqual(cache);
        });
    });
    // exception 属性
    describe('exceptions attribute', function () {
        it('should not be disabled when the day is exception even set minDate', function () {
            var el = '<uix-calendar ng-model="time" exceptions="exceptions" min-date="minDate"></uix-calendar>';
            scope.minDate = getDate({
                day: 8
            });
            scope.time = getDate();
            scope.exceptions = getDate({
                day: 5
            });
            createCalendar(el);
            expect(getDay(7)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(5)).not.toHaveClass('uix-cal-day-disabled');
            selectDay(5);
            expect(scope.time.getDate()).toBe(5);
        });
        it('should not be disabled when the day is exception even set maxDate', function () {
            var el = '<uix-calendar ng-model="time" exceptions="exceptions" max-date="maxDate"></uix-calendar>';
            scope.maxDate = getDate({
                day: 25
            });
            scope.time = getDate();
            scope.exceptions = getDate({
                day: 27
            });
            createCalendar(el);
            expect(getDay(26)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(27)).not.toHaveClass('uix-cal-day-disabled');
            selectDay(27);
            expect(scope.time.getDate()).toBe(27);
        });
        it('should not be disabled when the exception is array', function () {
            var el = '<uix-calendar ng-model="time" exceptions="exceptions" min-date="minDate"></uix-calendar>';
            scope.minDate = getDate({
                day: 10
            });
            scope.time = getDate();
            scope.exceptions = [getDate({
                day: 8
            }), getDate({
                day: 3
            })];
            createCalendar(el);
            expect(getDay(7)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(3)).not.toHaveClass('uix-cal-day-disabled');
            expect(getDay(8)).not.toHaveClass('uix-cal-day-disabled');
            selectDay(3);
            expect(scope.time.getDate()).toBe(3);
            selectDay(8);
            expect(scope.time.getDate()).toBe(8);
        });
    });
    // dateFilter 属性
    describe('dateFilter', function () {
        it('should disable specific date', function () {
            var el = '<uix-calendar show-time="false" ng-model="time" date-filter="dateFilter($date)"></uix-calendar>';
            scope.time = getDate();
            // 星期一不可选
            scope.dateFilter = function ($date) {
                return $date.getDay() !== 1;
            };
            createCalendar(el);
            expect(getDay(7)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(14)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(21)).toHaveClass('uix-cal-day-disabled');
            expect(getDay(28)).toHaveClass('uix-cal-day-disabled');
        });
    });
});
