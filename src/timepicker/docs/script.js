angular.module('fuguDemo').controller('timepickerDemoCtrl',['$scope', function ($scope) {
    $scope.time = new Date();
    $scope.time2 = new Date();
    $scope.isDisabled = true;
}]);