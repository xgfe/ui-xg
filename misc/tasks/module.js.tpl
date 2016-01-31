/**
 * <%module%>
 * <%module%> directive
 * Author: your_email@gmail.com
 * Date:<%date%>
 */
angular.module('ui.fugu.<%module%>', [])
    .controller('fugu<%humpModule%>Ctrl', ['$scope', '$attrs', function ($scope, $attrs) {
        this.init = function () {
        };
    }])
    .directive('fugu<%humpModule%>', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/<%module%>.html',
            replace: true,
            require: ['fugu<%humpModule%>'],
            scope: {},
            controller: 'fugu<%humpModule%>Ctrl',
            link: function (scope, el, attrs, ctrls) {
                var <%module%>Ctrl = ctrls[0];
                <%module%>Ctrl.init();
            }
        }
    });