export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        $scope.minDate = new Date();
        $scope.minDate.setDate(15);
        // 星期三不可选
        $scope.dateFilter = function ($date) {
            return $date.getDay() !== 3;
        };
    }
}
