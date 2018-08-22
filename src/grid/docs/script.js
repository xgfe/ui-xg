angular.module('uixDemo').controller('gridDemoCtrl', ['$scope', function ($scope) {
    var values = [{
        grid: {
            align: 'bottom', justify: 'end', gutter: '', reverse: '',
            xs: {}, sm: {}, md: {}, lg: {}, xl: {}, xxl: {}
        },
        item: {
            span: '12', offset: '4', order: '1',
            xs: {}, sm: {}, md: {}, lg: {}, xl: {}, xxl: {}
        }
    }, {
        grid: {
            align: 'middle', justify: 'center', gutter: 'false', reverse: 'false',
            xs: {}, sm: {}, md: {}, lg: {}, xl: {}, xxl: {}
        },
        item: {
            span: '6', offset: '0', order: '1',
            xs: {}, sm: {}, md: {}, lg: {}, xl: {}, xxl: {}
        }
    }];

    var value = values[0];
    $scope.grid = value.grid;
    $scope.item = value.item;
}]);
