# Alert
## Description
提示组件,可展示不同样式的提示信息。

## Usage

``` javascript
<fugu-alert text="string"
    [ close="boolean" ]
    [ close-func="string" ]
    [ close-text="string" ]
    [ has-icon="boolean" ]
    [ dismiss-on-timeout="number" ]
    [ template-url="string" ]
    [ type="string" ]>
</fugu-button>
```
## Restrict
- 'E'

## Arguments

- close(optional):指定提示是否可关闭,默认显示`false`。
    - type:`boolean`
    - default:`false`
- closeFunc(optional):指定提示关闭的回调函数,取父作用域上的函数,默认为自带回调函数。
    - type:`string`
    - default:`null`
- closeText(optional):设置关闭按钮的替代文案,不适用则不显示文案。
    - type:`string`
    - default:`null`
- hasIcon(optional):设置是否使用图标。
    - type:`boolean`
    - default:`false`
- dismissOnTimeout(optional):设置提示自动关闭的时间，单位是毫秒。要使用这个属性必须`close`这个属性存在。
    - type:`number`
    - default:`null`
- templateUrl(optional):指定提示使用自定义模板的路径。默认不适用自定义模板。
    - type:`string`
    - default:`null`
- type(optional):设置提示的类别，有`danger`、`success`、`warning`和`info`四种可选，默认为`warning`。
    - type:`string`
    - default:`warning`