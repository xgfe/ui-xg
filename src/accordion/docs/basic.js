export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        $scope.str = {
            heading: 'this is head'
        };
        $scope.closeOthers = false;
        $scope.openStatus = false;
        $scope.openStatus1 = true;
        $scope.change = function () {
            $scope.str.heading = 'xxx';
        };
    }
}
