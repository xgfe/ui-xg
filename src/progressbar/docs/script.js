export default class {
    static $inject = ['$scope'];
    constructor($scope) {
        $scope.max = 200;
        $scope.maxParam = 100;
        $scope.random = function () {
            var value = Math.ceil(Math.random() * 200);
            $scope.percent = (100 * value / $scope.max).toFixed(1) + '%';
            if (value < 50) {
                $scope.type = 'success';
            } else if (value < 100) {
                $scope.type = 'info';
            } else if (value < 150) {
                $scope.type = 'warning';
            } else {
                $scope.type = 'danger';
            }

            $scope.dynamic = value;
            $scope.dynamicMsg = $scope.dynamic + ' / ' + $scope.max;
        };
        $scope.random();

        $scope.stackRandom = function () {
            $scope.stackBars = [];
            var types = ['success', 'info', 'warning', 'danger'];
            for (var i = 0; i < 4; i++) {
                var index = Math.floor(Math.random() * 4);
                var value = Math.floor(Math.random() * 25);
                $scope.stackBars.push({
                    type: types[index],
                    value: value,
                    title: value
                });
            }
        };
        $scope.stackRandom();
    }
}
