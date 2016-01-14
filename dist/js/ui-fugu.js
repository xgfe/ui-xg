/*
 * angular-ui-fugu
 * Version: 0.0.1 - 2016-01-13
 * License: ISC
 */
angular.module("ui.fugu", ["ui.fugu.tpls","ui.fugu.alert","ui.fugu.dropdown","ui.fugu.pager"]);
angular.module("ui.fugu.tpls", ["alert/templates/alert.html","dropdown/templates/dropdown-choices.html","dropdown/templates/dropdown.html","pager/templates/pager.html"]);
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
    multiColClass: 'fugu-dropdown' //控制多列显示的calss
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
.controller('fuguDropdownCtrl',['$scope','$rootScope','$element','fuguDropdownConfig','fuguDropdownService','fuguDropdown', function ($scope,$rootScope,$element,fuguDropdownConfig,fuguDropdownService,fuguDropdownProvider) {
    $scope.colsNum = fuguDropdownProvider.getColsNum();
    $scope.eachItemWidth = fuguDropdownConfig.eachItemWidth;
    $scope.openClass = fuguDropdownConfig.openClass;
    $scope.multiColClass = fuguDropdownConfig.multiColClass;

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
        if($scope.count>$scope.colsNum){
            $element.find('.dropdown-menu > li').css('width',100/$scope.colsNum+'%');
        }
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
angular.module('ui.fugu.pager',[])
.constant('fuguPagerConfig', {
    itemsPerPage: 20, //默认每页数目为20
    maxSize:5, //默认分页最大显示数目为5
    firstText:'首页',
    lastText:'尾页',
    previousText:'上一页',
    nextText:'下一页'
})
.controller('fuguPagerCtrl',['$scope','fuguPagerConfig', function ($scope,fuguPagerConfig) {

    var pageOffset = 0,
        initialized = false;

    this.init = function () {
        $scope.itemsPerPage = $scope.itemsPerPage || fuguPagerConfig.itemsPerPage;
        $scope.maxSize = $scope.maxSize || fuguPagerConfig.maxSize;
        $scope.firstText = $scope.firstText || fuguPagerConfig.firstText;
        $scope.lastText = $scope.lastText || fuguPagerConfig.lastText;
        $scope.previousText = $scope.previousText || fuguPagerConfig.previousText;
        $scope.nextText = $scope.nextText || fuguPagerConfig.nextText;
    };

    $scope.pages = [];
    $scope.currentPage = 0;
    $scope.totalPages = 1;

    $scope.$watch('pageNo', function (val) {
        $scope.selectPage(val-1 || 0)
    });
    $scope.$watch("totalItems", function (val) {
        if($scope.currentPage === -1){
            return;
        }
        $scope.totalPages = Math.ceil(val / $scope.itemsPerPage);
        if ($scope.totalPages <= 0 || isNaN($scope.totalPages)) {
            $scope.totalPages = 1;
        }
        if (initialized) {
            if (pageOffset > $scope.totalPages) {
                pageOffset = 0;
                if ($scope.currentPage < pageOffset
                    || $scope.currentPage >= pageOffset + $scope.pages.length) {
                    $scope.currentPage = 0;
                }
            }
        }
        resetPageList();
        initialized = true;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
        }
        $scope.selectPage($scope.currentPage);
    });

    function getOffset(page) {
        var offset = Math.min(page - Math.floor($scope.maxSize / 2), $scope.totalPages - $scope.maxSize);
        if (offset < 0 || isNaN(offset)) {
            offset = 0;
        }
        return offset;
    }

    function resetPageList() {
        $scope.pages = [];
        var last = Math.min(pageOffset + $scope.maxSize, $scope.totalPages),i;
        for (i = pageOffset; i < last; i++) {
            $scope.pages.push({
                text: i,
                pageIndex: i,
                active: false
            });
        }
    }

    $scope.isFirst = function () {
        return $scope.currentPage <= 0;
    };

    $scope.isLast = function () {
        return $scope.currentPage >= $scope.totalPages - 1;
    };

    $scope.selectPage = function (value) {
        if (value >= $scope.totalPages || value < 0) {
            return;
        }
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = false;
        }
        var offset = getOffset(value),oldPage = $scope.currentPage;
        if (offset != pageOffset) {
            pageOffset = offset;
            resetPageList();
        }
        $scope.currentPage = value;
        $scope.pageNo = value+1;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
        }
        var fn;
        if(angular.isDefined($scope.pageChanged) && oldPage !== $scope.currentPage){
            fn = $scope.pageChanged();
            if(fn && typeof fn === 'function'){
                fn($scope.currentPage+1);
            }
        }
    };

    $scope.first = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage(0);
    };

    $scope.last = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.totalPages - 1);
    };

    $scope.previous = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage($scope.currentPage - 1);
    };

    $scope.next = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.currentPage + 1);
    };
}])
.directive('fuguPager', function () {
    return {
        restrict: 'E',
        templateUrl:'templates/pager.html',
        replace:true,
        require:'fuguPager',
        scope:{
            itemsPerPage:'=?',
            totalItems:'=',
            pageNo:'=',
            maxSize:'=?',
            firstText:'@?',
            lastText:'@?',
            previousText:'@?',
            nextText:'@?',
            pageChanged:'&?'
        },
        controller:'fuguPagerCtrl',
        link: function (scope,el,attrs,fuguPagerCtrl) {
            fuguPagerCtrl.init();
        }
    }
});
angular.module("alert/templates/alert.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/alert.html",
    "<div ng-show=\"!defaultclose\" class=\"alert fugu-alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">"+
    "    <div ng-show=\"hasIcon\" class=\"alert-icon\">"+
    "        <span class=\"alert-icon-span glyphicon\" ng-class=\"'glyphicon-'+iconClass\"></span>"+
    "    </div>"+
    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"close({$event: $event})\">"+
    "        <span ng-if=\"!closeText\">&times;</span>"+
    "        <span class=\"cancel-text\" ng-if=\"closeText\">{{closeText}}</span>"+
    "    </button>"+
    "    <div ng-class=\"[hasIcon?'show-icon' : null]\" ng-transclude></div>"+
    "</div>");
}]);
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
    "    <ul class=\"dropdown-menu\" ng-style=\"{width:count>colsNum?colsNum*eachItemWidth:'auto'}\" ng-transclude></ul>"+
    "</div>");
}]);
angular.module("pager/templates/pager.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/pager.html",
    "<ul class=\"pagination pagination-sm m-t-none m-b-none\">"+
    "    <li ng-class=\"{disabled: isFirst()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"first()\">{{firstText}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isFirst()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"previous()\">{{previousText}}</a>"+
    "    </li>"+
    "    <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"selectPage(page.pageIndex)\">{{page.pageIndex + 1}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"next()\">{{nextText}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"last()\">{{lastText}}</a>"+
    "    </li>"+
    "    <li class=\"disabled\">"+
    "        <a href=\"javascript:void(0)\">共{{totalPages}}页 / {{totalItems}}条</a>"+
    "    </li>"+
    "</ul>");
}]);