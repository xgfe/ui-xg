/**
 * 数据表格 - datatable
 * 数据表格指令
 * 主要用于展示大量结构化数据。
 * 支持排序、固定列、固定表头、分页、自定义操作、单选多选等复杂功能。
 * 
 * Author: yjy972080142@gmail.com
 * Date:2019-08-13
 */
(function () {
    // set forTableHead to true when convertToRows, false in normal cases like table.vue
    const getDataColumns = (cols, forTableHead = false) => {
        const columns = cols;
        const result = [];
        columns.forEach((column) => {
            if (column.children) {
                if (forTableHead) {
                    result.push(column);
                }
                result.push.apply(result, getDataColumns(column.children, forTableHead));
            } else {
                result.push(column);
            }
        });
        return result;
    };
    const getRandomStr = function (len = 32) {
        const $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        const maxPos = $chars.length;
        let str = '';
        for (let i = 0; i < len; i++) {
            str += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    };
    const convertColumnOrder = (columns, fixedType) => {
        let list = [];
        let others = [];
        columns.forEach((col) => {
            if (fixedType) {
                if (col.fixed && col.fixed === fixedType) {
                    list.push(col);
                }
            } else {
                list.push(col);
            }
        });
        return list.concat(others);
    };
    const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g;
    const MOZ_HACK_REGEXP = /^moz([A-Z])/;
    function camelCase(name) {
        return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        }).replace(MOZ_HACK_REGEXP, 'Moz$1');
    }
    function getStyle(element, styleName) {
        if (!element || !styleName) {
            return null;
        }
        styleName = camelCase(styleName);
        if (styleName === 'float') {
            styleName = 'cssFloat';
        }
        try {
            // eslint-disable-next-line angular/document-service
            const computed = document.defaultView.getComputedStyle(element, '');
            return element.style[styleName] || computed ? computed[styleName] : null;
        } catch (evt) {
            return element.style[styleName];
        }
    }
    function getScrollBarSize() {
        // eslint-disable-next-line angular/document-service
        const inner = document.createElement('div');
        inner.style.width = '100%';
        inner.style.height = '200px';

        // eslint-disable-next-line angular/document-service
        const outer = document.createElement('div');
        const outerStyle = outer.style;

        outerStyle.position = 'absolute';
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = 'none';
        outerStyle.visibility = 'hidden';
        outerStyle.width = '200px';
        outerStyle.height = '150px';
        outerStyle.overflow = 'hidden';

        outer.appendChild(inner);

        // eslint-disable-next-line angular/document-service
        document.body.appendChild(outer);

        const widthContained = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        let widthScroll = inner.offsetWidth;

        if (widthContained === widthScroll) {
            widthScroll = outer.clientWidth;
        }

        // eslint-disable-next-line angular/document-service
        document.body.removeChild(outer);

        return widthContained - widthScroll;
    }

    angular.module('ui.xg.datatable', [])
        .constant('uixDatatableConfig', {
            loadingText: '数据加载中',
            emptyText: '数据为空',
            errorText: '加载失败',
            emptyDataHeight: 350 // 没有数据时，提示文案占据高度
        })
        .provider('uixDatatable', ['uixDatatableConfig', function (uixDatatableConfig) {
            let statusText = {
                loading: uixDatatableConfig.loadingText,
                empty: uixDatatableConfig.emptyText,
                error: uixDatatableConfig.errorText
            };
            this.setStatusText = function (options) {
                statusText = angular.extend(statusText, options);
            };
            this.$get = function () {
                return {
                    getStatusText: function (type) {
                        if (angular.isDefined(type)) {
                            return statusText[type];
                        }
                        return statusText;
                    }
                };
            };
        }])
        .controller('uixDatatableCtrl', ['$scope', '$timeout', '$element', 'uixDatatableConfig',
            function ($scope, $timeout, $element, uixDatatableConfig) {
                const $table = this;
                $table.scrollBarWidth = getScrollBarSize();
                $table.scrollPosition = 'left';

                $table.fixedLeftTableStyle = {}; // 左侧固定表格样式
                $table.fixedRightTableStyle = {}; // 右侧固定表格样式
                $table.tableHeaderStyle = {}; // 表头样式
                $table.tableBodyStyle = ''; // 表格内容区宽度
                $table.columnsWidth = {}; // 列宽
                $table.fixedBodyStyle = {};
                $scope.containerStyle = {};
                $table.bodyStyle = {};

                $table.showVerticalScrollBar = false;
                $table.showHorizontalScrollBar = false;

                $table.headerHeight = 0; // initial header height

                function findEl(selector) {
                    return angular.element($element[0].querySelector(selector));
                }

                function makeRebuildData() {
                    return $scope.data.map((row, index) => {
                        const newRow = angular.copy(row);
                        newRow._isHover = false;
                        if (newRow._disabled) {
                            newRow._isDisabled = newRow._disabled;
                        } else {
                            newRow._isDisabled = false;
                        }
                        newRow._index = index;
                        if ($scope.rowClassName && angular.isFunction($scope.rowClassName)) {
                            newRow._rowClassName = $scope.rowClassName({
                                $row: newRow,
                                $index: index
                            });
                        }

                        return newRow;
                    });
                }

                $table.setCellWidth = (column) => {
                    let width = '';
                    if (column.width) {
                        width = column.width;
                    } else if ($table.columnsWidth[column._index]) {
                        width = $table.columnsWidth[column._index].width;
                    }
                    if (width === '0') {
                        width = '';
                    }
                    return width;
                };
                /* handle events emit from children */
                $table.handleMouseIn = (row) => {
                    if ($table.disabledHover) {
                        return;
                    }
                    if (row._isHover) {
                        return;
                    }
                    row._isHover = true;
                };
                $table.handleMouseOut = (row) => {
                    if ($table.disabledHover) {
                        return;
                    }
                    row._isHover = false;
                };
                $table.handleClickRow = (row) => {
                    if ($scope.onRowClick) {
                        $scope.onRowClick({
                            $row: row,
                            $index: row._index
                        });
                    }
                };
                $table.handleSort = (column, type) => {
                    $table.allDataColumns.forEach((col) => {
                        col._sortType = 'normal';
                    });

                    const key = column.key;

                    column._sortType = type;
                    if (angular.isFunction($scope.onSortChange)) {
                        $scope.onSortChange({
                            $column: column,
                            $key: key,
                            $order: type
                        });
                    }
                };
                function handleBodyScroll(event) {
                    findEl('.uix-datatable-header.middle-header')[0].scrollLeft = event.target.scrollLeft;
                    if (event.target.scrollLeft <= 0) {
                        $table.scrollPosition = 'left';
                    } else if (event.target.scrollLeft >= $table.tableWidth - $element[0].offsetWidth) {
                        $table.scrollPosition = 'right';
                    } else {
                        $table.scrollPosition = 'middle';
                    }
                    $scope.$digest();
                    if ($table.isLeftFixed) {
                        findEl('.uix-datatable-fixed-left .uix-datatable-fixed-body')[0].scrollTop = event.target.scrollTop;
                    }
                    if ($table.isRightFixed) {
                        findEl('.uix-datatable-fixed-right .uix-datatable-fixed-body')[0].scrollTop = event.target.scrollTop;
                    }
                    // this.hideColumnFilter();
                }

                $table.updateContainerByStatus = () => {
                    // 数据为空
                    updateContainerStyle();
                };

                function updateAllStyles() {
                    updateBodyStyle();
                    updateFixedBodyStyle();
                    updateTableBodyStyle();
                    updateTableHeaderStyle();
                    updateContainerStyle();
                    updateFixedLeftTableStyle();
                    updateFixedRightTableStyle();
                }
                function updateContainerStyle() {
                    let style = {};
                    if ($table.height) {
                        style.height = `${$table.height}px`;
                    } else if ($table.isEmpty || $table.isError || $table.isLoading) {
                        style.height = `${uixDatatableConfig.emptyDataHeight}px`;
                    }
                    if ($table.maxHeight) {
                        style.maxHeight = `${$table.maxHeight}px`;
                    }
                    if ($table.width) {
                        style.width = `${$table.width}px`;
                    }
                    $table.containerStyle = style;
                }
                function updateTableHeaderStyle() {
                    let style = {};
                    if ($table.tableWidth !== 0) {
                        let width = '';
                        width = $table.tableWidth;
                        style.width = `${width}px`;
                    }
                    $table.tableHeaderStyle = style;
                }
                function updateTableBodyStyle() {
                    let styles = {};
                    if ($table.tableWidth !== 0) {
                        let width = '';
                        if ($table.bodyHeight === 0) {
                            width = $table.tableWidth;
                        } else {
                            width = $table.tableWidth - ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0);
                        }
                        styles.width = `${width}px`;
                    }
                    $table.tableBodyStyle = styles;
                }
                function updateBodyStyle() {
                    let style = {};
                    if ($table.bodyHeight !== 0) {
                        const height = $table.bodyHeight;
                        if ($table.height) {
                            style.height = `${height}px`;
                        } else if ($table.maxHeight) {
                            style.maxHeight = `${height}px`;
                        }
                    }
                    $table.bodyStyle = style;
                }
                function updateFixedBodyStyle() {
                    let style = {};
                    if ($table.bodyHeight !== 0) {
                        let height = $table.bodyHeight - ($table.showHorizontalScrollBar ? $table.scrollBarWidth : 0);
                        style.height = $table.showHorizontalScrollBar ? `${height}px` : `${height - 1}px`;
                    }
                    $table.fixedBodyStyle = style;
                }
                function updateFixedLeftTableStyle() {
                    let style = {};
                    let width = getFixedColumnsWidth('left');
                    style.width = `${width}px`;
                    $table.fixedLeftTableStyle = style;
                }
                function updateFixedRightTableStyle() {
                    let style = {};
                    let width = getFixedColumnsWidth('right');
                    //width += this.scrollBarWidth;
                    style.width = `${width}px`;
                    style.right = `${$table.showVerticalScrollBar ? $table.scrollBarWidth : 0}px`;
                    $table.fixedRightTableStyle = style;
                }

                function calcScrollBar() {
                    if (!$table.data || $table.data.length === 0) {
                        $table.showVerticalScrollBar = false;
                    } else {
                        let bodyContentEl = $element[0].querySelector('.uix-datatable-tbody');
                        let bodyEl = bodyContentEl.parentElement;
                        let bodyContentHeight = bodyContentEl.offsetHeight;
                        let bodyHeight = bodyEl.offsetHeight;
                        $table.showHorizontalScrollBar = bodyEl.offsetWidth < bodyContentEl.offsetWidth + ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0);
                        $table.showVerticalScrollBar = $table.bodyHeight ?
                            bodyHeight - ($table.showHorizontalScrollBar ? $table.scrollBarWidth : 0) < bodyContentHeight
                            : false;
                    }
                }
                function calcBodyHeight() {
                    if ($table.height || $table.maxHeight) {
                        const headerHeight = $table.headerHeight || 0;
                        const footerHeight = parseInt(getStyle(findEl('.uix-datatable-footer')[0], 'height'), 10) || 0;
                        if ($table.height) {
                            $table.bodyHeight = $table.height - headerHeight - footerHeight;
                        } else if ($table.maxHeight) {
                            $table.bodyHeight = $table.maxHeight - headerHeight - footerHeight;
                        }
                    } else {
                        $table.bodyHeight = 0;
                    }
                    $timeout(() => {
                        calcScrollBar();
                    }, 0);
                }

                $scope.$watch('$table.bodyHeight', calcScrollBar);
                $scope.$watch('$table.headerHeight', calcBodyHeight);

                // function fixedBody() {
                //     if (!$table.data || $table.data.length === 0) {
                //         $table.showVerticalScrollBar = false;
                //     } else {
                //         let bodyContentEl = $element[0].querySelector('.uix-datatable-tbody');
                //         let bodyEl = bodyContentEl.parentElement;
                //         let bodyContentHeight = bodyContentEl.offsetHeight;
                //         let bodyHeight = bodyEl.offsetHeight;
                //         $table.showHorizontalScrollBar = bodyEl.offsetWidth < bodyContentEl.offsetWidth + ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0);
                //         $table.showVerticalScrollBar = $table.bodyHeight ?
                //             bodyHeight - ($table.showHorizontalScrollBar ? $table.scrollBarWidth : 0) < bodyContentHeight
                //             : false;
                //     }
                //     updateAllStyles();
                // }
                function bindEvents() {
                    findEl('.uix-datatable-body').on('scroll', handleBodyScroll);
                    angular.element(window).on('resize', () => {
                        handleResize();
                    });
                }
                function unbindEvents() {
                    findEl('.uix-datatable-body').off('scroll', handleBodyScroll);
                    angular.element(window).off('resize', handleResize);
                }
                // function fixedHeader() {
                //     if ($table.height || $table.maxHeight) {
                //         const headerHeight = $table.headerHeight || 0;
                //         const footerHeight = parseInt(getStyle(findEl('.uix-datatable-footer')[0], 'height'), 10) || 0;
                //         if ($table.height) {
                //             $table.bodyHeight = $table.height - headerHeight - footerHeight;
                //         } else if ($table.maxHeight) {
                //             $table.bodyHeight = $table.maxHeight - headerHeight - footerHeight;
                //         }
                //     } else {
                //         $table.bodyHeight = 0;
                //     }
                //     // fixedBody();
                // }
                $scope.$watch('$table.showVerticalScrollBar', (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                        handleResize();
                    }
                });
                $scope.$watch('$table.showHorizontalScrollBar', (newVal, oldVal) => {
                    if (newVal !== oldVal) {
                        handleResize();
                    }
                });

                function handleResize() {

                    //let tableWidth = parseInt(getStyle(this.$el, 'width')) - 1;
                    let tableWidth = $element[0].offsetWidth - 1;
                    let columnsWidth = {};
                    let sumMinWidth = 0;
                    let hasWidthColumns = [];
                    let noWidthColumns = [];
                    let maxWidthColumns = [];
                    let noMaxWidthColumns = [];
                    $table.allDataColumns.forEach((col) => {
                        if (col.width) {
                            hasWidthColumns.push(col);
                        } else {
                            noWidthColumns.push(col);
                            if (col.minWidth) {
                                sumMinWidth += col.minWidth;
                            }
                            if (col.maxWidth) {
                                maxWidthColumns.push(col);
                            } else {
                                noMaxWidthColumns.push(col);
                            }
                        }
                        col._width = null;
                    });
                    let unUsableWidth = hasWidthColumns.map(cell => cell.width).reduce((a, b) => a + b, 0);
                    let usableWidth = tableWidth - unUsableWidth - sumMinWidth - ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0) - 1;
                    let usableLength = noWidthColumns.length;
                    let columnWidth = 0;
                    if (usableWidth > 0 && usableLength > 0) {
                        columnWidth = parseInt(usableWidth / usableLength, 10);
                    }

                    for (let i = 0; i < $table.allDataColumns.length; i++) {
                        const column = $table.allDataColumns[i];
                        let width = columnWidth + (column.minWidth ? column.minWidth : 0);
                        if (column.width) {
                            width = column.width;
                        } else {
                            if (column._width) {
                                width = column._width;
                            } else {
                                if (column.minWidth > width) {
                                    width = column.minWidth;
                                } else if (column.maxWidth < width) {
                                    width = column.maxWidth;
                                }

                                if (usableWidth > 0) {
                                    usableWidth -= width - (column.minWidth ? column.minWidth : 0);
                                    usableLength--;
                                    if (usableLength > 0) {
                                        columnWidth = parseInt(usableWidth / usableLength, 10);
                                    } else {
                                        columnWidth = 0;
                                    }
                                } else {
                                    columnWidth = 0;
                                }
                            }
                        }
                        column._width = width;
                        columnsWidth[column._index] = {
                            width: width
                        };
                    }
                    if (usableWidth > 0) {
                        usableLength = noMaxWidthColumns.length;
                        columnWidth = parseInt(usableWidth / usableLength, 10);
                        for (let i = 0; i < noMaxWidthColumns.length; i++) {
                            const column = noMaxWidthColumns[i];
                            let width = column._width + columnWidth;
                            if (usableLength > 1) {
                                usableLength--;
                                usableWidth -= columnWidth;
                                columnWidth = parseInt(usableWidth / usableLength, 10);
                            } else {
                                columnWidth = 0;
                            }
                            column._width = width;
                            columnsWidth[column._index] = {
                                width: width
                            };
                        }
                    }
                    $table.tableWidth = $table.allDataColumns
                        .map(cell => cell._width)
                        .reduce((item, prev) => item + prev, 0) + ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0) + 1;
                    $table.columnsWidth = columnsWidth;
                    // fixedBody();
                    updateAllStyles();
                    calcScrollBar();
                }
                function prepareColumns(columns) {
                    return columns.map(column => {
                        if ('children' in column) {
                            prepareColumns(column.children);
                        }
                        column.__id = getRandomStr(6);
                        column.width = parseInt(column.width, 10);
                        column._width = column.width ? column.width : '';
                        column._sortType = 'normal';

                        if ('sortType' in column) {
                            column._sortType = column.sortType;
                        }

                        if (column.type === 'index') {
                            column.__renderBodyCellType = 'index';
                        } else if (angular.isFunction(column.format)) {
                            column.__renderBodyCellType = 'format';
                        } else if (angular.isDefined(column.template) || angular.isDefined(column.templateUrl)) {
                            column.__renderBodyCellType = 'template';
                        } else {
                            column.__renderBodyCellType = 'normal';
                        }

                        if (angular.isDefined(column.headerTemplate) || angular.isDefined(column.headerTemplateUrl)) {
                            column.__renderHeadType = 'template';
                        } else if (angular.isFunction(column.headerFormat)) {
                            column.__renderHeadType = 'format';
                        } else {
                            column.__renderHeadType = 'normal';
                        }
                        return column;
                    });
                }
                function splitDataColumns() {
                    let columns = $table.allDataColumns;
                    let left = [];
                    let right = [];
                    let center = [];

                    columns.forEach((column, index) => {
                        column._index = index;

                        if (column.fixed && column.fixed === 'left') {
                            left.push(column);
                        } else if (column.fixed && column.fixed === 'right') {
                            right.push(column);
                        } else {
                            center.push(column);
                        }
                    });
                    return {
                        left: left,
                        center: left.concat(center).concat(right),
                        right: right,
                    };
                }
                function makeColumnRows(colsWithId, position) {
                    const originColumns = convertColumnOrder(colsWithId, position);
                    let maxLevel = 1;
                    const traverse = (column, parent) => {
                        if (parent) {
                            column.level = parent.level + 1;
                            if (maxLevel < column.level) {
                                maxLevel = column.level;
                            }
                        }
                        if (column.children) {
                            let colSpan = 0;
                            column.children.forEach((subColumn) => {
                                traverse(subColumn, column);
                                colSpan += subColumn.colSpan;
                            });
                            column.colSpan = colSpan;
                        } else {
                            column.colSpan = 1;
                        }
                    };

                    originColumns.forEach((column) => {
                        column.level = 1;
                        traverse(column);
                    });

                    const rows = [];
                    for (let i = 0; i < maxLevel; i++) {
                        rows.push([]);
                    }

                    const allColumns = getDataColumns(originColumns, true);

                    allColumns.forEach((column) => {
                        if (!column.children) {
                            column.rowSpan = maxLevel - column.level + 1;
                        } else {
                            column.rowSpan = 1;
                        }
                        rows[column.level - 1].push(column);
                    });

                    return rows;
                }

                // 获取固定列的宽度
                function getFixedColumnsWidth(fixedType) {
                    let width = 0;
                    ($table.allDataColumns || []).forEach((col) => {
                        if (col.fixed && col.fixed === fixedType) {
                            width += col._width;
                        }
                    });
                    return width;
                }

                $table.alignCls = (fixed, column, row = {}) => {
                    let cellClassName = '';
                    if (row.cellClassName && column.key && row.cellClassName[column.key]) {
                        cellClassName = row.cellClassName[column.key];
                    }
                    return [
                        cellClassName,
                        column.className,
                        column.align ? `uix-datatable-column-${column.align}` : '',
                        (fixed === 'left' && column.fixed !== 'left') ||
                            (fixed === 'right' && column.fixed !== 'right') ||
                            (!fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right'))
                            ? 'uix-datatable-hidden' : ''
                    ];
                };

                $table.initColums = function () {
                    const colsWithId = prepareColumns($scope.columns);
                    $table.allDataColumns = getDataColumns(colsWithId);

                    const columnsObj = splitDataColumns();
                    $table.centerColumns = columnsObj.center;
                    $table.leftColumns = columnsObj.left;
                    $table.rightColumns = columnsObj.right;

                    $table.centerColumnRows = makeColumnRows(colsWithId);
                    $table.leftColumnRows = makeColumnRows(colsWithId, 'left');
                    $table.rightColumnRows = makeColumnRows(colsWithId, 'right');

                    $table.isLeftFixed = $table.leftColumns.length > 0;
                    $table.isRightFixed = $table.rightColumns.length > 0;
                };
                $table.initData = function () {
                    $table.rebuildData = makeRebuildData();
                };
                $table.refresh = () => {
                    $timeout(() => {
                        handleResize();
                        $table.headerHeight = 42;
                    }, 0);
                };

                $table.rowSlotScopes = {};
                $table.colSlotScopes = {};

                $table.getRowSlotScopes = (rowIndex, colIndex) => {
                    if ($table.rowSlotScopes[rowIndex]) {
                        return $table.rowSlotScopes[rowIndex];
                    }
                    let slotScope = $scope.$parent.$new();
                    let row = $table.rebuildData.find(item => item._index === rowIndex) || {};
                    let column = $table.allDataColumns.find(item => item._index === colIndex);
                    slotScope.$row = row;
                    slotScope.$rowIndex = rowIndex;
                    slotScope.$column = column;
                    slotScope.$colIndex = colIndex;
                    $table.rowSlotScopes[rowIndex] = slotScope;
                    return slotScope;
                };
                $table.getColSlotScopes = (colIndex) => {
                    if ($table.colSlotScopes[colIndex]) {
                        return $table.colSlotScopes[colIndex];
                    }
                    let slotScope = $scope.$parent.$new();
                    let column = $table.allDataColumns.find(item => item._index === colIndex);
                    slotScope.$column = column;
                    slotScope.$colIndex = colIndex;
                    $table.colSlotScopes[colIndex] = slotScope;
                    return slotScope;
                };

                // 初始化
                $table.init = function () {
                    $table.initColums();
                    $table.initData();
                    $table.refresh();
                    bindEvents();
                };
                $scope.$on('$destroy', () => {
                    unbindEvents();
                });
            }])
        .directive('uixDatatable', ['uixDatatable', 'uixDatatableConfig', function (uixDatatable, uixDatatableConfig) {
            return {
                restrict: 'E',
                templateUrl: 'templates/datatable.html',
                replace: true,
                require: ['uixDatatable'],
                scope: {
                    columns: '=',
                    data: '=',
                    status: '=',
                    disabledHover: '=',
                    rowClassName: '&',
                    onSortChange: '&',
                    onRowClick: '&'
                },
                controllerAs: '$table',
                controller: 'uixDatatableCtrl',
                link: function (scope, el, $attrs, ctrls) {
                    var $table = ctrls[0];
                    $table.columns = scope.columns;
                    $table.data = scope.data;

                    $table.isStriped = 'striped' in $attrs;
                    $table.isBordered = 'bordered' in $attrs;

                    $table.showFooter = false; // TODO footer

                    $table.isLoading = false;
                    $table.isEmpty = false;
                    $table.isError = false;

                    ['loading', 'empty', 'error'].forEach(type => {
                        scope[`${type}Text`] = $attrs[`${type}Text`] ||
                            uixDatatable.getStatusText(type) ||
                            uixDatatableConfig[`${type}Text`];
                    });
                    ['height', 'maxHeight', 'width'].forEach(attr => {
                        if ($attrs[attr]) {
                            $table[attr] = parseInt($attrs[attr], 10);
                        }
                    });

                    scope.$watch('disabledHover', function (val) {
                        $table.disabledHover = val;
                    });

                    scope.$watch('data', function (val, old) {
                        if (val !== old && angular.isDefined(val)) {
                            $table.data = val;
                            $table.initData();
                            $table.refresh();
                        }
                    });
                    scope.$watch('columns', function (val, old) {
                        if (val !== old && angular.isDefined(val)) {
                            $table.columns = val;
                            $table.initColums();
                            $table.refresh();
                        }
                    });
                    scope.$watch('status', function (val) {
                        $table.isLoading = val === 1 || val === 'loading';
                        $table.isEmpty = val === 2 || val === 'empty';
                        $table.isError = val === -1 || val === 'error';
                        $table.updateContainerByStatus();
                    });

                    $table.init();
                }
            };
        }])
        .directive('uixDatatableHead', ['$timeout', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/datatable-head.html',
                replace: true,
                scope: {
                    columnRows: '=',
                    columns: '=',
                    fixed: '@',
                    width: '='
                },
                require: ['^uixDatatable'],
                link: function ($scope, el, attrs, [$table]) {
                    let fixed = $scope.fixed || '';
                    $scope.$table = $table;

                    $scope.heightMap = {};

                    $scope.scrollBarCellClass = () => {
                        let hasRightFixed = false;
                        for (let i in $scope.columnRows) {
                            for (let j in $scope.columnRows[i]) {
                                if ($scope.columnRows[i][j].fixed === 'right') {
                                    hasRightFixed = true;
                                    break;
                                }
                                if (hasRightFixed) {
                                    break;
                                }
                            }
                        }
                        return hasRightFixed ? 'uix-datatable-hidden' : '';
                    };
                    $scope.cellClasses = (column) => {
                        return [
                            !fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right') ? 'uix-datatable-hidden' : '',
                            column.type === 'selection' ? 'uix-datatable-cell-with-selection' : '',
                            column.sortable ? 'uix-datatable-cell-sortable' : ''
                        ];
                    };
                    $scope.handleSort = (column, type) => {
                        if (column._sortType === type) {
                            type = 'normal';
                        }
                        $table.handleSort(column, type);
                    };
                    $scope.handleSortByHead = (column) => {
                        if (column.sortable) {
                            const type = column._sortType;
                            if (type === 'normal') {
                                $scope.handleSort(column, 'asc');
                            } else if (type === 'asc') {
                                $scope.handleSort(column, 'desc');
                            } else {
                                $scope.handleSort(column, 'normal');
                            }
                        }
                    };
                }
            };
        }])
        .directive('uixDatatableBody', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/datatable-body.html',
                replace: true,
                scope: {
                    columns: '=',
                    fixed: '@',
                    width: '='
                },
                require: '^uixDatatable',
                link: function ($scope, el, attrs, $table) {
                    $scope.$table = $table;
                    $scope.handleMouseIn = function (evt, row) {
                        evt.stopPropagation();
                        $table.handleMouseIn(row);
                    };
                    $scope.handleMouseOut = function (evt, row) {
                        evt.stopPropagation();
                        $table.handleMouseOut(row);
                    };
                    $scope.handleClickRow = function (evt, row) {
                        evt.stopPropagation();
                        $table.handleClickRow(row);
                    };
                }
            };
        })
        .directive('uixDatatableCell', ['$templateCache', '$compile', function ($templateCache, $compile) {
            return {
                restrict: 'A',
                replace: true,
                require: '^uixDatatable',
                scope: {
                    column: '=',
                    row: '=',
                    type: '@'
                },
                link: function ($scope, el, attrs, $table) {
                    let column = $scope.column;
                    let row = $scope.row || {};
                    let columnIndex = column._index;
                    let rowIndex = row._index;
                    let type = $scope.type || 'body';
                    let template = '';
                    let include = '';

                    let templateProp = '';
                    let templateUrlProp = '';
                    let slotScope = null;

                    if (type === 'head') {
                        templateProp = 'headerTemplate';
                        templateUrlProp = 'headerTemplateUrl';
                        slotScope = $table.getColSlotScopes(columnIndex);
                    } else {
                        slotScope = $table.getRowSlotScopes(rowIndex, columnIndex);
                        templateProp = 'template';
                        templateUrlProp = 'templateUrl';
                    }

                    if (angular.isString(column[templateUrlProp])) {
                        include = column[templateUrlProp];
                    } else if (angular.isFunction(column[templateUrlProp])) {
                        include = column[templateUrlProp](type === 'head' ? column : row, type === 'head' ? columnIndex : rowIndex);
                    }
                    template = $templateCache.get(include) || '';

                    if (angular.isString(column[templateProp])) {
                        template = column[templateProp];
                    } else if (angular.isFunction(column[templateProp])) {
                        template = column[templateProp](type === 'head' ? column : row, type === 'head' ? columnIndex : rowIndex);
                    }

                    $compile(`<div>${template}</div>`)(slotScope, (clonedElement) => {
                        el.replaceWith(clonedElement);
                    });
                }
            };
        }])
        .directive('uixDatatableFoot', function () {
            return {
                restrict: 'E',
                templateUrl: 'templates/datatable-foot.html',
                replace: true,
                require: '^uixDatatable',
                scope: {
                },
                link: function (scope, el, attrs, $table) {
                    scope.$table = $table;
                }
            };
        });
})();
