angular.module('fuguDemo').controller('buttonGroupDemoCtrl',['$scope', function ($scope) {
    $scope.radioModel = 'man';
    $scope.checkModel = {
        'music' : true,
        'running' : true,
        'football' : false
    };
    $scope.type = 'checkbox';
    $scope.checkModelArr = ['music', 'running', 'football'];
    $scope.sizeArr = ['x-small', 'small', 'default', 'large'];
    $scope.showClassArr = ['danger', 'warning', 'default', 'success', 'info', 'primary'];
    $scope.checkModelVal = {
        'music' : 1,
        'running' : 0,
        'football' : 0
    };
    $scope.disabled = true;
    $scope.viewModel = '按钮1'
}]);