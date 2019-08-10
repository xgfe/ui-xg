describe('ui.xg.avatar', function () {
    var compile,
        scope;

    beforeEach(function () {
        module('ui.xg.avatar');
        module('avatar/templates/avatar.html');
        inject(function( $compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });

    function createAvatar(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    it('Should output a avatar',function(){
        createAvatar('<uix-avatar></uix-avatar>');
        expect(element[0].nodeName.toLocaleLowerCase()).toEqual('div');
        expect(element.hasClass('uix-avatar')).toBe(true);
    });

});