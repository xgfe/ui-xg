angular.module('uixDemo').controller('buttonDemoCtrl', ['$scope', function ($scope) {
    $scope.btnText = '我是通过{{}}设置的button';
    $scope.btnTypeText = '';
    $scope.loading = false;
    $scope.submitFn = function () {
        $scope.loading = !$scope.loading;
    };
}]);
