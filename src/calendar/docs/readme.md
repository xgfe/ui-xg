# calendar
## Description

日历组件,可以选择日期，依赖于组件<a ui-sref="app.api.timepanel" href="../../timepanel/docs/readme.md">timepanel</a>

## Usage

``` html
<fugu-calendar ng-model="date"
    [ min-date="date" ]
    [ max-date="date" ]
    [ show-time="boolean" ]
    [ starting-day="number" ]
    [ exceptions="array">
</fugu-calendar>
```
## Restrict
- 'E'

## Provider
- fuguCalendarProvider：配置calendar相关的设置
- methods
    - `setFormats(format[,val])`：设置日期,周末等显示内容,具体参看[$locale](https://code.angularjs.org/1.3.20/docs/api/ng/service/$locale)相关API.

## Arguments

- ngModel:绑定数据
    - type:`date`
- minDate(optional):可显示的最大日期,比这个日期小的无法选择
    - type:`date`
- maxDate(optional):可显示的最大日期,比这个日期大的无法选择
    - type:`date`
- showTime(optional):是否显示时间选择
    - type:`boolean`
    - default:`true`
- startingDay(optional):每一周的开始天,0-周日,1-周一...以此类推
    - type:`number`
    - default:`0`(周日)
- exceptions(optional):禁用日期内的例外日期,日期对象或者日期对象数组
    - type:`date`|`array`
