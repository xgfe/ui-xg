# 开关 switch
## Description
开关组件，用于开启某些状态的地方。

## Usage

``` html
<uix-switch ng-model="boolean"
    [ size="{{string}}" ]
    [ type="{{string}}" ]
    [ true-value="value" ]
    [ false-value="value" ]
    [ on-change="function" ]>
    </uix-switch>
```
## Restrict
- 'E'

## Arguments

- ngModel:绑定数据，必须赋值
    - type:`boolean`
- size(optional):大小。可取值`sm`,`md`,`lg`
    - type:`string`
    - default:`"md"`
- type(optional):开关类型。可取值`default`,`primary`,`success`,`info`,`error`
    - type:`string`
    - default:`"default"`
- trueValue(optional):当选中的时候ngModal的值
    - type:`string`|`number`|`boolean`
    - default:`true`
- falseValue(optional):当未选中的时候ngModal的值
    - type:`string`|`number`|`boolean`
    - default:`false`
- onChange(optional):点击之后如果ngModel绑定对象改变,触发该方法
    - type:`function`