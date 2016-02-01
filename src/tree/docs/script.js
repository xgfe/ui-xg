angular.module('fuguDemo').controller('treeDemoCtrl',['$scope', function ($scope) {
    $scope.nodes = [
        {label: '省份', children: [
            {label: '陕西', children:[
                {label: '汉中'},
                {label: '勉县'},
                {label: '咸阳'}
            ]},
            {label: '北京', children:[
                {label: '朝阳'},
                {label: '昌平'},
                {label: '顺义'}
            ]},
            {label: '浙江', children:[
                {label: '宁波'},
                {label: '杭州'},
                {label: '嘉兴'}
            ]}
        ]}
    ];
    $scope.expandAll = false;
    $scope.checkable = false;
    $scope.showIcon = false;
    $scope.clickFn = function(data){
        $scope.clickData = data;
    };
    $scope.checkChangeFn = function(data){
        $scope.selectData = data;
    };
}]);
