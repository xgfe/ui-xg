/**
 * alert
 * 警告提示指令
 * Author:heqingyang@meituan.com
 * Date:2015-01-11
 */
angular.module('ui.fugu.alert',[])
//.constant('fuguAlertConfig', {
//    hasIcon: true //是否图标显示
//})
.controller('fuguAlertCtrl',['$scope','$attrs', '$timeout','$interpolate', function ($scope,$attrs,$timeout,$interpolate) {

    //指令初始化
    function initConfig(){
        $scope.closeable = !!$attrs.close;
        $scope.defaultclose = false;
    }
    initConfig();

    //判断是否有关闭参数
    if($attrs.close == 'true'){
        $scope.close = function(){
            $scope.defaultclose = true;
        }
    }

    //判断是否显示图标
    if($scope.hasIcon) {
        var type = angular.isDefined($attrs.type)? $interpolate($attrs.type)($scope.$parent): null;
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
            $scope.close();
        },parseInt(dismissOnTimeout, 10))
    }
}])
.directive('fuguAlert',function () {
    return {
        restrict: 'E',
        templateUrl: function(element, attrs){
            return attrs.templateUrl || 'templates/alert.html';
        },
        replace:true,
        transclude:true,
        scope:{
            type:'@',
            close : '&',
            closeText : '@',
            hasIcon : '@'
        },
        controller:'fuguAlertCtrl'
    }
});