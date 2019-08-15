# 城市选择器 cityselect
## Description

cityselect组件，可以根据传入的数据进行城市的初始化并提供各种操作，整个组件使用ng-model作为唯一的数据接口，ng-model允许传入一个对象，里面可以进行参数设置。

## Usage

``` html
<div class="btn btn-default cityselect-test" uix-cityselect ng-model="config">城市选择</div>
    </div>
```
## Restrict
- 'E'

## Arguments

- placement:城市选择浮层出现位置,可选
  - type: `string`
  - default: `bottom`
- class:css修改
  - type: `string`
- initPage:tab页的初始状态
  - type: `number`
  - default: `0`
- isShowHot:是否现实热门城市
  - type: `bool`
  - default: `true`
- isShowSelected:是否初始化显示已选城市
  - type: `bool`
  - default: `false`
- supportChoseAll:是否支持全选
  - type: `bool`
  - default: `true`
- supportChoseReverse:是否支持反选
  - type: `bool`
  - default: `true`
- supportSearch:是否支持搜索
  - type: `bool`
  - default: `true`
- supportChoseClear:是否支持清空
  - type: `bool`
  - default: `true`
- animation:城市选择浮层出现动画
  - type: `bool`
  - default: `true`
- requestGetData:是否通过后台请求获得数据
  - type: `bool`
  - default: `false`
- requestUrl:后台请求路径
  - type: `string`
- requestData:后台请求参数
  - type: `object`
- chosedCityDisable:是否支持初始选择值不被修改
  - type: `bool`
  - default: `false`
- supportGroup:是否支持城市分组，此值不同则传进来的allCity的数据结构不同
  - type: `bool`
  - default: `true`
- hotCity:当isShowHot为true时需传入此参数
  - type: `[{cityId: xx, cityName: xx}]`
- initChosedCity:初始选中的城市
  - type: `[{cityId: xx, cityName: xx}]`
- allCity:所有的城市，当supportGroup为false时
  - type: `[{cityId: xx, cityName: xx}]`
- allCity:所有的城市，当supportGroup为true时
  - type: `{'AA': [{name: xx, data: [{cityId: xx, cityName: xx}]}]}`
- callBack:回调函数，将选中的城市列表传递出去，如果用户不配置这个参数，则关闭时选中的城市自动初始化为下次打开时的初始选中城市
  - type: `function`

## Attention

* 整个组件通过cityId进行判断
* 热门城市，已选城市应该属于全部城市
* allCity是必填项，且必须按照规定的数据格式来，具体格式看例子和参数详情
* 不传hotCity也会显示热门城市的标题，如果不想显示需操作isShowHot参数
* placement, class, animation不支持动态修改，需初始化时设定


