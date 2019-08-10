describe('ui.xg.divider', function () {
    var compile,
        scope,
        element;

    beforeEach(function () {
        module('ui.xg.divider');
        module('divider/templates/divider.html');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });

    function createDivider(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    it('Should output a divider', function () {
        createDivider('<uix-divider></uix-divider>');
        expect(element.hasClass('uix-divider')).toBe(true);
    });

});
