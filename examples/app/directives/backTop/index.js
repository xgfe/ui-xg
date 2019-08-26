import app from 'app';
import angular from 'angular';
import template from './template.html';
import './style.scss';

app.directive('backTop', [function () {
    return {
        restrict: 'E',
        template,
        replace: true,
        scope: {},
        link($scope) {
            let scrollEl = angular.element('#app > .page');
            $scope.handleBackTop = function () {
                scrollEl.stop().animate({ scrollTop: 0 }, 500, 'swing');
            };
        }
    };
}]);
