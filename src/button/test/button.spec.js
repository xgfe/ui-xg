/**
 * Created by penglu on 16/8/31.
 */
describe('uix.xg.button', function () {
    var compile,
        scope,
        element;

    // 加载模块
    beforeEach(function () {
        module('ui.xg.button');
        module('button/templates/button.html');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
            scope.loading = false;
        });
    });


    function createBtn(el) {
        element = compile(el)(scope);
        scope.$digest();
    }


    it('Should output a button', function () {
        createBtn('<uix-button></uix-button>');
        expect(element[0].nodeName.toLocaleLowerCase()).toEqual('button');
    });

    it('Should set type=button and loading=false when set nothing', function () {
        createBtn('<uix-button></uix-button>');
        expect(element.attr('type')).toEqual('button');
        expect(element.scope().loading).toEqual(false);
    });

    it('Should show the type if passed one', function () {
        scope.type = 'submit';
        createBtn('<uix-button b-type="type"></uix-button>');
        expect(element).toHaveAttr('type', 'submit');
    });


    it('Should set the loading if passed one and should achieve two bind way', function () {
        scope.loading = false;
        createBtn('<uix-button loading="loading"></uix-button>');
        expect(element.find('i').length).toEqual(0);
        scope.loading = true;
        scope.$digest();
        expect(element.find('i').length).toEqual(1);
    });
});
