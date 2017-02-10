describe('ui.xg.steps', function () {
    var compile;
    var scope;
    var element;
    beforeEach(function () {
        module('ui.xg.steps');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });

    function createElement(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    it('run with direction=vertical and result should be direction=vertical', function () {
        scope.direction = 'vertical';
        createElement('<uix-steps direction="{{direction}}"></uix-steps>');
        expect(element.attr('direction')).toEqual('vertical');
    });

    it('run with direction=horizontal and result should be direction=horizontal', function () {
        scope.direction = 'horizontal';
        createElement('<uix-steps direction="{{direction}}"></uix-steps>');
        expect(element.attr('direction')).toEqual('horizontal');
    });

    it('run without direction and result should be direction=vertical', function () {
        scope.direction = 'vertical';
        createElement('<uix-steps></uix-steps>');
        expect(element.scope().direction).toEqual('vertical');
    });

    it('run with size=lg and result should be size=lg', function () {
        scope.size = 'lg';
        createElement('<uix-steps size="{{size}}"></uix-steps>');
        expect(element.attr('size')).toEqual('lg');
    });

    it('run with size=md and result should be size=md', function () {
        scope.size = 'md';
        createElement('<uix-steps size="{{size}}"></uix-steps>');
        expect(element.attr('size')).toEqual('md');
    });

    it('run with size=sm and result should be size=sm', function () {
        scope.size = 'sm';
        createElement('<uix-steps size="{{size}}"></uix-steps>');
        expect(element.attr('size')).toEqual('sm');
    });

    it('run without size and result should be size=md', function () {
        scope.size = 'md';
        createElement('<uix-steps></uix-steps>');
        expect(element.scope().size).toEqual('md');
    });
});

