describe('ui.xg.carousel', function () {
    var compile,
        scope,
        element,
        timeout;


    function defaultItems() {
        var items = [
            {
                content: 1,
                index: 0,
                active: false
            },
            {
                content: 1,
                index: 1,
                active: true
            },
            {
                content: 1,
                index: 2,
                active: false
            }
        ];
        return items;
    }

    // beforeEach(module('ui.xg.transition'));
    beforeEach(module('ui.xg.carousel'));
    beforeEach(module('ngMock'));
    beforeEach(module('ngAnimateMock'));
    beforeEach(module('carousel/templates/carousel.html'));
    beforeEach(module('carousel/templates/carousel-item.html'));

    beforeEach(function () {
        inject(function ($compile, $rootScope, $timeout) {
            timeout = $timeout;
            compile = $compile;
            scope = $rootScope.$new();

            scope.interval = 1000;
            scope.active = 0;
            scope.noLoop = true;
            scope.noPause = true;
            scope.noTransition = true;

            scope.items = defaultItems();
        });
    });
    afterEach(function () {
        element.remove();
    });

    function createCarousel() {

        var el = '<uix-carousel interval="interval" no-loop="noLoop" no-pause="noPause" no-transition="noTransition">' +
            '<div uix-carousel-item  ng-repeat="item in items" index="item.index" active="item.active">' +
            '{{item.content}}' +
            '</div>' +
            '</uix-carousel>';
        element = compile(el)(scope);
        scope.$digest();
    }

    function testActive(index) {
        for (var i = 0; i < scope.items.length; i++) {

            var item = scope.items[i];
            if (index === item.index) {
                expect(item.active).toBe(true);
            } else {
                expect(item.active).not.toBe(true);
            }
        }
        return true;
    }

    describe('DOM style', function () {
        it('have uix-carousel class', function () {
            createCarousel();
            expect(element).toHaveClass('uix-carousel');
        });

        it('uix-carousel-item list : 3', function () {
            var items = element.find('.uix-carousel-item');
            expect(items.length).toEqual(3);
        });

        it('should show navigation when there are 3 slides', function () {
            var navs = element.find('ol>li');
            expect(navs.length).not.toBe(0);

            var navNext = element.find('a.right');
            expect(navNext.length).not.toBe(0);

            var navPrev = element.find('a.left');
            expect(navPrev.length).not.toBe(0);
        });
    });

    describe('only one item', function () {

        beforeAll(function () {
            scope.items = [defaultItems()[0]];
            createCarousel();
        });

        it('should hide navigation when only one slide', function () {
            var navs = element.find('ol>li');
            expect(navs.length).toBe(0);

            var navNext = element.find('a.right');
            expect(navNext.length).toBe(0);

            var navPrev = element.find('a.left');
            expect(navPrev.length).toBe(0);
        });
    });

    describe('click event', function () {
        var originalTimeout;
        beforeEach(function () {
            scope.items = defaultItems();
            createCarousel();
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 3000;
        });

        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        });

        it('right click', function () {
            var navNext = element.find('a.carousel-control.right');
            testActive(1);
            navNext.click();
            testActive(2);
            navNext.click();
            testActive(0);
            navNext.click();
            testActive(1);
        });

        it('left click', function () {
            var navPrev = element.find('a.carousel-control.left');
            testActive(1);
            navPrev.click();
            testActive(0);
            navPrev.click();
            testActive(2);
            navPrev.click();
            testActive(1);
        });

        it('loop', function () {
            // scope.noTransition = false;
            scope.noLoop = false;
            scope.$digest();
            testActive(1);
            timeout.flush(scope.interval);
            testActive(2);
            timeout.flush(scope.interval);
            testActive(0);
            timeout.flush(scope.interval);
            testActive(1);
        });

        it('loop animation', function () {
            scope.noTransition = false;
            scope.noLoop = false;
            scope.$digest();
            testActive(1);
            timeout.flush(scope.interval);
            timeout.flush(50);

        });
    });

    describe('remove item', function () {
        beforeEach(function () {
            scope.items = defaultItems();
            createCarousel();
        });

        it('remove 2', function () {
            testActive(1);
            scope.items.splice(1, 1);
            scope.$digest();
            testActive(2);
        });

        // it('remove animate now',function () {
        // 	var navNext = element.find('a.carousel-control.right');
        //
        // 	testActive(1);
        // 	scope.noTransition = false;
        // 	scope.$digest();
        // 	navNext.click();
        // 	scope.items.splice(1,1);
        // 	scope.$digest();
        // 	testActive(2);
        // });
    });

    describe('mousehover', function () {
        beforeEach(function () {
            scope.items = defaultItems();
            createCarousel();
        });

        it('noPause', function () {
            scope.noLoop = false;
            scope.$digest();

            element.trigger('mouseenter');

            testActive(1);
            timeout.flush(scope.interval);
            testActive(2);
            element.trigger('mouseleave');

        });

        it('pause', function () {
            scope.noPause = false;
            scope.noLoop = false;
            scope.$digest();
            element.trigger('mouseenter');

            testActive(1);
            timeout.flush(scope.interval);
            testActive(1);
            element.trigger('mouseleave');
            timeout.flush(scope.interval);
            testActive(2);
        });
    });

});
