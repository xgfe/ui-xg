angular.module('fuguDemo').config(['notificationProvider', function (notificationProvider   ) {
    notificationProvider.globalDurationTime(5000); //统一设置5秒后关闭
    notificationProvider.globalDisableCloseBtn(true); //统一设置不显示关闭标签
    notificationProvider.globalUnique(false); //统一设置通知可重复显示
}]);
angular.module('fuguDemo').controller('notificationDemoCtrl',['$scope', 'notification', function ($scope, notification) {
    $scope.notifications = [
        {title:'This is success info', type: 'info'},
        {title:'This is success error', type: 'error'},
        {title:'This is success success', type: 'success'},
        {title:'This is success warning', type: 'warning'}
    ];
    $scope.addNotice = function(type){
        var config = {};
        switch(type){
            case 'info':
                config.duration = -1; //一直显示
                notification.info('info － will always show', config);
                break;
            case 'success':
                config.duration = 1000; //一直显示
                config.disableCloseBtn = true; //不显示关闭
                notification.success('success - will show 1 second,not show close button', config);
                break;
            case 'warning':
                config.variables = {name: 'penglu', email: 'rabbit_pl@126.com'};  // 设置模版
                notification.warning('warning - author:{{name}},email:{{email}}', config);
                break;
            case 'error':
                config.duration = 1000; //一直显示
                config.disableCloseBtn = true; //不显示关闭
                config.variables = {name: 'penglu', email: 'rabbit_pl@126.com'};
                notification.error('error - show 10 second; not show close btn; author:{{name}},email:{{email}}', config);
                break;
            default :
                $scope.notifications.forEach(function(val){
                    config = angular.copy(val);
                    delete config.title;
                    delete config.type;
                    notification.common(val.title, config, val.type);
                });
                break;
        }
    };
}]);