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
        let others = [];
        columns.forEach((col) => {
            if (col.fixed && col.fixed === fixedType) {
                list.push(col);
            } else {
                others.push(col);
            }
        });
        return list.concat(others);
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
                $table.handleMouseIn = (event, row) => {
                    event.stopPropagation();
                    if ($table.disabledHover) {
                        return;
                    }
                    if (row._isHover) {
                        return;
                    }
                    hoverRow(row);
                };
                function removeHover(row) {
                    let tbodys = $element[0].querySelectorAll('.uix-datatable-tbody');
                    tbodys.forEach((tbody) => {
                        let rowEl = tbody.querySelectorAll('tbody > tr')[row._index];
                        if (rowEl) {
                            angular.element(rowEl).removeClass('uix-datatable-row-hover');
                        }
                    });
                }
                function hoverRow(row) {
                    let tbodys = $element[0].querySelectorAll('.uix-datatable-tbody');
                    tbodys.forEach((tbody) => {
                        tbody.querySelectorAll('tbody > tr').forEach((item, index) => {
                            if (row._index === index) {
                                angular.element(item).addClass('uix-datatable-row-hover');
                            } else {
                                angular.element(item).removeClass('uix-datatable-row-hover');
                            }
                        });
                    });
                }
                $table.handleMouseOut = (event, row) => {
                    event.stopPropagation();
                    if ($table.disabledHover) {
                        return;
                    }
                    removeHover(row);
                };
                $table.handleClickRow = (event, row) => {
                    event.stopPropagation();
                    if ($scope.onRowClick) {
                        $scope.onRowClick({
                            $row: row,
                            $index: row._index
                        });
                    }
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
                function handleBodyScroll() {
                    let scrollEl = findEl('.uix-datatable-main-table > .uix-datatable-body-wrap')[0];
                    let scrollTop = scrollEl.scrollTop;
                    let scrollLeft = scrollEl.scrollLeft;
                    findEl('.uix-datatable-main-table .uix-datatable-thead').css({
                        transform: `translateX(-${scrollLeft}px)`
                    });
                    if ($table.isLeftFixed) {
                        findEl('.uix-datatable-left-body')
                            .css({
                                transform: `translateY(-${scrollTop}px)`
                            });
                    }
                    if ($table.isRightFixed) {
                        findEl('.uix-datatable-right-body')
                            .css({
                                transform: `translateY(-${scrollTop}px)`
                            });
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

                function bindEvents() {
                    findEl('.uix-datatable-main-table > .uix-datatable-body-wrap').on('scroll', handleBodyScroll);
                    angular.element(window).on('resize', () => {
                        handleResize();
                    });
                }
                function unbindEvents() {
                    findEl('.uix-datatable-main-table > .uix-datatable-body-wrap').off('scroll', handleBodyScroll);
                    angular.element(window).off('resize', handleResize);
                }

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
                    let usableWidth = tableWidth - unUsableWidth - sumMinWidth - /*($table.showVerticalScrollBar ? $table.scrollBarWidth : 0) -*/ 1;
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
                        .reduce((item, prev) => item + prev, 0) /*+ ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0)  */ + 1;
                    $table.columnsWidth = columnsWidth;
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
                            column.__cellTemplate = column.template || $templateCache.get(column.templateUrl) || '';
                        } else {
                            column.__renderBodyCellType = 'normal';
                        }

                        if (angular.isDefined(column.headerTemplate) || angular.isDefined(column.headerTemplateUrl)) {
                            column.__renderHeadType = 'template';
                            column.__headTemplate = column.headerTemplate || $templateCache.get(column.headerTemplateUrl) || '';
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

                $table.alignCls = (column, row = {}) => {
                    let cellClassName = '';
                    if (row.cellClassName && column.key && row.cellClassName[column.key]) {
                        cellClassName = row.cellClassName[column.key];
                    }
                    return [
                        cellClassName,
                        column.className,
                        column.align ? `uix-datatable-column-${column.align}` : ''
                    ];
                };

                $table.initColums = function () {
                    const colsWithId = prepareColumns($scope.columns);
                    $table.allDataColumns = getDataColumns(colsWithId);

                    const columnsObj = splitDataColumns();

                    $table.allColumnRows = makeColumnRows(colsWithId);

                    $table.isLeftFixed = columnsObj.left.length > 0;
                    $table.isRightFixed = columnsObj.right.length > 0;
                };
                $table.initData = function () {
                    $table.rebuildData = makeRebuildData();
                };
                $table.refresh = () => {
                    $table.leftTableWidth = getFixedColumnsWidth('left') + 'px';
                    $table.rightTableWidth = getFixedColumnsWidth('right') + 'px';

                    $timeout(() => {
                        // handleResize();
                        renderTableBody();
                        // renderTableHead();
                    }, 0);
                };

                let $tableBodyScope = $scope.$parent.$new();
                $tableBodyScope.$table = $table;
                function showVerticalScrollBar() {
                    let mainTable = $element[0]
                        .querySelector('.uix-datatable-main-body > table');
                    return mainTable.offsetWidth > $element[0].offsetWidth;
                }
                // 获取所有模板并拼接
                function getCellTpls() {
                    let tpls = '';
                    $table.allDataColumns.forEach((column, colIndex) => {
                        if (column.__renderBodyCellType === 'template') {
                            tpls += `
                                <div ng-if="colIndex===${colIndex}">
                                    ${column.__cellTemplate}
                                </div>
                            `;
                        }
                    });
                    return tpls;
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
                function calcColumnsWidthCol(mainTable) {
                    let cells = mainTable.find('tr').eq(0).find('td');
                    let result = [];
                    angular.forEach(cells, (cell) => {
                        result.push(cell.offsetWidth);
                    });
                    return result.map(width => `<col width="${width}"></col>`).join('');
                }
                function renderTableBody() {
                    let template = $templateCache.get('templates/datatable-body.html');
                    template = template.replace('<%template%>', getCellTpls());
                    $compile(template)($tableBodyScope, (clonedElement) => {
                        let mainTable = angular.element($element[0]
                            .querySelector('.uix-datatable-main-body'));
                        mainTable.empty().append(clonedElement);
                        $timeout(() => {
                            $table.showHorizontalScrollBar = mainTable[0].querySelector('.uix-datatable-tbody').offsetWidth > $element[0].offsetWidth;
                            let mainBodyHeight = mainTable[0].offsetHeight;



                            if ($table.height) {
                                if (mainBodyHeight > $table.height) {
                                    $table.showVerticalScrollBar = true;
                                    $table.bodyStyle = {
                                        height: ($table.height + $table.scrollBarWidth) + 'px',
                                    };
                                }
                            } else if ($table.maxHeight) {
                                if (mainBodyHeight > $table.maxHeight) {
                                    $table.showVerticalScrollBar = true;
                                    $table.bodyStyle = {
                                        maxHeight: ($table.maxHeight + $table.scrollBarWidth) + 'px',
                                    };
                                }
                            }
                            $timeout(() => {
                                let columnsWidth = calcColumnsWidthCol(mainTable);
                                renderTableHead(columnsWidth);

                                let mainBodyWrapHeight = mainTable.parent()[0].offsetHeight;

                                if ($table.isLeftFixed) {
                                    let leftTable = angular.element($element[0]
                                        .querySelector('.uix-datatable-left-body'));
                                    leftTable.empty().append(mainTable.clone(true).children());

                                    $table.leftBodyStyle = {
                                        height: mainBodyWrapHeight - ($table.showHorizontalScrollBar ? $table.scrollBarWidth : 0) + 'px',
                                    }
                                }
                                if ($table.isRightFixed) {
                                    let rightTable = angular.element($element[0]
                                        .querySelector('.uix-datatable-right-body'));
                                    rightTable.empty().append(mainTable.clone(true).children());

                                    $table.rightBodyStyle = {
                                        height: mainBodyWrapHeight - ($table.showHorizontalScrollBar ? $table.scrollBarWidth : 0) + 'px',
                                        right: $table.showVerticalScrollBar ? $table.scrollBarWidth + 'px' : 0
                                    }
                                }
                            }, 0);
                        }, 0);
                    });
                }
                function renderTableHead(columnsWidth) {
                    let template = $templateCache.get('templates/datatable-head.html');
                    template = template.replace('<%cols%>', columnsWidth)
                        .replace('<%template%>', getHeadTpls());
                    $compile(template)($tableBodyScope, (clonedElement) => {
                        let mainTable = angular.element($element[0]
                            .querySelector('.uix-datatable-main-header'));
                        mainTable.empty().append(clonedElement);
                        $timeout(() => {
                            $table.headerHeight = mainTable[0].offsetHeight;
                            if ($table.isLeftFixed) {
                                let leftTable = angular.element($element[0]
                                    .querySelector('.uix-datatable-left-header'));
                                leftTable.empty().append(mainTable.clone(true).children());
                            }
                            if ($table.isRightFixed) {
                                let rightTable = angular.element($element[0]
                                    .querySelector('.uix-datatable-right-header'));
                                $table.rightBodyStyle = {
                                    ...$table.rightBodyStyle,
                                    marginTop: $table.headerHeight + 'px'
                                }
                                rightTable.empty().append(mainTable.clone(true).children());
                            }
                        }, 0);
                    });
                }

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
