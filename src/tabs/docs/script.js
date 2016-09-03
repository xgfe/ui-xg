angular.module('uixDemo').controller('tabsDemoCtrl', ['$scope', function ($scope) {
    $scope.htmlContent = '<div class="hero-unit"><h1>Heading</h1><p>Tagline</p><p><a class="btn btn-primary btn-large">Learn more</a></p></div>';
    $scope.content = '姓名:pl;年龄:28;';
    $scope.changeFn = function (oldVal, newVal) {
        alert('oldIndex:' + oldVal + ';newIndex:' + newVal);
    };
    $scope.heading = '我是{{}}设置的heading';
    $scope.headingIcon = '<i class="glyphicon glyphicon-eye-open"></i>';
    $scope.activeNum = 4;
    $scope.activeNum_new = 4;
    $scope.activeNum_one = 4;
}]);

