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