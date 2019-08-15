# 定位 position
## Description
`$uixPosition`是一个用于对DOM元素进行绝对定位的service，在<a ui-sref="app.api.tooltip" href="../../tooltip/docs/readme.md">`tooltip`</a>、<a ui-sref="app.api.popover" href="../../popover/docs/readme.md">`popover`</a>、<a ui-sref="app.api.timepicker" href="../../timepicker/docs/readme.md">`timepicker`</a>和<a ui-sref="app.api.datepicker" href="../../datepicker/docs/readme.md">`datepicker`</a>中均有使用。代码使用的是[ui-bootstrap](https://github.com/angular-ui/bootstrap)的。

## Usage

```
// 模块进行依赖
angular.module('yourModule',['ui.xg.position']);

// 注入
.controller('yourController',['$uixPosition',function($uixPosition){
	...
}])
```

## Methods
### getRawNode(element)
把一个jQuery/jqLite对象转化为原生的DOM元素。

### parseStyle(element)
把一个数值的CSS属性值转化为数字，去掉属性单位且当值不合法的时候返回0。

### offsetParent(element)
获取最近的有定位（即`position`不为`static`）的祖先元素。

### scrollbarWidth()
计算浏览器的滚动条宽度并缓存结果。

### scrollParent(element,includeHidden)
获取最近的可以滚动的祖先元素。借鉴jQueryUI中的[scrollParent.js](https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js)。

### position(element,includeMargins)
相当于jQuery中[position](http://api.jquery.com/position/)方法的自读版本，获取距离最近的定位祖先元素的距离。和jQuery中的position类似，默认不计算`margins`。

### offset(element)
相当于jQuery中[offset](http://api.jquery.com/offset/)方法的自读版本，获取距离视图边界的距离。

### viewportOffset(element,useDocument,includePadding)
获取相对于最接近的可滚动的祖先元素可用空间，包括`padding`，`border`和滚动条宽度，`right`和`bottom`值表示元素距离视图元素相应边界的距离，而不是`left`和`top`边界。如果元素超出视图元素边界计算出的值为负数。

### parsePlacement(placement)
把定位字符串解析成定位的数组，除了`"auto"`之外，包括的定位值包括：

- `"top"`：元素在主元素上方并水平居中
- `"top-left"`：元素在主元素上方并以左边界对齐
- `"top-right"`：元素在主元素上方并以右边界对齐
- `"bottom"`：元素在主元素的下方并水平居中
- `"bottom-left"`：元素在主元素的下方并左边界对齐
- `"bottom-right"`：元素在主元素的下方并右边界对齐
- `"left"`：元素在主元素的左侧并垂直居中
- `"left-top"`：元素在主元素的左侧并上边界对齐
- `"left-bottom"`：元素在主元素的左侧并下边界对齐
- `"right"`：元素在主元素的右侧并垂直居中
- `"right-top"`：元素在主元素的右侧并上边界对齐
- `"right-bottom"`：元素在主元素的右侧并下边界对齐

定位字符串包括`"auto"`的话需要使用空格分开各个定位，如`"auto top-left"`，如果主定位和第二定位不是`"top"`,`"left"`,`"right"`中的任何一个，`"top"`会作为主要定位，`"center"`会作为第二定位。如果传递了`"auto"`，函数返回值的第三个值会是`true`。

### positionElements(hostElement,targetElement,placement,appendToBody)
获取把一个元素定位到另一个元素特定位置中的坐标。

### positionArrow(element,placement)
使用`placement`选项对`tooltip`和`popover`中的“箭头”进行定位，可选择`"top"`、`"left"`、`"bottom"`和`"right"`.
