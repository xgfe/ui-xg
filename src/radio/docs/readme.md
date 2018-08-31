# radio

## Description

单选框组件。有三种显示方式，一种是简写成`uix-radio`指令的形式；一种是写成`<uix-radio-group><uix-radio></uix-radio></uix-radio-group>`，另一种是`<uix-radio-group><uix-radio-btn></uix-radio-btn></uix-radio-group>`。后两种形式，内部都可以重复包含多个子指令。

## Usage

### 最简单的用法

``` html
<uix-radio
    [value="string"]
    [disabled="boolean"]
    [default-checked]>
    Radio
</uix-radio>
```

### 一组互斥的 Radio

``` html
<uix-radio-group
    [options="array"]
    [value="string"]
    [change-fn="function(value)"]
    [disabled="boolean"]>
</uix-radio-group>
```

### 一组互斥的 Radio ，组合形式

``` html
<uix-radio-group
    [options="array: string | object:{label: [string], value: [string], disabled: [boolean]}"]
    [value="string"]
    [name="string"]
    [change-fn="function(value)"]
    [disabled="boolean"]>
        <uix-radio
            [value="string"]
            [disabled="boolean"]
            [default-checked]>
            A.这里是内容~
        </uix-radio>
        <uix-radio value="2">B.这里是内容~</uix-radio>
</uix-radio-group>
```

### 一组互斥的 Radio ，组合按钮形式

``` html
<uix-radio-group
    [size="string"]
    [value="string"]
    [change-fn="function(value)"]
    [btn-style="string"]
    [disabled="boolean"]>
        <uix-radio-btn
            [value="string"]
            [disabled="boolean"]
            [default-checked]>
            A.这里是内容~
        </uix-radio-btn>
        <uix-radio value="2">B.这里是内容~</uix-radio>
</uix-radio-group>
```

## Restrict

- 'E'

## Arguments

- value:当前单选框组件的value值，用于确定选择的结果
    - type:`string`
- options:指定当前单选框组件的每个选项及选项对应的值，及每个选项是否可操作
    - type:`array`
    - default:`null`
    - childType: `object`
- change-fn: 单选框组件的value值发生改变时，调用函数
    - type:`function`
    - default:`null`
- disabled: 组件或选项是否可操作
    - type:`boolean`
    - default: `false`
- default-checked: 选项的默认选择项
    - type:`boolean`
    - default:`progressbar`
- size:当前单选框按钮组件的尺寸，分为sm(小)、md(中)、lg(大)
    - type:`string`
    - default:`md`
- btn-style:当前单选框按钮组件的风格
    - type:`string`
    - default:`primary`
    