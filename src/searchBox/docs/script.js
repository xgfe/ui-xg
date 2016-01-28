angular.module('fuguDemo').controller('searchBoxDemoCtrl',['$scope', function ($scope) {
    $scope.showButton = false;
    $scope.text = 'search';
    $scope.query = 'text';
    $scope.toggleButton = function () {
        $scope.showButton = !$scope.showButton;
    };
    $scope.doSearch = function () {
        alert('searching: '+$scope.query);
    }
}]);