angular.module('uixDemo').controller('gridDemoCtrl', ['$scope', '$interval', function ($scope, $interval) {
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
    var index = 0;
    $interval(function() {
        var value = values[index];
        if (!value) {
            index = 0;
            value = values[0]
        }
        index += 1;

        $scope.grid = value.grid;
        $scope.item = value.item;
    }, 3600);
}]);
