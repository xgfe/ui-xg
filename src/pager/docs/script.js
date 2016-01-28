angular.module('fuguDemo').controller('pagerDemoCtrl',['$scope', function ($scope) {
    $scope.pages = {
        pageNo:1,
        pageSize:30,
        totalCount:110
    };
    $scope.setPageNo = function (val) {
        $scope.pages.pageNo = val;
    };
    $scope.changePage = function (pageNo) {
        console.log('修改页码为:'+pageNo);
    }
}]);