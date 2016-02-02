# searchBox
## Description
搜索框组件，主要封装搜索框的搜索事件。

## Usage

``` javascript
<fugu-search-box [ng-model="string"]
    [placeholder="{{string}}"]
    [show-btn="boolean"]
    [btn-text="{{string}}"]
    [search="function"]>
    </fugu-search-box>
```
## Restrict
- 'AE'

## Arguments

- ngModel:绑定数据
    - type:`string`
- placeholder(optional):搜索框的placeholder
    - type:`string`
- showBtn(optional):是否显示搜索按钮
    - type:`boolean`
    - default:`true`
- btnText(optional):展示搜索按钮的话，指定按钮上的文本
    - type:`string`
    - default:`"搜索"`
- search(optional):在搜索框中回车键或者点击搜索按钮之后触发的函数
    - type:`function`