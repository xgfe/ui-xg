# 表格加载 TableLoader
## Description
表格加载loading组件,当加载数据时,会显示相应的loading图标。

## Usage

``` javascript
<tag uix-table-loader="string"
	[ loader-height="number" ]
	[ no-thead="boolean" ]
/>
```
## Restrict
- 'A'

## Provider
- uixTableLoaderProvider：全局配置tableLoader相关的设置。
- methods
	- setLoadingTime(num)：设置loading的时间。

## Arguments

- uixTableLoader:指定当前loading效果的状态。
```
0表示初始状态或已加载成功，不需要loading;
1表示当前正在加载中;
2表示加载的数据列表为空;
-1表示当前已加载失败。
```
    - type:`string`
    - default: `必填值`
- loaderHeight:设置loader的默认高度。
    - type:`number`
    - default:`auto`
- noThead:设置loading时不显示`<thead>`。
    - type:`boolean`
    - default:`false`
- loadingTime:设置loading时间，属性的配置会覆盖全局provider的配置，全局的配置会覆盖默认的配置。
