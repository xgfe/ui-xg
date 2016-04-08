# Tooltip
## Description
一个轻量级的可扩展的提示指令，支持click和hover两种形式。

## Usage

``` javascript
<span fugu-tooltip content="tooltip message"
    [ tooltip-is-open="string" ]
    [ trigger="string" ]>
</span>
```
## Restrict
- 'AE'

## Arguments

- content:指定tooltip的提示文字,若不设置，则默认显示`请设置提示文字`。
    - type:`string`
    - default:`请设置提示文字`
- trigger(optional):可以设置tooltip的触发方式，目前支持`click`和`hover`两种方式，若选择`hover`需要单独指定。
    - type:`string`
    - default:`click`
- tooltipIsOpen(optional):当trigger设置为`click`时，可以由`tooltip-is-open`属性设置tooltip是否显示。
    - type:`boolean`
    - default:`false`