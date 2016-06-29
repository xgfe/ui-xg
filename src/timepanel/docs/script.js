angular.module('uixDemo').controller('timepanelDemoCtrl',['$scope','$log', function ($scope,$log) {
    $scope.time = new Date();
    $scope.changed = function (time) {
        $log.log(time);
    };
    $scope.showSeconds = true;
}]);