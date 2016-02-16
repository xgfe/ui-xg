# timepanel
## Description

时间选择面板，在<a ui-sref="app.api.canlender" href="../../canlender/docs/readme.md">canlender</a>和<a ui-sref="app.api.timepicker" href="../../timepicker/docs/readme.md">timepicker</a>中有使用

## Usage

``` html
<fugu-timepanel ng-model="time"
    [ hour-step="number" ]
    [ minute-step="number" ]
    [ second-step="number" ]
    [ show-seconds="boolean" ]
    [ mousewheel="boolean" ]
    [ arrowkeys="boolean" ]
    [ on-change="function" ]>
</fugu-timepanel>
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
- showSeconds(optional):是否显示秒
    - type:`boolean`
    - default:`true`
- mousewheel(optional):是否可以使用鼠标滚轮增加或减少小时/分钟/秒
    - type:`boolean`
    - default:`true`
- arrowkeys(optional):是否可以使用上下方向键增加或减少小时/分钟/秒
    - type:`boolean`
    - default:`true`
- onChange(optional):时间变动的时候触发的函数，只需要传入方法名即可，这样方法的参数为绑定是日期对象
    - type:`function`