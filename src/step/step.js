/**
 * step
 * step directive
 * Author: your_email@gmail.com
 * Date:2017-01-19
 */
angular.module('ui.xg.step', [])
    .directive('uixStep', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/step.html',
            require: '^?uixSteps',
            scope: {},
            link: function ($scope, $element, $attr, stepsCtrl) {
                $scope.title = $attr.title || '';
                $scope.status = $attr.status || 'wait';
                $scope.desc = $attr.desc || '';
                $scope.size = stepsCtrl.size || 'lg';
                $scope.direction = stepsCtrl.direction;
                $scope.icon = $attr.icon || '';
                $scope.num = stepsCtrl.num || 0;
                $scope.iconColor = '#DDDDDD';

                switch ($scope.status) {
                    case 'process':
                        $scope.iconColor = '#20A0FF';
                        break;
                    case 'finish':
                        $scope.iconColor = '#13CE66';
                        break;
                    case 'error':
                        $scope.iconColor = 'red';
                        break;
                }
                stepsCtrl.num++;

                if (stepsCtrl.direction === 'horizontal') {
                    $element.css('display', 'block');
                }
            }
        };
    });
