# pager
## Description
分页器组件

## Usage

```
<fugu-pager total-items="number"
    page-no="number"
    [items-per-page="number"]
    [max-size="number"]
    [first-text="{{string}}"]
    [last-text="{{string}}"]
    [previous-text="{{string}}"]
    [next-text="{{string}}"]
    [page-changed="function">]
    </fugu-pager>
```
## Restrict
- 'E'

## Arguments

- totalItems:条目总数
    - type:`number`
- pageNo:当前页码
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
- pageChanged(optional):切换页码的时候触发的函数
    - type:`function`