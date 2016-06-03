angular.module('fuguDemo').controller('timepickerDemoCtrl', ['$scope', '$log', function ($scope, $log) {
    $scope.time = new Date();
    $scope.time2 = new Date();
    $scope.isDisabled = true;
    var min = new Date();
    min.setHours(5);
    $scope.minTime = min;
    var max = new Date();
    max.setHours(22);
    max.setMinutes(45);
    $scope.maxTime = max;
    $scope.onChange = function () {
        $log.log('time changed:' + $scope.time);
    }
}]);