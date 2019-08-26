# 数据表格 datatable

主要用于展示大量结构化数据。

支持排序、固定列、固定表头、分页、自定义操作、单选多选等复杂功能。

### Restrict
- 'E'

## Arguments

### uixDatatable 参数

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 显示的结构化数据，其中，字段 `cellClassName` 用于设置任意单元格的样式名称，因此数据不能使用该字段，详见示例[特定样式](#datatable_customStyle)。 | Array<[Column](#column-%e6%8f%8f%e8%bf%b0)> | [] | 
| columns | 表格列的配置描述，具体项见后文 | Array | [] |
| striped | 是否显示间隔斑马纹 | boolean | `false` |
| bordered | 是否显示纵向边框 | boolean | `false` |
| width | 表格宽度，单位 `px` | Number / String | `auto` |
| height | 表格高度，单位 px，设置后，如果表格内容大于此值，会固定表头 | Number / String | - |
| max-height | 表格最大高度，单位 px，设置后，如果表格内容大于此值，会固定表头 | Number / String | - |
| row-class-name | 行的 className 的回调方法，传入参数：row-当前行数据；index：当前行的索引 | Function | - |
| disabledHover | 是否禁用鼠标悬浮效果 | boolean | `false` |
| status | 表格状态，可选值<ul><li>`1/loading`：加载状态</li><li>`2/empty`：数据为空</li><li>`-1/error`：加载失败状态</li></ul> | String | - |
| loadingText | 加载中状态提示文案，也可通过全局的`uixDatatableProvider`设置，属性优先级高于全局设置| String| `'数据加载中'` |
| emptyText | 数据为空状态提示文案，配置方式同`loadingText`| String| `'数据为空'` |
| errorText | 数据加载失败状态提示文案，配置方式同`loadingText`| String| `'加载失败'` |

### uixDatatable 回调函数

| 属性 | 说明 | 参数 |
| --- | --- | --- | 
| on-sort-change | 排序时有效，当点击排序时触发 | <ul><li>`$column`：当前列数据</li><li>`$order`：排序的顺序，值为 `asc` 或 `desc`</li><li>`$key`：排序依据的指标</li></ul> |
|on-row-click|单击某一行时触发|<ul><li>`$row`：当前行数据</li><li>`$index`：行索引</li></ul> |

### uixDatatableProvider 

`uixDatatableProvider`可以在应用全局配置表格相关属性。

| 方法 | 说明 | 参数 |
| --- | --- | --- | 
| setStatusText | 设置表格不同状态的提示文案，参考示例[表格状态](#datatable_status) | Object |

### Column 描述
列描述数据对象，是 columns 中的一项

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | String | # | 
| key | 对应列内容的字段名 | String | - |
| width | 列宽 | Number | - |
| minWidth | 最小列宽 | Number | - |
| maxWidth | 最大列宽 | Number | - |
| align | 对齐方式，可选值为 `left` `左对齐、right` 右对齐和 `center` 居中对齐 | String | `left` |
| className | 列的样式名称 | String | - |
| fixed | 列是否固定在左侧或者右侧，可选值为 `left` 左侧和 `right` 右侧 | String | - |
| sortable | 对应列是否可以排序 | boolean | `false` |
| children | 表头分组 | Array<Column> | - |
| template | 自定义列，可以是字符串，也可是函数，函数参数为<ul><li>`row`：当前行数据</li><li>`index`：行索引</li></ul> | String / Function | - |
| templateUrl | 自定义列模板ID，指定模板的ID，函数的参数同上，使用方式参考[自定义列模板](#datatable_customTemplate) | String / Function | - |
| headerTemplate | 自定义表头，可以是模板，也可是函数，函数参数为<ul><li>`column`：当前列数据</li><li>`index`：列索引</li></ul> | String / Function | - |
| headerTemplateUrl | 自定义列模板ID，指定模板的ID，函数的参数同上，使用方式参考[自定义列模板](#datatable_customHeader) | String / Function | - |