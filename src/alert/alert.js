/**
 * alert
 * 警告提示指令
 * Author:heqingyang@meituan.com
 * Date:2015-01-11
 */
angular.module('ui.fugu.alert',[])
.constant('fuguAlertConfig', {
    hasIcon: false //是否图标显示
})
.controller('fuguAlertCtrl',['$scope','$element','$attrs','fuguAlertConfig', '$timeout', function ($scope,$element,$attrs,fuguAlertConfig,$timeout) {
    function initConfig(){
        $scope.hasIcon = fuguAlertConfig.hasIcon;
        $scope.closable = !!$attrs.close;
    }

    $scope.toggleDropdown = function (event) {
        event.preventDefault();
        if (!$scope.isDisabled) {
            _this.toggle();
        }
    };
    this.toggle = function(open) {
        var result = $scope.isOpen = arguments.length ? !!open : !$scope.isOpen;
        return result;
    };
    this.isOpen = function() {
        return $scope.isOpen;
    };
    this.init = function () {
        initConfig();
        $scope.isDisabled = $scope.isDisabled || !!$element.attr('disabled') || $element.hasClass('disabled');
    };

    $scope.$watch('isOpen', function(isOpen) {
        if (isOpen) {
            fuguDropdownService.open($scope);
        } else {
            fuguDropdownService.close($scope);
        }
    });
    $scope.getToggleElement = function () {
        return $element.find('.dropdown-toggle');
    };
    $scope.count = 0;
    this.addChild = function () {
        $scope.count ++;
    };

    $scope.$on('$locationChangeSuccess', function() {
        $scope.isOpen = false;
    });
}])
.directive('fuguAlert',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/alert.html',
        replace:true,
        //require:'^fuguDropdown',
        transclude:true,
        scope:{
            type:'@',
            close : '@'
        },
        controller:'fuguAlertCtrl',
        //link: function (scope,el,attrs,fuguAlertCtrl) {
        //    fuguAlertCtrl.init();
        //}
    }
});