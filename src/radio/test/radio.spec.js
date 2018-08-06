describe('ui.xg.radio', function () {
    var compile,
        scope;

    beforeEach(function () {
        module('ui.xg.radio');
        module('radio/templates/radio.html');
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