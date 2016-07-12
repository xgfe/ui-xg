angular.module('uixDemo').controller('buttonDemoCtrl', ['$scope', function ($scope) {
    $scope.text = '设置text';
    $scope.typeArr = ['button', 'reset', 'submit'];
    $scope.btnClass = 'primary';
    $scope.formContent = '表单内容';
    $scope.submit = 'Submit';
    $scope.reset = 'Reset';
    $scope.block = true;
    $scope.clickText = '';

    $scope.activeTrue = true;
    $scope.activeFalse = false;

    $scope.disabledTrue = true;
    $scope.disabledFalse = false;

    $scope.loadingTrue = true;
    $scope.loadingFalse = false;

    $scope.icon = 'plus';

    $scope.loading = false;
    $scope.clickFn = function () {
        $scope.loading = !$scope.loading;
    };
    $scope.submitFn = function () {
        $scope.clickText = 'submit function';
    };
    $scope.classArr = ['danger', 'warning', 'default', 'success', 'info', 'primary', 'link'];
    $scope.sizeArr = ['x-small', 'small', 'large'];
}]);
