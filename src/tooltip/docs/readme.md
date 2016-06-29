# Tooltip
## Description
工具提示组件,依赖于<a ui-sref="app.api.position" href="../../position/docs/readme.md">position</a>,基本搬运的是[ui-bootstrap](https://github.com/angular-ui/bootstrap)中的[tooltip](https://github.com/angular-ui/bootstrap/tree/1.0.0/src/tooltip)组件(捂脸~).

## Usage

``` javascript
基本用法
<span uix-tooltip="{{string}}"
    [ tooltip-is-open="boolean" ]
    [ tooltip-enable="boolean" ]
    [ tooltip-placement="{{string}}" ]
    [ tooltip-class="{{string}}" ]
    [ tooltip-popup-close-delay="{{number}}" ]
    [ tooltip-popup-delay="{{number}}" ]
    [ tooltip-animation="boolean" ]
    [ tooltip-append-to-body="boolean" ]
    [ tooltip-trigger="{{string}}" ]>
</span>
生成含有HTML代码的提示
<span uix-tooltip-html="{{string}}"
	...
>
</span>
生成含有模板内容的提示
<span uix-tooltip-template="string"
	...
>
</span>
```
## Restrict
- 'AE'

## Provider
- $uixTooltipProvider：设置tooltip的全局属性以及扩展类似于tooltip的指定，如<a ui-sref="app.api.popover" href="../../popover/docs/readme.md">popover</a>
	- `setTriggers(obj)`：设置显示和隐藏的触发事件，如`{ 'openTrigger':'closeTrigger' }`
	- `options(obj)`：设置全局的属性，如默认定位，是否启用动画效果等。

## Arguments

- uixTooltip:指定tooltip的提示文字,若不设置,则不显示
    - type:`string`
- uixTooltipHtml:指定tooltip的提示文字，可以包含html代码,若不设置,则不显示
    - type:`string`
- uixTooltipTemplate:指定tooltip的提示文字，可以指定模板,如`ng-template`或者外部文件
    - type:`string`
- tooltipIsOpen(optional):当`trigger`设置为`none`时，可以由`tooltip-is-open`属性设置tooltip是否显示。
    - type:`boolean`
    - default:`false`
- tooltipEnable(optional):设置tooltip是否启用，当该选项设置为`false`的时候，即使`tooltipIsOpen`是`true`也不会显示。
    - type:`boolean`
    - default:`true`
- tooltipPlacement(optional):设置tooltip的展示方位，可选值参考<a ui-sref="app.api.position" href="../../position/docs/readme.md">position</a>
	- type:`string`
	- default:`"top"`
- tooltipClass(optional):自定义的class
	- type:`string`
- tooltipPopupDelay(optional):tooltip显示时的延迟时间
	- type:`number`
	- default:`0`
- tooltipPopupCloseDelay(optional):tooltip隐藏时的延迟时间
	- type:`number`
	- default:`0`
- tooltipAnimation(optional):是否运用动画效果
	- type:`boolean`
	- default:`true`
- tooltipAppendToBody(optional):生成的tooltip是否插入到页面`body`元素中，设置为`false`的话默认和绑定指定的元素同级。
	- type:`boolean`
	- default:`false`
- tooltipTrigger(optional):可以设置tooltip的触发方式，支持`click`（单击显示和隐藏）、`mouseenter`（鼠标进入显示，离开隐藏）、`outsideClick`（点击显示，再次单击其他区域隐藏），`focus`（获取焦点显示，失去焦点隐藏）和`none`（不会受任何影响，由`tooltip-is-open`控制显示隐藏）五种方式，。
    - type:`string`
    - default:`mouseenter`
