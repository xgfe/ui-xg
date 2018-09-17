# grid
## Description
24栅格组件

grid directive.

## Usage

``` html
<uix-grid
    [uix-grid-align]
    [uix-grid-justify]
    [uix-grid-gutter]
    [uix-grid-reverse]
    [uix-grid-xs]
    [uix-grid-sm]
    [uix-grid-md]
    [uix-grid-lg]
    [uix-grid-xl]
    [uix-grid-xxl]
>
    <uix-grid-item
        [uix-grid-item-span]
        [uix-grid-item-offset]
        [uix-grid-item-order]
        [uix-grid-item-xs]
        [uix-grid-item-sm]
        [uix-grid-item-md]
        [uix-grid-item-lg]
        [uix-grid-item-xl]
        [uix-grid-item-xxl]
    >
    </uix-grid-item>
</uix-grid>
```
## Restrict
- 'AE'

## Arguments
### Grid
- uix-grid-align: 垂直对齐方式，可取值top, middle, bottom，默认显示top
    - type:`string`
    - default:`top`

- uix-grid-justify: 横向排列方式，可取值start, end, center, around, between，默认显示start
    - type:`string`
    - default:`start`

- uix-grid-gutter: 间距，当值未设置或为true时生效
    - type:`string`

- uix-grid-reverse: 倒序排列，当值未设置或为true时生效
    - type:`string`

- uix-grid-(xs|sm|md|lg|xl|xxl): 响应式设置，对象属性包括align, justify, gutter, reverse

### Grid Item
- uix-grid-item-span: 宽度，可取值0-24或`''`，0时隐藏，`''`为自适应宽度
    - type:`string`

- uix-grid-item-offset: 偏移宽度，可取值0-24
    - type:`string`

- uix-grid-item-order: 排序值，可取值0-24
    - type:`string`

- uix-grid-(xs|sm|md|lg|xl|xxl): 响应式设置，对象属性包括span, offset, order