import app from 'app';
import angular from 'angular';
import template from './template.html';
import './style.scss';


app.directive('demoAffix', ['$window', function ($window) {
    return {
        restrict: 'E',
        template,
        replace: true,
        scope: {
            demos: '@'
        },
        link($scope) {
            let demos = angular.fromJson(decodeURIComponent($scope.demos));
            $scope.cloneDemos = demos;
            activeDemo();
            function activeDemo() {
                let hashId = location.hash.slice(1);
                $scope.cloneDemos.forEach((demo, index) => {
                    $scope.cloneDemos[index].active = demo.id === hashId;
                });
            }
            function onHashChange() {
                activeDemo();
                $scope.$digest();
            }
            $window.addEventListener('hashchange', onHashChange);
            $scope.$on('$destroy', () => {
                $window.removeEventListener('hashchange', onHashChange);
            });
        }
    };
}]);
