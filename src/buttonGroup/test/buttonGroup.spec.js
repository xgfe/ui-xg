/**
 * uixButtonGroup指令测试文件
 * Author: penglu02@meituan.com
 * Date: 2016-08-30
 */
describe('ui.xg.buttonGroup', function () {
    var compile,
        scope,
        element;

    // 加载模块
    beforeEach(function () {
        module('ui.xg.button');
        module('button/templates/button.html');
        module('ui.xg.buttonGroup');
        module('buttonGroup/templates/buttonGroup.html');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
            scope.male = 'male';
            scope.female = 'female';
        });
    });


    function createButtonGroup(el) {
        element = compile(el)(scope);
        scope.$digest();
    }


    it('Should throw an error without set ng-model', function () {
        function errorFunctionWrapper() {
            createButtonGroup('<uix-button-group><button>男</button><button>女</button></uix-button-group>');
            scope.$apply();
        }

        expect(errorFunctionWrapper).toThrow();
    });


    it('Should set an radio type without set type', function () {
        scope.value = 'female';
        createButtonGroup('<uix-button-group ng-model="value"><button>男</button><button>女</button></uix-button-group>');
        expect(element).toHaveAttr('type', 'radio');
    });

    it('Should set active class based on model', function () {
        scope.value = 'female';
        createButtonGroup('<uix-button-group ng-model="value"><button btn-radio-val="male">男</button><button btn-radio-val="female">女</button></uix-button-group>');
        var ele = element.find('button');
        for (var i = 0; i < ele.length; i++) {
            var eItem = ele.eq(i);
            if (eItem.attr('btn-radio-val') === scope.value) {
                expect(eItem).toHaveClass('active');
            } else {
                expect(eItem).not.toHaveClass('active');
            }
        }
    });

    it('Should own different functional when set type', function () {
        scope.value = {'male': true, 'female': true};  // 多选
        scope.type = 'checkbox';
        createButtonGroup('<uix-button-group ng-model="value" bg-type="type"><button name="male">男</button><button name="female">女</button></uix-button-group>');
        var ele = element.find('button');
        var idx = 0;
        for (var i in scope.value) {
            if (scope.value.hasOwnProperty(i)) {
                if (scope.value[i]) {
                    expect(ele.eq(idx)).toHaveClass('active');
                } else {
                    expect(ele.eq(idx)).not.toHaveClass('active');
                }

            }
        }
    });

    it('Should modify ng-model via click one element to toggle active class', function () {
        scope.value = {'male': true, 'female': true};  // 多选
        scope.type = 'checkbox';
        createButtonGroup('<uix-button-group ng-model="value" bg-type="type"><button name="male">男</button><button name="female">女</button></uix-button-group>');
        var ele = element.find('button');
        var ekey = ele.eq(0).attr('name');
        var oldValue = scope.value[ekey];
        ele.eq(0).click();
        expect((!oldValue)).toEqual(scope.value[ekey]);
    });

    it('Should modify ng-model via click different element to toggle active class', function () {
        scope.value = 'male';  // 多选
        createButtonGroup('<uix-button-group ng-model="value"><label class="btn btn-default" btn-radio-val="male">男</label><label class="btn btn-default" btn-radio-val="female">女</label></uix-button-group>');
        var ele = element.find('label');
        for (var i = 0; i < ele.length; i++) {
            if (ele.eq(i).attr('btn-radio-val') === scope.value) {
                expect(ele.eq(i)).toHaveClass('active');
                var newIdx = i + 1;
                if (newIdx > ele.length) {
                    newIdx = i - 1;
                }
                ele.eq(newIdx).click();
                expect(ele.eq(i)).not.toHaveClass('active');
                expect(ele.eq(newIdx)).toHaveClass('active');
                expect(scope.value).not.toEqual(ele.eq(i).attr('btn-radio-val'));
                expect(scope.value).toEqual(ele.eq(newIdx).attr('btn-radio-val'));
                break;
            }
        }
    });

    it('Should doing nothing when click an active radio and type equals to radio', function () {
        scope.value = 'male';  // 多选
        createButtonGroup('<uix-button-group ng-model="value"><label class="btn btn-default" btn-radio-val="male">男</label><label class="btn btn-default" btn-radio-val="female">女</label></uix-button-group>');
        var ele = element.find('label');
        for (var i = 0; i < ele.length; i++) {
            if (ele.eq(i).attr('btn-radio-val') === scope.value) {
                expect(ele.eq(i)).toHaveClass('active');
                ele.eq(i).click();
                expect(ele.eq(i)).toHaveClass('active');
                expect(scope.value).toEqual(ele.eq(i).attr('btn-radio-val'));
                break;
            }
        }
    });

    it('Should toggle custom model values when click', function () {
        scope.value = {'male': true, 'female': true};  // 多选
        scope.type = 'checkbox';
        createButtonGroup('<uix-button-group ng-model="value" bg-type="type"><button name="male"  btn-checkbox-true="male" btn-checkbox-false="nomale">男</button><button name="female" btn-checkbox-true="female">女</button></uix-button-group>');
        var ele = element.find('label');
        ele.eq(0).click();
        expect(scope.value[ele.eq(0).attr('name')]).toEqual(ele.eq(0).attr('btn-checkbox-true'));
        ele.eq(0).click();
        expect(scope.value[ele.eq(0).attr('name')]).toEqual(ele.eq(0).attr('btn-checkbox-false'));
    });

    it('Should can\'t toggle select  click one radio element when not set uncheckable or set uncheckable as false', function () {
        scope.value = 'female';
        createButtonGroup('<uix-button-group ng-model="value"><label class="btn btn-default" btn-radio-val="male">男</label><label class="btn btn-default" btn-radio-val="female">女</label></uix-button-group>');
        expect(element).toHaveAttr('type', 'radio');
        var ele = element.find('label');
        if (!(ele.eq(0).attr('btn-radio-val') === scope.value)) {
            expect(ele.eq(0)).not.toHaveClass('active');
            ele.eq(0).click();
        }
        expect(ele.eq(0).attr('btn-radio-val')).toEqual(scope.value);
        expect(ele.eq(0)).toHaveClass('active');
        ele.eq(0).click();
        expect(ele.eq(0)).toHaveClass('active');
        expect(ele.eq(0).attr('btn-radio-val')).toEqual(scope.value);
    });

    it('Should toggle select  click one radio element when  set uncheckable  as true', function () {
        scope.value = 'female';
        scope.uncheckable = true;
        createButtonGroup('<uix-button-group ng-model="value"><label class="btn btn-default" btn-radio-val="male" uncheckable="uncheckable">男</label><label class="btn btn-default" btn-radio-val="female">女</label></uix-button-group>');
        expect(element).toHaveAttr('type', 'radio');
        var ele = element.find('label');
        if (!(ele.eq(0).attr('btn-radio-val') === scope.value)) {
            expect(ele.eq(0)).not.toHaveClass('active');
            ele.eq(0).click();
            expect(ele.eq(0)).toHaveClass('active');
            expect(ele.eq(0).attr('btn-radio-val')).toEqual(scope.value);
        } else {
            expect(ele.eq(0)).toHaveClass('active');
            ele.eq(0).click();
            expect(ele.eq(0)).not.toHaveClass('active');
            expect(ele.eq(0).attr('btn-radio-val')).not.toEqual(scope.value);
        }
    });
});
