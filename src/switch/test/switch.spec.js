describe('fugu-switch', function () {
    var compile, // 编译模板
        scope, // 新创建的scope，编译的html所在的scope
        switchConfig,
        element;    //指令DOM结点
    beforeEach(function () {
        module('ui.fugu.switch');
        module('switch/templates/switch.html');
        inject(function( $compile, $rootScope,fuguSwitchConfig) {
            compile = $compile;
            scope = $rootScope.$new();
            switchConfig = fuguSwitchConfig
        });
    });
    afterEach(function() {
        element.remove();
    });
    function createSwitch(el){
        element = compile(el)(scope);
        scope.$digest();
    }
    function isChecked(){
        return element.children('input:checked').length>0;
    }

    it('should result in an error when ngModel is missed', function () {
        var errorType;
        try{
            createSwitch('<fugu-switch></fugu-switch>');
        }catch(e){
            errorType = e.message.match(/\[[^\]]+\]/)[0];
            expect(typeof e).not.toBe('undefined');
            expect(errorType).toEqual('[$compile:ctreq]');
        }
    });

    it('should not result in an error', function () {
        scope.open = true;
        createSwitch('<fugu-switch ng-model="open"></fugu-switch>');
        expect(isChecked()).toBe(true);
        scope.open = false;
        scope.$digest();
        expect(isChecked()).toBe(false);
        element.click();
        expect(isChecked()).toBe(true);
    });

    it('switch should be disabled when ngDisabled set to be true', function () {
        scope.disabled = true;
        scope.open = true;
        createSwitch('<fugu-switch ng-model="open" ng-disabled="disabled"></fugu-switch>');
        expect(isChecked()).toBe(true);
        element.click();
        expect(isChecked()).toBe(true);
    });

    it('different size', function () {
        createSwitch('<fugu-switch ng-model="open"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-'+switchConfig.size);
        createSwitch('<fugu-switch ng-model="open" size="sm"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-sm');
        createSwitch('<fugu-switch ng-model="open" size="lg"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-lg');
    });

    it('different typs', function () {
        createSwitch('<fugu-switch ng-model="open"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-'+switchConfig.type);
        createSwitch('<fugu-switch ng-model="open" type="primary"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-primary');
        createSwitch('<fugu-switch ng-model="open" type="success"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-success');
        createSwitch('<fugu-switch ng-model="open" type="info"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-info');
        createSwitch('<fugu-switch ng-model="open" type="error"></fugu-switch>');
        expect(element).toHaveClass('fugu-switch-error');
    });

    it('should trigger ngChange event when scope data changes', function () {
        /* TODO onChange 事件测试用例,onChange事件在点击之后触发,而不是在ngModel改变之后触发
        var el = '<fugu-switch on-change="changeHandler()" ng-model="open"></fugu-switch>';
        scope.changeHandler = jasmine.createSpy('changeHandler');
        createSwitch(el);
        scope.open = true;
        scope.$digest();
        element.click();
        scope.open = false;
        expect(scope.changeHandler).toHaveBeenCalled();
        */
    });

    it('should get current value', function () {
        /* TODO trueValue 和 falseValue 没有测试
        var el = '<fugu-switch ng-model="status" true-value="A" false-value="B"></fugu-switch>';
        createSwitch(el);
        scope.status = 'A';
        scope.A = 'A';
        scope.B = 'B';
        scope.$digest();
        expect(isChecked()).toBe(true);
        scope.status = 'B';
        scope.$digest();
        expect(isChecked()).toBe(false);*/
    });

});