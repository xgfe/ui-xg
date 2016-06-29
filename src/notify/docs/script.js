angular.module('uixDemo').config(['$uixNotifyProvider', function ($uixNotifyProvider) {
    $uixNotifyProvider.globalTimeToLive({'info': 5000, 'success': -1}); //设置info5秒后关闭,success则一直显示
    $uixNotifyProvider.globalDisableCloseButton(true); //统一设置不显示关闭标签
    $uixNotifyProvider.globalDisableIcons(true); //统一设置不显示提示图标标签
    $uixNotifyProvider.globalReversedOrder(true); //统一设置消息翻转插入
    $uixNotifyProvider.globalDisableCountDown(true); //统一设置不现实倒计时按钮
    $uixNotifyProvider.globalInlineMessages(true); //统一设置整行显示
    $uixNotifyProvider.globalPosition('bottom-center'); //统一设置位置在下面的中间
    $uixNotifyProvider.onlyUniqueMessages(false); //统一设置通知可重复显示
}]);

angular.module('uixDemo').controller('notifyDemoCtrl', ['$scope', '$uixNotify', function ($scope, $uixNotify) {
    $scope.reference = 1;  // 指定notify的referenceId
    $scope.inline = true;  // 指定notify中消息整行显示
    $scope.limitMessages = 2;   // 指定notify指令可显示多少条提示信息

    $scope.notifies = [
        {title: 'This is success info', type: 'info'},
        {title: 'This is success error', type: 'error'},
        {title: 'This is success success', type: 'success'},
        {title: 'This is success warning', type: 'warning'}
    ];
    $scope.addNotify = function (type) {
        var i;
        var config = {};
        switch (type) {
            case 'info':
                config.referenceId = 0;
                for (i = 0; i < 5; i++) {
                    $uixNotify.info('info － referenceId=0;inline=false;limit-Messages不设置');
                }
                break;
            case 'success':
                config.referenceId = 1;
                for (i = 0; i < 5; i++) {
                    $uixNotify.success('success - referenceId=3;inline=true;limit-Messages=2' + i, config);
                }
                break;
            default :
                $scope.notifies.forEach(function (val) {
                    config = angular.copy(val);
                    delete config.title;
                    delete config.type;
                    $uixNotify.general(val.title, config, val.type);
                });
                break;
        }
    };

    $scope.notifyMethod = function () {
        var config = {};
        config.disableIcons = true;
        config.disableCloseButton = true;
        config.position = 'top-center';
        config.disableCountDown = true;
        config.referenceId = 0;
        config.ttl = 5000;
        $uixNotify.error('error - 不显示icon,不显示关闭按钮,位置在顶部中间,不显示倒计时图标,5秒后关闭', config);
    }
}]);