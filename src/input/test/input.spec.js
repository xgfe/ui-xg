describe('ui.xg.input', function () {
    var compile,
        scope,
        inputELe;

    beforeEach(function () {
        module('ui.xg.input');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
            inputELe = angular.element('<input type="text" uix-input >');
            compile(inputELe)(scope);
            scope.$digest();
        });
    });

    it('should className correct', function () {
        expect(inputELe.hasClass('uix-input')).toBe(true);
    });

});
