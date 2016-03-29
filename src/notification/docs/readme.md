# notification
## Description
消息通知组件。全局组件,可以通过Provider设置通知持续显示时间、是否显示关闭按钮、提示框是否重复显示.

## Usage

```
在需要使用通知页面对应controller中注入notification(provider),通过使用notification上方法进行调用.
angular.module('XXXXApp').controller('YYYYCtrl',['notification', function (notification) {}])
```
## notification
- inject: controller中注入
- methods
    - `warning(text, config)`: 显示警告通知,text为提示内容,config为当前显示通知配置项.
    - `error(text, config)`: 显示错误通知,text为提示内容,config为当前显示通知配置项.
    - `info(text, config)`: 显示信息通知,text为提示内容,config为当前显示通知配置项.
    - `success(text, config)`: 显示成功通知,text为提示内容,config为当前显示通知配置项.
    - `common(text, config, type)`: 显示通知,text为提示内容,type为通知类型(error,warning,success,info四种),config为当前显示通知配置项.
- config(object)
    - `duration`: 通知显示持续时间(毫秒),类型为number,默认为-1,表示一直显示.
    - `disableCloseBtn`: 是否显示关闭图标,类型为boolean,默认为false,显示关闭图标.
    - `variables`: 自定义变量对象,用于解析text中的插值{{}}变量,类型为object,默认为空.



## Restrict
- 'A'

## Provider
- notificationProvider: 全局配置notification相关的设置.
- methods
    - `globalDurationTime(number|object)`: 设置通知显示时间,默认为-1表示一直显示.number表示设置显示时间(毫秒),则所有类型统一设置;object格式为`{error:number,info:number,warning:number,success:number}`,也可以只设置某几个属性.
    - `globalDisableCloseBtn(boolean)`: 设置是否显示关闭图标,默认为true表示显示.
    - `globalUnique`: 设置相同通知是否可以重复显示,默认为true表示不重复(唯一).
    - `globalLimitNum`: 设置通知限制显示条数,默认为-1表示不限制.