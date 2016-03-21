angular.module('fuguDemo').controller('datepickerDemoCtrl',['$scope', function ($scope) {
    $scope.date = new Date();
    $scope.minDate = new Date('2016-3-10');
    $scope.maxDate = new Date('2017-3-21');

    $scope.exceptions = [
        new Date('2016-3-5'),
        new Date('2017-3-25')
    ];
    $scope.isDisabled = false;
}]);