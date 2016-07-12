describe('ui.xg.timepanel', function () {
    var compile,
        scope,
        timepanelConfig, //timepanel的常量配置
        element;    //指令DOM结点;

    beforeEach(function () {
        module('ui.xg.timepanel');
        module('timepanel/templates/timepanel.html');
        inject(function ($compile, $rootScope, uixTimepanelConfig) {
            compile = $compile;
            scope = $rootScope.$new();
            timepanelConfig = uixTimepanelConfig;
        });
    });
    afterEach(function () {
        element.remove();
    });

    function createTimepanel(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    function getTimes() {
        var inputs = element.find('input');
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

    function increaseHour() {
        var el = element.find('.uix-timepanel-col').eq(0).find('.uix-timepanel-top');
        el.click();
        scope.$digest();
    }

    function decreaseHour() {
        var el = element.find('.uix-timepanel-col').eq(0).find('.uix-timepanel-bottom');
        el.click();
        scope.$digest();
    }

    function getDate() {
        var dt = new Date();
        dt.setHours(12);
        dt.setMinutes(30);
        dt.setSeconds(30);
        return dt;
    }

    function wheelMouse(delta) {
        var evt = $.Event('mousewheel');
        evt.wheelDelta = delta;
        return evt;
    }
    function keydown(key) {
        var evt = $.Event('keydown');
        switch(key) {
            case 'left':
                evt.which = 37;
                break;
            case 'up':
                evt.which = 38;
                break;
            case 'right':
                evt.which = 39;
                break;
            case 'down':
                evt.which = 40;
                break;
        }
        return evt;
    }

    it('should show correct number', function () {
        var el = '<uix-timepanel ng-model="time"></uix-timepanel>';
        var dt = getDate();
        var hour = dt.getHours();
        var minute = dt.getMinutes();
        var second = dt.getSeconds();
        scope.time = dt;
        createTimepanel(el);
        expect(element).toHaveClass('uix-timepanel');
        var times = getTimes();
        expect(hour - timepanelConfig.hourStep).toEqual(parseInt(times.hour_smaller, 10));
        expect(hour).toEqual(parseInt(times.hour, 10));
        expect(hour + timepanelConfig.hourStep).toEqual(parseInt(times.hour_larger, 10));

        expect(minute - timepanelConfig.minuteStep).toEqual(parseInt(times.minute_smaller, 10));
        expect(minute).toEqual(parseInt(times.minute, 10));
        expect(minute + timepanelConfig.minuteStep).toEqual(parseInt(times.minute_larger, 10));

        expect(second - timepanelConfig.secondStep).toEqual(parseInt(times.second_smaller, 10));
        expect(second).toEqual(parseInt(times.second, 10));
        expect(second + timepanelConfig.secondStep).toEqual(parseInt(times.second_larger, 10));
    });

    it('time should increase when click larger value', function () {
        var el = '<uix-timepanel ng-model="time"></uix-timepanel>';
        var dt = getDate();
        var hour = dt.getHours();
        scope.time = dt;
        createTimepanel(el);
        increaseHour();
        var times = getTimes();
        expect(hour).toEqual(parseInt(times.hour_smaller, 10));
        expect(hour + timepanelConfig.hourStep).toEqual(parseInt(times.hour, 10));
        expect(hour + 2 * timepanelConfig.hourStep).toEqual(parseInt(times.hour_larger, 10));
    });

    it('time should decrease when click smaller value', function () {
        var el = '<uix-timepanel ng-model="time"></uix-timepanel>';
        var dt = getDate();
        var hour = dt.getHours();
        scope.time = dt;
        createTimepanel(el);
        decreaseHour();
        var times = getTimes();
        expect(hour - 2 * timepanelConfig.hourStep).toEqual(parseInt(times.hour_smaller, 10));
        expect(hour - timepanelConfig.hourStep).toEqual(parseInt(times.hour, 10));
        expect(hour).toEqual(parseInt(times.hour_larger, 10));
    });

    it('time should be changed when input value been changed', function () {
        var el = '<uix-timepanel ng-model="time"></uix-timepanel>';
        scope.time = getDate();
        createTimepanel(el);
        var hourInput = element.find('input').eq(0);
        var newHour = 10;
        hourInput.val(newHour);
        hourInput.change();
        var times = getTimes();
        expect(newHour - timepanelConfig.hourStep).toEqual(parseInt(times.hour_smaller, 10));
        expect(newHour).toEqual(parseInt(times.hour, 10));
        expect(newHour + timepanelConfig.hourStep).toEqual(parseInt(times.hour_larger, 10));
    });

    it('ngModel should be two-way data binding', function () {
        var el = '<uix-timepanel ng-model="time"></uix-timepanel>';
        var dt = getDate();
        scope.time = dt;
        createTimepanel(el);
        decreaseHour();
        var hour = scope.time.getHours();
        expect(hour).toEqual(dt.getHours() - timepanelConfig.hourStep);
    });

    it('should be work when set *Step attr', function () {
        var el = '<uix-timepanel hour-step="hourStep" ng-model="time"></uix-timepanel>';
        var dt = getDate();
        var hour = dt.getHours();
        scope.time = dt;
        scope.hourStep = 3;
        createTimepanel(el);
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

    it('do not show second col when showSeconds set to be false', function () {
        var el = '<uix-timepanel show-seconds="showSeconds" ng-model="time"></uix-timepanel>';
        scope.time = getDate();
        scope.showSeconds = false;
        createTimepanel(el);
        var secondCol = element.find('.uix-timepanel-col').eq(2);
        expect(secondCol).toBeHidden();
    });

    it('mousewheel should be worked by default', function () {
        var el = '<uix-timepanel ng-model="time"></uix-timepanel>';
        var dt = getDate();
        var minute = dt.getMinutes();
        scope.time = dt;
        createTimepanel(el);

        var minuteInput = element.find('input').eq(1);
        var upScrollEvt = wheelMouse(1);

        minuteInput.trigger(upScrollEvt);
        var times = getTimes();
        expect(minute).toEqual(parseInt(times.minute_smaller, 10));
        expect(minute + timepanelConfig.minuteStep).toEqual(parseInt(times.minute, 10));
        expect(minute + 2 * timepanelConfig.minuteStep).toEqual(parseInt(times.minute_larger, 10));

        var downScrollEvt = wheelMouse(-1);
        minuteInput.trigger(downScrollEvt);
        times = getTimes();
        expect(minute - timepanelConfig.minuteStep).toEqual(parseInt(times.minute_smaller, 10));
        expect(minute).toEqual(parseInt(times.minute, 10));
        expect(minute + timepanelConfig.minuteStep).toEqual(parseInt(times.minute_larger, 10));
    });
    it('mousewheel should not be worked when set to be false', function () {
        var el = '<uix-timepanel mousewheel="mousewheel" ng-model="time"></uix-timepanel>';
        var dt = getDate();
        var minute = dt.getMinutes();
        scope.time = dt;
        scope.mousewheel = false;
        createTimepanel(el);

        var minuteInput = element.find('input').eq(1);
        var upScrollEvt = wheelMouse(1);

        minuteInput.trigger(upScrollEvt);
        var times = getTimes();
        expect(minute - timepanelConfig.minuteStep).toEqual(parseInt(times.minute_smaller, 10));
        expect(minute).toEqual(parseInt(times.minute, 10));
        expect(minute + timepanelConfig.minuteStep).toEqual(parseInt(times.minute_larger, 10));
    });

    it('up and down key should be worked by default', function () {
        var el = '<uix-timepanel ng-model="time"></uix-timepanel>';
        var dt = getDate();
        var minute = dt.getMinutes();
        scope.time = dt;
        createTimepanel(el);

        var minuteInput = element.find('input').eq(1);
        var upKeyEvt = keydown('up');

        minuteInput.trigger(upKeyEvt);
        var times = getTimes();
        expect(minute).toEqual(parseInt(times.minute_smaller, 10));
        expect(minute + timepanelConfig.minuteStep).toEqual(parseInt(times.minute, 10));
        expect(minute + 2 * timepanelConfig.minuteStep).toEqual(parseInt(times.minute_larger, 10));

        var downKeyEvt = keydown('down');
        minuteInput.trigger(downKeyEvt);
        times = getTimes();
        expect(minute - timepanelConfig.minuteStep).toEqual(parseInt(times.minute_smaller, 10));
        expect(minute).toEqual(parseInt(times.minute, 10));
        expect(minute + timepanelConfig.minuteStep).toEqual(parseInt(times.minute_larger, 10));
    });

    it('should trigger onChange function when click smaller or larger value', function () {
        var el = '<uix-timepanel on-change="changeHanlder" ng-model="time"></uix-timepanel>';
        scope.time = getDate();
        scope.changeHanlder = jasmine.createSpy('changeHanlder');
        createTimepanel(el);
        decreaseHour();
        expect(scope.changeHanlder).toHaveBeenCalled();
    });
    it('should trigger onChange function when change input value', function () {
        var el = '<uix-timepanel on-change="changeHanlder" ng-model="time"></uix-timepanel>';
        scope.time = getDate();
        scope.changeHanlder = jasmine.createSpy('changeHanlder');
        createTimepanel(el);

        var hourInput = element.find('input').eq(0);
        var newHour = 10;
        hourInput.val(newHour);
        hourInput.change();

        expect(scope.changeHanlder).toHaveBeenCalled();
    });

    it('should trigger onChange function when mousewheel scroll', function () {
        var el = '<uix-timepanel on-change="changeHanlder" ng-model="time"></uix-timepanel>';
        scope.time = getDate();
        scope.changeHanlder = jasmine.createSpy('changeHanlder');
        createTimepanel(el);

        var upScrollEvt = wheelMouse(1);
        var minuteInput = element.find('input').eq(1);
        minuteInput.trigger(upScrollEvt);

        expect(scope.changeHanlder).toHaveBeenCalled();
    });

    it('should trigger onChange function when press up key', function () {
        var el = '<uix-timepanel on-change="changeHanlder" ng-model="time"></uix-timepanel>';
        scope.time = getDate();
        scope.changeHanlder = jasmine.createSpy('changeHanlder');
        createTimepanel(el);

        var downKeyEvt = keydown('down');
        var minuteInput = element.find('input').eq(1);
        minuteInput.trigger(downKeyEvt);

        expect(scope.changeHanlder).toHaveBeenCalled();
    });

});
