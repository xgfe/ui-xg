# cascaderSelect
## Description

级联选择组件，依赖于组件<a ui-sref="app.api.select" href="../../select/docs/readme.md">select</a>，整个组件使用confs作为唯一的数据接口，confs的类型只允许为数组，数组的元素类型只允许是对象，在对象中对每一个select进行配置。

## Usage

``` html
<uix-cascader-select confs="confs">
</uix-cascader-select>
```
## Restrict
- 'E'

## Arguments
- code:选择器的唯一标识，必填
    - type: 'string' 
- lebel:选择器的label，可选
    - type: 'string'
- defaultValue:选择器的默认值，可选
    - type: 'object'
- emptyValue:选择器的空值，第一级可选，非第一级必填，用于父级的值发生变化时的展示的默认值
    - type: 'object'
- itemLabel:下拉列表的value
    - type: 'string'
- itemValue:下拉列表的key
    - type: 'string'
- className:选择器的类名
    - type: 'string'
- getData:选择器获取数据的方法，在方法中可以自行指定url、请求参数，非第一级节点会默认将父节点的值作为参数传入
    - type: 'function'
