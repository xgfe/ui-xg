describe('fugu-alert', function () {

    //var compile, scope,rootScope, document, dropdownConfig, element;
    var element, scope, $compile, $templateCache, $timeout;

    beforeEach(module('ui.fugu.alert'));
    beforeEach(module('alert/templates/alert.html'));

    beforeEach(inject(function($rootScope, _$compile_, _$templateCache_, _$timeout_) {
        scope = $rootScope;
        $compile = _$compile_;
        $templateCache = _$templateCache_;
        $timeout = _$timeout_;

        element = angular.element(
            '<div>' +
            '<fugu-alert ng-repeat="alert in alerts" type="{{alert.type}}"' +
            'close="removeAlert($index)">{{alert.msg}}' +
            '</fugu-alert>' +
            '</div>');

        scope.alerts = [
            { msg:'foo', type:'success'},
            { msg:'bar', type:'error'},
            { msg:'baz'}
        ];
    }));

    function createAlerts() {
        $compile(element)(scope);
        scope.$digest();
        return element.find('.alert');
    }

    function findCloseButton(index) {
        return element.find('.close').eq(index);
    }

    function findContent(index) {
        return element.find('div[ng-transclude] span').eq(index);
    }

    it('should expose the controller to the view', function() {
        $templateCache.put('uib/template/alert/alert.html', '<div>{{alert.text}}</div>');

        element = $compile('<uib-alert></uib-alert>')(scope);
        scope.$digest();

        var ctrl = element.controller('uib-alert');
        expect(ctrl).toBeDefined();

        ctrl.text = 'foo';
        scope.$digest();

        expect(element.html()).toBe('foo');
    });

    it('should support custom templates', function() {
        $templateCache.put('foo/bar.html', '<div>baz</div>');

        element = $compile('<uib-alert template-url="foo/bar.html"></uib-alert>')(scope);
        scope.$digest();

        expect(element.html()).toBe('baz');
    });

    it('should generate alerts using ng-repeat', function() {
        var alerts = createAlerts();
        expect(alerts.length).toEqual(3);
    });

    it('should use correct classes for different alert types', function() {
        var alerts = createAlerts();
        expect(alerts.eq(0)).toHaveClass('alert-success');
        expect(alerts.eq(1)).toHaveClass('alert-error');
        expect(alerts.eq(2)).toHaveClass('alert-warning');
    });

    it('should respect alert type binding', function() {
        var alerts = createAlerts();
        expect(alerts.eq(0)).toHaveClass('alert-success');

        scope.alerts[0].type = 'error';
        scope.$digest();

        expect(alerts.eq(0)).toHaveClass('alert-error');
    });

    it('should show the alert content', function() {
        var alerts = createAlerts();

        for (var i = 0, n = alerts.length; i < n; i++) {
            expect(findContent(i).text()).toBe(scope.alerts[i].msg);
        }
    });

    it('should show close buttons and have the dismissible class', function() {
        var alerts = createAlerts();

        for (var i = 0, n = alerts.length; i < n; i++) {
            expect(findCloseButton(i).css('display')).not.toBe('none');
            expect(alerts.eq(i)).toHaveClass('alert-dismissible');
        }
    });

    it('should fire callback when closed', function() {
        var alerts = createAlerts();

        scope.$apply(function() {
            scope.removeAlert = jasmine.createSpy();
        });

        expect(findCloseButton(0).css('display')).not.toBe('none');
        findCloseButton(1).click();

        expect(scope.removeAlert).toHaveBeenCalledWith(1);
    });

    it('should not show close button and have the dismissible class if no close callback specified', function() {
        element = $compile('<uib-alert>No close</uib-alert>')(scope);
        scope.$digest();
        expect(findCloseButton(0)).toBeHidden();
        expect(element).not.toHaveClass('alert-dismissible');
    });

    it('should be possible to add additional classes for alert', function() {
        var element = $compile('<uib-alert class="alert-block" type="info">Default alert!</uib-alert>')(scope);
        scope.$digest();
        expect(element).toHaveClass('alert-block');
        expect(element).toHaveClass('alert-info');
    });

    it('should close automatically if dismiss-on-timeout is defined on the element', function() {
        scope.removeAlert = jasmine.createSpy();
        $compile('<uib-alert close="removeAlert()" dismiss-on-timeout="500">Default alert!</uib-alert>')(scope);
        scope.$digest();

        $timeout.flush();
        expect(scope.removeAlert).toHaveBeenCalled();
    });

    it('should not close immediately with a dynamic dismiss-on-timeout', function() {
        scope.removeAlert = jasmine.createSpy();
        scope.dismissTime = 500;
        $compile('<uib-alert close="removeAlert()" dismiss-on-timeout="{{dismissTime}}">Default alert!</uib-alert>')(scope);
        scope.$digest();

        $timeout.flush(100);
        expect(scope.removeAlert).not.toHaveBeenCalled();

        $timeout.flush(500);
        expect(scope.removeAlert).toHaveBeenCalled();
    });
    //beforeEach(inject(function( $compile, $rootScope, $document, fuguDropdownConfig) {
    //    compile = $compile;
    //    scope = $rootScope.$new();
    //    rootScope = $rootScope;
    //    document = $document;
    //    dropdownConfig = fuguDropdownConfig;
    //}));
    //afterEach(function() {
    //    element.remove();
    //});
    //var clickDropdownToggle = function(elm) {
    //    elm = elm || element;
    //    elm.find('.dropdown-toggle').click();
    //};
    //describe('basic', function () {
    //    function createDropdown(){
    //        var ele = compile(angular.element('<fugu-dropdown btn-value="第二项">'+
    //            '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
    //            '</fugu-dropdown>'))(scope)
    //        scope.$apply();
    //        return ele;
    //    }
    //
    //    beforeEach(function () {
    //        element = createDropdown();
    //        scope.$apply();
    //    });
    //
    //    it('should toggle on button click', function() {
    //        expect(element).not.toHaveClass(dropdownConfig.openClass);
    //        clickDropdownToggle();
    //        expect(element).toHaveClass(dropdownConfig.openClass);
    //        clickDropdownToggle();
    //        expect(element).not.toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('should toggle when an option is clicked', function() {
    //        document.find('body').append(element);
    //        expect(element).not.toHaveClass(dropdownConfig.openClass);
    //        clickDropdownToggle();
    //        expect(element).toHaveClass(dropdownConfig.openClass);
    //
    //        var optionEl = element.find('ul > li').eq(0).find('a').eq(0);
    //        optionEl.click();
    //        expect(element).not.toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('should close on document click', function() {
    //        clickDropdownToggle();
    //        expect(element).toHaveClass(dropdownConfig.openClass);
    //        document.click();
    //        expect(element).not.toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('should close on $location change', function() {
    //        clickDropdownToggle();
    //        expect(element).toHaveClass(dropdownConfig.openClass);
    //        rootScope.$broadcast('$locationChangeSuccess');
    //        rootScope.$apply();
    //        expect(element).not.toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('should only allow one dropdown to be open at once', function() {
    //        var elm1 = createDropdown();
    //        var elm2 = createDropdown();
    //        expect(elm1).not.toHaveClass(dropdownConfig.openClass);
    //        expect(elm2).not.toHaveClass(dropdownConfig.openClass);
    //
    //        clickDropdownToggle( elm1 );
    //        expect(elm1).toHaveClass(dropdownConfig.openClass);
    //        expect(elm2).not.toHaveClass(dropdownConfig.openClass);
    //
    //        clickDropdownToggle( elm2 );
    //        expect(elm1).not.toHaveClass(dropdownConfig.openClass);
    //        expect(elm2).toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('should not toggle if the element has `disabled` class', function() {
    //        var el = '<fugu-dropdown class="disabled" btn-value="第二项">'+
    //            '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
    //            '</fugu-dropdown>';
    //        var elm = compile(angular.element(el))(scope);
    //        scope.$apply();
    //        clickDropdownToggle( elm );
    //        expect(elm).not.toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('should not toggle if the element is disabled', function() {
    //        var el = '<fugu-dropdown disabled btn-value="第二项">'+
    //            '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
    //            '</fugu-dropdown>';
    //        var elm = compile(angular.element(el))(scope);
    //        scope.$apply();
    //        clickDropdownToggle( elm );
    //        expect(elm).not.toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('should not toggle if the element has `ng-disabled` as true', function() {
    //        rootScope.isdisabled = true;
    //        var el = '<fugu-dropdown ng-disabled="isdisabled" btn-value="第二项">'+
    //            '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
    //            '</fugu-dropdown>';
    //        var elm = compile(angular.element(el))(scope);
    //        scope.$apply();
    //        rootScope.$digest();
    //        clickDropdownToggle( elm );
    //        expect(elm).not.toHaveClass(dropdownConfig.openClass);
    //
    //        rootScope.isdisabled = false;
    //        rootScope.$digest();
    //        clickDropdownToggle( elm );
    //        expect(elm).toHaveClass(dropdownConfig.openClass);
    //    });
    //
    //    it('executes other document click events normally', function() {
    //        var checkboxEl = compile('<input type="checkbox" ng-click="clicked = true" />')(scope);
    //        scope.$apply();
    //        rootScope.$digest();
    //
    //        expect(element).not.toHaveClass(dropdownConfig.openClass);
    //        expect(scope.clicked).toBeFalsy();
    //
    //        clickDropdownToggle();
    //        expect(element).toHaveClass(dropdownConfig.openClass);
    //        expect(scope.clicked).toBeFalsy();
    //
    //        checkboxEl.click();
    //        expect(scope.clicked).toBeTruthy();
    //    });
    //});
    //describe('multi col dropdown', function () {
    //    it('should not be multi col', function () {
    //        var html = '<fugu-dropdown btn-value="第二项">'+
    //            '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
    //            '</fugu-dropdown>';
    //        var ele = compile(html)(scope);
    //        scope.$apply();
    //        expect(ele).not.toHaveClass(dropdownConfig.multiColClass);
    //    });
    //
    //    it('should have multi col class', function () {
    //        var html = '<fugu-dropdown btn-value="第二项">'+
    //            '<fugu-dropdown-choices title="第一项">第一项</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
    //            '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
    //            '</fugu-dropdown>';
    //        var ele = compile(html)(scope);
    //        scope.$apply();
    //        expect(ele).toHaveClass(dropdownConfig.multiColClass);
    //    });
    //});
});