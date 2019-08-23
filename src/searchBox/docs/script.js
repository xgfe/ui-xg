export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        $scope.showButton = false;
        $scope.text = 'search';
        $scope.query = 'text';
        $scope.toggleButton = function () {
            $scope.showButton = !$scope.showButton;
        };
        $scope.doSearch = function () {
            $log.log('searching: ' + $scope.query);
        };
    }
}
