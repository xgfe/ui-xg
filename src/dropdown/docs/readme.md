# dropdown
## Description
下拉菜单组件，支持多列。可以通过Provider设置多列数目，当列表项的数目大于多列数目时以多列显示

## Usage

```
<fugu-dropdown btn-value="{{string}}"
    [is-open="boolean"]
    [ng-disabled="boolean"]>
        <fugu-dropdown-choices>{{string}}</fugu-dropdown-choices>
    ...
</fugu-dropdown>
```
## Restrict
- 'E'

## Provider
- fuguDropdownProvider：全局配置dropdown相关的设置
- methods
    - `setColsNum(num)`：设置多列数目

## Arguments

- btnValue:按钮显示文本
    - type:`string`
- isOpen:是否开启列表
    - type:`boolean`
    - default:`false`
- ngDisabled:是否禁用下拉列表
    - type:`boolean`
    - default:`false`