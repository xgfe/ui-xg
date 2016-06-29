angular.module('uixDemo').controller('sortableDemoCtrl',['$scope', function ($scope) {
    $scope.mockList = [{
        name:'List Item -- 1',
        id:1
    },{
        name:'List Item -- 2',
        id:2
    },{
        name:'List Item -- 3',
        id:3
    },{
        name:'List Item -- 4',
        id:4
    }];
    $scope.addItem = function () {
        $scope.mockList.push({
            name:'List Item -- '+($scope.mockList.length+1),
            id:$scope.mockList.length+1
        });
    }
}]);