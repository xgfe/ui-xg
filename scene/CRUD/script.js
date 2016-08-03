/**
 * Created by heqingyang on 16/7/8.
 */

angular.module('uixDemo').controller('listDemoCtrl', ['$scope', '$http', '$uixModal', '$filter', function ($scope, $http, $uixModal, $filter) {
    $scope.search = {
        showButton : false
    };
    $scope.scene = {
        name: '增删改查'
    };
    $scope.pages = {
        pageNo: 1,
        pageSize: 6,
        totalCount: 12
    };
    $scope.pageNo = 1;
    $scope.query = {
        'search' : '',
        'checkAll' : false
    };
    var _scope = $scope;

    // 检测checkAll的变化
    $scope.$watch('query.checkAll', function (newValue) {
        angular.forEach($scope.dataList, function (item) {
            item.checked = newValue;
        });
    });

    // 新增
    $scope.addItem = function () {
        var modalInstance = $uixModal.open({
            templateUrl: 'modalContent.html',
            controller: ['$scope', '$uixModalInstance',
                function ($scope, $uixModalInstance) {

                    $scope.modalBodyText = '新增数据';
                    $scope.item = {};
                    $scope.ok = function () {
                        $scope.item.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');

                        _scope.dataList.unshift($scope.item);
                        $uixModalInstance.close();
                    };
                    $scope.cancel = function () {
                        $uixModalInstance.close();
                    };
                }]
        });
    };

    // 编辑
    $scope.editItem = function (item) {
        var modalInstance = $uixModal.open({
            templateUrl: 'modalContent.html',
            controller: ['$scope', '$uixModalInstance',
                function ($scope, $uixModalInstance) {

                    $scope.modalBodyText = '编辑数据';
                    $scope.item = item ? angular.copy(item) : {};
                    $scope.ok = function () {
                        item.title = $scope.item.title;
                        item.money = $scope.item.money;
                        item.agent = $scope.item.agent;
                        item.person = $scope.item.person;
                        item.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
                        $uixModalInstance.close();
                    };
                    $scope.cancel = function () {
                        $uixModalInstance.close();
                    };
                }]
        });
    };

    // 删除
    $scope.deleteItem = function () {
        var modalInstance = $uixModal.open({
            templateUrl: 'anotherModal.html',
            size: 'sm',
            controller: ['$scope', '$uixModalInstance',
                function ($scope, $uixModalInstance) {

                    $scope.modalBodyText = '删除数据';
                    $scope.ok = function () {
                        var tempDataList = [];
                        _scope.dataList.forEach(function (item) {
                            if(!item.checked) {
                                tempDataList.push(item);
                            }
                        });
                        _scope.dataList = angular.copy(tempDataList);
                        $uixModalInstance.close();
                    };
                    $scope.cancel = function () {
                        $uixModalInstance.close();
                    };
                }]
        });
    };

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

}]);
