/*
 * angular-ui-fugu
 * Version: 0.0.1 - 2016-02-02
 * License: ISC
 */
angular.module("ui.fugu", ["ui.fugu.tpls","ui.fugu.alert","ui.fugu.button","ui.fugu.buttonGroup","ui.fugu.dropdown","ui.fugu.pager","ui.fugu.searchBox","ui.fugu.switch","ui.fugu.tree"]);
angular.module("ui.fugu.tpls", ["alert/templates/alert.html","button/templates/button.html","buttonGroup/templates/buttonGroup.html","dropdown/templates/dropdown-choices.html","dropdown/templates/dropdown.html","pager/templates/pager.html","searchBox/templates/searchBox.html","switch/templates/switch.html","tree/templates/tree-node.html","tree/templates/tree.html"]);
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
 * button
 * 按钮组指令
 * Author:penglu02@meituan.com
 * Date:2016-01-23
 */
angular.module('ui.fugu.buttonGroup', [])
    .constant('buttonGroupConfig', {
        size : 'default',   // 按钮组大小:x-small,small,default,larger
        type : 'radio',  // 按钮组类型:radio 或者 checkbox类型
        showClass : 'default', //按钮组样式:danger | warning | default | success | info ｜ primary
        checkboxTrue : true, // 按钮选中对应ngModel的值
        checkboxFalse : false, //按钮不选对应ngModel的值
        disabled : false  // 按钮组不可用状态
    })
    .controller('buttonGroupController',['$transclude', '$scope', '$element', '$attrs', 'buttonGroupConfig', function($transclude, $scope, $element, $attrs, buttonGroupConfig){
        var transcludeEles = $transclude(),// 获取嵌入元素 TODO:1.2.25版本不需要传入$scope，否则会报错
            i = 0,
            tagName,
            childElements = [],
            btnObj = {};

        // 根据插入按钮，生成嵌入元素数据对象
        for (;i < transcludeEles.length; i++ ){
            tagName = transcludeEles[i].tagName;
            if(tagName && tagName.toLocaleLowerCase() === 'button'){
                btnObj = {};
                btnObj.value = transcludeEles[i].innerText;   // 获取button显示内容
                btnObj.btnRadio = getAttrValue(angular.element(transcludeEles[i]).attr('btn-radio'), "");  //获取btn-radio属性对应值:控制选中状态
                btnObj.btnCheckbox = getAttrValue(angular.element(transcludeEles[i]).attr('btn-checkbox'), "");  //获取btn-checkbox属性对应值:控制勾选状态
                childElements.push(btnObj);
            }
        }

        $scope.buttons = childElements;
        $scope.type = getAttrValue($attrs.type, buttonGroupConfig.type);  //按钮组类型:radio | checkbox
        $scope.size = getAttrValue($attrs.size, buttonGroupConfig.size);  // 按钮组大小
        $scope.showClass = getAttrValue($attrs.showClass, buttonGroupConfig.showClass); //按钮组样式
        $scope.checkboxTrue = getAttrValue($attrs.checkboxTrue, buttonGroupConfig.checkboxTrue);   //checkbox选中对应model值
        $scope.checkboxFalse = getAttrValue($attrs.checkboxFalse, buttonGroupConfig.checkboxFalse);   //checkbox不选对应model值
        $scope.disabled = getAttrValue($attrs.disabled, buttonGroupConfig.disabled);

        // 设置按钮大小,转变成class
        switch($scope.size)
        {
            case 'large':
                $scope.size = 'btn-lg';
                break;
            case 'small':
                $scope.size = 'btn-sm';
                break;
            case 'x-small':
                $scope.size = 'btn-xs';
                break;
            default:
                $scope.size = 'btn-default';
                break;
        }

        // 设置按钮样式类型,转变成class
        $scope.showClass = "btn-" + $scope.showClass;

        // 设置不可用
        if($scope.disabled) {
            $scope.disabled = 'disabled';
        }
        /**
         * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
         * @param {string} attributeValue 标签绑定数据(可解析|定值)
         * @param {string | boolean} defaultValue 默认值
         * @returns {*} 最终值
         */
        function getAttrValue(attributeValue, defaultValue){
            var val = $scope.$parent.$eval(attributeValue);   //变量解析
            return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
        }
    }])
    .directive('fuguButtonGroup', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                ngModel: '@'
            },
            require: '^ngModel',
            templateUrl: 'templates/buttonGroup.html',
            transclude:true,
            controller: 'buttonGroupController',
            link: function (scope, element, attrs, ngModelCtrl) {
                var _scope = scope,
                    o, i;
                scope.modelObj = angular.copy(scope.$parent.$eval(scope.ngModel));  // 复制获取元素的model
                if(scope.type === 'radio'){   //radio类型

                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        angular.forEach(scope.buttons, function(val){
                            if(!val.btnRadio){  // 没有设置btn-radio,使用元素的text作为默认值
                                val.btnRadio = val.value;
                            }
                            // 判断按钮组是否选中:btn-radio设置model值
                            if(angular.equals(ngModelCtrl.$modelValue, val.btnRadio)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                            }
                        });
                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }
                        ngModelCtrl.$setViewValue(btn.btnRadio); // 修改选中对应model值
                        ngModelCtrl.$render();
                    };
                }else{    // checkbox类型
                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        angular.forEach(scope.buttons, function(val, idx){
                            i = 0;
                            if(!val.btnCheckbox){  // 没有设置值,则使用对应ng-model的key作为默认值
                                for(o in scope.modelObj){
                                    if(i === idx){
                                        val.btnCheckbox = o;
                                        break;
                                    }else{
                                        i++;
                                    }
                                }
                            }

                            // 判断给定当前checkbox状态是否选中model的值(btn-checkbox对应model中的值是否为true)
                            // btn-checkbox值的设置为ng-model对应对象的key
                            if(angular.equals(scope.modelObj[val.btnCheckbox], scope.checkboxTrue)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                            }
                        });
                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }

                        if(btn.active){
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxFalse; // 修改选中状态:选中->不选,对应model值
                        }else{
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxTrue; //修改选中状态:不选->选中,对应model值
                        }
                        ngModelCtrl.$setViewValue(scope.modelObj);  // 修改model
                        ngModelCtrl.$render();
                    };
                }
            }
        }
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
 * searchBox
 * 搜索框
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-25
 */
angular.module('ui.fugu.searchBox',[])
.constant('fuguSearchBoxConfig', {
    btnText: '搜索', // 默认搜索按钮文本
    showBtn: true   // 默认显示按钮
})
.controller('fuguSearchBoxCtrl',['$scope','$attrs','fuguSearchBoxConfig', function ($scope,$attrs,fuguSearchBoxConfig) {
    var ngModelCtrl = { $setViewValue: angular.noop };
    $scope.searchBox = {};
    this.init = function (_ngModelCtrl) {
        if(_ngModelCtrl){
            ngModelCtrl = _ngModelCtrl;
        }
        ngModelCtrl.$render = this.render;
        $scope.showBtn = angular.isDefined($attrs.showBtn) ? $scope.$parent.$eval($attrs.showBtn) : fuguSearchBoxConfig.showBtn;
    };
    var btnText;
    $scope.getText = function () {
        if(btnText){
            return btnText;
        }
        btnText = angular.isDefined($attrs.btnText) ? $attrs.btnText : fuguSearchBoxConfig.btnText;
        return btnText;
    };
    $scope.$watch('searchBox.query', function (val) {
        ngModelCtrl.$setViewValue(val);
        ngModelCtrl.$render();
    });
    $scope.keyUpToSearch = function (evt) {
        if (evt && evt.keyCode === 13) {
            evt.preventDefault();
            evt.stopPropagation();
            $scope.doSearch();
        }
    };
    $scope.doSearch = function () {
        if(angular.isDefined($scope.search) && typeof $scope.search === 'function'){
            $scope.search();
        }
    };
    this.render = function() {
        if(ngModelCtrl.$viewValue){
            $scope.searchBox.query = ngModelCtrl.$viewValue;
        }
    };
}])
.directive('fuguSearchBox',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/searchBox.html',
        replace:true,
        require:['fuguSearchBox', '?ngModel'],
        scope:{
            btnText:'@?',
            showBtn:'=?',
            placeholder:'@?',
            search:'&?'
        },
        controller:'fuguSearchBoxCtrl',
        link: function (scope,el,attrs,ctrls) {
            var searchBoxCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            searchBoxCtrl.init(ngModelCtrl);
        }
    }
});
/**
 * switch
 * 开关
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-31
 */
angular.module('ui.fugu.switch', [])
    .constant('fuguSwitchConfig', {
        type: 'default',
        size: 'md',
        isDisabled: false
    })
    .controller('fuguSwitchCtrl', ['$scope', '$attrs','fuguSwitchConfig', function ($scope, $attrs,fuguSwitchConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        $scope.switchObj = {};
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            $scope.switchObj.isDisabled = getAttrValue('ngDisabled','isDisabled');
            $scope.switchObj.type = $scope.type || fuguSwitchConfig.type;
            $scope.switchObj.size = $scope.size || fuguSwitchConfig.size;
        };
        $scope.$watch('switchObj.query', function (val,old) {
            ngModelCtrl.$setViewValue(val);
            ngModelCtrl.$render();
            if(val !== old && $scope.onChange){
                $scope.onChange();
            }
        });
        this.render = function () {
            $scope.switchObj.query = ngModelCtrl.$viewValue;
        };
        function getAttrValue(attributeValue,defaultValue) {
            var val = $scope.$parent.$eval($attrs[attributeValue]);   //变量解析
            return val ? val : fuguSwitchConfig[defaultValue||attributeValue];
        }
    }])
    .directive('fuguSwitch', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/switch.html',
            replace: true,
            require: ['fuguSwitch', 'ngModel'],
            scope: {
                type:'@?',
                size:'@?',
                onChange:'&?'
            },
            controller: 'fuguSwitchCtrl',
            link: function (scope, el, attrs, ctrls) {
                var switchCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                switchCtrl.init(ngModelCtrl);
            }
        }
    });
/**
 * tree
 * 树形菜单指令
 * Author:penglu02@meituan.com
 * Date:2016-01-28
 */
angular.module('ui.fugu.tree', [])
    .constant('fuguTreeConfig', {
        showIcon: true,
        checkable: true,
        collapsedAll: false,
        editable: false
    })
    .controller('treeController', ['$scope', '$element', '$attrs', 'fuguTreeConfig', function ($scope, $element, $attrs, fuguTreeConfig) {
        this.checkedNodes = {}; // 选中节点集合
        // 变量初始化,如果没有设置,则使用默认值
        this.showIcon = angular.isDefined($scope.showIcon) ? $scope.showIcon : fuguTreeConfig.showIcon;
        this.checkable = angular.isDefined($scope.checkable) ? $scope.checkable : fuguTreeConfig.checkable;
        this.expandAll = angular.isDefined($scope.expandAll) ? !$scope.expandAll : fuguTreeConfig.collapsedAll;
        this.editable = angular.isDefined($scope.editable) ? $scope.editable : fuguTreeConfig.editable;
        $scope.nodes = $scope.$parent.$eval($attrs.ngModel);  // 获取ng-model绑定节点对象

    }])
    .directive('fuguTree', ['fuguTreeConfig', '$parse', function () {
        return {
            restrict: 'AE',
            scope: {
                showIcon: '=?',
                checkable: '=?',
                expandAll: '=?',
                editable: '=?',
                onClick: '&?',
                onCheckChange: '&?'
            },
            replace: true,
            require: ['ngModel'],
            templateUrl: 'templates/tree.html',
            controller: 'treeController',
            link: function (scope) {
                var clickFn = scope.onClick(),  //获取绑定在tree上的click事件回调
                    checkFn = scope.onCheckChange();  //获取绑定在tree上的check事件回调
                /**
                 * 捕获click事件，进行绑定事件处理
                 */
                scope.$on('on-click', function (e, data) {
                    if (angular.isDefined(clickFn)) {
                        clickFn(data);
                    }
                });

                /**
                 * 捕获check改变事件，绑定事件处理
                 */
                scope.$on('on-check', function(e, data){
                    if (angular.isDefined(clickFn)) {
                        checkFn(data);
                    }
                });
            }
        }
    }])
    .controller('treeNodeController', ['$scope', function ($scope) {


        /**
         * 阻止事件传播
         * @param {object} event 事件对象
         */
        $scope.preventClick = function (event) {
            event.stopPropagation();
        };

        /**
         * 向上派发单击事件,传递当前单击对象节点信息以及其子节点
         * @param {object} e 事件对象
         */
        $scope.clickFn = function (e) {
            $scope.$emit('on-click', e.node); // 向上派发事件,同时暴露出当前点击节点信息
        };

        $scope.toggleCollapsed = function(e, scope){
            e.stopPropagation();
            if(scope.node.children && scope.node.children.length > 0){
                $scope.collapsed = !$scope.collapsed;  // 闭合元素
            }
        };

        /**
         * 向上|向下派发事件(注意节点自身派发出去的事件，会被自身先捕获一次)
         * @param {boolean} selected checkbox选中|取消状态
         * @param self 选中|取消checkbox自己
         */
        $scope.checkFn = function (selected) {
            // 派发的先后顺序对代码执行会有影响
            $scope.$broadcast('check-change', selected);   // 向下派发事件
            $scope.$emit('check-change', selected);  // 向上派发事件
            $scope.$emit('on-check', $scope.treeCtrl.checkedNodes);  // 向上派发事件,同时向上暴露选中节点集合
        };

        /**
         * 捕获勾选状态修改事件,执行勾选|取消勾选操作,修改勾选集合
         */
        $scope.$on('check-change', function (event, selected) {
            var currentScope = event.currentScope,    //当前事件节点scope
                targetScope = event.targetScope,    // 原始触发选中|取消节点scope
                leafFlag = !(currentScope.node.children && currentScope.node.children.length > 0),  // 叶子节点标识
                parentFlag = false,   //子节点触发父节点(true)｜父节点触发子节点(false)标识
                selfFlag = true,    //节点本身勾选|不选标识
                targetParentScope = targetScope.$parent.$parent,  // 获取当前节点的父节点scope
                checkNodes = currentScope.treeCtrl.checkedNodes,  // 选中节点集合
                i = 0,
                childrensEle = null,   //当前节点非叶子节点时的孩子节点
                selectFlag = true,    // 孩子节点是否全部勾选标识
                childrenScope = null,  //遍历孩子节点的scope
                subElements = null;   //子节点对象集合

            // 判断是父节点触发还是子节点触发,还是自身触发
            if (targetScope.$id === currentScope.$id) {  //通过勾选|取消勾选触发
                parentFlag = false;
                selfFlag = true;
            } else {
                selfFlag = false;

                // 判断是否为子节点触发父节点:向上触发
                while (targetParentScope) {
                    if (targetParentScope.$id === currentScope.$id) {  // 目标触发节点是父节点
                        parentFlag = true;
                        break;
                    } else {
                        targetParentScope = targetParentScope.$parent ? targetParentScope.$parent.$parent : targetParentScope.$parent;   //获取父scope
                    }
                }
            }

            // 节点分为叶子节点和非叶子节点进行处理
            if (!leafFlag) {  // 非叶子节点

                if (selected) {   // 选中

                    // 判断是够为向上触发:子触发父
                    if (parentFlag) {
                        childrensEle = currentScope.ele.children('ol').children('li');  // 获取子节点
                        for (i = 0; i < childrensEle.length; i++) {
                            childrenScope = childrensEle.eq(i).children('div').children('div').children('input').scope();  // 获取当前遍历节点勾选框的scope
                            if (childrenScope.selected !== selected) { //判断孩子节点是否为选中状态
                                selectFlag = false;   //存在未否选孩子节点
                                break;
                            }
                        }
                        // 子选父:子节点全部勾选,则选中父节点
                        if (selectFlag) {
                            reselect(childrensEle, checkNodes);  //重新保存选中集合(父加入集合，则需要移除原有的子孙集合)
                            currentScope.selected = selected;
                            currentScope.ele.children('div').children('input').checked = selected;  // 实现勾选
                            checkNodes[currentScope.$id] = currentScope.node;  // 保存节点信息到集合
                        }
                    }

                    //判断是否为向下触发:父选择触发子选择
                    if (!parentFlag && !selfFlag) { //触发子非叶子节点
                        // 只需要修改勾选状态
                        event.currentScope.selected = selected;
                        event.currentScope.ele.children('div').children('input').checked = selected;
                    }

                    // 自己勾选触发事件
                    if (selfFlag) {
                        event.currentScope.selected = selected;  //修改勾选状态
                        event.currentScope.ele.children('div').children('input').checked = selected;
                        checkNodes[event.currentScope.$id] = event.currentScope.node;   // 保存节点信息
                        reselect(event.currentScope.ele.children('ol').children('li'), checkNodes);  //重新保存选中集合(父加入集合，则需要移除原有的子孙集合)
                    }

                } else {
                    // 修改勾选状态
                    currentScope.selected = selected;
                    currentScope.ele.children('div').children('input').checked = selected;
                    if (angular.isDefined(checkNodes[currentScope.$id])) {  // 判断当前节点是否再勾选集合中
                        delete  checkNodes[event.currentScope.$id];  // 删除勾选集合中当前元素
                    }

                    // 取消勾选子触发父节点也不选中
                    if (parentFlag) {
                        childrensEle = event.currentScope.ele.children('ol').children('li'); // 获取当前节点的孩子节点
                        for (i = 0; i < childrensEle.length; i++) {
                            subElements = childrensEle.eq(i).children('div').children('div').children('input');
                            if (subElements.scope().selected) {  // 判断子节点是否为选中
                                // 选中子节点的节点信息存入选中集合
                                checkNodes[subElements.scope().$id] = subElements.scope().node;
                            }
                        }
                    }
                }

            } else {   // 叶子节点

                // 父选子:向下触发,只需改变勾选状态,不用修改节点集合
                if (!parentFlag && !selfFlag) {
                    event.currentScope.selected = selected;
                    event.currentScope.ele.children('div').children('input').checked = selected;
                }

                // 自己选自己:修改勾选状态
                if (selfFlag) {
                    event.currentScope.selected = selected;
                    event.currentScope.ele.children('div').children('input').checked = selected;
                    if (selected) {  // 勾选的保存信息到节点集合
                        checkNodes[event.currentScope.$id] = event.currentScope.node;  // 保存节点信息
                    }
                }

                // 取消勾选时,从勾选节点集合中移除
                if (!selected) {
                    if (angular.isDefined(checkNodes[event.currentScope.$id])) {
                        delete  checkNodes[event.currentScope.$id];
                    }
                }
            }
        });

        /**
         * 选中父节点时,需要对选中节点数组进行重新选择，保证数组中出现的节点不重复(添加父亲node，则无需添加子node)
         * @param {array} ele:子元素对象数组
         * @param {array} checkNodes:tree选中节点数组集合
         */
        function reselect(ele, checkNodes) {
            var i = 0,
                subElements = null,
                subScope = null,
                innerEle = null;
            for (; i < ele.length; i++) {
                subElements = ele.eq(i).children('div').children('div').children('input');  // 获取子节点选择框
                subScope = subElements.scope(); //获取子节点
                if (subElements.length > 0 && angular.isDefined(checkNodes[subScope.$id])) {  // 判断取消节点是否为当前节点
                    delete checkNodes[subScope.$id]; // 如果当前子节点选中，则存入
                } else {
                    innerEle = ele.eq(i).children('div').children('ol').children('li');
                    if (innerEle.length > 0) {
                        reselect(innerEle, checkNodes);
                    }
                }
            }
        }
    }])
    .directive('treeNode', ['$parse', '$compile', function ($parse, $compile) {
        return {
            restrict: 'AE',
            scope: {
                node: '='
            },
            replace: true,
            require: ['^fuguTree'],
            templateUrl: 'templates/tree-node.html',
            controller: 'treeNodeController',
            link: function (scope, element, attrs, ctrls) {
                var tpl = null,
                    htmlTpl = null;
                scope.treeCtrl = ctrls[0];  // 保存树ctrl
                scope.ele = element;  // 保存节点元素
                scope.collapsed = scope.treeCtrl.expandAll;  // 文件夹展开|收起标识
                scope.showIcon = scope.treeCtrl.showIcon;  // 是否显示图标标识
                scope.checkable = scope.treeCtrl.checkable;  // 是否勾选标识

                // 动态插入子节点
                if (scope.node.children && scope.node.children.length > 0) {
                    tpl = '<li ng-repeat="node in  node.children"><tree-node data-node="node"></tree-node><ol></ol></li>';
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

angular.module("buttonGroup/templates/buttonGroup.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/buttonGroup.html",
    "<div class=\"btn-group\">"+
    "    <label class=\"btn  btn-default\"  ng-class=\"[showClass, size, disabled, btn.active]\" ng-repeat=\"btn in buttons\" ng-click=\"clickFn(btn, $event)\">{{btn.value}}</label>"+
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
angular.module("searchBox/templates/searchBox.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/searchBox.html",
    "<div ng-class=\"{'input-group':showBtn}\">"+
    "    <input type=\"text\" class=\"input-sm form-control\" ng-keyup=\"keyUpToSearch($event)\" placeholder=\"{{placeholder}}\" ng-model=\"searchBox.query\">"+
    "    <span class=\"input-group-btn\" ng-if=\"showBtn\">"+
    "        <button class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"doSearch()\">{{getText()}}</button>"+
    "    </span>"+
    "</div>"+
    "");
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
angular.module("switch/templates/switch.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/switch.html",
    "<label class=\"fugu-switch\" ng-class=\"['fugu-switch-'+switchObj.type,'fugu-switch-'+switchObj.size]\">"+
    "    <input type=\"checkbox\" ng-disabled=\"switchObj.isDisabled\" ng-model=\"switchObj.query\"/>"+
    "    <i></i>"+
    "</label>");
}]);
angular.module("tree/templates/tree-node.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/tree-node.html",
    "<div>"+
    "    <div class=\"cur\" ng-click=\"clickFn(this)\">"+
    "        <input type=\"checkbox\" ng-model=\"selected\" ng-change=\"checkFn(selected)\" ng-click=\"preventClick($event)\" ng-show=\"checkable\"/>"+
    "        <span ng-if=\"node.children && node.children.length > 0\" ng-click=\"toggleCollapsed($event, this)\">"+
    "            <i class=\"glyphicon\" ng-class=\"{'glyphicon-folder-close': collapsed&&showIcon, 'glyphicon-folder-open': !collapsed&&showIcon}\" ></i>"+
    "        </span>"+
    "        <span ng-if=\"!node.children || node.children.length == 0\" ng-click=\"preventClick($event)\">"+
    "            <i class=\"glyphicon glyphicon-file\" ng-show=\"showIcon\"></i>"+
    "        </span>"+
    "        {{node.label}}"+
    "        <span ng-show=\"editable\">"+
    "            <span class=\"btn btn-xs m-10-neg\" ng-click=\"add($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-plus-sign\"></i>"+
    "            </span>"+
    "            <span class=\"btn btn-xs m-10-neg\" ng-click=\"delete($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-trash\"></i>"+
    "            </span>"+
    "             <span class=\"btn btn-xs\" ng-click=\"edit($event, this)\">"+
    "                <i class=\"glyphicon glyphicon-edit\"></i>"+
    "            </span>"+
    "        </span>"+
    "    </div>"+
    "    <ol ng-show=\"!collapsed\">"+
    "    </ol>"+
    "</div>");
}]);
angular.module("tree/templates/tree.html",[]).run(["$templateCache",function($templateCache){
    $templateCache.put("templates/tree.html",
    "<div class=\"tree\">"+
    "    <ol ng-show=\"nodes && nodes.length > 0 && !collapsedAll\" class=\"tree-content\">"+
    "        <li ng-repeat=\"node in nodes\">"+
    "            <tree-node  data-node=\"node\" ng-if=\"node.children && node.children.length > 0\"></tree-node>"+
    "            <tree-node data-node=\"node\" ng-if=\"!node.children || node.children.length == 0\"></tree-node>"+
    "        </li>"+
    "    </ol>"+
    "</div>");
}]);