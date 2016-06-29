angular.module('uixDemo').controller('searchBoxDemoCtrl', ['$scope', '$log', function ($scope, $log) {
    $scope.showButton = false;
    $scope.text = 'search';
    $scope.query = 'text';
    $scope.toggleButton = function () {
        $scope.showButton = !$scope.showButton;
    };
    $scope.doSearch = function () {
        $log.log('searching: ' + $scope.query);
    }
}]);