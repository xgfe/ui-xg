#notify
## Description
 消息通知组件.全局组件,可以通过Provider设置通知持续显示时间、是否显示关闭按钮、提示框是否重复显示、是否允许提示html信息、是否显示关闭按钮、提示信息是否在一行显示、是否显示动画效果等. 
## Usage
 ``` <div fugu-notify [ reference="number" ] [ inline="boolean" ] [ limitMessages="boolean" ]></div> ```
## Arguments
- reference: 指定插入指令标志,默认为0.(类似id)
- inline: 指定插入指令所添加的提示信息是否在一行显示.
- limitMessages: 指定一个指令可以显示多少条提示信息,默认不限制.
## Restrict
- 'A'
## Provider
- notifyProvider: 全局配置notify相关的设置.
- methods
	- `globalTimeToLive(number|object)`: 设置通知显示时间,默认为-1表示一直显示.number表示设置显示时间(毫秒),则所有类型统一设置;object格式为`{error:number,info:number,warning:number,success:number}`,也可以只设置某几个属性.
	- `globalDisableCloseButton(boolean)`: 设置是否不显示关闭图标按钮,默认为false表示显示.
	- `globalDisableIcons(boolean)`: 设置是否不显示提示图标,默认为false表示显示.
	- `globalReversedOrder(boolean)`: 设置是提示信息是否倒序插入,默认为false表示顺序插入。
	- `globalDisableCountDown(boolean)`: 设置是否不显示关闭倒计时图标,默认为false表示显示。
	- `globalInlineMessages(boolean)`: 设置所有提示信息是否在一行显示,默认为false表示一行显示一条。
	- `globalPosition`: 设置提示信息显示位置,取值有:`top-right|bottom-right|middle-right|top-left|bottom-left|middle-left|top-center|bottom-center|middle-center`默认为`top-right`表示显示在右上角.
	- `onlyUniqueMessages`: 设置提示信息是否不能重复显示,默认为true表示不重复.
## notify
- inject: controller中注入
- methods
	- `warning(text, config)`: 显示警告通知,text为提示内容,config为当前显示通知配置项.
	- `error(text, config)`: 显示错误通知,text为提示内容,config为当前显示通知配置项.
	- `info(text, config)`: 显示信息通知,text为提示内容,config为当前显示通知配置项.
	- `success(text, config)`: 显示成功通知,text为提示内容,config为当前显示通知配置项.
	- `general(text, config, type)`: 显示通知,text为提示内容,type为通知类型(error,warning,success,info四种),config为当前显示通知配置项.
	- `onlyUnique()`: 获取provider中的配置信息,消息是否唯一,返回true|false.
	- `reverseOrder()`: 获取provider中的配置信息,消息插入是否逆序显示,返回true |false.
	- `inlineMessages()`: 获取provider中的配置信息,消息是否在一行显示,返回true|false.
	- `position()`: 获取provider中的配置信息,返回消息显示位置.

- config(object):上面函数传递的config参数对象
	- `disableIcons`: 设置是否不显示提示图标,类型为boolean.
	- `disableCloseButton`: 是否不显示关闭图标,类型为boolean.
	- `position`: 设置提示信息显示位置,取值有:`top-right|bottom-right|middle-right|top-left|bottom-left|middle-left|top-center|bottom-center|middle-center`.
	- `disableCountDown`: 设置是否不显示关闭倒计时图标提示,类型为boolean.
	- `referenceId`: 设置提示信息属于哪个插入指令,默认值都0.

