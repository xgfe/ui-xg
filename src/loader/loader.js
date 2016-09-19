/**
 * loader
 * 加载Loading指令
 * Author:heqingyang@meituan.com
 * Date:2016-07-29
 */
angular.module('ui.xg.loader', [])

    .provider('uixLoader', function () {
        var loadingTime = 300;
        this.setLoadingTime = function (num) {
            loadingTime = angular.isNumber(num) ? num : 300;
        };
        this.$get = function () {
            return {
                getLoadingTime: function () {
                    return loadingTime;
                }
            };
        };
    })

    .controller('uixLoaderCtrl', ['$scope', '$timeout', '$element', '$window', 'uixLoader',
        function ($scope, $timeout, $element, $window, uixLoader) {

            var $ = angular.element;
            var windowHeight = $($window).height();
            var footerHeight = parseInt($('.app-footer').css('height'), 10) || 0;
            var height = parseInt($scope.loaderHeight, 10) || windowHeight - footerHeight - $element.offset().top;
            var width = $scope.loaderWidth;
            var loadingTime = parseInt($scope.loadingTime, 10) || uixLoader.getLoadingTime();

            var loadingTpl = $('<div class="loading">' +
                '<i class="fa fa-spin fa-spinner loading-icon"></i>' +
                '</div>');
            var errorTipTpl = $('<div class="error-tip">' +
                '<span class="error-text">数据加载失败! </span>' +
                '</div>');
            var startTimer, endTimer;
            $element.parent().addClass('uix-loader');
            $scope.$watch('uixLoader', function (newValue) {

                if(newValue === 1) {
                    startTimer = new Date().getTime();
                    errorTipTpl.hide();
                    $element.hide().after(loadingTpl);
                    loadingTpl.css('height', height);
                    if(width) {
                        loadingTpl.css('width', width);
                    }
                } else
                if(newValue === 0) {
                    endTimer = new Date().getTime();
                    timeoutHandle(startTimer, endTimer, function () {
                        loadingTpl.remove();
                        $element.show();
                    });
                } else
                if(newValue === -1) {
                    endTimer = new Date().getTime();
                    timeoutHandle(startTimer, endTimer, function () {
                        loadingTpl.remove();
                        $element.after(errorTipTpl);
                        errorTipTpl.show();
                        errorTipTpl.css('height', height);
                        if(width) {
                            loadingTpl.css('width', width);
                        }
                    });
                }
            });
            function timeoutHandle(startTimer, endTimer, callback) {
                var timer;
                if((endTimer - startTimer) < loadingTime) {
                    timer = loadingTime;
                } else {
                    timer = 0;
                }
                $timeout(callback, timer);
            }
        }])
    .directive('uixLoader', function () {
        return {
            restrict: 'A',
            scope: {
                uixLoader: '=',
                loaderHeight: '@',
                loaderWidth: '@',
                loadingTime: '@'
            },
            controller: 'uixLoaderCtrl',
            controllerAs: 'loader'
        };
    });
