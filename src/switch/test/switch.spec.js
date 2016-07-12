describe('uix-switch', function () {
    var compile, // 编译模板
        scope, // 新创建的scope，编译的html所在的scope
        switchConfig,
        element;    //指令DOM结点
    beforeEach(function () {
        module('ui.xg.switch');
        module('switch/templates/switch.html');
        inject(function ($compile, $rootScope, uixSwitchConfig) {
            compile = $compile;
            scope = $rootScope.$new();
            switchConfig = uixSwitchConfig;
        });
    });
    afterEach(function () {
        element.remove();
    });
    function createSwitch(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    function isChecked() {
        return element.children('input:checked').length > 0;
    }

    it('should result in an error when ngModel is missed', function () {
        var errorType;
        try {
            createSwitch('<uix-switch></uix-switch>');
        } catch (evt) {
            errorType = evt.message.match(/\[[^\]]+\]/)[0];
            expect(typeof evt).not.toBe('undefined');
            expect(errorType).toEqual('[$compile:ctreq]');
        }
    });

    it('should not result in an error', function () {
        scope.open = true;
        createSwitch('<uix-switch ng-model="open"></uix-switch>');
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
        createSwitch('<uix-switch ng-model="open" ng-disabled="disabled"></uix-switch>');
        expect(isChecked()).toBe(true);
        element.click();
        expect(isChecked()).toBe(true);
    });

    it('different size', function () {
        createSwitch('<uix-switch ng-model="open"></uix-switch>');
        expect(element).toHaveClass('uix-switch-' + switchConfig.size);
        createSwitch('<uix-switch ng-model="open" size="sm"></uix-switch>');
        expect(element).toHaveClass('uix-switch-sm');
        createSwitch('<uix-switch ng-model="open" size="lg"></uix-switch>');
        expect(element).toHaveClass('uix-switch-lg');
    });

    it('different typs', function () {
        createSwitch('<uix-switch ng-model="open"></uix-switch>');
        expect(element).toHaveClass('uix-switch-' + switchConfig.type);
        createSwitch('<uix-switch ng-model="open" type="primary"></uix-switch>');
        expect(element).toHaveClass('uix-switch-primary');
        createSwitch('<uix-switch ng-model="open" type="success"></uix-switch>');
        expect(element).toHaveClass('uix-switch-success');
        createSwitch('<uix-switch ng-model="open" type="info"></uix-switch>');
        expect(element).toHaveClass('uix-switch-info');
        createSwitch('<uix-switch ng-model="open" type="error"></uix-switch>');
        expect(element).toHaveClass('uix-switch-error');
    });

    it('should trigger ngChange event when scope data changes', function () {
        /* TODO onChange 事件测试用例,onChange事件在点击之后触发,而不是在ngModel改变之后触发
         var el = '<uix-switch on-change="changeHandler()" ng-model="open"></uix-switch>';
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
         var el = '<uix-switch ng-model="status" true-value="A" false-value="B"></uix-switch>';
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
