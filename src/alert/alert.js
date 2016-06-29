/**
 * alert
 * 警告提示指令
 * Author:heqingyang@meituan.com
 * Date:2015-01-11
 */
angular.module('ui.xg.alert',[])
.controller('uixAlertCtrl',['$scope','$attrs', '$timeout','$interpolate', function ($scope,$attrs,$timeout,$interpolate) {

    //指令初始化
    function initConfig(){
        $scope.closeable = !!($scope.close&&($scope.close=="true"||$scope.close=="1"));
        $scope.defaultclose = false;
        $scope.hasIcon = !!($scope.hasIcon&&($scope.hasIcon=="true"||$scope.hasIcon=="1"));
    }
    initConfig();

    //添加默认close方法
    if(!$attrs.closeFunc){
        $scope.closeFunc = function(){
            $scope.defaultclose = true;
        }
    }

    //判断是否显示图标
    var type = angular.isDefined($attrs.type)? $interpolate($attrs.type)($scope.$parent): null;

    if($scope.hasIcon) {
    switch(type){
        case 'danger':
            $scope.iconClass = 'remove-sign';
            break;
        case 'success':
            $scope.iconClass = 'ok-sign';
            break;
        case 'info':
            $scope.iconClass = 'info-sign';
            break;
        default:
            $scope.iconClass = 'exclamation-sign';
            break;
        }
    }

    //判断是否有时间参数
    var dismissOnTimeout = angular.isDefined($attrs.dismissOnTimeout)?
        $interpolate($attrs.dismissOnTimeout)($scope.$parent): null;
    if(dismissOnTimeout) {
        $timeout(function(){
            $scope.closeFunc();
        },parseInt(dismissOnTimeout, 10))
    }
}])
.directive('uixAlert',function () {
    return {
        restrict: 'E',
        templateUrl: function(element, attrs){
            return attrs.templateUrl || 'templates/alert.html';
        },
        replace:true,
        transclude:true,
        scope:{
            type:'@',
            close : '@',
            closeFunc : '&',
            closeText : '@',
            hasIcon : '@'
        },
        controller:'uixAlertCtrl',
        controllerAs: 'alert'
    }
});