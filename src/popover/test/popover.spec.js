describe('fugu-popover', function () {

    var element, scope, $compile, elm, elmScope;

    beforeEach(module('ui.fugu.popover'));

    beforeEach(inject(function($rootScope, _$compile_) {
        element = angular.element(
            '<span fugu-popover popover-is-open="template" content="'+'nimenghao'+'">我是第一个自由的文本</span>'
        );
        scope = $rootScope;
        $compile = _$compile_;

        $compile(element)(scope);
        scope.$digest();

        elm = element.next();
        elmScope = elm.scope();
    }));

    it('should have a tooptip DOM', inject(function() {
        // the DOM must be existed.
        expect(elm.length).toBe(1);
        expect(elm.css('display')).not.toBe('block');
    }));

    it('should open on click', inject(function() {
        expect(elm.css('display')).not.toBe('block');
        elmScope.popoverIsOpen = true;
        scope.$digest();
        expect(elm.css('display')).toBe('block');
    }));

    it('should open on mouseenter', inject(function() {
        element = $compile(angular.element(
            '<span fugu-popover trigger="hover">Selector Text</span>'
        ))(scope);
        scope.$digest();
        elm = element.next();
        elmScope = elm.scope();
        expect(elm.css('display')).not.toBe('block');
        element.trigger("mouseenter");
        expect(elm.css('display')).toBe('block');
        element.trigger('mouseleave');
        expect(elm.css('display')).not.toBe('block');
    }));

    it('content should accept an param', inject(function() {
        scope.text = "提示信息"
        element = $compile(angular.element(
            '<span fugu-popover trigger="hover" content="text">Selector Text</span>'
        ))(scope);
        scope.$digest();
        elm = element.next();
        var innerHTML = elm.find('.popover-content').html();
        expect(innerHTML).toBe('提示信息');
    }));

    it('should work inside an ngRepeat', inject(function() {
        scope.text = "提示信息"
        element = $compile(angular.element(
            '<ul>'+
                '<li ng-repeat="item in items">'+
                    '<span fugu-popover trigger="hover" content="item.text">{{item.name}}</span>'+
                '</li>'+
            '</ul>'
        ))(scope);

        scope.items = [
            { name: 'One', text: 'First Tooltip' },
            { name: 'Two', text: 'Second Tooltip' }
        ];
        scope.$digest();

        var tt = angular.element(element.find('li > span')[1]);
        var innerHTML = tt.next().find('.popover-content').html();
        expect(innerHTML).toBe(scope.items[1].text);
    }));
});