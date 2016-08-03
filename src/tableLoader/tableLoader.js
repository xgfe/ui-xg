/**
 * tableLoader
 * 表格Loading指令
 * Author:heqingyang@meituan.com
 * Date:2016-08-02
 */
angular.module('ui.xg.tableLoader', [])
    .controller('uixTableLoaderCtrl', ['$scope', '$timeout', '$element', '$window',
        function ($scope, $timeout, $element, $window) {

            var $ = angular.element;
            var tNode = $($element.children());
            var thead = $(tNode[0]);
            var tbody = $(tNode[1]);

            var noThead = $scope.noThead;
            var windowHeight = $($window).height();
            var footerHeight = parseInt($('.app-footer').css('height'), 10) || 0;
            var height = parseInt($scope.loaderHeight, 10) || windowHeight - footerHeight - $element.offset().top;

            var loadingTpl = $('<tbody><tr><td colspan="100%">' +
                '<div class="loading" style="height:' + height + 'px">' +
                '<i class="fa fa-spin fa-spinner loading-icon"></i>' +
                '</div>' +
                '</td></tr></tbody>');
            var errorTipTpl = $('<tbody><tr><td colspan="100%">' +
                '<div class="error-tip" style="height:' + height + 'px">' +
                '<span class="error-text">数据加载失败! </span>' +
                '</div>' +
                '</td></tr></tbody>');
            var startTimer, endTimer;
            $element.addClass('uix-table-loader');
            $scope.$watch('uixTableLoader', function (newValue) {

                if(newValue === 1) {
                    startTimer = new Date().getTime();
                    if(noThead) {
                        thead.hide();
                    }
                    errorTipTpl.remove();
                    loadingTpl.show();
                    tbody.hide().before(loadingTpl);
                } else
                if(newValue === 0) {
                    endTimer = new Date().getTime();
                    timeoutHandle(startTimer, endTimer, function () {
                        if(noThead) {
                            thead.show();
                        }
                        loadingTpl.remove();
                        tbody.show();
                    });
                } else
                if(newValue === -1) {
                    endTimer = new Date().getTime();
                    timeoutHandle(startTimer, endTimer, function () {
                        if(noThead) {
                            thead.show();
                        }
                        errorTipTpl.show();
                        loadingTpl.hide().before(errorTipTpl);
                        loadingTpl.remove();
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
    .directive('uixTableLoader', function () {
        return {
            restrict: 'A',
            scope: {
                uixTableLoader: '=',
                noThead: '=',
                loaderHeight: '@'
            },
            controller: 'uixTableLoaderCtrl',
            controllerAs: 'tableLoader'
        };
    });
