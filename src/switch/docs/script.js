angular.module('uixDemo').controller('switchDemoCtrl', ['$scope', '$log', function ($scope, $log) {
    $scope.open = false;
    $scope.checked = true;
    $scope.isDisabled = true;
    $scope.statusChange = function () {
        $log.log('changed');
    };
    $scope.status = 'A';
    $scope.A = 'A';
    $scope.B = 'B';
}]);