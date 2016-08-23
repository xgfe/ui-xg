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

        var transition = null;
        var transitionRemove = {
            list: [],
            done: function () {
                var itemList = $scope.itemList;

                // 双重循环,一个一个的删
                for (var i = 0; i < this.list.length; i++) {
                    for (var j = 0; j < itemList.length; j++) {
                        if (this.list[i] === itemList[j]) {
                            nextShow();
                            itemList.splice(j, 1);
                            break;
                        }
                    }
                }
            }
        };

        this.addItem = function (scope, ele, active) {
            $scope.itemList.push({scope: scope, ele: ele});

            if (active === true) {
                $scope.index = scope.index;
            }

            // 如果用户没传值,则默认第一个为初始显示
            if ($scope.index === angular.isUndefined) {
                $scope.index = scope.index;
            }

            // 设置默认显示
            if (scope.index === $scope.index) {

                // 防止多个item设置active
                for (var i = 0; i < $scope.itemList.length - 1; i++) {
                    $scope.itemList[i].ele.removeClass('active');
                    $scope.itemList[i].scope.active = false;
                }

                ele.addClass('active');
                $scope.indexNumber = $scope.itemList.length - 1;
                $scope.currentItem = $scope.itemList[$scope.indexNumber];
            }

            // 触发一次
            $scope.loop();

        };

        this.removeItem = function (scope, ele) {

            if (transition) {
                transition.cancel();
                transition = null;
            }

            var itemList = $scope.itemList;
            for (var i = 0; i < itemList.length; i++) {
                var item = itemList[i];

                if (item.scope === scope && item.ele === ele) {

                    // 需要判断当前item是否含有 active,prev,next。如果有证明当前或者即将显示自己,需要挪到下一帧

                    if (scope.active === true) {
                        $scope.indexNumber = i;
                        nextShow();
                        itemList.splice(i, 1);
                    } else if (ele.hasClass('prev') || ele.hasClass('next')) {

                        // 证明还在动画效果中,加入列表等待动画结束后删除
                        transitionRemove.list.push(item);
                    } else {

                        // 直接删除
                        itemList.splice(i, 1);
                    }

                    return true;
                }
            }
        };


        function nextShow() {

            // 当前显示状态,把active挪到下一帧
            var noTransition = $scope.noTransition;
            $scope.noTransition = true;
            $scope.next();
            $scope.noTransition = noTransition;
        }


        // 点击更换次序
        $scope.change = function (oldNum, newNum) {

            if (transition !== null) {

                // 还在动画效果中,禁止点击
                return true;
            }

            if (oldNum === newNum) {
                $scope.itemList[oldNum].active = true;
                $scope.itemList[oldNum].ele.addClass('active');
                return true;
            }

            $scope.killLoop();

            $scope.indexNumber = newNum;

            var oldItem = $scope.itemList[oldNum];
            var newItem = $scope.itemList[newNum];

            oldItem.scope.active = false;
            newItem.scope.active = true;

            if ($scope.noTransition === true) {

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
            transitionRemove.done();
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
                var interval = parseInt(scope.interval, 10);
                interval = isNaN(interval) ? 0 : interval;
                scope.interval = interval;


                scope.$watch('noLoop', function (newValue) {

                    if (newValue === true) {
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
        };
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

                scope.$on('$destroy', function () {
                    carouselCtrl.removeItem(scope, el);
                });
            }
        };
    });
