# Loader
## Description
数据加载loading组件,当加载数据时,会显示相应的loading图标。

## Usage

``` javascript
<tag uix-loader="string" 
	[ loader-height="number" ]
/>
```
## Restrict
- 'A'

## Arguments

- uixLoader:指定当前loading效果的状态。
```
0表示初始状态或已加载成功，不需要loading；
1表示当前正在加载中；
-1表示当前已加载失败。
```
    - type:`string`
    - default: `必填值`
- loaderHeight:设置loader的默认高度。
    - type:`number`
    - default:`auto`
