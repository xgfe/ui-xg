describe('ui.xg.carousel', function () {
    var compile,
        scope;

    beforeEach(function () {
        module('ui.xg.carousel');
        module('carousel/templates/carousel.html');
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