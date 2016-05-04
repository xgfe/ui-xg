describe('fugu-dropdown', function () {

    var compile, // 编译模板
        scope, // 新创建的scope，编译的html所在的scope
        rootScope,
        $timeout,
        document,
        dropdownConfig, //dropdown的常量配置
        element,    //指令DOM结点
        dropdownProvider,   //provider配置
        fuguDropdownProvider; //provider获取
    beforeEach(function () {
        module('ui.fugu.dropdown', ['fuguDropdownProvider',function (fuguDropdownProvider) {
            dropdownProvider = fuguDropdownProvider;
        }]);
        module('dropdown/templates/dropdown.html');
        module('dropdown/templates/dropdown-choices.html');
        inject(function( $compile, $rootScope, _$window_,$document, fuguDropdownConfig,fuguDropdown,_$timeout_) {
            compile = $compile;
            scope = $rootScope.$new();
            rootScope = $rootScope;
            document = $document;
            dropdownConfig = fuguDropdownConfig;
            fuguDropdownProvider = fuguDropdown;
            $timeout = _$timeout_;
        })
    });
    afterEach(function() {
        element.remove();
    });
    var clickDropdownToggle = function(elm,open) {
        elm = elm || element;
        elm.find('.fugu-dropdown-toggle').click();
        if(open){
            $timeout.flush(10);
        }
    };
    describe('basic', function () {
        function createDropdown(){
            var ele = compile(angular.element('<fugu-dropdown>'+
                '<button fugu-dropdown-toggle type="button" class="btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>'))(scope);
            scope.$apply();
            return ele;
        }

        beforeEach(function () {
            element = createDropdown();
            scope.$apply();
        });

        it('should toggle on button click', function() {
            expect(element).not.toHaveClass(dropdownConfig.openClass);
            clickDropdownToggle(null,true);
            expect(element).toHaveClass(dropdownConfig.openClass);
            clickDropdownToggle();
            expect(element).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should toggle when an option is clicked', function() {
            document.find('body').append(element);
            expect(element).not.toHaveClass(dropdownConfig.openClass);
            clickDropdownToggle(null,true);
            expect(element).toHaveClass(dropdownConfig.openClass);

            var optionEl = element.find('ul > li').eq(0).find('a').eq(0);
            optionEl.click();
            expect(element).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should close on document click', function() {
            clickDropdownToggle(null,true);
            expect(element).toHaveClass(dropdownConfig.openClass);
            document.click();
            expect(element).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should close on $location change', function() {
            clickDropdownToggle(null,true);
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

            clickDropdownToggle( elm1 ,true);
            expect(elm1).toHaveClass(dropdownConfig.openClass);
            expect(elm2).not.toHaveClass(dropdownConfig.openClass);

            clickDropdownToggle( elm2 ,true);
            expect(elm1).not.toHaveClass(dropdownConfig.openClass);
            expect(elm2).toHaveClass(dropdownConfig.openClass);
        });

        it('should not toggle if the element has `disabled` class', function() {
            var el = '<fugu-dropdown>'+
                '<button fugu-dropdown-toggle type="button" class="disabled btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var elm = compile(angular.element(el))(scope);
            scope.$apply();
            clickDropdownToggle( elm );
            expect(elm).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should not toggle if the element is disabled', function() {
            var el = '<fugu-dropdown>'+
                '<button fugu-dropdown-toggle disabled type="button" class="btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第一个">第一个</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var elm = compile(angular.element(el))(scope);
            scope.$apply();
            clickDropdownToggle( elm );
            expect(elm).not.toHaveClass(dropdownConfig.openClass);
        });

        it('should not toggle if the element has `ng-disabled` as true', function() {
            rootScope.isdisabled = true;
            var el = '<fugu-dropdown>'+
                '<button fugu-dropdown-toggle ng-disabled="isdisabled" type="button" class="btn btn-sm btn-primary">第二项</button>'+
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

            clickDropdownToggle(null, true);
            expect(element).toHaveClass(dropdownConfig.openClass);
            expect(scope.clicked).toBeFalsy();

            checkboxEl.click();
            expect(scope.clicked).toBeTruthy();
        });
    });
    describe('multi col dropdown', function () {
        it('should not be multi col', function () {
            var html = '<fugu-dropdown btn-value="第二项">'+
                '<button fugu-dropdown-toggle type="button" class="btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var ele = compile(html)(scope);
            scope.$apply();
            expect(ele).not.toHaveClass(dropdownConfig.multiColClass);
        });

        it('should have multi col class', function () {
            var html = '<fugu-dropdown>'+
                '<button fugu-dropdown-toggle type="button" class="btn btn-sm btn-primary">第二项</button>'+
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
        it('dropdown list width shoule be 3*dropdownConfig.eachItemWidth', function () {
            var html = '<fugu-dropdown>'+
                '<button fugu-dropdown-toggle type="button" class="btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第一项">第一项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var ele = compile(html)(scope);
            scope.$apply();
            expect(ele.find('.fugu-dropdown-menu').css('width')).toBe(fuguDropdownProvider.getColsNum() * dropdownConfig.eachItemWidth + 'px');
        });
        it('should have default multi col num when set colsNum', function () {
            dropdownProvider.setColsNum();
            var html = '<fugu-dropdown>'+
                '<button fugu-dropdown-toggle type="button" class="btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第一项">第一项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var ele = compile(html)(scope);
            scope.$apply();
            expect(fuguDropdownProvider.getColsNum()).toBe(3);
            var width = ele.find('.fugu-dropdown-menu > li').css('width');
            expect(parseFloat(width).toFixed(3)).toEqual((100/3).toFixed(3));
        });
        it('should not have multi col class when set colsNum to be 5', function () {
            dropdownProvider.setColsNum(5);
            var html = '<fugu-dropdown>'+
                '<button fugu-dropdown-toggle type="button" class="btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第一项">第一项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var ele = compile(html)(scope);
            scope.$apply();
            expect(ele).not.toHaveClass(dropdownConfig.multiColClass);
        });
        it('should have multi col class when set colsNum attr to be 1', function () {
            var html = '<fugu-dropdown cols-num="1">'+
                '<button fugu-dropdown-toggle type="button" class="btn btn-sm btn-primary">第二项</button>'+
                '<fugu-dropdown-choices title="第一项">第一项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="第二项">第二项</fugu-dropdown-choices>'+
                '<fugu-dropdown-choices title="fugu-dropdown">fugu-dropdown</fugu-dropdown-choices>'+
                '</fugu-dropdown>';
            var ele = compile(html)(scope);
            scope.$apply();
            expect(ele).toHaveClass(dropdownConfig.multiColClass);
            expect(ele.find('.fugu-dropdown-menu > li').css('width')).toBe('100%');
        });
    });
});