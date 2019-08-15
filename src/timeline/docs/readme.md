# 时间轴 timeline
## Description

时间轴组件，用于垂直展示时间流信息。

## Usage

``` html
<uix-timeline node-data="array"
    [ mode="string" ]
    [ reverse="boolean" ]
    [ pending="boolean" ]>
</uix-timeline>
```
## Restrict
- 'E'

## Arguments

- nodeData: 数据源，array类型.
    - type:`array`
- mode(optional): 通过设置mode可以改变时间轴和内容的相对位置，可取值`left`、`alternate`、`righgt`，默认为`left`
    - type:`string`
    - default:`left`
- reverse(optional): 节点排序，默认为`false`
    - type:`boolean`
    - default:`false`
- pending(optional): 指定最后一个幽灵节点是否存在，默认为`false`.
    - type:`boolean`
    - default:`false`