# dropdown
## Description
下拉菜单组件，支持多列。可以通过Provider设置多列数目，当列表项的数目大于多列数目时以多列显示

## Usage

```
<fugu-dropdown
    [ is-open="boolean" ]
    [ cols-num="number" ]>
        <button fugu-dropdown-toggle type="button" class="btn">Text</button>
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

- isOpen:是否开启列表
    - type:`boolean`
    - default:`false`
- colsNum:设置列数,属性的配置会覆盖全局provider的配置,全局的配置会覆盖默认的配置
    - type:`number`
    - default:`3`