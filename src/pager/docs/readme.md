# pager
## Description
分页器组件

## Usage

```
<uix-pager total-items="number"
    ng-model="number"
    [ items-per-page="number" ]
    [ max-size="number" ]
    [ first-text="{{string}}" ]
    [ last-text="{{string}}" ]
    [ previous-text="{{string}}" ]
    [ next-text="{{string}}" ]
    [ boundary-links="boolean" ]
    [ direction-links="boolean" ]
    [ show-total="boolean" ]>
    </uix-pager>
```
## Restrict
- 'E'

## Arguments

- totalItems:条目总数
    - type:`number`
- ngModel:当前页码,可以用`ng-change`监控变化
    - type:`number`
- itemsPerPage(optional):每一页的数量
    - type:`number`
    - default:`20`
- maxSize(optional):分页器展示页码的最大数量
    - type:`number`
    - default:`5`
- firstText(optional):首页按钮文本
    - type:`string`
    - default:`"首页"`
- lastText(optional):尾页按钮文本
    - type:`string`
    - default:`"尾页"`
- previousText(optional):上一页按钮文本
    - type:`string`
    - default:`"上一页"`
- nextText(optional):下一页按钮文本
    - type:`string`
    - default:`"下一页"`
- boundaryLinks(optional):是否显示边界的按钮,默认是"首页"和"尾页"按钮
    - type:`boolean`
    - default:`true`
- directionLinks(optional):是否显示方向的按钮,默认是"上一页"和"下一页"按钮
    - type:`boolean`
    - default:`true`
- showTotal(optional):是否显示条目和页码总数
    - type:`boolean`
    - default:`true`