import app from 'app';

app.controller('modalInstanceCtrl', ['$scope', '$uixModalInstance', 'items', '$uixModal',
    function ($scope, $uixModalInstance, items, $uixModal) {

        $scope.items = angular.copy(items.items);
        $scope.selected = {
            item: items.selected
        };

        $scope.openAnother = function () {
            $uixModal.open({
                templateUrl: 'anotherModal.html',
                size: 'sm',
                controller: ['$scope', function ($scope) {
                    $scope.modalBodyText = 'Hello!\'I\'m a another modal';
                    $scope.ok = function () {
                        $scope.$close('close modal by $scope');
                    };
                }]
            });
        };

        $scope.ok = function () {
            $uixModalInstance.close({
                items: $scope.items,
                selected: $scope.selected.item
            });
        };

        $scope.cancel = function () {
            $uixModalInstance.dismiss('cancel');
        };
    }]);

export default class {
    static $inject = ['$scope', '$timeout', '$log', '$uixModal', '$uixConfirm'];
    constructor($scope, $timeout, $log, $uixModal, $uixConfirm) {
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.confirm = function () {
            $uixConfirm({
                content: '确定执行操作吗?',
                confirmBtnText: '好的',
                cancelBtnText: '不好',
                confirm: $scope.onConfirm
            });
        };
        $scope.onConfirm = function () {
            return $timeout(function () {
                return true;
            }, 1000);
        };
        $scope.onCancel = function (modalInstance) {
            $log.log('500ms之后关闭');
            $timeout(function () {
                modalInstance.close();
            }, 500);
        };

        $scope.open = function (size) {

            var modalInstance = $uixModal.open({
                templateUrl: 'modalContent.html',
                controller: 'modalInstanceCtrl',
                size: size,
                resolve: {
                    items: function () {
                        return {
                            items: $scope.items,
                            selected: $scope.selected
                        };
                    }
                }
            });

            modalInstance.result.then(function (result) {
                $scope.items = result.items;
                $scope.selected = result.selected;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
}

