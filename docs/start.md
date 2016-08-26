# 开始使用
## 依赖
本组件的开发主要依赖于以下几个库:
- Angular JS(v1.2.25): 组件库只支持1.2.25版本的AngularJs。
- Bootstrap(v3.3.6): 支持组件库样式设计。


## 下载
组建代码主要有两种形式:压缩(主要使用,存在于构建后的dist目录下)和未压缩(用于开发,存在于src目录下)。以上所有代码都可以[下载]()。

想要了解更多内容,请看[组件](http://xgfe.github.io/ui-xg/#/app/api/alert)和[开发者文档](http://xgfe.github.io/ui-xg/#/app/guide)

## 安装
- 使用bower安装: `bower install ui-xg`

## 使用
- 文件引入
	- angular.min.js
	- bootstrap.css
	- ui-xg.min.css
	- ui-xg.min.js

	**angular和bootstrap文件的引入要在ui-xg文件引入之前**
- 具体使用

```
/**
 * js文件
 */
angular.module('myApp',['ui.xg']);  // 组件依赖注入
// 以alert使用为例
angular.module('uixDemo').controller('alertDemoCtrl',['$scope', function ($scope) {
    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
        { type: 'warning', msg: 'FBI Warning! Manong would ignore anything about warning.' },
        { type: 'info', msg: 'I know that you wouldn\'t see this line.' }
    ];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}]);


/**
 * html文件
 */
 <div ng-controller="alertDemoCtrl">
    <uix-alert ng-repeat="alert in alerts" type="{{alert.type}}" close="true" close-func="closeAlert($index)" has-icon="true">{{alert.msg}}</uix-alert>
</div>

```