angular.module('uixDemo').config(['uixCalendarProvider', function (uixCalendarProvider) {
    uixCalendarProvider.setFormats('SHORTDAY', ['日', '一', '二', '三', '四', '五', '六']);
}]);
angular.module('uixDemo').controller('calendarDemoCtrl', ['$scope', function ($scope) {
    $scope.date = new Date();

    $scope.minDate = new Date();
    $scope.minDate.setDate(15); // 本月15号之前的日期不可选

    $scope.maxDate = new Date();
    $scope.maxDate.setYear(2017); // 2017年之后的不可选

    // 设置两个例外的日期
    var dt1 = new Date();
    dt1.setMonth($scope.date.getMonth());
    dt1.setDate(5);
    var dt2 = new Date();
    dt2.setFullYear(2017);
    dt2.setMonth($scope.date.getMonth() + 1);
    dt2.setDate(5);
    $scope.exceptions = [dt1, dt2];
}]);
