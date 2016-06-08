# Popover
## Description
工具提示组件,依赖于<a ui-sref="app.api.popover" href="../../popover/docs/readme.md">popover</a>,基本搬运的是[ui-bootstrap](https://github.com/angular-ui/bootstrap)中的[popover](https://github.com/angular-ui/bootstrap/tree/1.0.0/src/popover)组件。

## Usage

``` javascript
基本用法
<span fugu-popover="{{string}}"
    [ popover-is-open="boolean" ]
    [ popover-enable="boolean" ]
    [ popover-placement="{{string}}" ]
    [ popover-class="{{string}}" ]
    [ popover-popup-close-delay="{{number}}" ]
    [ popover-popup-delay="{{number}}" ]
    [ popover-animation="boolean" ]
    [ popover-append-to-body="boolean" ]
    [ popover-trigger="{{string}}" ]>
</span>
生成含有HTML代码的提示
<span fugu-popover-html="{{string}}"
	...
>
</span>
生成含有模板的popover
<span fugu-popover-template="string"
	...
>
</span>
```
## Restrict
- 'AE'

## Arguments

- fuguPopover:指定popover的提示文字,若不设置,则不显示
    - type:`string`
- fuguPopoverHtml:指定popover的提示文字，可以包含html代码,若不设置,则不显示
    - type:`string`
- fuguPopoverTemplate:指定popover的提示文字，可以指定模板,如`ng-template`或者外部文件
    - type:`string`
- popoverIsOpen(optional):当`trigger`设置为`none`时，可以由`popover-is-open`属性设置popover是否显示。
    - type:`boolean`
    - default:`false`
- popoverEnable(optional):设置popover是否启用，当该选项设置为`false`的时候，即使`popoverIsOpen`是`true`也不会显示。
    - type:`boolean`
    - default:`true`
- popoverPlacement(optional):设置popover的展示方位，可选值参考<a ui-sref="app.api.position" href="../../position/docs/readme.md">position</a>
	- type:`string`
	- default:`"top"`
- popoverClass(optional):自定义的class
	- type:`string`
- popoverPopupDelay(optional):popover显示时的延迟时间
	- type:`number`
	- default:`0`
- popoverPopupCloseDelay(optional):popover隐藏时的延迟时间
	- type:`number`
	- default:`0`
- popoverAnimation(optional):是否运用动画效果
	- type:`boolean`
	- default:`true`
- popoverAppendToBody(optional):生成的popover是否插入到页面`body`元素中，设置为`false`的话默认和绑定指定的元素同级。
	- type:`boolean`
	- default:`false`
- popoverTrigger(optional):可以设置popover的触发方式，支持`click`（单击显示和隐藏）、`mouseenter`（鼠标进入显示，离开隐藏）、`outsideClick`（点击显示，再次单击其他区域隐藏），`focus`（获取焦点显示，失去焦点隐藏）和`none`（不会受任何影响，由`popover-is-open`控制显示隐藏）五种方式，。
    - type:`string`
    - default:`click`