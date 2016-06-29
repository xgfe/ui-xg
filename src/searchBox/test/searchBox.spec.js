describe('uix-search-box', function () {
    var compile, // 编译模板
        scope, // 新创建的scope，编译的html所在的scope
        searchBoxConfig, //searchBox的常量配置
        element;    //指令DOM结点
    beforeEach(function () {
        module('ui.xg.searchBox');
        module('searchBox/templates/searchBox.html');
        inject(function( $compile, $rootScope, uixSearchBoxConfig) {
            compile = $compile;
            scope = $rootScope.$new();
            searchBoxConfig = uixSearchBoxConfig;
        });
    });
    afterEach(function() {
        element.remove();
    });
    function createSearchBox(el){
        element = compile(el)(scope);
        scope.$digest();
    }
    it('should render a normal search box', function () {
        var el = '<uix-search-box ng-model="query"></uix-search-box>';
        createSearchBox(el);
        expect(element.hasClass('input-group')).toBe(true);
        expect(element.find('input').length).toBe(1);
        expect(element.find('button').length).toBe(1);
    });

    it('should have a default button text', function () {
        var el = '<uix-search-box ng-model="query"></uix-search-box>';
        createSearchBox(el);
        expect(element.find('button').text()).toBe(searchBoxConfig.btnText);
    });

    it('should set button text', function () {
        var el = '<uix-search-box ng-model="query" btn-text="Search"></uix-search-box>';
        createSearchBox(el);
        expect(element.find('button').text()).toBe('Search');
        el = '<uix-search-box ng-model="query" btn-text="{{text}}"></uix-search-box>';
        scope.text = 'customText';
        createSearchBox(el);
        expect(element.find('button').text()).toBe(scope.text);
    });

    it('should not have a default placeholder', function () {
        var el = '<uix-search-box ng-model="query"></uix-search-box>';
        createSearchBox(el);
        expect(element.find('input').attr('placeholder')).toBe('');
    });

    it('should have a placeholder', function () {
        var el = '<uix-search-box ng-model="query" placeholder="{{placeholder}}"></uix-search-box>';
        scope.placeholder = '搜索文本框';
        createSearchBox(el);
        expect(element.find('input').attr('placeholder')).toBe(scope.placeholder);
    });

    it('should not show button when "show-btn" set to be false', function () {
        var el = '<uix-search-box ng-model="query" show-btn="show"></uix-search-box>';
        scope.show = false;
        createSearchBox(el);
        expect(element.find('button').length).toBe(0);
    });

    it('ngModel should work', function () {
        var el = '<uix-search-box ng-model="search"></uix-search-box>';
        scope.search = 'text';
        createSearchBox(el);
        expect(element.find('input').val()).toBe(scope.search);

        scope.search = 'change text';
        scope.$digest();
        expect(element.find('input').val()).toBe(scope.search);
    });

    it('click button should trigger "search" function', function () {
        var el = '<uix-search-box search="searchHandler()" ng-model="search"></uix-search-box>';
        scope.searchHandler = jasmine.createSpy('searchHandler');
        createSearchBox(el);
        element.find('button').click();
        expect(scope.searchHandler).toHaveBeenCalled();
    });

    it('press "enter" key should trigger "search" function', function () {
        var el = '<uix-search-box search="searchHandler()" ng-model="search"></uix-search-box>';
        scope.searchHandler = jasmine.createSpy('searchHandler');
        createSearchBox(el);

        var input = element.find('input');
        var evt = $.Event("keyup");
        evt.keyCode = 13;
        input.trigger(evt);

        expect(scope.searchHandler).toHaveBeenCalled();
    });

});