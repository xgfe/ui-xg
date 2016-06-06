describe('ui.fugu.timepicker', function () {
    var compile,
        scope,
        date,
        timepickerConfig, //timepicker的常量配置
        element;    //指令DOM结点;

    beforeEach(function () {
        module('ui.fugu.position');
        module('ui.fugu.timepanel');
        module('timepanel/templates/timepanel.html');
        module('ui.fugu.timepicker');
        module('timepicker/templates/timepicker.html');
        inject(function( $compile, $rootScope,fuguTimepickerConfig,dateFilter) {
            compile = $compile;
            scope = $rootScope.$new();
            timepickerConfig = fuguTimepickerConfig;
            date = dateFilter;
        });
    });
    afterEach(function() {
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
    function getInputVal(){
        return element.find('.fugu-timepicker-input').val();
    }
    function clickInput(){
        element.find('.fugu-timepicker-input').click();
        scope.$digest();
    }
    function clickButton(){
        element.find('.input-group button').click();
        scope.$digest();
    }
    function getTimepanel(){
        return element.next('.fugu-timepicker-popover');
    }
    function increaseHour() {
        var el = getTimepanel().find('.fugu-timepanel-col').eq(0).find('.fugu-timepanel-top');
        el.click();
        scope.$digest();
    }

    function decreaseHour() {
        var el = getTimepanel().find('.fugu-timepanel-col').eq(0).find('.fugu-timepanel-bottom');
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
        }
    }

    it('should show format time',function(){
        var el = '<fugu-timepicker ng-model="time"></fugu-timepicker>';
        var dt = getDate();
        scope.time = dt;
        createTimepicker(el);
        expect(element).toHaveClass('fugu-timepicker');
        var val = getInputVal();
        expect(val).toEqual(date(dt,timepickerConfig.format));
    });

    it('should toggle timepanel when click input and button', function () {
        var el = '<fugu-timepicker ng-model="time"></fugu-timepicker>';
        scope.time = getDate();
        createTimepicker(el);
        expect(getTimepanel()).not.toHaveClass('in');
        clickInput();
        expect(getTimepanel()).toHaveClass('in');
        clickButton();
        expect(getTimepanel()).not.toHaveClass('in');
    });

    it('ngModel should be two-way data binding', function () {
        var el = '<fugu-timepicker ng-model="time"></fugu-timepicker>';
        var dt = getDate();
        scope.time = dt;
        createTimepicker(el);
        decreaseHour();
        var hour = scope.time.getHours();
        expect(hour).toEqual(dt.getHours() - timepickerConfig.hourStep);
    });

    it('should be work when set *Step attr', function () {
        var el = '<fugu-timepicker hour-step="hourStep" ng-model="time"></fugu-timepicker>';
        var dt = getDate();
        var hour = dt.getHours();
        scope.time = dt;
        scope.hourStep = 3;
        createTimepicker(el);
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
        var el = '<fugu-timepicker placeholder="{{placeholder}}" ng-model="time"></fugu-timepicker>';
        scope.time = getDate();
        scope.placeholder = 'I am placeholder';
        createTimepicker(el);
        var input = element.find('.fugu-timepicker-input');
        expect(input.attr('placeholder')).toEqual(scope.placeholder);
    });

    it('show diff format time', function () {
        var el = '<fugu-timepicker format="format" ng-model="time"></fugu-timepicker>';
        var dt = getDate();
        scope.time = dt;
        scope.format = 'HH-mm-ss';
        createTimepicker(el);
        var val = getInputVal();
        expect(val).toEqual(date(dt,scope.format));
    });
    it('disable input and button when ngDisabled set to be false', function () {
        var el = '<fugu-timepicker ng-disabled="isDisabled" ng-model="time"></fugu-timepicker>';
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