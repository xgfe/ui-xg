angular.module('fuguDemo').controller('tooltipDemoCtrl',['$scope', function ($scope) {
    $scope.text = "这是另一个提示！";
    $scope.template = false;
    $scope.clickTooltip = function(){
        $scope.template = !$scope.template;
    }
}]);