# modal
## Description

modal组件,用于快捷地创建一个modal,没有实际的dom指令,通过调用$uixModal这个service来创建.
本组件参考的是[ui-bootstrap](https://github.com/angular-ui/bootstrap)的[v0.12.1](https://github.com/angular-ui/bootstrap/tree/0.12.1)中[modal](https://github.com/angular-ui/bootstrap/blob/0.12.1/src/modal/modal.js)组件

## Usage

$uixModal是一个快速创建modal的service,$uixModal只有一个方法-open(options),用于创建一个动态的modal,下面是options可以配置的属性

- `templateUrl`:modal内容的模板路径
- `template`:modal内容模板
- `size`:modal的大小,默认中等,其他和选值为`"sm"`,`"lg"`
- `scope`:一个作用域对象,会依据这个作用域创建一个新的应用于modal的作用域,默认是`$rootScope`
- `controller`:modal实例的controller,可以注入`$scope`,`$uixModalInstance`等依赖
- `controllerAs`:一个可供选择的controller
- `resolve`:可以被转化并且注入到controller中的本地对象
- `backdrop`:是否显示蒙版,默认为`true`,可以设置为`false`或`static`,设置为`static`的话,点击modal窗口之外的区域不会关闭modal
- `keyboard`:是否启用点击ESC键关闭modal的功能
- `backdropClass`:给蒙版额外附加的样式
- `windowClass`:给modal窗口额外添加的样式

调用open方法会返回一个modal的示例对象,该对象可以调用下列方法

- `close(result)`:关闭窗口,可以传递参数
- `dismiss(result)`:可以用来解除modal,也可以传递参数
- `result`:一个Promise对象,当窗口以close方式关闭会执行resolve,当以dismiss关闭会执行reject
- `opened`:一个Promise对象,当窗口加载所有模板并注入依赖的时候调用

在modal的controller中注入的`$scope`会有两个特殊的方法:

- `$close(result)`:同上述`close(result)`方法
- `$dismiss(result)`:同上述`dismiss(result)`方法

注入的`$uixModalInstance`对象含有的方法和调用open方法之后返回的实例一样

上述这些方法可以很方便得按照需要关闭modal并根据不同情况执行后续操作

还有其他可用的service，比如`$uixModalStack`，用于关闭窗口，可以调用其`dismissAll(result)`方法关闭所有窗口