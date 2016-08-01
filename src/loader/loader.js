/**
 * loader
 * 加载Loading指令
 * Author:heqingyang@meituan.com
 * Date:2016-07-29
 */
angular.module('ui.xg.loader', [])
    .controller('uixLoaderCtrl', ['$scope', '$timeout', '$element', '$window',
        function ($scope, $timeout, $element, $window) {

            var $ = angular.element;
            var windowHeight = $($window).height();
            var footerHeight = parseInt($('.app-footer').css('height'), 10) || 0;
            var height = parseInt($scope.loaderHeight, 10) || windowHeight - footerHeight - $element.offset().top;

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
                    });
                }
            });
            function timeoutHandle(startTimer, endTimer, callback) {
                var timer;
                if((endTimer - startTimer) < 1000) {
                    timer = 1000;
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
                loaderHeight: '@'
            },
            controller: 'uixLoaderCtrl',
            controllerAs: 'loader'
        };
    });
