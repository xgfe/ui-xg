angular.module('fuguDemo').config(['fuguDropdownProvider', function (fuguDropdownProvider) {
    fuguDropdownProvider.setColsNum(3);
}]);
angular.module('fuguDemo').controller('dropdownDemoCtrl',['$scope', function ($scope) {
    $scope.list = [
        {id:1,name:'Jerry'},
        {id:2,name:'Test'},
        {id:3,name:'multidropdownmultidropdown'},
        {id:4,name:'meituan'}];
    $scope.status = {
        isOpen:true,
        isDisabled:true
    };
    $scope.doClick = function (evt) {
        evt.stopPropagation();
        $scope.status.isOpen = !$scope.status.isOpen
    };
    $scope.currentUser = {id:1,name:'Jerry'};
    $scope.selectItem = function (item) {
        $scope.currentUser = item;
    }
}]);