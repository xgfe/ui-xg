angular.module('fuguDemo').controller('timepickerDemoCtrl',['$scope', function ($scope) {
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
}]);