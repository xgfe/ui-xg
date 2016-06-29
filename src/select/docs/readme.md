# select
## Description

select directive.参考[ui-select](https://github.com/angular-ui/ui-select),去除了theme的设置,其他功能照搬过来

## Usage

``` html
<uix-select ng-model="model"
    [ ng-disable="boolean" ]
    [ multiple="boolean" ]
    ... >
    <uix-select-match
        [ placeholder="string" ]
        [ allow-clear="boolean" ] ...>{{$select.selected.name}}</uix-select-match>
    <uix-select-choices repeat="item in list | filter:$select.search">
        <span>{{item.name}}</span>
    </uix-select-choices>
</uix-select>
```
## Restrict
- 'E'

## Arguments
参考[ui-select](https://github.com/angular-ui/ui-select)的[相关配置](https://github.com/angular-ui/ui-select/wiki)
