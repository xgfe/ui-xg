# 输入提示 Typeahead
## Description
搜索提示组件.分为本地数据和异步数据两种.

## Usage

``` javascript
基本用法
<uix-typeahead ng-model="string"
    [ query-list="array" ]
    [ placeholder="string" ]
    [ get-async-func="function" ]
    [ typeahead-loading="boolean" ]
    [ typeahead-no-results="boolean" ]>
</uix-typeahead>
```
## Restrict
- 'E'

## Arguments

- ngModel:typeahead的输入文字,改变后更新绑定的变量。
    - type:`string`
- queryList(optional):指定typeahead的筛选列表，传入一个字符串数组作为本地列表。
    - type:`array`
- placeholder(optional):指定typeahead中input的提示文字。
    - type:`string`
- getAsyncFunc(optional):如果需要显示异步数据时,getAsyncFunc指定数据提供function。
    - type:`function`
    - default:`false`
- typeaheadLoading(optional):当getAsyncFunc传入时,该变量表示当前是否为loading状态。
    - type:`boolean`
    - default:`false`
- typeaheadNoReuslts(optional):当getAsyncFunc传入时,该变量表示当前是否为空数据。
	- type:`boolean`
	- default:`"false"`

