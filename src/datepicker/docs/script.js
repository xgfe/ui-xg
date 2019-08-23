export default class {
    static $inject = ['$scope', '$log'];
    constructor($scope, $log) {
        $scope.date = new Date();
        $scope.minDate = new Date('2016-3-10');
        $scope.maxDate = new Date('2017-3-21');

        $scope.exceptions = [
            new Date('2016-3-5'),
            new Date('2017-3-25')
        ];
        $scope.isDisabled = false;
        $scope.onChange = function () {
            $log.log('date changed');
        };

        // 星期二不可选
        $scope.dateFilter = function ($date) {
            return $date.getDay() !== 2;
        };
    }
}
