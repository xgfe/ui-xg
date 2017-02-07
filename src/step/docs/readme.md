# step
## Description
步骤条组件，依赖steps组件，用于描述事情的进度，需要配合steps组件一起使用

## Usage

``` html
<uix-steps [direction="{{string}}"] [size="{{string}}"]>
    <uix-step title="{{string}}" [desc="{{string}}"] [icon="{{string}}"] [status="{{string}}"]></uix-step>
</uix-steps>
```
## Restrict
- 'AE'

## Arguments

- title:步骤条每个步骤的标题,必填
    - type:`string`
    - default:
- desc(optional):步骤条每个步骤的描述，选填默认为空
    - type:`string`
    - default:`null`
- icon(optional):自定义图标类名，此处使用fontawesome图标类名，选填默认为空
    - type:`string`
    - default:`null`
- status(optional):步骤条每个步骤所处状态，选填默认为`wait`未开始。可填:`wait`表示未开始、`process`表示进行中、`finish`表示已完成、`error`表示出错了
    - type:`string`
    - default:`wait`
