# datepicker
## Description

日期选择组件,可以选择时间,依赖于<a ui-sref="app.api.calendar" href="../../calendar/docs/readme.md">calendar</a>组件

## Usage

``` html
<fugu-datepicker ng-model="date"
    [ min-date="date" ]
    [ max-date="date" ]
    [ placeholder="string" ]
    [ clear-btn="boolean" ]
    [ format="string" ]
    [ exceptions="array|date" ]
    [ auto-close="boolean" ]
    [ show-time="boolean" ]
    [ size="{{string}}" ]
    [ ng-disabled="boolean" ]>
</fugu-datepicker>
```
## Restrict
- 'E'

## Arguments
- ngModel:绑定数据
    - type:`date`
- minDate(optional):可显示的最大日期,比这个日期小的无法选择
    - type:`date`
- maxDate(optional):可显示的最大日期,比这个日期大的无法选择
    - type:`date`
- placeholder(optional):输入框placeholder
    - type:`string`
- clearBtn(optional):是否显示清空按钮
    - type:`boolean`
    - default:`false`
- format(optional):日期格式化,与angular自带的[dateFilter](https://docs.angularjs.org/api/ng/filter/date)可选的格式一样。
    - type:`string`
    - default:`yyyy-MM-dd hh:mm:ss a`
- exceptions(optional):禁用日期内的例外日期,日期对象或者日期对象数组
    - type:`date`|`array`
- autoClose(optional):选择日期之后是否自动关闭面板
    - type:`boolean`
    - default:`true`
- showTime(optional):是否可以选择时间
    - type:`boolean`
    - default:`true`
- size(optional):指定尺寸,可选择`'sm'`,`'md'`,`'lg'`
    - type:`string`
    - default:`'md'`
- ngDisabled(optional): 是否禁用
    - type:`boolean`
    - default:`false`
