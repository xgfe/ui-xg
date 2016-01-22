/*
 * angular-ui-fugu
 * Version: 0.0.1 - 2016-01-22
 * License: ISC
 */
angular.module("ui.fugu", ["ui.fugu.tpls","ui.fugu.alert","ui.fugu.button","ui.fugu.dropdown","ui.fugu.pager","ui.fugu.tree"]);
angular.module("ui.fugu.tpls", ["alert/templates/alert.html","button/templates/button.html","dropdown/templates/dropdown-choices.html","dropdown/templates/dropdown.html","pager/templates/pager.html"]);
/**
 * alert
 * 警告提示指令
 * Author:heqingyang@meituan.com
 * Date:2015-01-11
 */
angular.module('ui.fugu.alert',[])
.controller('fuguAlertCtrl',['$scope','$attrs', '$timeout','$interpolate', function ($scope,$attrs,$timeout,$interpolate) {

    //指令初始化
    function initConfig(){
        if($scope.close&&($scope.close=="true"||$scope.close=="1")) {$scope.closeable=true;}
        else {$scope.closeable = false;}
        $scope.defaultclose = false;
        $scope.hasIcon = $attrs.hasIcon&&$attrs.hasIcon=="true";
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
            close : '@',
            closeFunc : '&',
            closeText : '@'
        },
        controller:'fuguAlertCtrl',
        controllerAs: 'alert'
    }
});
/**
 * button
 * 按钮指令
 * Author:penglu02@meituan.com
 * Date:2016-01-12
 */
angular.module('ui.fugu.button', [])
    .constant('buttonConfig', {

    })
    .directive('fuguButton', [function(){
        return {
            restrict: 'AE',
            scope:{
                disabled: '=?',   // 对于不是必须传递需要使用?
                loading: '=?',
                onClick : '&?click'
            },
            replace:false,
            templateUrl: 'templates/button.html',
            controller: 'buttonController',
            link: function(scope, element, attrs){
               element = angular.element(element.children()[0]);
               var btnClass = getAttrValue(attrs.btnclass, 'default'), // 样式:primary|info等,默认default
                    size  = getAttrValue(attrs.size, 'default'), // 大小:x-small,small等,默认为default
                    block = getAttrValue(attrs.block, false), //是否按100%的width填充父标签,默认为false
                    active = getAttrValue(attrs.active, false),// 激活状态,默认为false
                    type = getAttrValue(attrs.type, 'button'), // 按钮类型:button|submit|reset,默认为button
                    text = getAttrValue(attrs.text, 'button'), //按钮显示文本,默认为Button
                    icon = getAttrValue(attrs.icon, ''); //按钮图标,默认没有
                scope.text = scope.initText = text;
                scope.type = type;
                scope.icon = 'glyphicon-' + icon;
                scope.iconFlag = icon !== ''  ? true : false;
                scope.disabled =  scope.initDisabled =angular.isDefined(scope.disabled) ?  scope.disabled : false; // 是否不可用,默认为false
                scope.loading = angular.isDefined(scope.loading) ?  scope.loading : false; // 是否有加载效果,默认为false
               /**
                 * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
                 * @param {string} attributeValue 标签绑定数据(可解析|定值)
                 * @param {string | boolean} defaultValue 默认值
                 * @returns {*} 最终值
                 */
               function getAttrValue(attributeValue, defaultValue){
                    var val = scope.$parent.$eval(attributeValue);   //变量解析
                    return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
               }
               element.addClass('btn-' + btnClass); //设置按钮样式

               // 设置按钮大小
               switch(size)
               {
                    case 'large':
                        size = 'lg';
                        break;
                    case 'small':
                        size = 'sm';
                        break;
                    case 'x-small':
                        size = 'xs';
                        break;
                    default:
                        size = 'default';
                        break;
               }

               element.addClass('btn-' + size); //设置按钮大小

               // 设置block
               if(block){
                    element.addClass('btn-block');
               }

               // 设置active状态
               if(active){
                    element.addClass('active');
               }

               scope.$watch('disabled', function(val){
                    if(val){
                        element.attr('disabled', 'disabled');
                    }else{
                        element.removeAttr('disabled');
                    }
               });

               // button绑定click事件
               element.bind('click', function(){
                    if(scope.onClick){
                        scope.onClick();
                        scope.$parent.$apply();
                    }
               });
               scope.$watch('loading', function(val){
                    var spanEle = element.children('span.glyphicon-refresh-animate'),
                        ele = null;
                   if(val){
                        scope.disabled = val;
                        if(spanEle.length > 0){
                            spanEle.removeClass('hidden');
                        }else{
                            scope.text = 'isLoading...';
                            ele = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';
                            element.prepend(ele);
                        }
                    }else{
                        scope.disabled = scope.initDisabled;
                        scope.text = scope.initText;
                        if(spanEle.length > 0){
                            spanEle.addClass('hidden');
                        }
                    }
               });
            }
        }
    }])
    .controller('buttonController', ['$scope', function($scope){
        $scope.btnClassArr = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'];  // 所有可设置样式
        $scope.sizeArr = ['large', 'small', 'x-small', 'default'];  // 所有可设置大小
        $scope.typeArr = ['button', 'reset', 'submit'];  // 所有可设置类型
    }]);

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
.controller('fuguPagerCtrl',['$scope', function ($scope) {

    var pageOffset = 0,
        initialized = false;

    this.init = function (fuguPagerConfig) {
        $scope.itemsPerPage = $scope.itemsPerPage || fuguPagerConfig.itemsPerPage;
        $scope.maxSize = $scope.maxSize || fuguPagerConfig.maxSize;
        $scope.getText = function (key){
            return $scope[key + 'Text'] || fuguPagerConfig[key + 'Text'];
        };
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
.directive('fuguPager', ['fuguPagerConfig', function (fuguPagerConfig) {
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
            fuguPagerCtrl.init(fuguPagerConfig);
        }
    }
}]);
/**
 * ngCheckboxTree Module
 *
 */
(function() {
    'use strict';
    angular.module('ngCheckboxTree', []).directive('ngCheckboxTree',  function() {
        return {
            name: 'tuSimpleTree',
            scope: {
                treeData: '=',
                treeSelected: '='
            },
            require: '?^ngModel',
            restrict: 'E',
            replace: 'true',
            template: '<div class="ng-checkbox-tree"></div>',
            transclude: false,
            link: function(scope, ele, attrs) {
                var indexTree = angular.element(ele);

                //监控treeDtata
                scope.$watch('treeData', function() {
                    removeBranches(indexTree);
                    createBranches(scope.treeData, indexTree);
                    if (attrs.leafOnly === "on") {
                        leafOnly();
                    }
                    //
                    indexTree.find('input').bind('change', function() {
                        select(angular.element(this));
                    });
                }, true);

                //递归地创建分支
                function createBranches(data, treeNode) {
                    var treeBase = null,
                        newTreeNode = null,
                        i = 0;

                    if (data.length > 0) {
                        treeBase = treeNode.append('<ul></ul>').children('ul');
                        for (i = 0; i < data.length; i++) {
                            newTreeNode = treeBase.append('<li><input type="checkbox" value=' + data[i].id + '/>' + data[i].title + '</li>').children('li:eq(' + i + ')');
                            createBranches(data[i].nodes, newTreeNode);
                        }
                    }
                }
                function leafOnly () {
                    var self = null,
                        isLeaf = null;
                        indexTree.find('li').each(function () {
                            self = angular.element(this);
                            isLeaf = self.children('ul').length === 0;
                        if (!isLeaf) {
                            self.children('input').remove();
                        }
                    }) ;
                }
                //移除分支
                function removeBranches(treeNode) {
                    treeNode.empty();
                }

                function select(checkbox) {
                    var currentUl = checkbox.parent().parent();
                    var currentsLi = currentUl.children('li');
                    var childrenCheckbox = checkbox.parent().find('input');
                    if (attrs.treeLinkage === "on") {
                        linkage ();
                    }
                    //check数据导出
                    var checkSet = indexTree.find('input');
                    scope.treeSelected = [];
                    checkSet.each(function() {
                        if (angular.element(this).is(':checked')) {
                            scope.treeSelected.push(angular.element(this).val());
                        }
                    });
                    scope.$apply();
                    //若一个复选框选中，且同级复选框都为选中状态，父级复选框自动选中，此行为递归至条件不满足为止
                    function linkage () {
                        if (checkbox.is(':checked')) {
                            //若一个复选框选中，它的所有子选框自动选中；
                            childrenCheckbox.each(function() {
                                angular.element(this).prop('checked', true);
                            });
                            //
                            selectParents(currentsLi);
                        } else {
                            //若一个复选框从选中状态切换到没有选中，则为其所有子选框取消选中状态。
                            childrenCheckbox.each(function() {
                                angular.element(this).prop('checked', false);
                            });

                            cancelParents(currentsLi);
                        }

                        function selectParents(currentsLi) {
                            var currentAllSelected = true,
                                parentLi = null,
                                parentsLi = null;
                                currentsLi.each(function() {
                                if (!angular.element(this).children('input').is(':checked')) {
                                    currentAllSelected = false;
                                }
                            });
                            if (currentAllSelected) {
                                parentLi = currentsLi.parent().parent();
                                parentsLi = currentsLi.parent().parent().parent().children('li');
                                if (parentLi.length > 0) {
                                    parentLi.children('input').prop('checked', true);
                                    selectParents(parentsLi);
                                }
                            }
                        }

                        function cancelParents(currentsLi) {
                            //若一个复选框取消选中，父级复选框递归取消选中
                            var parentLi = currentsLi.parent().parent();
                            var parentsLi = currentsLi.parent().parent().parent().children('li');
                            if (parentLi.length > 0) {
                                parentLi.children('input').prop('checked', false);
                                cancelParents(parentsLi);
                            }
                        }
                    }

                }
            }
        };
    });
})();
/**
 * tree
 * 树形菜单指令
 * Author:penglu02@meituan.com
 * Date:2016-01-06
 */
angular.module('ui.fugu.tree',[])
    .constant('treeConfig', {
        treeClass: 'fugu-tree',
        nodeClass: 'fugu-tree-node',
        defaultCollapsed: false
    })
    .directive('tree', ['treeConfig', '$parse', function(treeConfig, $parse){
        return {
            //require: '',
            restrict:'AE',
            scope:true,
            replace:true,
            templateUrl:'template/tree.html',
            controller:'treeController',
            link: function(scope, element, attrs){
                scope.node = $parse(attrs.nodes)(scope);
            }
        }
    }])
    .controller('treeController', ['$scope','$element', function($scope, $element){
        var _scope = $scope;
        $scope.collapsed = false;
        $scope.selected = false;
        $scope.$on('clickFn', function(event, data){
            $scope.collapsed = data;
        });
        $scope.inputs = $element.find('input');
        $scope.$on('click-parent', function(e, data){
            _scope.clickNode = data;
        })
    }])
    .controller('treeNodeController', ['$scope','$element', function($scope, $element){
        $scope.$on('checked-change-child',function(event, selected){
            event.currentScope.selected = selected;
            event.currentScope.ele.find('input')[0].checked = selected;
        });
        $scope.$on('checked-change-parent',function(event, selected){
            var parentNodes = event.currentScope.ele,
                parentScope = event.currentScope,
                parentChilds = parentNodes.find('input'),
                flag = true,
                i = null;
            if(typeof parentScope.selected !== 'undefined'){
                for (i=1; i<parentChilds.length; i++){
                    if(parentChilds[i].checked !== selected){
                        flag = false;
                    }
                }
                if(!selected){
                    event.currentScope.selected = selected;
                    parentChilds[0].checked = selected;
                }else{
                    // 选中状态
                    if(flag){
                        event.currentScope.selected = selected;
                        parentChilds[0].checked = selected;
                    }
                }
            }
        });
        $scope.ele = $element;
        $scope.selected = false;
        $scope.clickFn = function(node){
            $scope.$emit('click-parent', node);
            // 具有子元素
            if(node.node.nodes && node.node.nodes.length > 0){
                $scope.collapsed = !$scope.collapsed;  // 闭合元素
            }else{
                //console.log('单击的是叶子节点');
            }
        };
        $scope.add = function(e, node){
            var newNode = {text:node.node.text+'.1', nodes:[]};
            if(node.node.nodes){
                node.node.nodes.push(newNode);
            }
            if(!node.node.nodes){
                node.node.nodes=[newNode];
            }
            e.stopPropagation();
        };
        $scope.delete = function(e, node){
            $element.empty();
            node.node = null;
            e.stopPropagation();
        };
        $scope.checkFn = function(selected){
            $scope.$broadcast('checked-change-child', selected);
            $scope.$emit('checked-change-parent', selected);
        };

        // 阻止选择框单击事件
        $scope.preventClick = function(e){
            e.stopPropagation();
        }
    }])
    .directive('treeNode', ['treeConfig', '$parse', '$compile', function(treeConfig, $parse, $compile){
        return {
            //require: '',
            restrict:'AE',
            scope:true,
            replace:true,
            require:['?^ngModel', '^tree'],
            controller:'treeNodeController',
            templateUrl:'template/tree-node.html',
            link: function(scope, element, attrs, ctrls){
                var node = $parse(attrs.nodes)(scope),
                    modelCtrl = ctrls[0],
                    tpl = "",
                    htmlTpl = "";
                scope.node = node;
                if(modelCtrl){
                    tpl = '<li ng-repeat="node in  node.nodes"><tree-node nodes="node"></tree-node><ol></ol></li>';
                    htmlTpl = $compile(tpl)(scope);
                    element.find('ol').append(htmlTpl);
                }
            }
        }
    }]);


angular.module("alert/templates/alert.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/alert.html",
    "<div ng-show=\"!defaultclose\" class=\"alert fugu-alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">"+
    "    <div ng-show=\"hasIcon\" class=\"alert-icon\">"+
    "        <span class=\"alert-icon-span glyphicon\" ng-class=\"'glyphicon-'+iconClass\"></span>"+
    "    </div>"+
    "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"closeFunc({$event: $event})\">"+
    "        <span ng-if=\"!closeText\">&times;</span>"+
    "        <span class=\"cancel-text\" ng-if=\"closeText\">{{closeText}}</span>"+
    "    </button>"+
    "    <div ng-class=\"[hasIcon?'show-icon' : null]\" ng-transclude></div>"+
    "</div>");
}]);
angular.module("button/templates/button.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/button.html",
    "<button class=\"btn\" type=\"{{type}}\" ng-class=\"{'btn-addon': iconFlag}\"><i class=\"glyphicon\" ng-class=\"icon\" ng-show=\"iconFlag\"></i>{{text}}</button>");
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
    "        <a href=\"javascript:void(0)\" ng-click=\"first()\">{{getText('first')}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isFirst()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"previous()\">{{getText('previous')}}</a>"+
    "    </li>"+
    "    <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"selectPage(page.pageIndex)\">{{page.pageIndex + 1}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"next()\">{{getText('next')}}</a>"+
    "    </li>"+
    "    <li ng-class=\"{disabled: isLast()}\">"+
    "        <a href=\"javascript:void(0)\" ng-click=\"last()\">{{getText('last')}}</a>"+
    "    </li>"+
    "    <li class=\"disabled\">"+
    "        <a href=\"javascript:void(0)\">共{{totalPages}}页 / {{totalItems}}条</a>"+
    "    </li>"+
    "</ul>");
}]);