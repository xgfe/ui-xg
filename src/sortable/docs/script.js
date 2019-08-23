export default class {
    static $inject = ['$scope', '$log'];
    constructor($scope, $log) {
        $scope.mockList = [{
            name: 'List Item1 -- 1',
            id: 11
        }, {
            name: 'List Item1 -- 2',
            id: 12
        }, {
            name: 'List Item1 -- 3',
            id: 13
        }, {
            name: 'List Item1 -- 4',
            id: 14
        }];
        $scope.mockList2 = [{
            name: 'List Item2 -- 1',
            id: 21
        }, {
            name: 'List Item2 -- 2',
            id: 22
        }];
        $scope.sorted = function () {
            $log.log('sort finished');
        };
        $scope.addItem = function () {
            $scope.mockList.push({
                name: 'new Item -- ' + ($scope.mockList.length + 1),
                id: $scope.mockList.length + 1
            });
        };
    }
}
