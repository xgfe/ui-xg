/**
 * fuguButtonGroup指令测试文件
 * Author: penglu02@meituan.com
 * Date: 2016-01-25
 */
describe('fugu-button-group', function( ){
    var compile, scope;

    // 加载模块
    beforeEach(module('ui.fugu.buttonGroup'));
    beforeEach(module('buttonGroup/templates/buttonGroup.html'));

    beforeEach(inject(function($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
    }));

    describe('ButtonGroup', function () {

        // 公共特性测试
        it('Should throw an error without set ng-model',function() {
            function errorFunctionWrapper(){
                compile('<fugu-button-group><button>男</button><button>女</button></fugu-button-group>')(scope);
                scope.$apply();
            }
            expect(errorFunctionWrapper).toThrow();
        });

        it('Should set active class based on model', function(){
            var element = compile('<fugu-button-group ng-model="radioModel"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.$apply();
            childElements = element.children();
            expect(childElements.eq(0)).not.toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');

            scope.$apply('radioModel="男"');
            childElements = element.children();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');
        });

        it('Should can\'t click when disabled equals to true', function(){
            var element = compile('<fugu-button-group ng-model="radioModel" disabled="true"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.$apply('radioModel="男"');
            childElements = element.children();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');

            childElements.eq(1).click();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');

            scope.$apply();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');
        });

        it('Should show different size  style when set size', function(){
            var newScope = scope.$new(),
                element = compile('<fugu-button-group ng-model="radioModel" size="eleSize"><button>男</button><button>女</button></fugu-button-group>')(newScope),
                childElements = null;
            scope.radioModel = '男';
            scope.eleSize = 'large';
            scope.$apply();
            childElements = element.children();
            expect(childElements.eq(0)).toHaveClass('btn-lg');
            expect(childElements.eq(1)).toHaveClass('btn-lg');
        });

        it('Should show different color when set show-class', function(){
            var newScope = scope.$new(),
                element = compile('<fugu-button-group ng-model="radioModel" show-class="btnClass"><button>男</button><button>女</button></fugu-button-group>')(newScope),
                childElements = null;
            scope.radioModel = '男';
            scope.btnClass = 'primary';
            scope.$apply();
            childElements = element.children();
            expect(childElements.eq(0)).toHaveClass('btn-primary');
            expect(childElements.eq(1)).toHaveClass('btn-primary');
        });

        it('Should own different function when set type', function() {
            var newScope = scope.$new(),
                element = compile('<fugu-button-group ng-model="checkboxModel" type="type"><button>男</button><button>女</button></fugu-button-group>')(newScope),
                childElements = null;
            scope.checkboxModel = {'man' : true, 'woman' : true };
            scope.type = 'checkbox';
            scope.$apply();
            childElements = element.children();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).toHaveClass('active');
        });

        it('Should modify ng-model via click element to toggle active class', function(){
            var element = compile('<fugu-button-group ng-model="checkboxModel"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.$apply();
            childElements = element.children();

            // TODO 做完click操作，model不会改变。。。。但是可以获取attribute属性，然后使用$eval()解析得到最新值
            childElements.eq(0).click();
            expect(scope.$eval(element.attr('ng-model'))).toEqual('男');

            childElements.eq(1).click();
            expect(scope.$eval(element.attr('ng-model'))).toEqual('女');

        });

        //type为radio的部分属性测试
        it('Should set radio as default type', function() {
            var element = compile('<fugu-button-group ng-model="radioModel"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.radioModel = '男';
            scope.$apply();
            childElements = element.children();

            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');
        });

        it('Should use sub element\'s innerText content as btn-radio\'s value', function(){
            var element = compile('<fugu-button-group ng-model="checkboxModel"><button>男</button><button>女</button></fugu-button-group>')(scope),
                    childElements = null;
                scope.$apply();
                childElements = element.children();

                childElements.eq(0).click();
                expect(scope.$eval(element.attr('ng-model'))).toEqual('男');

                childElements.eq(1).click();
                expect(scope.$eval(element.attr('ng-model'))).toEqual('女');
        });

        it('Should reset active class via click,only the click element has not active class', function(){
            var element = compile('<fugu-button-group ng-model="radioModel"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
                scope.$apply('radioModel="男"');
                childElements = element.children();
                expect(childElements.eq(0)).toHaveClass('active');
                expect(childElements.eq(1)).not.toHaveClass('active');

                childElements.eq(1).click();
                expect(childElements.eq(1)).toHaveClass('active');
                expect(childElements.eq(0)).not.toHaveClass('active');
        });

        it('Should doing nothing when click an active radio and type equals to radio', function(){
            var element = compile('<fugu-button-group ng-model="radioModel"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.$apply('radioModel="男"');
            childElements = element.children();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');

            childElements.eq(0).click();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');
        });



        // type为checkbox的部分属性测试
        it('Should use ng-model\'s key as the value of btn-checkbox when without set btn-checkbox', function(){
            var element = compile('<fugu-button-group ng-model="checkboxModel" type="checkbox"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
                scope.checkboxModel = {'man': true, 'woman':true};
                scope.$apply();
                childElements = element.children();
                expect(childElements.eq(0)).toHaveClass('active');
                expect(childElements.eq(1)).toHaveClass('active');

                childElements.eq(1).click();
                expect(scope.$eval(element.attr('ng-model'))).toEqual({'man': true, 'woman':false});

                childElements.eq(0).click();
                expect(scope.$eval(element.attr('ng-model'))).toEqual({'man': false, 'woman':false});
        });

        it('Should toggle active class when click the element', function() {
            var element = compile('<fugu-button-group ng-model="checkboxModel" type="checkbox"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.checkboxModel = {'man':true, 'woman': true};
            scope.$apply();
            childElements = element.children();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).toHaveClass('active');

            childElements.eq(1).click();
            expect(childElements.eq(0)).toHaveClass('active');
            expect(childElements.eq(1)).not.toHaveClass('active');
        });

        it('Should monitor model value, when no set, the default value is true | false', function(){
            var element = compile('<fugu-button-group ng-model="checkboxModel" type="checkbox"><button>男</button><button>女</button></fugu-button-group>')(scope);
            scope.checkboxModel = {'man':true, 'woman': true};
            scope.$apply();
            expect(scope.$eval(element.attr('ng-model')).man).toEqual(true);
            expect(scope.$eval(element.attr('ng-model')).woman).toEqual(true);
        });

        it('Should toggle default model values on click', function(){
            var element = compile('<fugu-button-group ng-model="checkboxModel" type="checkbox"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.checkboxModel = {'man':true, 'woman': true};
            scope.$apply();

            childElements = element.children();
            childElements.eq(1).click();
            childElements.eq(0).click();

            expect(scope.$eval(element.attr('ng-model')).man).toEqual(false);
            expect(scope.$eval(element.attr('ng-model')).woman).toEqual(false);
        });

        it('Should toggle custom model values on click', function(){
            var element = compile('<fugu-button-group ng-model="checkboxModel" type="checkbox" checkbox-true="1" checkbox-false="0"><button>男</button><button>女</button></fugu-button-group>')(scope),
                childElements = null;
            scope.checkboxModel = {'man':0, 'woman': 1};
            scope.$apply();
            expect(scope.$eval(element.attr('ng-model')).man).toEqual(0);
            expect(scope.$eval(element.attr('ng-model')).woman).toEqual(1);

            childElements = element.children();
            childElements.eq(1).click();
            childElements.eq(0).click();
            expect(scope.$eval(element.attr('ng-model')).man).toEqual(1);
            expect(scope.$eval(element.attr('ng-model')).woman).toEqual(0);
        });
    });
});