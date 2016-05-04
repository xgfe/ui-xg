angular.module('fuguDemo').controller('pagerDemoCtrl',['$scope','$log', function ($scope,$log) {
    $scope.pages = {
        pageNo:1,
        pageSize:30,
        totalCount:110
    };
    $scope.changePage = function (pageNo) {
        $log.log('修改页码为:'+pageNo);
    }
    $scope.$on('pager:pageIndexChanged', function (event, args) {
        event.stopPropagation();
        $log.log('修改页码为:'+(args.pageIndex+1));
    });
}]);