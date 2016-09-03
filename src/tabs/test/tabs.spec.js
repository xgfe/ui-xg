/**
 * uixTabs指令测试文件
 * Author: penglu02@meituan.com
 * Date: 2016-08-30
 */
describe('ui.xg.tabs', function () {
    var compile,
        scope,
        element;

    // 加载模块
    beforeEach(function () {
        module('ui.xg.tabs');
        module('tabs/templates/tab.html');
        module('tabs/templates/tabs.html');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });


    function createTabs(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    it('should create tab with Tab heading and with empty content without set anything', function () {
        createTabs('<uix-tabs><uix-tab></uix-tab></uix-tabs>');
        expect(element.children().eq(0).children().length).toEqual(1);
        expect(element.children().eq(1).children().length).toEqual(0);
        var ele = element.children().eq(0).children();
        expect(ele.eq(0).find('a').text()).toEqual('Tab');
    });


    it('should set content by three way', function () {
        scope.content = '通过{{}}设置的内容';
        createTabs('<uix-tabs><uix-tab>{{content}}</uix-tab><uix-tab>直接设置内容</uix-tab><uix-tab><i class="glyphicon glyphicon-eye-open"></i></uix-tab></uix-tabs>');
        var ele = element.find('uix-tab-panel');
        expect(ele.length).toEqual(3);
        expect(ele.eq(0).text()).toEqual(scope.content);
        expect(ele.eq(1).text()).toEqual('直接设置内容');
        expect(ele.eq(2).html()).toEqual('<i class="glyphicon glyphicon-eye-open ng-scope"></i>');
    });

    it('should bind tabs content and set first tab active', function () {
        var arr = ['first content is 1', 'second content is 2', 'third content is 3'];
        createTabs('<uix-tabs><uix-tab>first content is 1</uix-tab><uix-tab>second content is 2</uix-tab><uix-tab>third content is 3</uix-tab></uix-tabs>');
        var tabContent = element.find('uix-tab-panel');
        var head = element.find('li');
        for (var i = 0; i < tabContent.length; i++) {
            expect(tabContent.eq(i).text().trim()).toEqual(arr[i]);
        }
        expect(head.eq(0)).toHaveClass('active');
        expect(head.eq(1)).not.toHaveClass('active');
        expect(head.eq(2)).not.toHaveClass('active');
    });

    it('should call on-change  when click different tab', function () {
        scope.active = 2;
        var oldVal = 0;
        var newVal = 0;
        scope.changeFn = function (_oldVal, _newVal) {
            oldVal = _oldVal;
            newVal = _newVal;
        };
        createTabs('<uix-tabs active="active" on-change="changeFn($oldVal, $newVal)"><uix-tab>first content is 1</uix-tab><uix-tab>second content is 2</uix-tab>' +
            '<uix-tab>third content is 3</uix-tab></uix-tabs>');
        var head = element.find('li');
        expect(head.eq(1)).toHaveClass('active');
        expect(scope.active).toEqual(2);
        expect(oldVal).toEqual(0);
        expect(newVal).toEqual(0);
        head.eq(0).click();
        expect(head.eq(1)).not.toHaveClass('active');
        expect(head.eq(0)).toHaveClass('active');
        expect(scope.active).toEqual(1);
        expect(oldVal).toEqual(2);
        expect(newVal).toEqual(1);
    });
});

