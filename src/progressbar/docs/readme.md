# progressbar
## Description
进度条组件，可根据不同参数显示不同样式的进度条

progressbar directive.

## Usage

``` html
<uix-progressbar
    [ value="number" ]
    [ type="string" ]
    [ max="number"]
    [ animate="boolean" ]
    [ title="string" ]>
</uix-progressbar>
```
## Restrict
- 'AE'

## Arguments

- `value`: 当前进度条完成值，用于计算进度条的百分比值的分子
- `type`: 进度条显示的样式，共有5种样式，可选值包括`success`，`info`，`warning`，`danger`，默认值为null
- `max`: 指定进度条的最大值，用于计算进度条的百分比值的分母，默认值为100
- `animate`: 显示进度条的过渡状态，默认值为false，表示不显示过渡状态
- `title`: 进度条的title，默认值为'progressbar'

## Description
进度条组件，将多个进度条显示在一起

## Usage

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

## Argument
同上述各项参数的描述