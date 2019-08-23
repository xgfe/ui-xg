export default class {
    static $inject = ['$scope', '$log'];
    constructor($scope, $log) {
        $scope.time = new Date();
        $scope.changed = function (time) {
            $log.log(time);
        };
        $scope.showSeconds = true;
    }
}
