angular.module('uixDemo').controller('accordionDemoCtrl', ['$scope', function ($scope) {
    // your js code here
    $scope.str = {
        heading: 'this is head'
    };
    $scope.closeOthers = false;
    $scope.openStatus = false;
    $scope.openStatus1 = true;
    $scope.change = function () {
        $scope.str.heading = 'xxx';
    };
}]);
