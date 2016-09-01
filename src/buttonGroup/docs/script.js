angular.module('uixDemo').controller('buttonGroupDemoCtrl', ['$scope', function ($scope) {
    $scope.interst = 'running';
    $scope.interstObj = {
        firstHobby: true,
        secondHobby: false,
        thirdHobby: true
    };
    $scope.setInterstObj = {
        firstHobby: 'running',
        secondHobby: false,
        thirdHobby: true
    };
}]);
