describe('ui.xg.carousel', function () {
	var compile,
		scope,
		element;

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

	beforeEach(function () {
		module('ui.xg.transition');
		module('ui.xg.carousel');
		module('carousel/templates/carousel.html');
		module('carousel/templates/carousel-item.html');
		inject(function ($compile, $rootScope) {
			compile = $compile;
			scope = $rootScope.$new();

			scope.interval = 1000;
			scope.active = 0;
			scope.noLoop = true;
			scope.noPause = true;
			scope.noTransition = true;

			scope.items = items;
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
		for(var i=0;i<scope.items;i++){

			var item = scope.items[i];
			if(index === i){
				expect(item.active).toBe(true);
			}else {
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
			scope.items = [items[0]];
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

		beforeAll(function () {
			scope.items = items;
			createCarousel();
		});


		it('right click', function () {
			var navNext = element.find('a.right');
			testActive(0);
			navNext.click();
			testActive(1);
			navNext.click();
			testActive(2);
			navNext.click();
			testActive(0);
		});

		it('left click',function(){
			var navPrev = element.find('a.left');
			testActive(0);
			navPrev.click();
			testActive(2);
			navPrev.click();
			testActive(1);
			navPrev.click();
			testActive(0);
		});
	});

});