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