# switch
## Description
开关组件，用于开启某些状态的地方。

## Usage

``` html
<fugu-switch ng-model="boolean"
    [size="{{string}}"]
    [type="{{string}}"]
    [on-change="function"]>
    </fugu-switch>
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
- onChange(optional):开关按钮绑定的数据变化之后触发的函数
    - type:`function`