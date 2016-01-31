describe('ui.fugu.<%module%>', function () {
    var compile,
        scope;

    beforeEach(function () {
        module('ui.fugu.<%module%>');
        module('<%module%>/templates/<%module%>.html');
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