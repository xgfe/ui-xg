# rate

## Description

 评分组件.

## Usage

``` html
<uix-rate ng-model="number"
    [count="number"]
    [rating-icon="string"]
    [read-only="boolean"]
    [rating-select-color="string"]
    [on-change="fn($oldVal, $newVal)"]>
</uix-rate>
```


## Restrict
- 'E'

## Arguments
- ngModel: 指定评分计数,number类型,实现双向数据绑定.范围为0~count-1,如果设置为0,则评分0(具体表现就是全为灰色,一个都不选);如果设置的值超过count-1,则设置为count-1,即全部选择.如果传入的值不合法,则充值为0,如果传入小数则四舍五入为整数.
    - type:`number`
- count(optional): 一个评分组件中icon的数量,如果不设置或设置为0,则默认为`5`
    - type:`number`
    - default:`5`
- readOnly: 当前评分组件只读,默认为`false`
    - type:`boolean`
    - default:`false`
- ratingIcon: 设置评分图标,默认为空五角星.可设置自定义图标样式如`rating-icon="'fa  fa-icon'"`,也可设置为bootstrap中定义的icon样式,如`rating-icon="'glyphicon glyphicon-ban-circle'"`
    - type:`string`
    - default:`'glyphicon glyphicon-star'`
- ratingSelectColor: 指定打分之后颜色,默认为`'#f5a623'`,橙色.可使用style中设置颜色样式的所有方式进行设置,例如'red','#ff000','rgb(234,54,33)','rgba(123,112,3,0.5)'
    - type:`string`
    - default:`'#f5a623'`
- onChange: 点击图标实现评分操作(修改ng-model)的值,评分计数发生改变时的回调函数,同时传递出去两个参数$oldVal和$newVal,其中$oldVal表示原评分计数的值,$newVal表示新评分计数的值.首次加载不会触发该事件.该事件不同于ng-change在于,使用该事件时候可以捕获两个参数.
    - type: `function`





