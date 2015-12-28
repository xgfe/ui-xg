/*
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.fugu.dropdown',[
    'template/dropdown/fugu-dropdown.html',
    'template/dropdown/fugu-dropdown-choices.html'
])
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
        templateUrl:'template/dropdown/fugu-dropdown.html',
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
        templateUrl:'template/dropdown/fugu-dropdown-choices.html',
        require:'^fuguDropdown',
        replace:true,
        transclude:true,
        scope:true,
        link: function (scope,el,attrs,fuguDropdownCtrl) {
            fuguDropdownCtrl.addChild();
        }
    }
});

angular.module('template/dropdown/fugu-dropdown.html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('template/dropdown/fugu-dropdown.html',
        '<div class="dropdown" ng-class="{true:multiColClass}[count>colsNum]">'+
        '<button type="button" ng-click="toggleDropdown($event)" class="btn btn-sm btn-primary dropdown-toggle">'+
        '<span ng-bind="btnValue"></span>&nbsp;<span class="caret"></span>'+
        '</button>'+
        '<ul class="dropdown-menu" ng-transclude>'+
        '</ul>'+
        '</div>'
    );
}]);
angular.module('template/dropdown/fugu-dropdown-choices.html', []).run(['$templateCache', function($templateCache) {
    $templateCache.put('template/dropdown/fugu-dropdown-choices.html',
        '<li>'+
        '<a href="javascript:;" ng-click="select()" ng-transclude></a>'+
        '</li>'
    );
}]);