/**
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.fugu.dropdown',[])
.constant('fuguDropdownConfig', {
    eachItemWidth: 120, //每一个项目的宽度
    openClass:'open', //打开dropdown的calss
    multiColClass: 'fugu-dropdown-multi' //控制多列显示的calss
})
.provider('fuguDropdown', function () {
    var _colsNum = 3;
    this.setColsNum = function (num) {
        _colsNum = num || 3;
    };
    this.$get  = function () {
        return {
            getColsNum: function () {
                return _colsNum;
            }
        }
    }
})
.factory('fuguDropdownOffset', ['$document', '$window', function ($document, $window) {
    return function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
            left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
    };
}])
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
        if (evt && toggleElement && toggleElement.contains(evt.target)) {
            return;
        }
        openScope.isOpen = false;
        openScope.$apply();
    }

}])
.controller('fuguDropdownCtrl',['$scope','$timeout','$attrs','$element','fuguDropdownOffset','fuguDropdownConfig','fuguDropdownService','fuguDropdown',
    function ($scope,$timeout,$attrs,$element,fuguDropdownOffset,fuguDropdownConfig,fuguDropdownService,fuguDropdownProvider) {
        $scope.colsNum = angular.isDefined($attrs.colsNum) ?
            angular.copy($scope.$parent.$eval($attrs.colsNum)) :fuguDropdownProvider.getColsNum();
        $scope.eachItemWidth = fuguDropdownConfig.eachItemWidth;
        $scope.openClass = fuguDropdownConfig.openClass;
        $scope.multiColClass = fuguDropdownConfig.multiColClass;

        var _this = this;

        $scope.toggleDropdown = function (event) {
            event.preventDefault();
            if(!getDisabled()){
                _this.toggle();
            }
        };
        function getDisabled(){
            return $scope.toggle.hasClass('disabled') || $scope.toggle.attr('disabled')
        }
        this.toggle = function() {
            $scope.isOpen = !$scope.isOpen;
            return $scope.isOpen;
        };
        $scope.dropdownMenuStyles = {};
        function adjustPostion(){
            var offset = fuguDropdownOffset($element);

            var top = offset.top;
            var bottom = window.innerHeight - top - offset.height;

            var dropdownMenu = angular.element($element[0].querySelector('.fugu-dropdown-menu'));
            if(top > dropdownMenu[0].clientHeight && bottom < dropdownMenu[0].clientHeight){
                var toggle = $scope.getToggleElement();
                $scope.dropdownMenuStyles.top = '';
                $scope.dropdownMenuStyles.bottom = toggle?toggle.clientHeight+'px':'';
            }else{
                $scope.dropdownMenuStyles.top = '100%';
                $scope.dropdownMenuStyles.bottom = '';
            }
        }
        $scope.$watch('isOpen', function(isOpen) {
            if (isOpen) {
                fuguDropdownService.open($scope);
                // timeout 等ng-repeat
                $timeout(function () {
                    adjustPostion();
                });
            } else {
                fuguDropdownService.close($scope);
            }
        });
        $scope.getToggleElement = function () {
            return $element[0].querySelector('.fugu-dropdown-toggle');
        };
        $scope.count = 0;
        this.addChild = function () {
            $scope.count ++;

            $scope.dropdownMenuStyles.width = $scope.count>$scope.colsNum?$scope.colsNum*$scope.eachItemWidth+'px':'auto';

            if($scope.count>$scope.colsNum){
                angular.element($element[0].querySelectorAll('.fugu-dropdown-menu > li')).css('width', 100/$scope.colsNum+'%');
            }
        };
        this.appendToggle = function (toggle) {
            var toggleEl = angular.element($element[0].querySelector('.fugu-dropdown-toggle'));
            toggleEl.removeAttr('fugu-dropdown-toggle');
            toggleEl.append(toggle);
            $scope.toggle = toggle;
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
            isOpen:'=?'
        },
        controller:'fuguDropdownCtrl'
    }
})
.directive('fuguDropdownToggle',function () {
    return {
        restrict: 'A',
        require:'^fuguDropdown',
        link: function (scope,el,attrs,$dropdown) {
            $dropdown.appendToggle(el);
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