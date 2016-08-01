/**
 * Created by heqingyang on 16/7/8.
 */

angular.module('uixDemo').controller('listDemoCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.search = {
        showButton : false
    };
    $scope.scene = {
        name: '列表页'
    };
    $scope.pages = {
        pageNo: 1,
        pageSize: 6,
        totalCount: 12
    };
    $scope.pageNo = 1;
    $scope.query = {
        'search' : '',
        'select' : '',
        'startTime': new Date(),
        'endTime': new Date(),
        'switch1': false,
        'switch2': false,
        'switch3': false,
        'switch4': false,
    };
    $scope.isCollapse = false;
    var defaultQuery = angular.copy($scope.query);

    $scope.$watch('query', function () {
        console.log('changing!!');
    }, true);

    $scope.getPage = function (pageNo) {
        if(pageNo) {
            $scope.pageNo = pageNo;
        }
        $http({
            method: 'GET',
            url: 'api/list' + $scope.pageNo + '.json'
        }).success(function (response) {
            $scope.dataList = response.data;
            var componyMap = {};
            var componyList = [];
            var index = 0;
            angular.forEach($scope.dataList, function (item) {
                if(componyMap[item.agent]) {

                } else {
                    index++;
                    componyMap[item.agent] = true;
                    componyList.push(
                        item.agent
                    );
                }
            });
            $scope.componyList = componyList;
        });
    };
    $scope.getPage();

    $scope.defaultButton = function () {
        $scope.query = defaultQuery;
    };
}]);
