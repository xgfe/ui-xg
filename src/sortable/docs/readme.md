# sortable
## Description

排序指令,可以对列表进行排序,目前sortable的使用局限性较大,只能对`ngRepeat`进行排序!

## Usage

``` html
<ul fugu-sortable="array">
    <li ng-repeat="item in array track by $index">your html code here</li>
</ul>
```
## Restrict

- 'AE'

## Notes

**在列表循环的时候如果使用`ngRepeat`指令,必须指定tracking,如`item in list track by $index`,不然可能会出现问题**



## Arguments

- fuguSortable:需要被排序的数组,建议和repeat的数组保持一致
    - type:`array`
