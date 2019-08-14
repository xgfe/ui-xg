describe('ui.xg.datatable', function () {
    var compile,
        scope;

    beforeEach(function () {
        module('ui.xg.datatable');
        module('datatable/templates/datatable.html');
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