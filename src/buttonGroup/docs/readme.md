# buttonGroup
## Description
按钮组组件,可用于展示一组数据,实现类radio或checkbox效果。

## Usage

``` html
<uix-button-group ng-model="string|object"
    [ bg-type="string" ]
    <button [btn-checkbox-true="string"]
        [btn-radio-val="string"]
        [btn-checkbox-false="string"]
        [name="string"]
        ></button>
</uix-button-group>
```
## Restrict
- 'AE'

## Arguments

- ngModel:设置按钮组绑定选中(`radio:string|checkbox:object`)数据对象,如果type为`radio`,则该取值对应设置的`btnRadioVal`,与ngModel值相同的btnRadioVal被选中,按钮间切换选择同时修改ngModel绑定数据;如果type为`checkbox`,则ngModel是一个对象,其键(key)是所有对应的子button的`name`值,而值(value)则是`btnCheckboxFalse|btnCheckboxTrue`(boolean类型)对应的值,`btnCheckboxTrue`表示key对应button被选中,`btnCheckboxFalse`则表示不选.如果不设置程序会报错.
    - type:`string`|`object`
- bgType(optional):指定按钮组类型,取值`radio(单选)`或者`checkbox(多选)`,默认为`radio`
    - type:`string`
    - default:`radio`
- btnCheckboxFalse(optional):`checkbox`类型,设置子button不选时ngModel设置对象,对应的value值,默认为`false`
    - type:`string`｜`boolean`
    - default:`false`
- btnCheckboxTrue(optional):`checkbox`类型,设置子button选中时ngModel设置对象,对应的value值,默认为`true`
    - type:`string`｜`boolean`
    - default:`true`
- name(optional):`设置在子元素button上`,主要用来标志每个子checkbox元素,设置ngModel的时候,通过name对应.
    - type:`string`
- btnRadioVal(optional):`设置在子元素button上`,主要用来根据ngModel的值判断是否选中,同时选中之后重新设置ngModel的值.如果设置`type=radio`,则必须设置
    - type:`string`
- uncheckable(optional):指定radio类型按钮组是否可取消选择,默认为false
     - type:`boolean`
     - default:`false`