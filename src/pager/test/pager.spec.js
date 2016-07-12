describe('uix-pager', function () {

    var compile, scope, pagerConfig, element;

    beforeEach(module('ui.xg.pager'));
    beforeEach(module('pager/templates/pager.html'));

    beforeEach(inject(function( $compile,$rootScope, uixPagerConfig) {
        compile = $compile;
        scope = $rootScope.$new();
        pagerConfig = uixPagerConfig;
    }));
    afterEach(function() {
        element.remove();
    });

    //获取分页数量
    function getPaginationBarSize() {
        return element.find('li').length;
    }
    //获取第几个分页
    function getPaginationEl(index) {
        return element.find('li').eq(index);
    }
    //点击分页
    function clickPaginationEl(index) {
        getPaginationEl(index).find('a').click();
    }
    //更新当前的页码
    function updateCurrentPage(value) {
        scope.pageNo = value;
        scope.$digest();
    }
    function createPager(){
        var el = "<uix-pager total-items='total' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        element = compile(el)(scope);
        scope.$digest();
    }

    it('has a "pagination" css class', function() {
        createPager();
        expect(element.hasClass('pagination')).toBe(true);
    });

    it('contains 8 li elements', function() {
        createPager();
        expect(getPaginationBarSize()).toBe(8);
        expect(getPaginationEl(2)).toHaveClass('active');
        expect(getPaginationEl(0).text().trim()).toEqual(pagerConfig.firstText);
        expect(getPaginationEl(-3).text().trim()).toEqual(pagerConfig.nextText);
    });

    it('disables the "previous" and "first" link if current page is 1', function() {
        createPager();
        updateCurrentPage(1);
        expect(getPaginationEl(0)).toHaveClass('disabled');
        expect(getPaginationEl(1)).toHaveClass('disabled');
    });

    it('disables the "next" and "last" link if current page is num-pages', function() {
        scope.selectPageHandler = jasmine.createSpy('selectPageHandler');
        var el = "<uix-pager total-items='total' ng-change='selectPageHandler()' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        element = compile(el)(scope);
        scope.$apply();
        updateCurrentPage(3);
        expect(getPaginationEl(-1)).toHaveClass('disabled');
        expect(getPaginationEl(-2)).toHaveClass('disabled');
        expect(getPaginationEl(-3)).toHaveClass('disabled');
    });

    it('changes currentPage if the "previous" link is clicked', function() {
        scope.selectPageHandler = jasmine.createSpy('selectPageHandler');
        var el = "<uix-pager total-items='total' ng-change='selectPageHandler()' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        element = compile(el)(scope);
        scope.$apply();
        updateCurrentPage(3);
        clickPaginationEl(1);
        expect(getPaginationEl(3)).toHaveClass('active');
    });

    it('changes currentPage if the "next" link is clicked', function() {
        createPager();
        clickPaginationEl(-3);
        expect(getPaginationEl(3)).toHaveClass('active');
    });

    it('changes currentPage if the "first" link is clicked', function() {
        createPager();
        updateCurrentPage(3);
        clickPaginationEl(0);
        expect(getPaginationEl(2)).toHaveClass('active');
    });

    it('changes currentPage if the "last" link is clicked', function() {
        createPager();
        clickPaginationEl(-2);
        expect(getPaginationEl(4)).toHaveClass('active');
    });
    it('should not changes currentPage when is last page if the "last" or "next" link is clicked', function() {
        scope.selectPageHandler = jasmine.createSpy('selectPageHandler');
        var el = "<uix-pager total-items='total' ng-change='selectPageHandler()' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 3;
        element = compile(el)(scope);
        scope.$apply();
        clickPaginationEl(-2);
        expect(scope.selectPageHandler).not.toHaveBeenCalled();
        clickPaginationEl(-3);
        expect(scope.selectPageHandler).not.toHaveBeenCalled();
    });
    it('should not changes currentPage when is first page if the "first" or "prev" link is clicked', function() {
        scope.selectPageHandler = jasmine.createSpy('selectPageHandler');
        var el = "<uix-pager total-items='total' ng-change='selectPageHandler()' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        element = compile(el)(scope);
        scope.$apply();
        clickPaginationEl(0);
        expect(scope.selectPageHandler).not.toHaveBeenCalled();
        clickPaginationEl(1);
        expect(scope.selectPageHandler).not.toHaveBeenCalled();
    });

    it('executes the `page-changed` expression when an element is clicked', function() {
        scope.selectPageHandler = jasmine.createSpy('selectPageHandler');
        var el = "<uix-pager total-items='total' ng-change='selectPageHandler()' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        element = compile(el)(scope);
        scope.$apply();
        clickPaginationEl(-2);
        expect(scope.selectPageHandler).toHaveBeenCalled();
    });

    it('changes the number of pages when `total-items` changes', function() {
        createPager();
        scope.total = 73; // 4 pages
        scope.$digest();

        expect(getPaginationBarSize()).toBe(9);
    });

    it('does not changes the number of pages when `items-pre-page` changes', function() {
        var el = "<uix-pager items-per-page='perPage' total-items='total' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        scope.perPage = 30;
        element = compile(el)(scope);
        scope.$apply();
        expect(getPaginationBarSize()).toBe(7);
        scope.perPage = 20;
        scope.$digest();
        expect(getPaginationBarSize()).toBe(8);
    });

    it('should change "page-no" in scope when "page-no" attr has changed', function() {
        var el = "<uix-pager total-items='total' ng-model='pageNo'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        element = compile(el)(scope);
        scope.$apply();
        expect(getPaginationEl(2)).toHaveClass('active');
        clickPaginationEl(-3);
        expect(getPaginationEl(3)).toHaveClass('active');
        expect(scope.pageNo).toBe(2);
    });


    it('use custom text on button', function() {
        var el = "<uix-pager total-items='total' ng-model='pageNo' first-text='{{firstText}}' last-text='Last' previous-text='Previous' next-text='Next'></uix-pager>";
        scope.total = 50;
        scope.pageNo = 1;
        scope.firstText = 'First';
        element = compile(el)(scope);
        scope.$apply();
        expect(getPaginationEl(0).text().trim()).toBe('First');
        expect(getPaginationEl(1).text().trim()).toBe('Previous');
        expect(getPaginationEl(-2).text().trim()).toBe('Last');
        expect(getPaginationEl(-3).text().trim()).toBe('Next');
    });

    it('set maxSize', function() {
        var el = "<uix-pager total-items='total' ng-model='pageNo' max-size='listSize'></uix-pager>";
        scope.total = 150;
        scope.pageNo = 1;
        scope.listSize = 4;
        element = compile(el)(scope);
        scope.$apply();
        expect(getPaginationBarSize()).toBe(9);
    });
    it('should keep current page in the middle of the visible ones.', function() {
        var el = "<uix-pager total-items='total' ng-model='pageNo' max-size='listSize'></uix-pager>";
        scope.total = 90;
        scope.pageNo = 1;
        scope.listSize = 3;
        element = compile(el)(scope);
        scope.$apply();
        expect(getPaginationBarSize()).toBe(8);
        expect(getPaginationEl(2)).toHaveClass('active');
        expect(getPaginationEl(2).text().trim()).toBe('1');
        clickPaginationEl(-3);
        expect(getPaginationEl(3)).toHaveClass('active');
        expect(getPaginationEl(3).text().trim()).toBe('2');
        clickPaginationEl(-3);
        expect(getPaginationEl(3).text().trim()).toBe('3');
        clickPaginationEl(-3);
        expect(getPaginationEl(3).text().trim()).toBe('4');
        clickPaginationEl(-3);
        expect(getPaginationEl(3)).not.toHaveClass('active');
        expect(getPaginationEl(4)).toHaveClass('active');
        expect(getPaginationEl(4).text().trim()).toBe('5');
    });
    it('should get uixPager:pageChanged event', function (done) {
        scope.$on('uixPager:pageChanged', function (event, args) {
            event.stopPropagation();
            expect(args).toBe(2);
            done();
        });
        createPager();
        clickPaginationEl(3);
    });

});