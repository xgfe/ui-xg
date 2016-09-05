/**
 * uixRate指令测试文件
 * Author: penglu02@meituan.com
 * Date: 2016-08-30
 */
describe('ui.xg.rate', function () {
    var compile,
        scope,
        timeout,
        element;

    // 加载模块
    beforeEach(function () {
        module('ui.xg.rate');
        module('rate/templates/rate.html');
        inject(function ($compile, $rootScope, $timeout) {
            compile = $compile;
            scope = $rootScope.$new();
            scope.value = 2;
            timeout = $timeout;
        });
    });


    function createRate(el) {
        element = compile(el)(scope);
        scope.$digest();
    }


    it('contains the default number of icons', function () {
        createRate('<uix-rate ng-model="value"></uix-rate>');
        var ele = element.find('li');
        expect(ele.length).toBe(5);
    });


    it('should return the default icon for each item', function () {
        createRate('<uix-rate ng-model="value"></uix-rate>');
        var ele = element.find('li');
        for (var i = 0; i < ele.length; i++) {
            expect(ele.eq(i).attr('class')).toContain('glyphicon glyphicon-star');
        }
    });

    it('set selected icons set by ng-model', function () {
        scope.defaultVal = 3;
        createRate('<uix-rate ng-model="defaultVal"></uix-rate>');
        var ele = element.find('li');
        var i = 0;
        for (; i < scope.defaultVal; i++) {
            expect(ele.eq(i).attr('class')).toContain('full-score');
        }
        for (i = scope.defaultVal; i < ele.length; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
    });

    it('should not include uix-rates-disabled when not set read-only', function () {
        createRate('<uix-rate ng-model="value"></uix-rate>');
        expect(element.attr('class')).not.toContain('uix-rates-disabled');
    });


    it('should show default color-#f5a623(rgb(245, 166, 35)) when selected', function () {
        createRate('<uix-rate ng-model="value"></uix-rate>');
        var ele = element.find('li');
        for (var i = 0; i < scope.value; i++) {
            expect(ele.eq(i).css('color')).toEqual('rgb(245, 166, 35)');
        }
    });

    it('should set ngModel to 0 when ngModel less than 0,set ngModel to (count - 1) when ngModel more than (count - 1)', function () {
        scope.minValue = -1;
        createRate('<uix-rate ng-model="minValue"></uix-rate>');
        var i = 0;
        var ele = element.find('li');
        expect(scope.minValue).toEqual(0);
        for (; i < 5; i++) {
            expect(ele.eq(i).css('color')).not.toEqual('rgb(245, 166, 35)');
        }

        scope.maxValue = 6;
        createRate('<uix-rate ng-model="maxValue"></uix-rate>');
        ele = element.find('li');
        expect(scope.maxValue).toEqual(5);
        for (i = 0; i < 5; i++) {
            expect(ele.eq(i).css('color')).toEqual('rgb(245, 166, 35)');
        }
    });

    it('should create 5 icons when the value or count less than 1', function () {
        scope.count = 0;
        createRate('<uix-rate ng-model="minValue" count="count"></uix-rate>');
        var ele = element.find('li');
        expect(ele.length).toEqual(5);

        scope.count = -1;
        createRate('<uix-rate ng-model="minValue" count="count"></uix-rate>');
        ele = element.find('li');
        expect(ele.length).toEqual(5);
    });

    it('should set rating-icon by yourself', function () {
        scope.ratingIcon = 'glyphicon glyphicon-off';
        createRate('<uix-rate ng-model="value" rating-icon="ratingIcon"></uix-rate>');
        var ele = element.find('li');
        for (var i = 0; i < ele.length; i++) {
            expect(ele.eq(i).attr('class')).toContain('glyphicon glyphicon-off');
            expect(ele.eq(i).attr('class')).not.toContain('glyphicon glyphicon-star');
        }
    });

    it('should set rating-select-color by all the way that can set color', function () {
        scope.ratingSelectColor = 'red';
        createRate('<uix-rate ng-model="value" rating-select-color="ratingSelectColor"></uix-rate>');
        var ele1 = element.find('li');
        scope.ratingSelectColor = '#ff0000';
        createRate('<uix-rate ng-model="value" rating-select-color="ratingSelectColor"></uix-rate>');
        var ele2 = element.find('li');
        scope.ratingSelectColor = 'rgb(255,0,0)';
        createRate('<uix-rate ng-model="value" rating-select-color="ratingSelectColor"></uix-rate>');
        var ele3 = element.find('li');
        for (var i = 0; i < scope.value; i++) {
            expect(ele1.eq(i).css('color')).toEqual('red');
            expect(ele2.eq(i).css('color')).toEqual('rgb(255, 0, 0)');
            expect(ele3.eq(i).css('color')).toEqual('rgb(255, 0, 0)');
            expect(ele2.eq(i).css('color')).toEqual(ele3.eq(i).css('color'));
        }
    });

    it('should show the icons that mouse entered above as selected', function () {
        createRate('<uix-rate ng-model="value" rating-select-color="ratingSelectColor"></uix-rate>');
        var ele = element.find('li');
        var rand = Math.floor(Math.random() * 5);  //随机生成一个小于5(scope.count)的数
        ele.eq(rand).mouseenter();  // 触发事件
        var i = 0;
        for (; i <= rand; i++) {
            expect(ele.eq(i).attr('class')).toContain('full-score');
        }
        for (i = rand + 1; i < ele.length; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
    });

    it('should change ngModel when click icon and current click icon\'s index is not equal ngModel-1', function () {
        createRate('<uix-rate ng-model="value" rating-select-color="ratingSelectColor"></uix-rate>');
        var ele = element.find('li');
        var rand = Math.floor(Math.random() * 5);  //随机生成一个小于5(scope.count)的数
        var oldVal = scope.value;
        var i = 0;
        ele.eq(rand).click();  // 触发事件
        if (rand + 1 !== oldVal) {
            expect(rand + 1).toEqual(scope.value);
            expect(oldVal).not.toEqual(scope.value);
        }
        for (; i < scope.value; i++) {
            expect(ele.eq(i).attr('class')).toContain('full-score');
        }
        for (i = scope.value; i < scope.count; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
    });


    it('should remove the selected icon style and reset style by ngModel when enter icon and leave and without click', function () {
        createRate('<uix-rate ng-model="value" rating-select-color="ratingSelectColor"></uix-rate>');
        var ele = element.find('li');
        var rand = Math.floor(Math.random() * 5);  //随机生成一个小于5(scope.count)的数
        var i = 0;
        ele.eq(rand).mouseenter();  // 触发事件
        for (; i <= rand; i++) {
            expect(ele.eq(i).attr('class')).toContain('full-score');
        }
        for (i = rand + 1; i < ele.length; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
        ele.eq(rand).mouseleave();  // 触发事件
        for (i = 0; i < scope.value; i++) {
            expect(ele.eq(i).attr('class')).toContain('full-score');
        }
        for (i = scope.value; i < scope.count; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
    });


    it('should change ngModel and keep the selected icon style when enter icon and click and then leave', function () {
        createRate('<uix-rate ng-model="value" rating-select-color="ratingSelectColor"></uix-rate>');
        var ele = element.find('li');
        var rand = Math.floor(Math.random() * 5);  //随机生成一个小于5(scope.count)的数
        var i = 0;
        ele.eq(rand).mouseenter();  // 触发事件
        for (; i <= rand; i++) {
            expect(ele.eq(i).attr('class')).toContain('full-score');
        }
        for (i = rand + 1; i < ele.length; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
        ele.eq(rand).click();  // 触发事件
        ele.eq(rand).mouseleave();  // 触发事件
        expect(rand + 1).toEqual(scope.value);

        for (i = 0; i < scope.value; i++) {
            expect(ele.eq(i).attr('class')).toContain('full-score');
        }
        for (i = scope.value; i < scope.count; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
    });


    it('it should disabled operate when set read-only with true', function () {
        createRate('<uix-rate ng-model="value" read-only="true"></uix-rate>');
        var ele = element.find('li');
        var rand = scope.value + 1;
        ele.eq(rand).mouseenter();  // 触发事件
        for (var i = scope.value; i < rand; i++) {
            expect(ele.eq(i).attr('class')).not.toContain('full-score');
        }
        expect(element.attr('class')).toContain('uix-rates-disabled');
    });


    it('should trigger on-change event when ngModel change and emit two params', function () {
        scope.changeValue = 4;
        scope.changeText = 0;
        scope.changeFn = function (oldVal, newVal) {
            scope.changeText = oldVal + ';' + newVal;
        };
        createRate('<uix-rate ng-model="changeValue" rating-select-color="ratingSelectColor" on-change="changeFn($oldVal, $newVal)"></uix-rate>');
        var ele = element.find('li');
        var rand = Math.floor(Math.random() * (scope.changeValue - 1));  //随机生成一个数
        var oldVal = scope.changeValue;
        ele.eq(rand).click();  // 触发事件
        expect(rand + 1).toEqual(scope.changeValue);
        if (rand + 1 !== oldVal) {
            expect(scope.changeText).toEqual(oldVal + ';' + (rand + 1));
        }
    });

    it('it should call mouseleave when the time interval between two mouseenter events more than 500 ms ', function () {
        createRate('<uix-rate ng-model="value"></uix-rate>');
        var ele = element.find('li');
        var rand = scope.value;
        ele.eq(rand).mouseenter();
        expect(typeof ele.eq(rand).scope.timer).toEqual('undefined');
        ele.eq(rand).mouseleave();  // 不会触发
        expect(ele.eq(rand).scope.timer).not.toEqual(null);
        ele.eq(rand + 1).mouseenter();
        expect(typeof ele.eq(rand).scope.timer).toEqual('undefined');
        ele.eq(rand).mouseenter();  // 会触发
    });

    it('should enlarge icon when mouseenter the icon and reset size when mouseleave', function () {
        createRate('<uix-rate ng-model="value"></uix-rate>');
        var ele = element.find('li');
        ele.eq(0).mouseenter();  //鼠标上移
        expect(ele.eq(0).attr('class')).toContain('max-icon');
        ele.eq(0).mouseleave();
        timeout(function () {
            expect(ele.eq(0).attr('class')).not.toContain('max-icon');
        }, 1000);
    });

    it('should mouseleave do nothing when call mouserenter then call click then mouseleave ', function () {
        createRate('<uix-rate ng-model="value"></uix-rate>');
        var ele = element.find('li');
        ele.eq(0).mouseenter();  //鼠标上移
        ele.eq(0).click();
        expect(ele.eq(0).scope().changeFlag).toEqual(true);
    });
});

