angular.module('fuguDemo').controller('popoverDemoCtrl',['$scope', function ($scope) {
    $scope.text =
        "凉风有信，秋月无边，"+
        "亏我思娇的情绪好比度日如年，"+
        "虽然我不是玉树临风，潇洒倜傥，"+
        "可是我有我广阔的胸襟，加强健的臂腕！";
    $scope.template = false;
    $scope.clickPopover = function(){
        $scope.template = !$scope.template;
    }
}]);