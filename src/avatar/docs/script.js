angular.module('uixDemo').controller('avatarDemoCtrl', ['$scope', function ($scope) {
    // your js code here
    $scope.UserList = ['Z', 'ONE', 'TWO', 'THREE'];
    $scope.colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
    $scope.user = $scope.UserList[0];
    $scope.color = $scope.colorList[0];
    $scope.square = 'square'
    $scope.src = 'http://vfile.meituan.net/xgfe/9d38bf112749733f06ec5b3f243c735d48409.jpg';
    $scope.changeUser = function () {
        const index = $scope.UserList.indexOf($scope.user);
        $scope.user = index < $scope.UserList.length - 1 ? $scope.UserList[index + 1] : $scope.UserList[0];
        $scope.color = index < $scope.colorList.length - 1 ? $scope.colorList[index + 1] : $scope.colorList[0];

    }
}]);