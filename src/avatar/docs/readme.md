# avatar
## Description
头像
用来代表用户或事物，支持图片、图标或字符展示。

## Usage

``` html
<uix-avatar
 [content="string"]
 [src="string"]
 [icon="string"]
 [size="small|large|default"]
 [shape="square|circle"]
 >
</uix-avatar>
```
## Restrict
- 'E'

## Arguments
- content(optional):指定显示的内容
    - type:`string`
    - default:`null`
- src(optional):指定显示图片
    - type:`string`
    - default:`null`
- icon(optional):指定显示图标
    - type:`string`
    - default:`null`   
- size(optional):指定大小,可取值`small`、`large`、`default`,默认为`default`
    - type:`string`
    - default:`default`
- shape(optional):指定形状,可取值`square`、`circle`,默认为`circle`
    - type:`string`
    - default:`circle`

