/**
 * steps
 * steps directive
 * Author: lihaijie02@meituan.com
 * Date:2017-01-17
 */
angular.module('ui.xg.steps', [])
    .directive('uixSteps', function () {
        return {
            restrict: 'AE',
            scope: {
                'size': '@',
                'direction': '@'
            },
            controller: ['$scope', function ($scope) {
                $scope.size = $scope.size || 'md';
                $scope.direction = $scope.direction || 'vertical';
                this.size = $scope.size;
                this.direction = $scope.direction;
                this.num = 0;
                $('uix-steps').addClass('uix-steps');
            }]
        };
    });


