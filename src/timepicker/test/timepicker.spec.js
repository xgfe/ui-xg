/* eslint angular/timeout-service:0  */
describe('ui.xg.timepicker', function () {
    var compile,
        scope,
        date,
        timepickerConfig, //timepicker的常量配置
        $timeout,
        element;    //指令DOM结点;

    beforeEach(function () {
        module('ui.xg.position');
        module('ui.xg.popover');
        module('ui.xg.tooltip');
        module('ui.xg.stackedMap');
        module('ui.xg.timepanel');
        module('timepanel/templates/timepanel.html');
        module('ui.xg.timepicker');
        module('timepicker/templates/timepicker.html');
        module('timepicker/templates/timepicker-timepanel.html');
        module('popover/templates/popover-template-popup.html');
        inject(function (_$timeout_, $compile, $rootScope, uixTimepickerConfig, dateFilter) {
            $timeout = _$timeout_;
            compile = $compile;
            scope = $rootScope.$new();
            timepickerConfig = uixTimepickerConfig;
            date = dateFilter;
        });
    });
    afterEach(function () {
        element.remove();
    });

    function createTimepicker(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    function getDate() {
        var dt = new Date();
        dt.setHours(12);
        dt.setMinutes(30);
        dt.setSeconds(30);
        return dt;
    }

    function getInputVal() {
        return element.find('.uix-timepicker-input').val();
    }

    function clickInput() {
        element.find('.uix-timepicker-input').click();
        scope.$digest();
    }

    function clickButton() {
        element.find('.input-group button').click();
        scope.$digest();
    }

    function getTimepanel() {
        return element.find('.uix-timepanel');
    }

    function increaseHour() {
        var el = getTimepanel().find('.uix-timepanel-col').eq(0).find('.uix-timepanel-top');
        el.click();
        scope.$digest();
    }

    function decreaseHour() {
        var el = getTimepanel().find('.uix-timepanel-col').eq(0).find('.uix-timepanel-bottom');
        el.click();
        scope.$digest();
    }

    function getTimes() {
        var inputs = getTimepanel().find('input');
        var hourInputEl = inputs.eq(0),
            minuteInputEl = inputs.eq(1),
            secondInputEl = inputs.eq(2);
        return {
            hour: hourInputEl.val(),
            hour_smaller: hourInputEl.parent().next().text(),
            hour_larger: hourInputEl.parent().prev().text(),
            minute: minuteInputEl.val(),
            minute_smaller: minuteInputEl.parent().next().text(),
            minute_larger: minuteInputEl.parent().prev().text(),
            second: secondInputEl.val(),
            second_smaller: secondInputEl.parent().next().text(),
            second_larger: secondInputEl.parent().prev().text()
        };
    }

    it('should show format time', function () {
        var el = '<uix-timepicker ng-model="time"></uix-timepicker>';
        var dt = getDate();
        scope.time = dt;
        createTimepicker(el);
        expect(element).toHaveClass('uix-timepicker');
        var val = getInputVal();
        expect(val).toEqual(date(dt, timepickerConfig.format));
    });

    it('should toggle timepanel when click input and button', function () {
        var el = '<uix-timepicker ng-model="time"></uix-timepicker>';
        scope.time = getDate();
        createTimepicker(el);
        expect(getTimepanel().length).toBe(0);
        clickInput();
        expect(getTimepanel().length).toBe(1);
        clickButton();
        $timeout(function () {
            expect(getTimepanel().length).toBe(0);
        }, 201);
    });

    it('ngModel should be two-way data binding', function () {
        var el = '<uix-timepicker ng-model="time"></uix-timepicker>';
        var dt = getDate();
        scope.time = dt;
        createTimepicker(el);
        clickInput();
        decreaseHour();
        var hour = scope.time.getHours();
        expect(hour).toEqual(dt.getHours() - timepickerConfig.hourStep);
    });

    it('should be work when set *Step attr', function () {
        var el = '<uix-timepicker hour-step="hourStep" ng-model="time"></uix-timepicker>';
        var dt = getDate();
        var hour = dt.getHours();
        scope.time = dt;
        scope.hourStep = 3;
        createTimepicker(el);
        clickInput();
        var times = getTimes();
        expect(hour - scope.hourStep).toEqual(parseInt(times.hour_smaller, 10));
        expect(hour).toEqual(parseInt(times.hour, 10));
        expect(hour + scope.hourStep).toEqual(parseInt(times.hour_larger, 10));
        increaseHour();
        times = getTimes();
        expect(hour).toEqual(parseInt(times.hour_smaller, 10));
        expect(hour + scope.hourStep).toEqual(parseInt(times.hour, 10));
        expect(hour + 2 * scope.hourStep).toEqual(parseInt(times.hour_larger, 10));
    });

    it('has placeholder', function () {
        var el = '<uix-timepicker placeholder="{{placeholder}}" ng-model="time"></uix-timepicker>';
        scope.time = getDate();
        scope.placeholder = 'I am placeholder';
        createTimepicker(el);
        var input = element.find('.uix-timepicker-input');
        expect(input.attr('placeholder')).toEqual(scope.placeholder);
    });

    it('show diff format time', function () {
        var el = '<uix-timepicker format="format" ng-model="time"></uix-timepicker>';
        var dt = getDate();
        scope.time = dt;
        scope.format = 'HH-mm-ss';
        createTimepicker(el);
        var val = getInputVal();
        expect(val).toEqual(date(dt, scope.format));
    });
    it('disable input and button when ngDisabled set to be false', function () {
        var el = '<uix-timepicker ng-disabled="isDisabled" ng-model="time"></uix-timepicker>';
        scope.time = getDate();
        scope.isDisabled = true;
        createTimepicker(el);
        expect(getTimepanel()).not.toHaveClass('in');
        clickInput();
        expect(getTimepanel()).not.toHaveClass('in');
        clickButton();
        expect(getTimepanel()).not.toHaveClass('in');
    });

});
