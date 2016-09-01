angular.module('uixDemo').controller('rateDemoCtrl', ['$scope', function ($scope) {
    $scope.modeZero = 0;
    $scope.modeFlow = 6;
    $scope.modeNormal = 3;
    $scope.modeIllegal = 'zero';
    $scope.modeFloatMin = 1.3;
    $scope.modeFloatMax = 1.6;
    $scope.changeModel = 1;
    $scope.oldVal = '';
    $scope.newVal = '';
    $scope.changeFn = function (oldVal, newVal) {
        $scope.oldVal = oldVal;
        $scope.newVal = newVal;
    };
}]);

