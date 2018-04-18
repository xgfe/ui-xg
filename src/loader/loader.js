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
        '$document', function ($scope, $timeout, $element, $window, uixLoader, $document) {

            var $ = angular.element;
            var windowHeight = $window.clientHeight;
            var footerHeight = parseInt($document.find('#app-footer').css('height'), 10) || 0;
            var tempHeight = windowHeight - footerHeight - $element[0].offsetTop;
            var height = parseInt($scope.loaderHeight, 10) || (tempHeight > 300) ? 300 : tempHeight;
            var width = $scope.loaderWidth;
            var loadingTime = parseInt($scope.loadingTime, 10) || uixLoader.getLoadingTime();
            var displayType = $element.css('display');

            var loadingTpl = $('<div class="loading">' +
                '<i class="fa fa-spin fa-spinner loading-icon"></i>' +
                '</div>');
            var errorTipTpl = $('<div class="error-tip">' +
                '<span class="error-text">数据加载失败! </span>' +
                '</div>');
            var emptyTipTpl = $('<div class="error-tip">' +
                '<span class="error-text empty-text">数据为空！</span>' +
                '</div>');
            var startTimer, endTimer;
            $element.parent().addClass('uix-loader');
            $scope.$watch('uixLoader', function (newValue) {

                if(newValue === 1) {
                    startTimer = new Date().getTime();
                    errorTipTpl.css('display', 'none');
                    emptyTipTpl.css('display', 'none');
                    $element.css('display', 'none').after(loadingTpl);
                    loadingTpl.css('height', height);
                    if(width) {
                        loadingTpl.css('width', width);
                    }
                } else
                if(newValue === 0) {
                    endTimer = new Date().getTime();
                    if(startTimer) {
                        timeoutHandle(startTimer, endTimer, function () {
                            errorTipTpl.remove();
                            emptyTipTpl.remove();
                            loadingTpl.remove();
                            $element.css('display', displayType);
                        });
                    }
                } else
                if (newValue === 2) {
                    endTimer = new Date().getTime();
                    if (startTimer) {
                        timeoutHandle(startTimer, endTimer, function () {
                            loadingTpl.remove();
                            errorTipTpl.remove();
                            $element.css('display', 'none').after(emptyTipTpl);
                            emptyTipTpl.css('display', displayType);
                            emptyTipTpl.css('height', height);
                            if (width) {
                                emptyTipTpl.css('width', width);
                            }
                        });
                    }
                } else
                if(newValue === -1) {
                    endTimer = new Date().getTime();
                    if(startTimer) {
                        timeoutHandle(startTimer, endTimer, function () {
                            loadingTpl.remove();
                            emptyTipTpl.remove();
                            $element.css('display', 'none').after(errorTipTpl);
                            errorTipTpl.css('display', displayType);
                            errorTipTpl.css('height', height);
                            if(width) {
                                loadingTpl.css('width', width);
                            }
                        });
                    }
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
