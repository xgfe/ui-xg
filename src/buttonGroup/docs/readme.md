# buttonGroup
## Description
按钮组组件,可用于展示一组数据,实现类radio或checkbox效果。

## Usage

``` javascript
<fugu-button-group ng-model="string|object"
    [ type="string" ]
    [ size="string" ]
    [ disabled="boolean" ]
    [ show-class="string" ]
    [ checkbox-true="boolean" ]
    [ checkbox-false="boolean" ] >
    <button [btn-checkbox="string"]
        [btn-radio="string"]></button>
</fugu-button-group>
```
## Restrict
- 'AE'

## Arguments

- ngModel:设置按钮组绑定选中(`radio:string|checkbox:object`)数据对象,如果type为`radio`,则该取值对应设置的`btnRadio`,与ngModel值相同的btnRadio被选中,按钮间切换选择同事修改ngModel绑定数据;如果type为`checkbox`,则ngModel是一个对象,其键(key)是所有对应的子button的`btnCheckbox`值,而值(value)则是`checkboxFalse|checkboxTrue`(boolean类型)对应的值,`checkboxTrue`表示key对应button被选中,`checkboxTrue`则表示不选.如果不设置程序会报错.
    - type:`string|object`
- type(optional):指定按钮组类型,取值`radio(单选)`或者`checkbox(多选)`,默认为`radio`
    - type:`string`
    - default:`radio`
- size(optional):设置按钮组显示大小,取值`x-small`、`small`、`default`、`large`,默认为`default`
    - type:`string`
    - default:`default`
- disabled(optional):设置按钮组是否不可用,取值`true`、`false`,默认可用
    - type:`boolean`
    - default:`false`
- showClass(optional):设置按钮组显示样式,取值`danger`、`warning`、`default`、`success`、`info`、`primary`,默认显示`default`
    - type:`string`
    - default:`default`
- checkboxFalse(optional):`checkbox`类型,设置子button不选时ngModel设置对象,对应的value值,默认为`false`
    - type:`string｜boolean`
    - default:`false`
- checkboxTrue(optional):`checkbox`类型,设置子button选中时ngModel设置对象,对应的value值,默认为`true`
    - type:`string｜boolean`
    - default:`true`
- btnCheckbox(optional):`设置在子元素button上`,主要用来选中|不选,设置对应ngModel的key值.如果不设置,则取button显示文本作为默认值.
    - type:`string`
- btnRadio(optional):`设置在子元素button上`,主要用来根据ngModel的值判断是否选中,同时选中之后重新设置ngModel的值,则取button显示文本作为默认值.
    - type:`string`