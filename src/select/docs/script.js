angular.module('uixDemo').controller('selectDemoCtrl',['$scope', function ($scope) {
    $scope.goods = {};
    $scope.brandList = [{
        brandName:'test1',
        brandId:1
    },{
        brandName:'5678765',
        brandId:2
    },{
        brandName:'foooasd',
        brandId:3
    },{
        brandName:'测试',
        brandId:4
    }];
}]);