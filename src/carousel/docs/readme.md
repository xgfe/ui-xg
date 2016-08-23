# carousel
## Description

carousel directive.

## Usage

``` html
<uix-carousel>
    <uix-carousel-item></uix-carousel-item>
</uix-carousel>
```

``` javascript
<uix-carousel
    [interval="number"]
    [active="index"]
    [no-loop="boolean"]
    [no-pause="boolean"]
    [no-transition="boolean"]
>
</uix-carousel>

<uix-carousel-item index="index"
    [active="boolean"]
></uix-carousel-item>
```

## Restrict
- 'AE'

## Arguments

### uix-carousel
- interval(optional):定时轮播时间(ms),如果<=0则定时不生效
    - type: `number`
- active(optional):首次加载时第一次显示某个index,值和uix-carousel-item的index相同。会被uix-carousel-item中的active覆盖
    - type: `index`
    - default: `默认第一个uix-carousel-item`
- no-loop(optional):取消定时轮播
    - type: `boolean`
    - default: `false`
- no-pause(optional):取消鼠标移入时暂停切换
    - type: `boolean`
    - default: `false`
- no-transition(optional):取消轮播动画
    - type: `boolean`
    - default: `false`

### uix-carousel-item
- index:标号
    - type: `any`
- active(optional):是否作为首次显示,覆盖uix-carousel中的active
    - type: `boolean`
    - default: `false`