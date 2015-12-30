describe('fugu-dropdown', function () {

    var compile, scope,rootScope, document, dropdownConfig, element;

    beforeEach(module('ui.fugu.dropdown'));
    beforeEach(module('templates/dropdown.html'));
    beforeEach(module('templates/dropdown-choices.html'));

    beforeEach(inject(function( $compile, $rootScope, $document, fuguDropdownConfig) {
        compile = $compile;
        scope = $rootScope.$new();
        rootScope = $rootScope;
        document = $document;
        dropdownConfig = fuguDropdownConfig;
    }));
    afterEach(function() {
        element.remove();
    });
    var clickDropdownToggle = function(elm) {
        elm = elm || element;
        elm.find('.dropdown-toggle').click();
    };
    describe('basic', function () {
        function createDropdown(){
            var ele = compile(angular.element('<fugu-dropdown btn-value="第二项">'+
                '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>'))(scope)
            scope.$apply();
            return ele;
        }

        beforeEach(function () {
            element = createDropdown();
            scope.$apply();
        });

        it('should toggle on button click', function() {
            expect(element).not.toHaveClass(dropdownConfig.openClass);
            clickDropdownToggle();
            expect(element).toHaveClass(dropdownConfig.openClass);
            clickDropdownToggle();
            expect(element).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should toggle when an option is clicked', function() {
            document.find('body').append(element);
            expect(element).not.toHaveClass(dropdownConfig.openClass);
            clickDropdownToggle();
            expect(element).toHaveClass(dropdownConfig.openClass);

            var optionEl = element.find('ul > li').eq(0).find('a').eq(0);
            optionEl.click();
            expect(element).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should close on document click', function() {
            clickDropdownToggle();
            expect(element).toHaveClass(dropdownConfig.openClass);
            document.click();
            expect(element).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should close on $location change', function() {
            clickDropdownToggle();
            expect(element).toHaveClass(dropdownConfig.openClass);
            rootScope.$broadcast('$locationChangeSuccess');
            rootScope.$apply();
            expect(element).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should only allow one dropdown to be open at once', function() {
            var elm1 = createDropdown();
            var elm2 = createDropdown();
            expect(elm1).not.toHaveClass(dropdownConfig.openClass);
            expect(elm2).not.toHaveClass(dropdownConfig.openClass);

            clickDropdownToggle( elm1 );
            expect(elm1).toHaveClass(dropdownConfig.openClass);
            expect(elm2).not.toHaveClass(dropdownConfig.openClass);

            clickDropdownToggle( elm2 );
            expect(elm1).not.toHaveClass(dropdownConfig.openClass);
            expect(elm2).toHaveClass(dropdownConfig.openClass);
        });

        it('should not toggle if the element has `disabled` class', function() {
            var el = '<fugu-dropdown class="disabled" btn-value="第二项">'+
                '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var elm = compile(angular.element(el))(scope);
            scope.$apply();
            clickDropdownToggle( elm );
            expect(elm).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should not toggle if the element is disabled', function() {
            var el = '<fugu-dropdown disabled btn-value="第二项">'+
                '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var elm = compile(angular.element(el))(scope);
            scope.$apply();
            clickDropdownToggle( elm );
            expect(elm).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should not toggle if the element has `ng-disabled` as true', function() {
            rootScope.isdisabled = true;
            var el = '<fugu-dropdown ng-disabled="isdisabled" btn-value="第二项">'+
                '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var elm = compile(angular.element(el))(scope);
            scope.$apply();
            rootScope.$digest();
            clickDropdownToggle( elm );
            expect(elm).not.toHaveClass(dropdownConfig.openClass);

            rootScope.isdisabled = false;
            rootScope.$digest();
            clickDropdownToggle( elm );
            expect(elm).toHaveClass(dropdownConfig.openClass);
        });

        it('executes other document click events normally', function() {
            var checkboxEl = compile('<input type="checkbox" ng-click="clicked = true" />')(scope);
            scope.$apply();
            rootScope.$digest();

            expect(element).not.toHaveClass(dropdownConfig.openClass);
            expect(scope.clicked).toBeFalsy();

            clickDropdownToggle();
            expect(element).toHaveClass(dropdownConfig.openClass);
            expect(scope.clicked).toBeFalsy();

            checkboxEl.click();
            expect(scope.clicked).toBeTruthy();
        });
    });
    describe('multi col dropdown', function () {
        it('should not be multi col', function () {
            var html = '<fugu-dropdown btn-value="第二项">'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var ele = compile(html)(scope);
            scope.$apply();
            expect(ele).not.toHaveClass(dropdownConfig.multiColClass);
        });

        it('should have multi col class', function () {
            var html = '<fugu-dropdown btn-value="第二项">'+
                '<fugu-dropdown-choices title="第一项">第一项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var ele = compile(html)(scope);
            scope.$apply();
            expect(ele).toHaveClass(dropdownConfig.multiColClass);
        });
    });
});