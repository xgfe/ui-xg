describe('fugu-tooltip', function () {

    var element, scope, $compile, elm, elmScope;

    beforeEach(module('ui.fugu.tooltip'));

    beforeEach(inject(function($rootScope, _$compile_) {
        element = angular.element(
            '<span fugu-tooltip tooltip-is-open="template" content="nimenghao!!!">我是第一个自由的文本</span>'
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
        expect(elm).not.toHaveClass('in');
    }));

    it('should open on click', inject(function() {
        expect(elm).not.toHaveClass('in');
        elmScope.tooltipIsOpen = true;
        scope.$digest();
        expect(elm).toHaveClass('in');
    }));

    it('should open on mouseenter', inject(function() {
        element = $compile(angular.element(
            '<span fugu-tooltip trigger="hover">Selector Text</span>'
        ))(scope);
        scope.$digest();
        elm = element.next();
        elmScope = elm.scope();
        expect(elm).not.toHaveClass('in');
        element.trigger("mouseenter");
        expect(elm).toHaveClass('in');
        element.trigger('mouseleave');
        expect(elm).not.toHaveClass('in');
    }));

    it('content should accept an param', inject(function() {
        scope.text = "提示信息"
        element = $compile(angular.element(
            '<span fugu-tooltip trigger="hover" content="{{text}}">Selector Text</span>'
        ))(scope);
        scope.$digest();
        elm = element.next();
        var innerHTML = elm.find('.tooltip-inner').html();
        expect(innerHTML).toBe('提示信息');
    }));

    it('should work inside an ngRepeat', inject(function() {
        scope.text = "提示信息"
        element = $compile(angular.element(
            '<ul>'+
                '<li ng-repeat="item in items">'+
                    '<span fugu-tooltip trigger="hover" content="{{item.text}}">{{item.name}}</span>'+
                '</li>'+
            '</ul>'
        ))(scope);

        scope.items = [
            { name: 'One', text: 'First Tooltip' },
            { name: 'Two', text: 'Second Tooltip' }
        ];
        scope.$digest();

        var tt = angular.element(element.find('li > span')[1]);
        var innerHTML = tt.next().find('.tooltip-inner').html();
        expect(innerHTML).toBe(scope.items[1].text);
    }));
});