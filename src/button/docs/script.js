export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        $scope.btnText = '我是通过{{}}设置的button';
        $scope.btnTypeText = '';
        $scope.loading = false;
        $scope.submitFn = function () {
            $scope.loading = !$scope.loading;
        };
        $scope.submitText = function () {
            $scope.btnTypeText = 'reset触发了ng-submit';
        };

        $scope.clickFn = function () {
            $scope.btnText = 'click text';
        };
    }
}
