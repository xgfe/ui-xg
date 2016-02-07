# button
## Description
按钮组件,可以展示不同样式和功能作用的按钮。

## Usage

``` javascript
<fugu-button text="string"
    [ type="string" ]
    [ btnClass="string" ]
    [ size="string" ]
    [ block="boolean" ]
    [ loading="boolean" ]
    [ disabled="boolean" ]
    [ icon="boolean" ]
    [ active="boolean" ]
    [ click="function" ] >
</fugu-button>
```
## Restrict
- 'AE'

## Arguments

- text(optional):指定按钮显示文本,默认显示`button`
    - type:`string`
    - default:`Button`
- type(optional):指定按钮样式,可取值`button`、`reset`、`submit`,默认为`button`
    - type:`string`
    - default:`button`
- btnClass(optional):设置按钮样式,可取值`danger`、`warning`、`default`、`success`、`info`、`primary`,默认显示`default`
    - type:`string`
    - default:`default`
- size(optional):设置按钮大小,可取值`x-small`、`small`、`default`、`large`,默认`default`
    - type:`string`
    - default:`default`
- block(optional):设置按钮是否全部填充父元素,默认为否
    - type:`boolean`
    - default:`false`
- loading(optional):设置是否显示按钮加载效果,默认不显示
    - type:`boolean`
    - default:`false`
- disabled(optional):设置按钮是否不可用,默认可用
    - type:`boolean`
    - default:`false`
- icon(optional):设置按钮图标(参考bootstrap),默认不显示
    - type:`string`
- active(optional):设置按钮是否为激活(选中)状态,默认为非激活状态
    - type:`boolean`
    - default:`false`
- click(optional):点击按钮时触发的事件
    - type:`function`