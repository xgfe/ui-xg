/**
 * progressbar
 * 进度条指令
 * Author: zhouxiong03@meituan.com
 * Date:2016-08-05
 */
angular.module('ui.xg.progressbar', [])

    .constant('uixProgressConfig', {
        animate: false,
        max: 100
    })

    .controller('UixProgressController', ['$scope', '$attrs', 'uixProgressConfig', function ($scope, $attrs, progressConfig) {
        var self = this,
            animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;
        this.bars = [];
        $scope.max = getMaxOrDefault();
        this.addBar = function (bar, element, attrs) {
            if (!animate) {
                element.css({'transition': 'none'});
            } else {
                element.parent().addClass('progress-striped active');
            }
            this.bars.push(bar);
            bar.max = getMaxOrDefault();
            bar.title = attrs && (angular.isDefined(attrs.title) && attrs.title) ? attrs.title : 'progressbar';
            bar.$watch('value', function () {
                bar.recalculatePercentage();
            });

            bar.recalculatePercentage = function () {
                var totalPercentage = self.bars.reduce(function (total, bar) {
                    bar.percent = +(100 * bar.value / bar.max).toFixed(2);
                    return total + bar.percent;
                }, 0);

                if (totalPercentage > 100) {
                    bar.percent -= totalPercentage - 100;
                }
            };

            bar.$on('$destroy', function () {
                element = null;
                self.removeBar(bar);
            });
        };

        this.removeBar = function (bar) {
            this.bars.splice(this.bars.indexOf(bar), 1);
            this.bars.forEach(function (bar) {
                bar.recalculatePercentage();
            });
        };

        $scope.$watch('maxParam', function () {
            self.bars.forEach(function (bar) {
                bar.max = getMaxOrDefault();
                bar.recalculatePercentage();
            });
        });

        function getMaxOrDefault() {
            return angular.isDefined($scope.maxParam) ? $scope.maxParam : progressConfig.max;
        }
    }])

    .directive('uixProgress', function () {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            require: 'uixProgress',
            scope: {
                maxParam: '=?max'
            },
            templateUrl: 'templates/progress.html',
            controller: 'UixProgressController'
        };
    })

    .directive('uixBar', function () {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            require: '^uixProgress',
            scope: {
                value: '=',
                type: '@'
            },
            templateUrl: 'templates/bar.html',
            link: function (scope, element, attrs, progressCtrl) {
                progressCtrl.addBar(scope, element, attrs);
            }
        };
    })

    .directive('uixProgressbar', function () {
        return {
            restrict: 'AE',
            replace: true,
            transclude: true,
            controller: 'UixProgressController',
            scope: {
                value: '=',
                maxParam: '=?max',
                type: '@'
            },
            templateUrl: 'templates/progressbar.html',
            link: function (scope, element, attrs, progressCtrl) {
                progressCtrl.addBar(scope, angular.element(element.children()[0]), {title: attrs.title});
            }
        };
    });

