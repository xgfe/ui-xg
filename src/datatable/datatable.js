/* eslint-disable angular/di-unused */
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
        columns.forEach((col) => {
            if (fixedType) {
                if (col.fixed && col.fixed === fixedType) {
                    list.push(col);
                }
            } else {
                list.push(col);
            }
        });
        return list;
    };
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
        .controller('uixDatatableCtrl', ['$scope', '$timeout', '$element', 'uixDatatableConfig', '$templateCache', '$compile',
            function ($scope, $timeout, $element, uixDatatableConfig, $templateCache, $compile) {
                const $table = this;
                $table.columnsWidth = {}; // 列宽
                $table.bodyStyle = {};
                $table.currentChecked = null;
                $table.selections = {};
                $table.isSelectedAll = false;
                $table.scrollBarWidth = getScrollBarSize();
                $table.showVerticalScrollBar = false;
                $table.showHorizontalScrollBar = false;

                $table.headerHeight = 0; // initial header height
                $table.containerHeight = null;

                let compileScope = $scope.$parent.$new();
                compileScope.$table = $table;
                function findEl(selector) {
                    return angular.element($element[0].querySelector(selector));
                }

                function makeRebuildData() {
                    return $scope.data.map((row, index) => {
                        const newRow = angular.copy(row);
                        newRow._index = index;
                        newRow._isHover = false;
                        newRow._isExpand = false;
                        newRow.disabled = !!row.disabled;
                        if ($scope.rowClassName && angular.isFunction($scope.rowClassName)) {
                            newRow._rowClassName = $scope.rowClassName({
                                $row: newRow,
                                $index: index
                            });
                        }
                        if (row.checked) {
                            $table.currentChecked = index;
                            $table.selections[index] = true;
                        }
                        return newRow;
                    });
                }
                $scope.$watch('$table.currentChecked', (newIndex, oldIndex) => {
                    if (newIndex !== null && $scope.onCurrentChange) {
                        let newRow = $table.rebuildData[newIndex];
                        let oldRow = $table.rebuildData[oldIndex];
                        $scope.onCurrentChange({
                            $newRow: newRow,
                            $oldRow: oldRow,
                            $newIndex: newIndex,
                            $oldIndex: oldIndex,
                        });
                    }
                });
                $scope.$watch('$table.selections', (newVal, oldVal) => {
                    let currentSelect = [];
                    let oldSelect = [];
                    for (let index in newVal) {
                        if (newVal[index]) {
                            currentSelect.push($table.rebuildData[index]);
                        }
                    }
                    for (let index in oldVal) {
                        if (oldVal[index]) {
                            oldSelect.push($table.rebuildData[index]);
                        }
                    }
                    if ($scope.onSelectionChange) {
                        $table.isSelectedAll = currentSelect.length >= $table.rebuildData.length;
                        $scope.onSelectionChange({
                            $newRows: currentSelect,
                            $oldRows: oldSelect
                        });
                    }
                }, true);

                $table.handleSelectAll = () => {
                    $table.rebuildData.forEach((row, index) => {
                        if (row.disabled) {
                            return;
                        }
                        $table.selections[index] = $table.isSelectedAll;
                    });
                };

                $table.handleMouseIn = (event, row) => {
                    event.stopPropagation();
                    if ($table.disabledHover) {
                        return;
                    }
                    if (row._isHover) {
                        return;
                    }
                    row._isHover = true;
                };
                $table.handleMouseOut = (event, row) => {
                    event.stopPropagation();
                    if ($table.disabledHover) {
                        return;
                    }
                    row._isHover = false;
                };
                $table.handleClickRow = (event, row) => {
                    event.stopPropagation();
                    if ($scope.onRowClick) {
                        $scope.onRowClick({
                            $row: row,
                            $index: row._index
                        });
                    }
                    // 禁用通过点击行选择
                    if ($table.disabledRowClickSelect) {
                        return;
                    }
                    if (row.disabled) {
                        return;
                    }
                    // 单选
                    $table.currentChecked = row._index;
                    // 多选
                    $table.selections[row._index] = !$table.selections[row._index];
                };
                $table.handleSelect = ($event) => {
                    $event.stopPropagation();
                };
                $table.handleSortByHead = (column) => {
                    if (column.sortable) {
                        const type = column._sortType;
                        if (type === 'normal') {
                            $table.handleSort(column, 'asc');
                        } else if (type === 'asc') {
                            $table.handleSort(column, 'desc');
                        } else {
                            $table.handleSort(column, 'normal');
                        }
                    }
                };
                $table.handleSort = (column, type) => {
                    if (column._sortType === type) {
                        type = 'normal';
                    }
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
                // 展开行响应事件，对外可调用
                $table.handleRowExpand = (row) => {
                    if (!row) {
                        return;
                    }
                    let rowIndex = row._index;
                    row._isExpand = !row._isExpand;
                    $timeout(() => {
                        let currentRow = findEl('.uix-datatable-main-body table')
                            .find('.uix-datatable-expand-row').get(rowIndex);
                        if (currentRow) {
                            let expandHeight = currentRow.offsetHeight;
                            if ($table.isLeftFixed) {
                                findEl('.uix-datatable-left-body table')
                                    .find('.uix-datatable-expand-row')
                                    .eq(rowIndex).css({
                                        height: expandHeight + 'px'
                                    });
                            }
                            if ($table.isRightFixed) {
                                findEl('.uix-datatable-right-body table')
                                    .find('.uix-datatable-expand-row')
                                    .eq(rowIndex).css({
                                        height: expandHeight + 'px'
                                    });
                            }
                        }
                    }, 0);
                };

                function handleMainBodyScroll(event) {
                    let scrollTop = event.target.scrollTop;
                    let scrollLeft = event.target.scrollLeft;
                    findEl('.uix-datatable-main-table .uix-datatable-thead').css({
                        transform: `translateX(-${scrollLeft}px)`
                    });

                    if ($table.isLeftFixed) {
                        findEl('.uix-datatable-left-body')[0].scrollTop = scrollTop;
                    }
                    if ($table.isRightFixed) {
                        findEl('.uix-datatable-right-body')[0].scrollTop = scrollTop;
                    }

                    updateFixedTableShadow();
                }
                function handleFixedBodyScroll(event) {
                    let scrollTop = event.target.scrollTop;
                    findEl('.uix-datatable-main-body')[0].scrollTop = scrollTop;
                    if ($table.isLeftFixed) {
                        findEl('.uix-datatable-left-body')[0].scrollTop = scrollTop;
                    }
                    if ($table.isRightFixed) {
                        findEl('.uix-datatable-right-body')[0].scrollTop = scrollTop;
                    }
                }

                $table.updateContainerByStatus = () => {
                    // 数据为空
                    if ($table.isEmpty || $table.isError || $table.isLoading) {
                        $table.containerHeight = `${uixDatatableConfig.emptyDataHeight}px`;
                    } else {
                        $table.containerHeight = null;
                    }
                };

                function handleResize() {
                    calcColumnsWidth();
                    updateFixedTableShadow();
                    $scope.$digest();
                    $timeout(() => {
                        $table.updateHorizontalScroll();
                        $table.updateVerticalScroll();
                        updateFixedRowHeight();
                        updateFixedHeadHeight();
                    }, 0);
                }

                function bindEvents() {
                    findEl('.uix-datatable-main-body').on('scroll', handleMainBodyScroll);
                    findEl('.uix-datatable-left-body').on('scroll', handleFixedBodyScroll);
                    findEl('.uix-datatable-right-body').on('scroll', handleFixedBodyScroll);

                    angular.element(window).on('resize', handleResize);
                }
                function unbindEvents() {
                    findEl('.uix-datatable-main-body').off('scroll', handleMainBodyScroll);
                    findEl('.uix-datatable-left-body').on('scroll', handleFixedBodyScroll);
                    findEl('.uix-datatable-right-body').on('scroll', handleFixedBodyScroll);
                    angular.element(window).off('resize', handleResize);
                }

                // 更新阴影
                function updateFixedTableShadow() {
                    let scrollLeft = findEl('.uix-datatable-main-body')[0].scrollLeft;
                    let leftClass = 'uix-datatable-scroll-left';
                    let rightClass = 'uix-datatable-scroll-right';
                    if (scrollLeft === 0) {
                        $element.addClass(leftClass);
                        if ($element[0].offsetWidth >= $table.tableWidth) { // 无滚动条
                            $element.addClass(rightClass);
                        } else {
                            $element.removeClass(rightClass);
                        }
                    } else if (scrollLeft >= $table.tableWidth - $element[0].offsetWidth) {
                        $element.addClass(rightClass).removeClass(leftClass);
                    } else {
                        $element.removeClass(leftClass).removeClass(rightClass);
                    }
                }

                function calcColumnsWidth() {
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
                    let unUsableWidth = hasWidthColumns.map(cell => cell.width).reduce((prev, next) => prev + next, 0);
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
                        .reduce((item, prev) => item + prev, 0) + 1;
                    $table.columnsWidth = columnsWidth;
                }

                function prepareColumns(columns) {
                    return columns.filter(column => !column.hidden).map(column => {
                        if ('children' in column) {
                            prepareColumns(column.children);
                        }
                        column.__id = getRandomStr(6);
                        column.width = parseFloat(column.width, 10);
                        column._width = column.width ? column.width : '';
                        column._sortType = 'normal';

                        if ('sortType' in column) {
                            column._sortType = column.sortType;
                        }

                        if (angular.isDefined(column.headerTemplate) || angular.isDefined(column.headerTemplateUrl)) {
                            column.__renderHeadType = 'template';
                            column.__headTemplate = column.headerTemplate || $templateCache.get(column.headerTemplateUrl) || '';
                        } else if (angular.isFunction(column.headerFormat)) {
                            column.__renderHeadType = 'format';
                        } else if (column.type === 'expand') {
                            column.__renderHeadType = 'expand';
                        } else if (column.type === 'selection') {
                            column.__renderHeadType = 'selection';
                        } else {
                            column.__renderHeadType = 'normal';
                        }
                        return column;
                    });
                }
                function makeColumnRows(colsWithId) {
                    const originColumns = colsWithId;
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

                    let left = [];
                    let right = [];
                    // 从所有的表头行中找到固定表头
                    // 需要要求固定列的表头不管是否有多级，必须设置fixed
                    for (let rowIndex in rows) {
                        if (rows[rowIndex].length) {
                            rows[rowIndex].forEach(item => {
                                if (item.fixed) {
                                    if (item.fixed === 'left') {
                                        left[rowIndex] = left[rowIndex] || [];
                                        left[rowIndex].push(item);
                                    }
                                    if (item.fixed === 'right') {
                                        right[rowIndex] = right[rowIndex] || [];
                                        right[rowIndex].push(item);
                                    }
                                }
                            });
                        }
                    }
                    return {
                        left,
                        center: rows,
                        right
                    };
                }
                $table.updateVerticalScroll = () => {
                    let mainTableHeight = $element.find('.uix-datatable-main-body > table').get(0).offsetHeight;
                    if ($table.height) {
                        $table.showVerticalScrollBar = mainTableHeight > $table.height;
                    } else if ($table.maxHeight) {
                        $table.showVerticalScrollBar = mainTableHeight > $table.maxHeight;
                    }
                };
                $table.updateHorizontalScroll = () => {
                    let mainTableWidth = $element.find('.uix-datatable-main-body').get(0).offsetWidth;

                    $table.showHorizontalScrollBar = $table.tableWidth > mainTableWidth;
                };

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

                $table.alignCls = (column, row = {}) => {
                    let cellClassName = '';
                    if (row.cellClassName && column.key && row.cellClassName[column.key]) {
                        cellClassName = row.cellClassName[column.key];
                    }
                    return [
                        cellClassName,
                        column.className,
                        column.align ? `uix-datatable-align-${column.align}` : ''
                    ];
                };

                function hasFixedColumns(fixedType) {
                    return $table.allDataColumns.some(col => col.fixed && col.fixed === fixedType);
                }
                function getHeadTpls() {
                    let tpls = '';
                    $table.allColumnRows.forEach((rows) => {
                        rows.forEach((column, colIndex) => {
                            if (column.__renderHeadType === 'template') {
                                tpls += `
                                    <div ng-if="colIndex===${colIndex}">
                                        ${column.__headTemplate}
                                    </div>
                                `;
                            }
                        });
                    });
                    return tpls;
                }
                function getBodyRowsTemplate(position) {
                    let columnsKey = '';
                    if (position === 'left') {
                        columnsKey = 'leftColumns';
                    } else if (position === 'right') {
                        columnsKey = 'rightColumns';
                    } else {
                        columnsKey = 'allDataColumns';
                    }
                    return $table[columnsKey].map((column, colIndex) => {
                        let classes = [
                            column.className,
                            column.align ? `uix-datatable-align-${column.align}` : '',
                        ].join(' ');
                        let ngClass = [
                            `row.cellClassName['${column.key}']`
                        ];
                        let content = '';
                        let enableTooltip = false;
                        if (column.type === 'index') {
                            if (column.indexMethod) {
                                content = '{{::$table[\'' + columnsKey + '\'][' + colIndex + '].indexMethod(row, rowIndex)}}';
                            } else {
                                content = '{{rowIndex+1}}';
                            }
                        } else if (column.type === 'selection') {
                            content = column.singleSelect
                                ? '<input type="radio" ng-disabled="row.disabled" ng-value="row._index" ng-model="$table.currentChecked">'
                                : '<input type="checkbox" ng-click="$table.handleSelect($event)" ng-disabled="row.disabled" ng-model="$table.selections[row._index]">';
                        } else if (column.type === 'expand') {
                            content = `
                            <div class="uix-datatable-expand-trigger" ng-click="$table.handleRowExpand(row, rowIndex)">
                                <i ng-show="!row._isExpand" class="glyphicon glyphicon-chevron-right"></i>
                                <i ng-show="row._isExpand" class="glyphicon glyphicon-chevron-down"></i>
                            </div>
                            `;
                        } else if (angular.isFunction(column.format)) {
                            content = '{{::$table[\'' + columnsKey + '\'][' + colIndex + '].format(row, rowIndex)}}';
                        } else if (angular.isDefined(column.template) || angular.isDefined(column.templateUrl)) {
                            content = column.template || $templateCache.get(column.templateUrl) || '';
                        } else {
                            content = '{{';
                            content += `row['${column.key}']`;
                            if (column.filter) {
                                content += ` | ${column.filter}`;
                            }
                            content += '}}';
                            enableTooltip = column.ellipsis;
                            if (enableTooltip) {
                                content = content.replace(/"/g, '\'');
                            }
                        }
                        if (enableTooltip) {
                            content = `<span tooltip-append-to-body="true" uix-tooltip="${content}">${content}</span>`;
                        }
                        return `
                            <td class="${classes}" ng-class="${ngClass}">
                                <div class="${column.fixed ? 'uix-datatable-cell-fixed' : ''} uix-datatable-cell ${enableTooltip ? 'uix-datatable-cell-ellipsis' : ''}">
                                    ${content}
                                </div>
                            </td>
                        `;
                    }).join('');
                }
                const columnsKeyMap = {
                    main: 'allDataColumns',
                    left: 'leftColumns',
                    right: 'rightColumns'
                };
                function hasExpandTemplate() {
                    let expandTemplate = $templateCache.get($table.expandTemplate) || '';
                    return !!expandTemplate;
                }
                // 获取展开行模板
                // 当具有左右固定列时，只展开中间表格
                function getExpandTemplate(position = 'main') {
                    if (!hasExpandTemplate()) {
                        return '';
                    }
                    let expandTemplate = $templateCache.get($table.expandTemplate) || '';
                    if (position === 'left' || position === 'right') {
                        return `
                            <tr ng-repeat-end ng-show="row._isExpand" class="uix-datatable-expand-row">
                                <td colspan="${$table[columnsKeyMap[position]].length}"></td>
                            </tr>
                        `;
                    }
                    let leftTd = '';
                    let rightTd = '';
                    if ($table.isLeftFixed) {
                        leftTd = `<td colspan="${$table[columnsKeyMap.left].length}"></td>`;
                    }
                    if ($table.isRightFixed) {
                        rightTd = `<td colspan="${$table[columnsKeyMap.right].length}"></td>`;
                    }
                    return `
                        <tr ng-repeat-end ng-show="row._isExpand" class="uix-datatable-expand-row">
                            ${leftTd}
                            <td colspan="${$table.centerColumns.length}">
                                <div class="uix-datatable-expand-cell">
                                    ${expandTemplate}
                                </div>
                            </td>
                            ${rightTd}
                        </tr>
                    `;
                }
                function getTemplate(position = 'main') {
                    let template = $templateCache.get(`templates/datatable-table-${position}.html`);
                    return template
                        .replace('<%head%>', getHeadTemplate(position))
                        .replace('<%body%>', getBodyTemplate(position));
                }
                function getBodyTemplate(position) {
                    let template = $templateCache.get('templates/datatable-body-tpl.html') || '';
                    let columnsKey = columnsKeyMap[position];
                    let widthKey = '';
                    if (position === 'left') {
                        widthKey = 'leftTableWidth';
                    } else if (position === 'right') {
                        widthKey = 'rightTableWidth';
                    } else {
                        widthKey = 'tableWidth';
                    }
                    let hasExpand = hasExpandTemplate();
                    return template
                        .replace('<%repeatExp%>', hasExpand ? 'ng-repeat-start' : 'ng-repeat')
                        .replace('<%widthKey%>', widthKey)
                        .replace('<%columnsKey%>', columnsKey)
                        .replace('<%columnsLength%>', $table[columnsKey].length)
                        .replace('<%expand%>', getExpandTemplate(position))
                        .replace('<%rowHeightExp%>', position === 'left' || position === 'right' ? 'ng-style="{height:row._height+\'px\'}"' : '')
                        .replace('<%template%>', getBodyRowsTemplate(position));
                }
                function getHeadTemplate(position) {
                    let template = $templateCache.get('templates/datatable-head-tpl.html') || '';
                    let widthKey = '';
                    let columnsKey = columnsKeyMap[position];
                    let columnRowsKey = '';
                    if (position === 'left') {
                        columnRowsKey = 'leftColumnRows';
                        widthKey = 'leftTableWidth';
                    } else if (position === 'right') {
                        columnRowsKey = 'rightColumnRows';
                        widthKey = 'rightTableWidth';
                    } else {
                        columnRowsKey = 'allColumnRows';
                        widthKey = 'tableWidth';
                    }
                    return template
                        .replace('<%columnsKey%>', columnsKey)
                        .replace('<%columnRowsKey%>', columnRowsKey)
                        .replace('<%widthKey%>', widthKey)
                        .replace('<%template%>', getHeadTpls());
                }

                function updateFixedRowHeight() {
                    let tableWrap = $element.find('.uix-datatable-wrap');
                    let allRows = tableWrap.find('.uix-datatable-main-body > table .uix-datatable-normal-row');
                    if (allRows.length) {
                        $table.rebuildData.forEach((row, index) => {
                            let tr = allRows.get(index);
                            if (tr) {
                                row._height = tr.offsetHeight;
                            }
                        });
                    }
                }
                // 当固定列与主表格行相同时，直接匹配
                // 当固定列行少于主表格时，由上往下进行匹配，多余的行高补充到最下一行
                // 当固定列行多于主表格时，不用处理
                function fitDiffColumnsRows(mainRows, fixedRows) {
                    let mainLength = mainRows.length;
                    let fixedLength = fixedRows.length;
                    let headerHeight = $table.headerHeight;
                    if (mainLength === fixedLength) { // 表头行相同
                        mainRows.each((index, row) => {
                            fixedRows.eq(index).css({
                                height: row.offsetHeight
                            });
                        });
                    } else if (mainLength > fixedLength) {
                        let restHeight = headerHeight;
                        fixedRows.each((index, row) => {
                            let height = mainRows.get(index).offsetHeight;
                            restHeight -= height;
                            angular.element(row).css({
                                height
                            });
                        });
                        if (restHeight > 0) {
                            fixedRows.eq(fixedLength - 1).css({
                                height: restHeight + fixedRows.get(fixedLength - 1).offsetHeight
                            });
                        }
                    }
                }
                // 计算固定列的表头高度
                function updateFixedHeadHeight() {
                    let allRows = $element.find('.uix-datatable-main-header > table tr');
                    if (!allRows.length) {
                        return;
                    }
                    if ($table.isLeftFixed) {
                        let leftHeadRows = $element.find('.uix-datatable-left-header > table tr');
                        fitDiffColumnsRows(allRows, leftHeadRows);
                    }
                    if ($table.isRightFixed) {
                        let rightHeadRows = $element.find('.uix-datatable-right-header > table tr');
                        fitDiffColumnsRows(allRows, rightHeadRows);
                    }
                }
                $scope.$watch('$table.showVerticalScrollBar', (val, oldVal) => {
                    if (val !== oldVal) {
                        calcColumnsWidth();
                    }
                });
                $scope.$watch('$table.tableWidth', (val, oldVal) => {
                    if (val !== oldVal) {
                        $table.updateHorizontalScroll();
                    }
                });

                function renderTableBody() {
                    let template = getTemplate('main');
                    if ($table.isLeftFixed) {
                        template += getTemplate('left');
                    }
                    if ($table.isRightFixed) {
                        template += getTemplate('right');
                    }
                    $compile(template)(compileScope, (clonedElement) => {
                        let tableWrap = angular.element($element[0]
                            .querySelector('.uix-datatable-wrap'));
                        tableWrap.empty().append(clonedElement);
                        $timeout(() => {
                            let headerHeight = findEl('.uix-datatable-main-header')[0].offsetHeight;
                            $table.headerHeight = headerHeight;

                            $table.updateHorizontalScroll();
                            $table.updateVerticalScroll();
                            updateFixedTableShadow();
                            updateFixedRowHeight();
                            updateFixedHeadHeight();
                        }, 0);
                    });
                }
                function splitColumns() {
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
                        center: center,
                        right: right,
                    };
                }

                $table.initColums = function () {
                    const colsWithId = prepareColumns($scope.columns);
                    $table.allDataColumns = getDataColumns(colsWithId);

                    let columsObj = splitColumns(colsWithId);
                    $table.leftColumns = columsObj.left;
                    $table.rightColumns = columsObj.right;
                    $table.centerColumns = columsObj.center;

                    let columnRowsObj = makeColumnRows(colsWithId);
                    $table.allColumnRows = columnRowsObj.center;
                    $table.leftColumnRows = columnRowsObj.left;
                    $table.rightColumnRows = columnRowsObj.right;

                    $table.leftTableWidth = getFixedColumnsWidth('left');
                    $table.rightTableWidth = getFixedColumnsWidth('right');

                    $table.isLeftFixed = hasFixedColumns('left');
                    $table.isRightFixed = hasFixedColumns('right');
                };
                $table.initData = function () {
                    $table.rebuildData = makeRebuildData();
                    $timeout(() => {
                        updateFixedRowHeight();
                    }, 0);
                };
                $table.render = () => {
                    calcColumnsWidth();
                    renderTableBody();
                };
                // 初始化
                $table.init = function () {
                    $table.initColums();
                    $table.initData();
                    $table.render();

                    bindEvents();
                };
                $scope.$on('$destroy', () => {
                    unbindEvents();
                    compileScope.$destroy();
                });
            }])
        .directive('uixDatatable', ['uixDatatable', 'uixDatatableConfig', '$timeout', function (uixDatatable, uixDatatableConfig, $timeout) {
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
                    onRowClick: '&',
                    onSelectionChange: '&',
                    onCurrentChange: '&',
                    height: '=',
                    maxHeight: '=',
                    expandTemplate: '@',
                    disabledRowClickSelect: '='
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

                    $table.expandTemplate = scope.expandTemplate || '';

                    ['loading', 'empty', 'error'].forEach(type => {
                        scope[`${type}Text`] = $attrs[`${type}Text`] ||
                            uixDatatable.getStatusText(type) ||
                            uixDatatableConfig[`${type}Text`];
                    });

                    scope.$watch('height', (val) => {
                        val = parseFloat(val, 10);
                        if (!isNaN(val)) {
                            $table.height = val;
                            $table.bodyStyle = {
                                height: $table.height + 'px',
                            };
                        }
                    });
                    scope.$watch('maxHeight', (val) => {
                        val = parseFloat(val, 10);
                        if (!isNaN(val)) {
                            $table.maxHeight = val;
                            if (!$table.height) {
                                $table.bodyStyle = {
                                    maxHeight: val + 'px',
                                };
                            }
                        }
                    });

                    scope.$watch('disabledHover', function (val) {
                        $table.disabledHover = val;
                    });

                    scope.$watch('disabledRowClickSelect', function (val) {
                        $table.disabledRowClickSelect = val;
                    });

                    scope.$watch('data', function (val, old) {
                        if (val !== old && angular.isDefined(val)) {
                            $table.data = val;
                            $table.initData();
                            // 当内容发生变化时，重新计算是否有纵向滚动
                            $timeout(() => {
                                $table.updateVerticalScroll();
                            }, 0);
                        }
                    });
                    scope.$watch('columns', function (val, old) {
                        if (val !== old && angular.isDefined(val)) {
                            $table.columns = val;
                            $table.initColums();
                            $table.render();
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
