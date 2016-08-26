# 组件文档编写规范

为了便于使用者了解组件功能以及使用方法，组件必须有相应的文档解释功能和方法。组件文档包括以下几个部分：

## Description
描述部分简单介绍组件的功能和特点。

## Usage
用法部分介绍组件的使用规范，主要包括两个部分：组件的名称以及属性。具体格式如下：

```
<uix-name attr1="type"
	[attr2="type"]
</uix-name>
```
其中，必填属性直接写出，所有非必填的属性由中括号`[]`注明。同时标注出每个属性的取值类型。

**组件名称为`uix-组件名称`，组件属性为驼峰式命名，如`fooBar`而不是`foo-bar`。**

## Restrict
Restrict部分标识如何定义一个指令作为标签使用。其中包括以下四种取值：

- `A`：允许作为一个属性。
- `E`：允许作为一个元素。
- `C`：作为一个类名。
- `M`：作为一个注释。

**可以结合以上的任意值来放松限制，例如`AE`等**

## Arguments
在Arguments部分，详细解释每个属性的作用。其中包括以下四个部分：

- `Param`：属性名称。驼峰式命名。
- `Type`：属性取值格式。
- `Default`：属性的默认值。
- `Detail`：解释每个属性的具体含义。

按照下面的格式进行描述：

```
- Param(optional):Detail
	- type:`Type`
	- default:`Defailt`
```
需要注意以下的几点：

- 类型字段必须用**小写**。
- 如果该属性为为必填属性，需要在括号中添加`optional`标记为可选。
- 如果某个属性允许多种类型同时存在，需要用`|`将`Type`进行分隔。例如属性既支持`string`又支持`function`，则需要备注```- type:`function`|`string` ```。

如下面的demo所示：

```
- text(optional):指定按钮显示文本,默认显示`button`
    - type:`string`
    - default:`Button`
```

## Example
实例部分包括两个部分：

- 一部分是示例文件，一般包括一个`index.html`和`script.js`，如果需要设置样式的话还有样式文件`style.css`。
- 另外一部分是生成的`demo`，在`demo`中显示该组件的具体功能。

# Demo

以下是button组件的文档以供参考（其中例如`Description`等标题必须用二级标题）：

	
	# button
	## Description
	按钮组件,可以展示不同样式和功能作用的按钮。
	
	## Usage
	
	``` javascript
	<uix-button text="string"
	    [ type="string" ]
	    [ btnClass="string" ]
	    [ size="string" ]
	    [ block="boolean" ]
	    [ loading="boolean" ]
	    [ disabled="boolean" ]
	    [ icon="boolean" ]
	    [ active="boolean" ]
	    [ click="function" ] >
	</uix-button>
	```
	## Restrict
	- 'AE'
	
	## Arguments
	
	- text(optional):指定按钮显示文本,默认显示`button`
	    - type:`string`
	    - default:`Button`
	- type(optional):指定按钮样式,可取值`button`、`reset`、`submit`,默认为`button`
	    - type:`string`
	    - default:`button`
	- btnClass(optional):设置按钮样式,可取值`danger`、`warning`、`default`、`success`、`info`、`primary`,默认显示`default`
	    - type:`string`
	    - default:`default`
	- size(optional):设置按钮大小,可取值`x-small`、`small`、`default`、`large`,默认`default`
	    - type:`string`
	    - default:`default`
	- block(optional):设置按钮是否全部填充父元素,默认为否
	    - type:`boolean`
	    - default:`false`
	- loading(optional):设置是否显示按钮加载效果,默认不显示
	    - type:`boolean`
	    - default:`false`
	- disabled(optional):设置按钮是否不可用,默认可用
	    - type:`boolean`
	    - default:`false`
	- icon(optional):设置按钮图标(参考bootstrap),默认不显示
	    - type:`string`
	- active(optional):设置按钮是否为激活(选中)状态,默认为非激活状态
	    - type:`boolean`
	    - default:`false`
	- click(optional):点击按钮时触发的事件
	    - type:`function`
	

