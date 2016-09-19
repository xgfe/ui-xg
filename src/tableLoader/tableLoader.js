/**
 * tableLoader
 * 表格Loading指令
 * Author:heqingyang@meituan.com
 * Date:2016-08-02
 */
angular.module('ui.xg.tableLoader', [])

    .provider('uixTableLoader', function () {
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

    .controller('uixTableLoaderCtrl', ['$scope', '$timeout', '$element', '$window', 'uixTableLoader',
        function ($scope, $timeout, $element, $window, uixTableLoader) {

            var $ = angular.element;
            var thead = $element.children('thead');
            var tbody = $element.children('tbody');

            var loadingTime = parseInt($scope.loadingTime, 10) || uixTableLoader.getLoadingTime();
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
            var emptyTipTpl = $('<tbody><tr><td colspan="100%">' +
                '<div class="error-tip" style="height:' + height + 'px">' +
                '<span class="error-text">数据列表为空! </span>' +
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
                    emptyTipTpl.remove();
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
                } else
                if(newValue === 2) {
                    endTimer = new Date().getTime();
                    timeoutHandle(startTimer, endTimer, function () {
                        if(noThead) {
                            thead.show();
                        }
                        emptyTipTpl.show();
                        loadingTpl.hide().before(emptyTipTpl);
                        loadingTpl.remove();
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
    .directive('uixTableLoader', function () {
        return {
            restrict: 'A',
            scope: {
                uixTableLoader: '=',
                noThead: '=',
                loaderHeight: '@',
                loadingTime: '@'
            },
            controller: 'uixTableLoaderCtrl',
            controllerAs: 'tableLoader'
        };
    });
