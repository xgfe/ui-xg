# 进度条 progressbar
## Description
进度条组件，有两种显示方式，一种是将写成`uix-progressbar`指令的形式；另一种是写成`<uix-progress><uix-bar></uix-bar></uix-progress>`
的形式，该种方式下可以有多个bar。参照的是[ui-bootstrap](https://github.com/angular-ui/bootstrap/tree/master/src/progressbar)指令

## Usage

### uix-progressbar的写法

``` html
<uix-progressbar
    [ value="number" ]
    [ type="string" ]
    [ max="number"]
    [ animate="boolean" ]
    [ title="string" ]>
</uix-progressbar>
```

### 将uix-progress与uix-bar分离的写法

``` html
<uix-progress
    [max="number"]
    [animate="boolean"]>
        <uix-bar
            [value="number"]
            [type="string"]
            [animate="boolean"]
            [title="string"]>
        </uix-bar>
        <uix-bar
            [value="number"]
            [type="string"]
            [animate="boolean"]
            [title="string"]>
        </uix-bar>
</uix-progress>
```

## Restrict
- 'AE'

## Arguments

- value:当前进度条完成值，用于计算进度条的百分比值的分子
    - type:`number`
- type:进度条显示的样式，共有5种样式，可选值包括`success`，`info`，`warning`，`danger`，`null`
    - type:`string`
    - default:`null`
- max: 指定进度条的最大值，用于计算进度条的百分比值的分母
    - type:`number`
    - default:`100`
- animate: 是否显示进度条的过渡状态
    - type:`boolean`
    - default: `false`
- title: 进度条的title
    - type:`string`
    - default:`progressbar`
