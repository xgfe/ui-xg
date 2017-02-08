# steps
## Description
步骤条父组件,该组件为步骤条组件step的依赖模块，需要配合step组件一起使用

## Usage
``` html
<uix-steps [direction="{{string}}"] [size="{{string}}"]>
    <uix-step title="{{string}}" [desc="{{string}}"] [icon="{{string}}"] [status="{{string}}"]></uix-step>
</uix-steps>
```
## Restrict
- 'AE'

## Arguments

- direction(optional):步骤条的展示方式,可选`vertical`、`horizontal`，默认为`vertical`
    - type:`string`
    - default:`vertical`
- size(optional):指定步骤条中间线的长短,可选`lg`、`md`、`sm`，默认`md`
    - type:`string`
    - default:`md`
