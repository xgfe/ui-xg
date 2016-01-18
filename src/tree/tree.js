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

