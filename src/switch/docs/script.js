angular.module('fuguDemo').controller('switchDemoCtrl',['$scope', function ($scope) {
    $scope.open = false;
    $scope.checked = true;
    $scope.isDisabled = true;
    $scope.statusChange = function () {
        console.log('changed');
    };
    $scope.status = 'A';
    $scope.A = 'A';
    $scope.B = 'B';
}]);