# tabs

## Description

 选项卡切换组件,主要用于同一区域展示不同内容,依赖组件`uix-tab`.  

## Usage

``` html
<uix-tabs [active="number"]
    [type="string"]
    [on-change="fn($oldVal, $newVal)"]>
    <uix-tab [heading="string"] [index="number"] [disabled="boolean"]>content</uix-tab>
    <uix-tab [heading="string"] [index="number"]>content</uix-tab>
</uix-tabs>
```


## Restrict
- 'E'

## Arguments
- heading(optional): 指定tab的标题内容,字符串格式,可以是文本也可以是html代码串,如果不填.默认值为`Tab`
    - type:`string`
    - default:`Tab` 
- index(optional): tab唯一标示,类似id,如果不指定,默认第一个tab为`1`,之后tab的index值为前一个加1.该值主要用active对应,确定哪个tab被选中
    - type:`number`
    - default:`1`   
- disabled(optional): 是否禁用当前tab,默认为`false`
    - type:`boolean`
    - default:`false`
- active(optional): 指定tabs中当前选中的子tab,默认为第一个,active的值需要与`uix-tab`组件中index属性对应
    - type:`boolean`
    - default:`1`
- type(optional): 指定标签页组件样式,默认为`tabs`,可设置值为`tabs,pills`
    - type:`string`
    - default:`tabs`
- onChange(optional): tab页切换的时的回调函数,同时传递出去两个参数`$oldVal`和`$newVal`,其中$oldVal表示切换前tab对应的index,$newVal表示最新切换的tab对应的index,首次加载选中tab不会触发
    - type: `function`
- uixTab的content: 指定tab对应的内容,可以是文本,也可以使用`{{content}}`动态插入内容,还可以直接使用html,`注意:必须使用一个根目录对内容进行包裹`
    - type: `html`|`string`



