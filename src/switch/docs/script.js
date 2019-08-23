export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        $scope.open = false;
        $scope.checked = true;
        $scope.isDisabled = true;
        $scope.statusChange = function () {
            $log.log('changed');
        };
        $scope.status = 'A';
        $scope.trueVal = 'A';
        $scope.falseVal = 'B';
    }
}
