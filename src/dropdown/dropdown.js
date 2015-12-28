/*
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.fugu.dropdown',[])
.constant('fuguDropdownConfig', {
    colsNum: 3, //多列数目
    multiColClass: 'fugu-dropdown' //控制多列显示的calss
})
.controller('fuguDropdownCtrl',['$scope','$element','$document','fuguDropdownConfig', function ($scope,$element,$document,fuguDropdownConfig) {
    $scope.colsNum = fuguDropdownConfig.colsNum;
    $scope.multiColClass = fuguDropdownConfig.multiColClass;
    $scope.toggleDropdown = function (event) {
        if(event){
            event.stopPropagation();
        }
        $scope.isOpen = !$scope.isOpen;
        if($scope.isOpen){
            $scope.openDropdown();
        }else{
            $scope.closeDropdown();
        }
    };
    var hasBind = false;
    $scope.openDropdown = function(){
        $element.addClass('open');
        $scope.isOpen = true;
        if(!hasBind){
            $document.on('click', $scope.closeDropdown);
            hasBind = true;
        }
    };
    $scope.closeDropdown = function(){
        $element.removeClass('open');
        $scope.isOpen = false;
        if(hasBind){
            $document.off('click', $scope.closeDropdown);
            hasBind = false;
        }
    };
    $scope.count = 0;
    this.addChild = function () {
        $scope.count ++;
    }

}])
.directive('fuguDropdown',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/dropdown.html',
        replace:true,
        transclude:true,
        scope:{
            isOpen:'=?',
            btnValue:'@'
        },
        controller:'fuguDropdownCtrl',
        link: function (scope) {
            if(scope.isOpen){
                scope.openDropdown();
            }
        }
    }
})
.directive('fuguDropdownChoices',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/dropdown-choices.html',
        require:'^fuguDropdown',
        replace:true,
        transclude:true,
        scope:true,
        link: function (scope,el,attrs,fuguDropdownCtrl) {
            fuguDropdownCtrl.addChild();
        }
    }
});