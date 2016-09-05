# accordion
## Description

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
## Restrict
- 'E'

## Arguments

- closeOthers:是否只允许同一时间展开一个group，值为`true`表示只允许展开一个，反之可同时展开多个
    - type:`boolean`
    - default: `true`
- heading:group标题文本
    - type: `string`
- isOpen:是否展开,值为`true`表示展开,反之收起
    - type: `boolean`
    - default: `true`