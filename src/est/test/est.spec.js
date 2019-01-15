describe('ui.xg.est', function () {
    var compile,
        scope;

    beforeEach(function () {
        module('ui.xg.est');
        module('est/templates/est.html');
        inject(function( $compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });
    afterEach(function() {

    });

    it('should run without an error',function(){

    });

});