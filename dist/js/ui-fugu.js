/*
 * angular-ui-fugu
 * Version: 0.0.1 - 2015-12-31
 * License: ISC
 */
angular.module("ui.fugu", ["ui.fugu.tpls","ui.fugu.dropdown"]);
angular.module("ui.fugu.tpls", ["dropdown/templates/dropdown-choices.html","dropdown/templates/dropdown.html"]);
/**
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.fugu.dropdown',[])
.constant('fuguDropdownConfig', {
    colsNum: 3, //多列数目
    openClass:'open', //打开dropdown的calss
    multiColClass: 'fugu-dropdown' //控制多列显示的calss
})
.service('fuguDropdownService', ['$document', function($document) {
    var openScope = null;
    this.open = function(dropdownScope) {
        if (!openScope) {
            $document.on('click', closeDropdown);
        }
        if (openScope && openScope !== dropdownScope) {
            openScope.isOpen = false;
        }
        openScope = dropdownScope;
    };

    this.close = function(dropdownScope) {
        if (openScope === dropdownScope) {
            openScope = null;
            $document.off('click', closeDropdown);
        }
    };

    function closeDropdown(evt) {
        if (!openScope) { return; }
        var toggleElement = openScope.getToggleElement();
        if (evt && toggleElement && toggleElement[0].contains(evt.target)) {
            return;
        }
        openScope.isOpen = false;
        openScope.$apply();
    }

}])
.controller('fuguDropdownCtrl',['$scope','$rootScope','$element','$attrs','$parse','$document','fuguDropdownConfig','fuguDropdownService', function ($scope,$rootScope,$element,$attrs,$parse,$document,fuguDropdownConfig,fuguDropdownService) {
    function initConfig(){
        $scope.colsNum = fuguDropdownConfig.colsNum;
        $scope.openClass = fuguDropdownConfig.openClass;
        $scope.multiColClass = fuguDropdownConfig.multiColClass;
    }
    var _this = this;

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
.directive('fuguDropdown',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/dropdown.html',
        replace:true,
        require:'^fuguDropdown',
        transclude:true,
        scope:{
            isOpen:'=?',
            isDisabled:'=?ngDisabled',
            btnValue:'@?'
        },
        controller:'fuguDropdownCtrl',
        link: function (scope,el,attrs,fuguDropdownCtrl) {
            fuguDropdownCtrl.init();
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
angular.module("dropdown/templates/dropdown-choices.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/dropdown-choices.html",
    "<li>"+
    "    <a href=\"javascript:;\" ng-transclude></a>"+
    "</li>");
}]);
angular.module("dropdown/templates/dropdown.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/dropdown.html",
    "<div class=\"btn-group dropdown\" ng-class=\"[{true:multiColClass}[count>colsNum],{true:openClass}[isOpen]]\">"+
    "    <button type=\"button\" ng-click=\"toggleDropdown($event)\" ng-disabled=\"isDisabled\" class=\"btn btn-sm btn-primary dropdown-toggle\">"+
    "        {{btnValue}}&nbsp;<span class=\"caret\"></span>"+
    "    </button>"+
    "    <ul class=\"dropdown-menu\" ng-transclude></ul>"+
    "</div>");
}]);