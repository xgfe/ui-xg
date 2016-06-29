# dropdown
## Description
下拉菜单组件，支持多列。可以通过Provider设置多列数目，当列表项的数目大于多列数目时以多列显示

## Usage

```
<div class="btn-group" uix-dropdown is-open="status.isopen">
    <button type="button" uix-dropdown-toggle ng-disabled="disabled">
        Button dropdown
    </button>
    <ul class="dropdown-menu" role="menu">
        <li><a href="#">Something else here</a></li>
        <li><a href="#">Separated link</a></li>
    </ul>
</div>
```
## Restrict
- 'AE'

## Provider
- uixDropdownProvider：全局配置dropdown相关的设置
- methods
    - `setColsNum(num)`：设置多列数目

## Arguments

- isOpen:是否开启列表
    - type:`boolean`
    - default:`false`
- colsNum:设置列数,属性的配置会覆盖全局provider的配置,全局的配置会覆盖默认的配置
    - type:`number`
    - default:`3`
- onToggle:打开关闭的时候的回调函数,含有一个布尔值的参数,表示是否是打开的状态
    - type:`function`