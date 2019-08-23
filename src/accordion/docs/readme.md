# 手风琴 Accordion
手风琴组件.

## Usage

``` html
<uix-accordion
    [close-others="boolean"]>
    <div uix-accordion-group
        [heading="string"]
        [is-open="boolean"]>
        <!-- some content or template here -->
    </div>
</uix-accordion>
```

### Restrict
- 'E'

## Arguments

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| closeOthers | 是否只允许同一时间展开一个group，值为`true`表示只允许展开一个，反之可同时展开多个 | `boolean` | `true` | 
| heading | group标题文本 | string |  |
| isOpen | 是否展开,值为`true`表示展开,反之收起 | `boolean` | `true` |

