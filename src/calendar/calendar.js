/**
 * calendar
 * calendar directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-14
 */
angular.module('ui.xg.calendar', ['ui.xg.timepanel'])
    .constant('uixCalendarConfig', {
        startingDay: 0, // 一周的开始天,0-周日,1-周一,以此类推
        showTime: true, // 是否显示时间选择
        showSeconds: true, // 是否显示秒
        minDate: null, // 最小可选日期
        maxDate: null, // 最大可选日期
        exceptions: []  // 不可选日期中的例外,比如3月份的日期都不可选,但是3月15日却是可选择的
    })
    .provider('uixCalendar', function () {
        var FORMATS = {};
        this.setFormats = function (formats, subFormats) {
            if (subFormats) {
                FORMATS[formats] = subFormats;
            } else {
                FORMATS = formats;
            }
        };

        this.$get = ['$locale', '$log', function ($locale, $log) {
            return {
                getFormats: function () {
                    FORMATS = angular.extend(angular.copy($locale.DATETIME_FORMATS), FORMATS);
                    if (!FORMATS.TODAY) {
                        if ($locale.id === 'en-us') {
                            FORMATS.TODAY = 'today';
                        } else if ($locale.id === 'zh-cn') {
                            FORMATS.TODAY = '今天';
                        }
                    }
                    if (!angular.isArray(FORMATS.SHORTMONTH) ||
                        FORMATS.SHORTMONTH.length !== 12 || !angular.isArray(FORMATS.MONTH) ||
                        FORMATS.MONTH.length !== 12 || !angular.isArray(FORMATS.SHORTDAY) ||
                        FORMATS.SHORTDAY.length !== 7
                    ) {
                        $log.warn('invalid date time formats');
                        FORMATS = $locale.DATETIME_FORMATS;
                    }
                    return FORMATS;
                }
            };
        }];
    })
    .controller('uixCalendarCtrl', ['$scope', '$attrs', '$log', 'uixCalendar', 'uixCalendarConfig',
        function ($scope, $attrs, $log, uixCalendarProvider, calendarConfig) {
            var FORMATS = uixCalendarProvider.getFormats();
            var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //每个月的天数,2月会根据闰年调整
            var ngModelCtrl = {$setViewValue: angular.noop};

            $scope.FORMATS = FORMATS;
            $scope.panels = {
                year: false,
                month: false,
                day: true,
                time: false
            };
            var self = this;
            angular.forEach(['startingDay', 'exceptions'], function (key) {
                self[key] = angular.isDefined($attrs[key])
                    ? angular.copy($scope.$parent.$eval($attrs[key])) : calendarConfig[key];
            });
            $scope.showTime = angular.isDefined($attrs.showTime)
                ? $scope.$parent.$eval($attrs.showTime) : calendarConfig.showTime;

            // 是否展示秒
            $scope.showSeconds = angular.isDefined($attrs.showSeconds)
                ? $scope.$parent.$eval($attrs.showSeconds) : calendarConfig.showSeconds;


            if (self.startingDay > 6 || self.startingDay < 0) {
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
                    $log.warn('Calendar directive: "ng-model" value must be a Date object, ' +
                        'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' +
                        'or ISO 8601 date.');
                    date = new Date(); // fix #1 如果没有传入日期,或者清空的话,设置当前time
                }
                date = new Date(date);
                $scope.selectDate = angular.copy(date);

                $scope.currentYear = $scope.selectDate.getFullYear();
                $scope.currentMonth = $scope.selectDate.getMonth();
                $scope.currentDay = $scope.currentYear + '-' + $scope.currentMonth + '-' + $scope.selectDate.getDate();

                $scope.allDays = getDays($scope.selectDate);
            };
            // 选择某一个面板
            $scope.selectPanel = function (panel) {
                angular.forEach($scope.panels, function (pan, index) {
                    $scope.panels[index] = false;
                });
                $scope.panels[panel] = true;
            };
            // 切换上一个月
            $scope.prevMonth = function () {
                if ($scope.currentMonth === 0) {
                    $scope.currentYear -= 1;
                    $scope.currentMonth = 11;
                } else {
                    $scope.currentMonth -= 1;
                }
                buildDayPanel();
            };
            // 切换到下一个月
            $scope.nextMonth = function () {
                if ($scope.currentMonth === 11) {
                    $scope.currentYear += 1;
                    $scope.currentMonth = 0;
                } else {
                    $scope.currentMonth += 1;
                }
                buildDayPanel();
            };
            // 选择日期
            $scope.selectDayHandler = function (day) {
                if (day.isDisabled) {
                    return;
                }
                $scope.selectDate.setFullYear(day.year);
                $scope.selectDate.setMonth(0); // 先把月份设置为1月，保证setDate的时候不会跨月份
                $scope.selectDate.setDate(day.day);
                $scope.selectDate.setMonth(day.month);
                if (!day.inMonth) {
                    if (day.isNext) {
                        $scope.nextMonth();
                    } else {
                        $scope.prevMonth();
                    }
                }
                $scope.currentDay = $scope.currentYear + '-' + $scope.currentMonth + '-' + $scope.selectDate.getDate();
                fireRender();
            };
            // 选择今天
            $scope.chooseToday = function () {
                if ($scope.disableToday) {
                    return;
                }
                var today = splitDate(new Date());

                $scope.selectDate.setFullYear(today.year);
                $scope.selectDate.setMonth(0); // set to Jan firstly
                $scope.selectDate.setDate(today.day);
                $scope.selectDate.setMonth(today.month);

                $scope.currentYear = today.year;
                $scope.currentMonth = today.month;
                $scope.currentDay = $scope.currentYear + '-' + $scope.currentMonth + '-' + $scope.selectDate.getDate();

                buildDayPanel();
                fireRender();
            };

            $scope.$watch('minDate', function (newVal) {
                if (angular.isUndefined(newVal)) {
                    return;
                }
                if (!angular.isDate(new Date(newVal))) {
                    $log.warn('Calendar directive: "minDate" value must be a Date object, ' +
                        'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' +
                        'or ISO 8601 date.');
                    return;
                }
                dateRangeChaned();
            });
            $scope.$watch('maxDate', function (newVal) {
                if (angular.isUndefined(newVal)) {
                    return;
                }
                if (!angular.isDate(new Date(newVal))) {
                    $log.warn('Calendar directive: "maxDate" value must be a Date object, ' +
                        'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' +
                        'or ISO 8601 date.');
                    return;
                }
                dateRangeChaned();
            });

            function dateRangeChaned() {
                $scope.disableToday = todayIsDisabled();
                buildDayPanel();
            }

            // 判断今天是否是不可选的
            function todayIsDisabled() {
                var date = formatDate(new Date());
                return date.isDisabled;
            }


            var cacheTime;
            // 点击时间进入选择时间面板
            $scope.selectTimePanelHandler = function () {
                cacheTime = angular.copy($scope.selectDate);
                var sDay = $scope.selectDate.getDate();
                var minDate = $scope.minDate;
                var maxDate = $scope.maxDate;

                if (minDate) {
                    var minDay = new Date(minDate).getDate();
                    if (sDay !== minDay) {
                        $scope.minTime = createTime();
                    } else {
                        $scope.minTime = angular.copy(minDate);
                    }
                }

                if (maxDate) {
                    var maxDay = new Date(maxDate).getDate();
                    if (sDay !== maxDay) {
                        $scope.maxTime = createTime(23, 59, 59);
                    } else {
                        $scope.maxTime = angular.copy(maxDate);
                    }
                }
                $scope.selectPanel('time');
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
            $scope.allMonths = (function () {
                var res = [],
                    MONTHS = FORMATS.MONTH,
                    temp = [];
                for (var i = 0, len = MONTHS.length; i < len; i++) {
                    if (temp.length >= 3) {
                        res.push(temp);
                        temp = [];
                    }
                    temp.push({
                        name: MONTHS[i],
                        index: i
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
                var year = $scope.allYears[0][0] - 8;
                $scope.allYears = getYears(year);
            };
            // 获取下一个12年
            $scope.next12Years = function () {
                var year = $scope.allYears[3][2] + 5;
                $scope.allYears = getYears(year);
            };
            // 在月份视图显示某一月份
            $scope.chooseYearHandler = function (year) {
                $scope.currentYear = year;
                buildDayPanel();
                $scope.selectPanel('month');
            };

            function fireRender() {
                ngModelCtrl.$setViewValue($scope.selectDate);
                ngModelCtrl.$render();
                var fn = $scope.onChange ? $scope.onChange() : angular.noop();
                if (fn && angular.isFunction(fn)) {
                    fn($scope.selectDate);
                }
            }

            // 根据年,月构建日视图
            function buildDayPanel() {
                var date = createDate($scope.currentYear, $scope.currentMonth);
                $scope.allDays = getDays(date);
            }

            // 获取所有的最近的12年
            function getYears(year) {
                var res = [], temp = [];
                for (var i = -4; i < 8; i++) {
                    if (temp.length >= 3) {
                        res.push(temp);
                        temp = [];
                    }
                    temp.push(year + i);
                }
                res.push(temp);
                return res;
            }

            // 获取周一到周日的名字
            function dayNames(startingDay) {
                var shortDays = angular.copy(FORMATS.SHORTDAY).map(function (day) {
                    return day;
                });
                var delDays = shortDays.splice(0, startingDay);
                return shortDays.concat(delDays);
            }

            // 根据日期获取当月的所有日期
            function getDays(date) {
                var dayRows = [];
                var currentYear = date.getFullYear();
                var currentMonth = date.getMonth();
                // 添加当月之前的天数
                var firstDayOfMonth = createDate(currentYear, currentMonth, 1);
                var day = firstDayOfMonth.getDay();
                var len = day >= self.startingDay ? day - self.startingDay : (7 - self.startingDay + day);
                for (var i = 0; i < len; i++) {
                    pushDay(dayRows, dayBefore(firstDayOfMonth, len - i));
                }
                // 添加本月的天
                var lastDayOfMonth = getLastDayOfMonth(currentYear, currentMonth);
                var tempDay;
                for (var j = 1; j <= lastDayOfMonth; j++) {
                    tempDay = createDate(currentYear, currentMonth, j);
                    pushDay(dayRows, tempDay);
                }
                // 补全本月之后的天
                len = 7 - dayRows[dayRows.length - 1].length;
                for (var k = 1; k <= len; k++) {
                    pushDay(dayRows, dayAfter(tempDay, k));
                }
                return dayRows;
            }

            // 存储计算出的日期
            function pushDay(dayRows, date) {
                var hasInsert = false;
                angular.forEach(dayRows, function (row) {
                    if (row && row.length < 7) {
                        row.push(formatDate(date));
                        hasInsert = true;
                    }
                });
                if (hasInsert) {
                    return;
                }
                dayRows.push([formatDate(date)]);
            }

            // 根据日期date获取gapDay之后的日期
            function dayAfter(date, gapDay) {
                gapDay = gapDay || 1;
                var time = date.getTime();
                time += gapDay * 24 * 60 * 60 * 1000;
                return new Date(time);
            }

            // 根据日期date获取gapDay之前几天的日期
            function dayBefore(date, gapDay) {
                gapDay = gapDay || 1;
                var time = date.getTime();
                time -= gapDay * 24 * 60 * 60 * 1000;
                return new Date(time);
            }

            //获取一个月里最后一天是几号
            function getLastDayOfMonth(year, month) {
                var months = MONTH_DAYS.slice(0);
                if (year % 100 === 0 && year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
                    months[1] = 29;
                }
                return months[month];
            }

            //创建日期
            function createDate(year, month, day) {
                var date = new Date();
                date.setMonth(0);
                date.setDate(31); // set date to 1.31 first
                date.setFullYear(year);
                date.setDate(day || 1); // set date before set month
                date.setMonth(month || 0);
                return date;
            }

            function createTime(hour, minute, seconds) {
                var date = new Date();
                date.setHours(hour || 0);
                date.setMinutes(minute || 0);
                date.setSeconds(seconds || 0);
                return date;
            }

            // date1 是否比date2小,
            function earlierThan(date1, date2) {
                var tempDate1 = splitDate(date1);
                var tempDate2 = splitDate(date2);
                if (tempDate1.year < tempDate2.year) {
                    return true;
                } else if (tempDate1.year > tempDate2.year) {
                    return false;
                }
                if (tempDate1.month < tempDate2.month) {
                    return true;
                } else if (tempDate1.month > tempDate2.month) {
                    return false;
                }
                return tempDate1.day < tempDate2.day;
            }

            var dateFilter = angular.isDefined($attrs.dateFilter) ? $scope.dateFilter : function () {
                return true;
            };

            //对日期进行格式化
            function formatDate(date) {
                var tempDate = splitDate(date);
                var selectedDt = splitDate($scope.selectDate);
                var today = splitDate(new Date());
                var isToday = tempDate.year === today.year &&
                    tempDate.month === today.month &&
                    tempDate.day === today.day;
                var isSelected = tempDate.year === selectedDt.year &&
                    tempDate.month === selectedDt.month &&
                    tempDate.day === selectedDt.day;
                var isDisabled = ($scope.minDate && earlierThan(date, $scope.minDate) && !isExceptionDay(date)) ||
                    ($scope.maxDate && earlierThan($scope.maxDate, date) && !isExceptionDay(date)) ||
                    (!dateFilter({$date: date}) && !isExceptionDay(date));
                var day = date.getDay();
                return {
                    date: date,
                    year: tempDate.year,
                    month: tempDate.month,
                    day: tempDate.day,
                    isWeekend: day === 0 || day === 6,
                    isToday: isToday,
                    inMonth: tempDate.month === $scope.currentMonth,
                    isNext: tempDate.month > $scope.currentMonth,
                    isSelected: isSelected,
                    isDisabled: isDisabled,
                    index: tempDate.year + '-' + tempDate.month + '-' + tempDate.day
                };
            }

            function isExceptionDay(date) {
                self.exceptions = [].concat(self.exceptions);
                var day1, day2 = splitDate(date);
                return self.exceptions.some(function (excepDay) {
                    day1 = splitDate(excepDay);
                    return day1.year === day2.year && day1.month === day2.month && day1.day === day2.day;
                });
            }

            function splitDate(date) {
                var dt = new Date(date);
                if (!angular.isDate(dt)) {
                    $log.error('Calendar directive: date is not a Date Object');
                    return;
                }
                return {
                    year: dt.getFullYear(),
                    month: dt.getMonth(),
                    day: dt.getDate()
                };
            }
        }])
    .directive('uixCalendar', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/calendar.html',
            replace: true,
            require: ['uixCalendar', 'ngModel'],
            scope: {
                minDate: '=?',
                maxDate: '=?',
                onChange: '&?',
                dateFilter: '&?'
            },
            controller: 'uixCalendarCtrl',
            link: function (scope, el, attrs, ctrls) {
                var calendarCtrl = ctrls[0],
                    ngModelCtrl = ctrls[1];
                calendarCtrl.init(ngModelCtrl);
            }
        };
    });
