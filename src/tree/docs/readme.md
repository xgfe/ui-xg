# tree
## Description
树组件,可以用于以层级的形式展示数据,也可以用于选择数据。

## Usage

``` javascript
<fugu-tree ng-model="array"
    [ show-icon="boolean" ]
    [ checkable="boolean" ]
    [ expand-all="boolean" ]
    [ on-click="function" ]
    [ on-check-change="function" ] >
</fugu-tree>
```
## Restrict
- 'AE'

## Arguments

- ngModel:绑定tree展示和操作数据,具有特定格式`[{label: '省份', children: []}]`,其中如果是叶子节点,`children`为空,可以省略,如果不为空其内容也是上述格式.
    - type:`array`
- showIcon(optional):是否显示文件夹|文件图标,默认显示
    - type:`boolean`
    - default:`true`
- checkable(optional):是否显示勾选框,默认显示
    - type:`boolean`
    - default:`true`
- expandAll(optional):是否展开树,默认展开
    - type:`boolean`
    - default:`true`
- onClick(optional):点击树节点名称时触发的事件,同时可以派发出一个参数data(表示点击节点)
    - type:`function`
- onCheckChange(optional):勾选|取消勾选时触发的事件,同时可以派发出一个参数data(表示选中节点集)
    - type:`function`