export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        $scope.dynamicPopover = {
            content: 'Hello, World!',
            title: 'Title'
        };

        $scope.placement = {
            options: [
                'top',
                'top-left',
                'top-right',
                'bottom',
                'bottom-left',
                'bottom-right',
                'left',
                'left-top',
                'left-bottom',
                'right',
                'right-top',
                'right-bottom'
            ],
            selected: 'top'
        };
    }
}
