angular.module('uixDemo').controller('tableLoaderDemoCtrl', ['$scope', '$timeout',  function ($scope, $timeout) {
    $scope.isLoading = 0;
    $scope.isLoading2 = 0;
    $scope.isLoading3 = 0;
    $scope.noHead = true;

    $scope.loadTable1 = function () {
        $scope.isLoading = 1;
        $timeout(function () {
            $scope.isLoading = 0;
        }, 0);
    };
    $scope.loadTable2 = function () {
        $scope.isLoading2 = 1;
        $timeout(function () {
            $scope.isLoading2 = 0;
        }, 0);
    };
    $scope.loadTable3 = function () {
        $scope.isLoading3 = 1;
        $timeout(function () {
            $scope.isLoading3 = -1;
        }, 0);
    };
}]);
