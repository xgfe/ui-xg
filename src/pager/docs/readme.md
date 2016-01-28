# pager
## Description
search box directive.

## Usage

``` javascript
<fugu-search-box [ng-model="string"]
    placeholder="test">
    </fugu-search-box>
```
## Restrict
- 'AE'

## Arguments

|  Param      |         Type        | Default|Details|
| ------------- |:-------------------:|:--:|:--:|
|  showBtn(optional)       | number |`true`|是否展示搜索按钮|
|  btnText(optional)       | string |`"搜索"`|展示搜索按钮的话，指定按钮上的文本|
|  search(optional)       | function |`none`|在搜索框中回车键或者点击搜索按钮之后触发|
