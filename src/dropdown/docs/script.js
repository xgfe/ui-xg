import app from 'app';

app.config(['uixDropdownProvider', function (uixDropdownProvider) {
    uixDropdownProvider.setColsNum(3);
}]);
export default class {
    static $inject = ['$scope', '$log'];
    constructor($scope, $log) {
        $scope.items = [
            'The first choice!',
            'And another choice for you.',
            'but wait! A third!'
        ];

        $scope.status = {
            isopen: false
        };

        $scope.toggled = function (open) {
            $log.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
    }
}

