/**
 * sortable
 * sortable directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.fugu.sortable', [])
    .service('fuguSortableService', function () {return {};})
    .directive('fuguSortable', ['$parse', '$timeout', 'fuguSortableService',
        function ($parse, $timeout, fuguSortableService) {
        return {
            restrict: 'AE',
            scope: {
                fuguSortable:'='
            },
            link: function (scope, element) {
                var self = this;
                if(scope.fuguSortable){
                    scope.$watch('fuguSortable.length', function() {
                        // Timeout to let ng-repeat modify the DOM
                        $timeout(function() {
                            self.refresh();
                        }, 0, false);
                    });
                }
                self.refresh = function () {
                    var children = element.children();
                    children.off('dragstart dragend');
                    element.off('dragenter dragover drop dragleave');
                    angular.forEach(children,function (item,i) {
                        var child = angular.element(item);
                        child.attr('draggable', 'true').css({cursor:'move'}).on('dragstart', function (event) {
                                event = event.originalEvent || event;
                                if (element.attr('draggable') == 'false') {
                                    return;
                                }
                                event.dataTransfer.effectAllowed = "move";
                                event.dataTransfer.setDragImage(item,10, 10);

                                $timeout(function() {
                                    //child.hide();
                                    item.originDisplay = item.style.display;
                                    item.style.display = 'none';
                                }, 0);

                                fuguSortableService.isDragging = true;
                                fuguSortableService.dragIndex = i;
                                fuguSortableService.placeholder = getPlaceholder(child);
                                event.stopPropagation();
                            })
                            .on('dragend', function (event) {
                                event = event.originalEvent || event;

                                $timeout(function() {
                                    //child.show();
                                    item.style.display = item.originDisplay;
                                }, 0);
                                fuguSortableService.isDragging = false;
                                fuguSortableService.dragIndex = null;
                                fuguSortableService.placeholder = null;
                                event.stopPropagation();
                                event.preventDefault();
                            });
                    });

                    //父元素绑定drop事件
                    var listNode = element[0],placeholder,placeholderNode;
                    element.on('dragenter', function (event) {
                            event = event.originalEvent || event;
                            if (!fuguSortableService.isDragging) {
                                return false;
                            }
                            placeholder = fuguSortableService.placeholder;
                            placeholderNode = placeholder[0];
                            event.preventDefault();
                        })
                        .on('dragover', function (event) {
                            event = event.originalEvent || event;
                            if (!fuguSortableService.isDragging) {
                                return false;
                            }
                            if (placeholderNode.parentNode != listNode) {
                                element.append(placeholder);
                            }
                            if (event.target !== listNode) {
                                var listItemNode = event.target;
                                while (listItemNode.parentNode !== listNode && listItemNode.parentNode) {
                                    listItemNode = listItemNode.parentNode;
                                }
                                if (listItemNode.parentNode === listNode && listItemNode !== placeholderNode) {
                                    if (isMouseInFirstHalf(event, listItemNode)) {
                                        listNode.insertBefore(placeholderNode, listItemNode);
                                    } else {
                                        listNode.insertBefore(placeholderNode, listItemNode.nextSibling);
                                    }
                                }
                            } else {
                                if (isMouseInFirstHalf(event, placeholderNode, true)) {
                                    while (placeholderNode.previousElementSibling
                                    && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true)
                                    || placeholderNode.previousElementSibling.offsetHeight === 0)) {
                                        listNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
                                    }
                                } else {
                                    while (placeholderNode.nextElementSibling &&
                                    !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                                        listNode.insertBefore(placeholderNode,
                                            placeholderNode.nextElementSibling.nextElementSibling);
                                    }
                                }
                            }
                            element.addClass("fugu-sortable-dragover");
                            event.preventDefault();
                            event.stopPropagation();
                            return false;
                        })
                        .on('drop', function (event) {
                            event = event.originalEvent || event;

                            if (!fuguSortableService.isDragging) {
                                return true;
                            }
                            var dragIndex = fuguSortableService.dragIndex;
                            var placeholderIndex = getPlaceholderIndex(placeholderNode,listNode,dragIndex);
                            scope.$apply(function() {
                                // 改变数据,由angular进行DOM修改
                                var dragObj = scope.fuguSortable[dragIndex];
                                scope.fuguSortable.splice(dragIndex,1);
                                scope.fuguSortable.splice(placeholderIndex,0,dragObj)
                            });
                            placeholder.remove();
                            element.removeClass("fugu-sortable-dragover");
                            event.stopPropagation();
                            return false;
                        })
                        .on('dragleave', function(event) {
                            event = event.originalEvent || event;
                            element.removeClass("fugu-sortable-dragover");
                            $timeout(function() {
                                if(!element.hasClass('fugu-sortable-dragover')){
                                    placeholder.remove();
                                }
                            }, 0);
                        });
                };
                /**
                 * 获取placeholder的索引
                 * @param placeholderNode - placeholder的节点
                 * @param listNode - 列表节点
                 * @param dragIndex - 被拖拽的节点索引
                 * @returns {number}
                 */
                function getPlaceholderIndex(placeholderNode,listNode,dragIndex) {
                    var index = Array.prototype.indexOf.call(listNode.children, placeholderNode);
                    return index > dragIndex?--index:index;
                }

                /**
                 * 判断鼠标位置是否在targetNode上一半
                 */
                function isMouseInFirstHalf(event, targetNode, relativeToParent) {
                    var mousePointer = event.offsetY || event.layerY;
                    var targetSize = targetNode.offsetHeight;
                    var targetPosition = targetNode.offsetTop;
                    targetPosition = relativeToParent ? targetPosition : 0;
                    return mousePointer < targetPosition + targetSize / 2;
                }

                /**
                 * 获取placeholder元素
                 * @param ele
                 * @returns {*}
                 */
                function getPlaceholder(ele){
                    var placeholder = ele.clone();
                    placeholder.html('');
                    placeholder.css({
                        listStyle: 'none',
                        border: '1px dashed #CCC',
                        minHeight:'10px',
                        height:ele[0].offsetHeight+'px',
                        width:ele[0].offsetWidth+'px',
                        background:'transparent'
                    });
                    return placeholder;
                }
            }
        }
    }]);