# timepicker
## Description

时间选择器，依赖于<a ui-sref="app.api.timepanel" href="../../timepanel/docs/readme.md">timepanel</a>

## Usage

``` html
<fugu-timepicker ng-model="time"
    [ hour-step="number" ]
    [ minute-step="number" ]
    [ second-step="number" ]
    [ placeholder="string" ]
    [ format="string" ]
    [ readonly-input="boolean" ]
    [ min-time="date" ]
    [ max-time="date" ]
    [ size="{{string}}" ]
    [ show-seconds="boolean" ]
    [ ng-disabled="boolean" ]>
</fugu-timepicker>
```
## Restrict
- 'AE'

## Arguments
- ngModel:绑定日期对象
    - type:`date`
- hourStep(optional):每次增加或减少的小时数
    - type:`number`
    - default:`1`
- minuteStep(optional):每次增加或减少的分钟数
    - type:`number`
    - default:`1`
- secondStep(optional):每次增加或减少的秒数
    - type:`number`
    - default:`1`
- placeholder(optional):显示在输入框的提示文本
    - type:`string`
- format(optional):显示在输入框的格式化日期，与angular自带的[dateFilter](https://docs.angularjs.org/api/ng/filter/date)可选的格式一样。
    - type:`string`
    - default:`HH:mm:ss`
- readonlyInput(optional):输入框是否是只读模式
    - type:`boolean`
    - default:`false`
- minTime(optional):可选择的最小时间
    - type:`date`
- maxTime(optional):可选择的最大时间
    - type:`date`
- size(optional):大小,可选值`sm`,`md`和`lg`
    - type:`stirng`
    - default:`"md"`
- showSeconds(optional):是否显示秒
    - type:`boolean`
    - default:`false`
- ngDisabled(optional):是否禁用
    - type:`boolean`
    - default:`false`