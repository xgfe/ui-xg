/**
 * uixButton指令测试文件
 * Author: penglu02@meituan.com
 * Date: 2016-01-12
 */
describe('uix-button', function( ){
    var compile, scope;

    // 加载模块
    beforeEach(module('ui.xg.button'));
    beforeEach(module('button/templates/button.html'));

    beforeEach(inject(function($compile, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
        $rootScope.xSize = "x-small";
    }));

    describe('Button', function () {
        function clickFn(){
            scope.disabled = !scope.disabled;
        }
        function createButton(btnClass, size, block, active, disabled, loading, type) {
            btnClass = btnClass ? 'btnClass=' + btnClass : '';
            size = size ? ' size=' + size : '';
            block = block ? ' block=' + block : '';
            active = active ? ' active=' + active : '';
            disabled = disabled ? ' disabled=' + disabled : '';
            loading = loading ? ' loading=' + loading : '';
            type = type ? ' type=' + type : '';
            var ele = compile(angular.element('<uix-button '+ btnClass + size + block + active + disabled + loading +  type + '></uix-button>'))(scope);
            scope.$apply();
            return ele;
        }

        it('Should output a button', function() {
            var ele = angular.element(createButton()).children()[0],
                eleName = ele.nodeName.toLowerCase();
            expect(eleName).toEqual('button');
        });

        it('Should have class="btn btn-default", type=button, button content show "button" by default', function(){
            var ele = angular.element(angular.element(createButton()).children()[0]);
            // ele必须为angular.element,否则toHaveClass会报错
            expect(ele).toHaveClass('btn');
            expect(ele).toHaveClass('btn-default');
            expect(ele).toHaveAttr('type','button');
        });

        it('Should show the type if passed one', function(){
            var ele = angular.element(angular.element(createButton('','','','','','','reset')).children()[0]);
            expect(ele).toHaveAttr('type','reset');
        });

        it('Should show have btn-XXX class  if passed btnClass=XXX', function(){
            var ele = createButton('danger','','','','','','').children();
            expect(ele).toHaveClass('btn-danger');
        });

        it('Should show have btn-xs class  if passed size=x-small', function(){
            var ele = createButton('','xSize','','','','','').children();
            expect(ele).toHaveClass('btn-xs');
        });

        it('Should show have btn-block class  if passed block=true', function(){
            // TODO 默认的时候应该测试不含btn-block
            var ele = createButton('','',true,'','','','').children();
            expect(ele).toHaveClass('btn-block');
        });

        it('Should show have active class  if passed active=true', function(){
            // TODO 默认的时候应该测试不含active
            var ele = createButton('','','',true,'','','').children();
            expect(ele).toHaveClass('active');
        });

        it('Should show icon before button text  if passed icon=plus', function(){
            var element = compile('<uix-button icon="plus"></uix-button>')(scope),
                btnEle = null,
                iEle = null;
            scope.$apply();
            btnEle = element.children();
            iEle = btnEle.children();
            expect(btnEle).toHaveClass('btn-addon');
            expect(iEle).toHaveClass('glyphicon-plus');
        });

        it('should observe the disabled attribute', function () {
            var element = compile('<uix-button disabled="disabled"></uix-button>')(scope);
            scope.$apply();
            expect(angular.element(element.children()[0])).not.toHaveAttr('disabled', 'disabled');
            scope.$apply('disabled = true');
            expect(angular.element(element.children()[0])).toHaveAttr('disabled', 'disabled');
            scope.$apply('disabled = false');
            expect(angular.element(element.children()[0])).not.toHaveAttr('disabled', 'disabled');
        });

        it('should observe the loading attribute', function () {
            var element = compile('<uix-button loading="loading"></uix-button>')(scope),
                spanEle = null;
            scope.$apply();
            spanEle = element.children().children('span.glyphicon-refresh-animate')[0];
            // TODO:undefined比较的时候不能使用angular.element.不然会包装成一个对象，传递的undefined不能是字符串不然会报错
            expect(typeof spanEle).toEqual('undefined');
            scope.$apply('loading = true');
            spanEle = element.children().children('span.glyphicon-refresh-animate');
            // TODO 如何测试一个元素存在且具有某一属性
            expect(spanEle).not.toEqual(null);
            expect(spanEle).not.toHaveClass('hidden');
            scope.$apply('loading = false');
            expect(spanEle).not.toEqual(null);
            expect(spanEle).toHaveClass('hidden');
        });

        it('should call clickFn when set click=clickFn() && execute click event', function () {
            var element = compile('<uix-button click="clickFn()" disabled="disabled"></uix-button>')(scope);
            scope.clickFn = clickFn;
            scope.disabled = false;
            scope.$apply();
            expect(element.children()).not.toHaveAttr('disabled', 'disabled');
            element.children().trigger('click');
            scope.$apply();
            expect(element.children()).toHaveAttr('disabled', 'disabled');
        });
    });
});