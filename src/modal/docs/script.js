angular.module('fuguDemo').controller('modalDemoCtrl',['$scope','$log','$fgModal', function ($scope,$log,$fgModal) {
    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (size) {

        var modalInstance = $fgModal.open({
            templateUrl: 'modalContent.html',
            controller: 'modalInstanceCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (result) {
            $scope.items = result.items;
            $scope.selected = result.selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);
angular.module('fuguDemo').controller('modalInstanceCtrl', ['$scope','$fgModalInstance','items','$fgModal',function ($scope, $fgModalInstance, items,$fgModal) {

    $scope.items = angular.copy(items);
    $scope.selected = {
        item: $scope.items[0]
    };

    $scope.openAnother = function () {
        $fgModal.open({
            templateUrl: 'anotherModal.html',
            size: 'sm',
            controller: ['$scope',function ($scope) {
                $scope.modalBodyText = "Hello!'I'm a another modal";
                $scope.ok = function () {
                    $scope.$close('close modal by $scope');
                };
            }]
        });
    };

    $scope.ok = function () {
        $fgModalInstance.close({
            items:$scope.items,
            selectedItem:$scope.selected.item
        });
    };

    $scope.cancel = function () {
        $fgModalInstance.dismiss('cancel');
    };
}]);