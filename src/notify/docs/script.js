angular.module('fuguDemo').config(['notifyProvider', function (notifyProvider   ) {
    notifyProvider.globalDurationTime(5000); //统一设置5秒后关闭
    notifyProvider.globalDisableCloseBtn(true); //统一设置不显示关闭标签
    notifyProvider.globalUnique(false); //统一设置通知可重复显示
    notifyProvider.globalLimitNum(5); //统一设置最多显示5条通知
}]);
angular.module('fuguDemo').controller('notifyDemoCtrl',['$scope', 'notify', function ($scope, notify) {
    $scope.notifys = [
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
                notify.info('info － will always show', config);
                break;
            case 'success':
                config.duration = 1000; //一直显示
                config.disableCloseBtn = true; //不显示关闭
                notify.success('success - will show 1 second,not show close button', config);
                break;
            case 'warning':
                config.variables = {name: 'penglu', email: 'rabbit_pl@126.com'};  // 设置模版
                notify.warning('warning - limitNum:2,author:{{name}},email:{{email}}', config);
                break;
            case 'error':
                config.duration = 1000; //一直显示
                config.disableCloseBtn = true; //不显示关闭
                config.variables = {name: 'penglu', email: 'rabbit_pl@126.com'};
                notify.error('error - show 10 second; not show close btn; author:{{name}},email:{{email}}', config);
                break;
            default :
                $scope.notifys.forEach(function(val){
                    config = angular.copy(val);
                    delete config.title;
                    delete config.type;
                    notify.common(val.title, config, val.type);
                });
                break;
        }
    };
}]);