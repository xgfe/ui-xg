import basic from './basic';
import rawBasic from '!!raw-loader!./basic';
import basicTemplate from './basic.html';

import stripe from './stripe';
import rawStripe from '!!raw-loader!./stripe';
import stripeTemplate from './stripe.html';

import border from './border';
import rawborder from '!!raw-loader!./border';
import borderTemplate from './border.html';

import customStyle from './customStyle';
import rawcustomStyle from '!!raw-loader!./customStyle';
import customStyleTemplate from './customStyle.html';

import fixedHeader from './fixedHeader';
import rawfixedHeader from '!!raw-loader!./fixedHeader';
import fixedHeaderTemplate from './fixedHeader.html';

import fixedColumns from './fixedColumns';
import rawfixedColumns from '!!raw-loader!./fixedColumns';
import fixedColumnsTemplate from './fixedColumns.html';

import fixedHeaderAndColumns from './fixedHeaderAndColumns';
import rawfixedHeaderAndColumns from '!!raw-loader!./fixedHeaderAndColumns';
import fixedHeaderAndColumnsTemplate from './fixedHeaderAndColumns.html';

import radio from './radio';
import rawradio from '!!raw-loader!./radio';
import radioTemplate from './radio.html';

import selection from './selection';
import rawselection from '!!raw-loader!./selection';
import selectionTemplate from './selection.html';

import sort from './sort';
import rawsort from '!!raw-loader!./sort';
import sortTemplate from './sort.html';

import customTemplate from './customTemplate';
import rawcustomTemplate from '!!raw-loader!./customTemplate';
import customTemplateTemplate from './customTemplate.html';

import customHeader from './customHeader';
import rawcustomHeader from '!!raw-loader!./customHeader';
import customHeaderTemplate from './customHeader.html';

import columnsGroup from './columnsGroup';
import rawcolumnsGroup from '!!raw-loader!./columnsGroup';
import columnsGroupTemplate from './columnsGroup.html';

import status from './status';
import rawstatus from '!!raw-loader!./status';
import statusTemplate from './status.html';

import pagination from './pagination';
import rawpagination from '!!raw-loader!./pagination';
import paginationTemplate from './pagination.html';

import rawData from '!!raw-loader!./data';
export const name = 'datatable';
export const cnName = '数据表格';
export { default as readme } from './readme.md';

export const demos = {
    basic: {
        title: '基本用法',
        description: '表格的最简单用法。<br> 通过设置<code>align</code>可以设置文本对齐方式',
        controller: basic,
        template: basicTemplate,
        script: rawData + rawBasic
    },
    stripe: {
        title: '斑马纹',
        description: '设置属性 <code>striped</code> ，表格会间隔显示不同颜色，用于区分不同行数据。',
        controller: stripe,
        template: stripeTemplate,
        script: rawData + rawStripe
    },
    border: {
        title: '带边框',
        description: '设置属性 <code>bordered</code> 可以添加表格的边框线。',
        controller: border,
        template: borderTemplate,
        script: rawData + rawborder
    },
    customStyle: {
        title: '自定义样式',
        description: `
        行：通过属性 <code>row-class-name</code> 可以给某一行指定一个样式名称。<br/>
        列：通过给列 <code>columns</code> 设置字段 <code>className</code> 可以给某一列指定一个样式。<br/>
        单元格：通过给数据 <code>data</code> 设置字段 <code>cellClassName</code> 可以给任意一个单元格指定样式。
        `,
        controller: customStyle,
        template: customStyleTemplate,
        script: rawData + rawcustomStyle
    },
    fixedHeader: {
        title: '固定表头',
        description: '通过设置属性 <code>height</code>或<code>max-height</code> 给表格指定高度后，会自动固定表头。当纵向内容过多时可以使用。',
        controller: fixedHeader,
        template: fixedHeaderTemplate,
        script: rawData + rawfixedHeader
    },
    fixedColumns: {
        title: '固定列',
        description: '通过给数据 <code>columns</code> 的项设置 <code>fixed</code> 为 <code>left</code> 或 <code>right</code>，可以左右固定需要的列。当横向内容过多时可以使用。',
        controller: fixedColumns,
        template: fixedColumnsTemplate,
        script: rawData + rawfixedColumns
    },
    fixedHeaderAndColumns: {
        title: '固定表头和列',
        description: '同时应用上述两个属性，可以同时固定表头和列。',
        controller: fixedHeaderAndColumns,
        template: fixedHeaderAndColumnsTemplate,
        script: rawData + rawfixedHeaderAndColumns
    },
    // radio: {
    //     title: '单选',
    //     description: `
    //     通过给 <code>columns</code> 数据设置一项，指定 <code>type: radio</code>，即可自动开启多选功能。<br>
    //     `,
    //     controller: radio,
    //     template: radioTemplate,
    //     script: rawData + rawradio
    // },
    // selection: {
    //     title: '多选',
    //     description: `
    //     通过给 <code>columns</code> 数据设置一项，指定 <code>type: selection</code>，即可自动开启多选功能。<br>
    //     当选择时，触发事件<code>on-selection-change</code>
    //     `,
    //     controller: selection,
    //     template: selectionTemplate,
    //     script: rawData + rawselection
    // },
    sort: {
        title: '排序',
        description: `
        通过给 <code>columns</code> 数据的项，设置 <code>sortable: true</code>，即可对该列数据进行排序。<br>
        排序默认升序和降序，当触发排序时，触发事件<code>on-sort-change</code>，<code>on-sort-change</code>的回调参数有三个，分别是：
        <ul>
        <li><code>$column</code>：列数据</li>  
        <li><code>$key</code>：列标识</li>  
        <li><code>$order</code>：排序方式。<code>normal-默认</code>，<code>asc-升序</code>和<code>desc-降序</code></li>  
        </ul>
        使用方式参看demo
        `,
        controller: sort,
        template: sortTemplate,
        script: rawData + rawsort
    },
    customTemplate: {
        title: '自定义列模板',
        description: `
        通过给 <code>columns</code> 数据的项设置参数 <code>template</code>或<code>templateUrl</code> ，可以自定义渲染当前列。<br>
        <code>template</code> 的值是一段HTML，<code>templateUrl</code> 的值是<code>ng-template</code>。<br/>
        二者都可以是直接的值，也可以是一个具有返回值的函数，函数有两个参数，分别是当前行的内容以及行索引。
        使用自定义模板时，模板内可以调用外部作用域的属性或值，同时可以获取<code>$row(行数据)</code>、<code>$column(列数据)</code>、<code>$index(行索引)</code>三个值，具体使用方法可以查看demo
        `,
        controller: customTemplate,
        template: customTemplateTemplate,
        script: rawData + rawcustomTemplate
    },
    customHeader: {
        title: '自定义表头',
        description: `
        通过给 <code>columns</code> 数据的项设置参数 <code>headerTemplate</code>或<code>headerTemplateUrl</code> ，可以自定义渲染当前列的表头。<br>
        使用方式同“自定义列模板”，区别在于如果指定的是函数的话，函数的两个参数分别是当前列的内容以及列索引。<br>
        模板内可以调用外部作用域的属性或值，同时可以获取<code>$column(列数据)</code>、<code>$index(列索引)</code>两个值，具体使用方法可以查看demo
        `,
        controller: customHeader,
        template: customHeaderTemplate,
        script: rawData + rawcustomHeader
    },
    columnsGroup: {
        title: '表头分组',
        description: '给 <code>column</code> 设置 <code>children</code>，可以渲染出分组表头。',
        controller: columnsGroup,
        template: columnsGroupTemplate,
        script: rawData + rawcolumnsGroup
    },
    status: {
        title: '表格状态',
        description: `
        通过设置属性 <code>status</code> 可以让表格处于不同状态，在异步请求数据、分页时建议使用。<br>
        <ul>
        <li><code>status=1或'loading'</code>时表示加载中</li>
        <li><code>status=2或'empty'</code>时表示数据为空</li>
        <li><code>status=-1或'error'</code>时表示加载失败</li>
        </ul>
        三种状态对于的提示语句分别是：<code>loadingText</code>、<code>emptyText</code>和<code>errorText</code>，可通过属性传递，也可通过<code>uixDatatableProvider</code>在全局设置，属性设置会覆盖全局配置
        `,
        controller: status,
        template: statusTemplate,
        script: rawData + rawstatus
    },
    pagination: {
        title: '带分页',
        description: `
        分页目前没有封装到表格内部，可以和<a ui-sref="app.components.pager">pager</a>搭配使用
        `,
        controller: pagination,
        template: paginationTemplate,
        script: rawData + rawpagination
    },
};
