/**
 * carousel
 * carousel directive
 * Author: your_email@gmail.com
 * Date:2016-08-05
 */
angular.module('ui.xg.carousel', ['ui.xg.transition'])
	.controller('uixCarouselCtrl', ['$scope', '$timeout', '$uixTransition', function ($scope, $timeout, $uixTransition) {

		$scope.itemList = [];
		$scope.indexNumber = 0;
		$scope.currentItem = null;
		$scope.pause = false;

		this.addItem = function (scope, ele, active) {
			$scope.itemList.push({scope: scope, ele: ele});

			if (!!active) {
				$scope.index = scope.index;
			}

			// 如果用户没传值,则默认第一个为初始显示
			if ($scope.index === undefined) {
				$scope.index = scope.index;
			}

			// 设置默认显示
			if (scope.index === $scope.index) {

				// 防止多个item设置active
				for (var i = 0; i < $scope.itemList.length - 1; i++) {
					$scope.itemList[i].ele.removeClass('active');
				}

				ele.addClass('active');
				$scope.indexNumber = $scope.itemList.length - 1;
				$scope.currentItem = $scope.itemList[$scope.indexNumber];
			}

		};

		var transition = null;
		// 点击更换次序
		$scope.change = function (oldNum, newNum) {

			if (transition !== null) {

				// 还在动画效果中,禁止点击
				return true;
			}

			$scope.killLoop();

			$scope.indexNumber = newNum;

			var oldItem = $scope.itemList[oldNum];
			var newItem = $scope.itemList[newNum];

			if (!!$scope.noTransition) {

				// 无动画效果
				oldItem.ele.removeClass('active');
				newItem.ele.addClass('active');

				$scope.loop();
				return true;
			}

			var nextCss = 'next';
			var animateCss = 'left';

			if (oldNum > newNum) {
				nextCss = 'prev';
				animateCss = 'right';
			}


			// 加个timeout,让下一个item先就位,否则会出现无动画现象
			newItem.ele.addClass(nextCss);

			$timeout(function () {

				// 监听oldItem
				transition = $uixTransition(oldItem.ele, animateCss);
				newItem.ele.addClass(animateCss);

				transition.then(function () {
					transitionDone(oldItem, newItem, nextCss, animateCss);
				}, function () {
					transitionDone(oldItem, newItem, nextCss, animateCss);
				});

				// 这里的50ms是用来防止chrome同时加入class丢失动画

			}, 50);


		};

		function transitionDone(oldItem, newItem, nextCss, animateCss) {
			// 更换item显示
			oldItem.ele.removeClass('active');
			oldItem.ele.removeClass(animateCss);
			newItem.ele.removeClass(nextCss);
			newItem.ele.removeClass(animateCss);
			newItem.ele.addClass('active');


			transition = null;
			$scope.loop();
		}

		var timer = null;
		$scope.loop = function () {

			if (!!$scope.noLoop || $scope.pause || $scope.interval === 0) {
				return true;
			}
			// 先kill一次,防止多个定时器出现
			$scope.killLoop();
			timer = $timeout(function () {
				$scope.next();
			}, $scope.interval);
		};

		$scope.killLoop = function () {
			if (timer !== null) {
				$timeout.cancel(timer);
				timer = null;
			}

			return true;
		};

		$scope.next = function () {

			var oldNum = $scope.indexNumber;
			var newNum = 1 + oldNum;

			if (newNum >= $scope.itemList.length) {
				newNum = 0;
			}

			$scope.change(oldNum, newNum);
		};

		$scope.prev = function () {

			var oldNum = $scope.indexNumber;
			var newNum = oldNum - 1;

			if (newNum < 0) {
				newNum = $scope.itemList.length - 1;
			}

			$scope.change(oldNum, newNum);
		};

	}])
	.directive('uixCarousel', function () {
		return {
			restrict: 'AE',
			templateUrl: 'templates/carousel.html',
			replace: true,
			scope: {
				index: '=?active',
				interval: '=?',
				noLoop: '=?',
				noPause: '=?',
				noTransition: '=?'
			},
			controller: 'uixCarouselCtrl',
			controllerAs: 'carouselCtrl',
			transclude: true,
			link: function (scope, ele) {
				var interval = parseInt(scope.interval);
				interval = isNaN(interval) ? 0 : interval;
				scope.interval = interval;


				scope.$watch('noLoop', function (newValue,oldValue) {

					if (!!newValue) {
						scope.killLoop();
					} else {
						scope.noLoop = false;
						scope.loop();
					}

				});

				ele.on('mouseenter', function () {
					if (scope.noPause) {
						return true;
					}
					scope.pause = true;
					scope.killLoop();
				});

				ele.on('mouseleave', function () {
					if (scope.noPause) {
						return true;
					}
					scope.pause = false;
					scope.loop();
				});


			}
		}
	})
	.directive('uixCarouselItem', function () {
		return {
			restrict: 'AE',
			templateUrl: 'templates/carousel-item.html',
			require: '^uixCarousel',
			scope: {
				index: '=',
				active: '=?'
			},
			transclude: true,
			link: function (scope, el, attrs, carouselCtrl) {
				carouselCtrl.addItem(scope, el, scope.active);
				el.addClass('item');
			}
		}
	});
