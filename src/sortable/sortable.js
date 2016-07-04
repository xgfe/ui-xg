/**
 * sortable
 * sortable directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.xg.sortable', [])
    .service('uixSortableService', function () {
        return {};
    })
    .directive('uixSortable', ['$parse', '$timeout', 'uixSortableService',
        function ($parse, $timeout, uixSortableService) {
            return {
                restrict: 'AE',
                scope: {
                    uixSortable: '=',
                    onChange:'&'
                },
                link: function ($scope, ele) {
                    var self = this;
                    if ($scope.uixSortable) {
                        $scope.$watch('uixSortable', function () {
                            // Timeout to let ng-repeat modify the DOM
                            $timeout(function () {
                                self.refresh(ele, $scope);
                            }, 0, false);
                        });
                        $scope.$watch('uixSortable.length', function () {
                            $timeout(function () {
                                self.refresh(ele, $scope);
                            }, 0, false);
                        });
                    }
                    self.refresh = function (element, scope) {
                        var children = element.children();
                        children.off('dragstart dragend');
                        element.off('dragenter dragover drop dragleave');
                        angular.forEach(children, function (item, i) {
                            var child = angular.element(item);
                            child.attr('draggable', 'true').css({cursor: 'move'}).on('dragstart', function (event) {
                                    event = event.originalEvent || event;
                                    if (element.attr('draggable') == 'false') {
                                        return;
                                    }
                                    event.dataTransfer.effectAllowed = "move";
                                    event.dataTransfer.setDragImage(item, 10, 10);

                                    $timeout(function () {
                                        //child.hide();
                                        item.originDisplay = item.style.display;
                                        item.style.display = 'none';
                                    }, 0);

                                    uixSortableService.element = element;
                                    uixSortableService.isDragging = true;
                                    uixSortableService.dragIndex = i;
                                    uixSortableService.placeholder = getPlaceholder(child);
                                    uixSortableService.sortScope = null;
                                    event.stopPropagation();
                                })
                                .on('dragend', function (event) {
                                    event = event.originalEvent || event;

                                    $timeout(function () {
                                        //child.show();
                                        item.style.display = item.originDisplay;
                                    }, 0);
                                    uixSortableService.isDragging = false;
                                    uixSortableService.dragIndex = null;
                                    uixSortableService.placeholder = null;
                                    uixSortableService.element = null;

                                    event.stopPropagation();
                                    event.preventDefault();
                                });
                        });

                        //父元素绑定drop事件
                        var listNode = element[0], placeholder, placeholderNode;
                        element.on('dragenter', function (event) {
                                event = event.originalEvent || event;
                                if (!uixSortableService.isDragging
                                    || uixSortableService.element !== element) {
                                    return false;
                                }
                                placeholder = uixSortableService.placeholder;
                                placeholderNode = placeholder[0];
                                event.preventDefault();
                            })
                            .on('dragover', function (event) {
                                event = event.originalEvent || event;
                                if (!uixSortableService.isDragging
                                    || uixSortableService.element !== element) {
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
                                        while (placeholderNode.nextElementSibling && !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                                            listNode.insertBefore(placeholderNode,
                                                placeholderNode.nextElementSibling.nextElementSibling);
                                        }
                                    }
                                }
                                element.addClass("uix-sortable-dragover");
                                event.preventDefault();
                                event.stopPropagation();
                                return false;
                            })
                            .on('drop', function (event) {
                                event = event.originalEvent || event;

                                if (!uixSortableService.isDragging
                                    || uixSortableService.element !== element) {
                                    return true;
                                }
                                var dragIndex = uixSortableService.dragIndex;
                                var placeholderIndex = getPlaceholderIndex(placeholderNode, listNode, dragIndex);
                                scope.$apply(function () {
                                    // 改变数据,由angular进行DOM修改
                                    var dragObj = scope.uixSortable[dragIndex];
                                    scope.uixSortable.splice(dragIndex, 1);
                                    scope.uixSortable.splice(placeholderIndex, 0, dragObj);
                                    if(scope.onChange && angular.isFunction(scope.onChange)){
                                        scope.onChange();
                                    }
                                });
                                placeholder.remove();
                                element.removeClass("uix-sortable-dragover");
                                event.stopPropagation();
                                return false;
                            })
                            .on('dragleave', function (event) {
                                event = event.originalEvent || event;
                                element.removeClass("uix-sortable-dragover");
                                $timeout(function () {
                                    if (!element.hasClass('uix-sortable-dragover') && placeholder) {
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
                    function getPlaceholderIndex(placeholderNode, listNode, dragIndex) {
                        var index = Array.prototype.indexOf.call(listNode.children, placeholderNode);
                        return index > dragIndex ? --index : index;
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
                     * @param el
                     * @returns {*}
                     */
                    function getPlaceholder(el) {
                        var placeholder = el.clone();
                        placeholder.html('');
                        placeholder.css({
                            listStyle: 'none',
                            border: '1px dashed #CCC',
                            minHeight: '10px',
                            height: el[0].offsetHeight + 'px',
                            width: el[0].offsetWidth + 'px',
                            background: 'rgba(0, 0, 0, 0)'
                        });
                        return placeholder;
                    }
                }
            }
        }]);