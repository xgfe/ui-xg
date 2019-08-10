/**
 * est
 * est directive
 * Author: your_email@gmail.com
 * Date:2018-11-19
 */
angular.module('ui.xg.est', [])
    .controller('uixEstCtrl', ['$scope', '$attrs', function ($scope, $attrs) {
        this.init = function () {
        };
    }])
    .directive('uixEst', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/est.html',
            replace: true,
            require: ['uixEst'],
            scope: {},
            controller: 'uixEstCtrl',
            link: function (scope, el, attrs, ctrls) {
                var estCtrl = ctrls[0];
                estCtrl.init();
            }
        }
    });