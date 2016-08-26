# ui-xg - AngularJS directives

[![Build Status](https://travis-ci.org/xgfe/ui-xg.svg?branch=master)](https://travis-ci.org/xgfe/ui-xg)
[![codecov](https://codecov.io/gh/xgfe/ui-xg/branch/master/graph/badge.svg)](https://codecov.io/gh/xgfe/ui-xg)

## 依赖说明
本组件的开发主要依赖于以下几个库:

- Angular JS(v1.2.29): 组件库在1.2.29版本下进行测试,适用于1.2.x-1.3.20的AngularJS。
- Bootstrap(v3.3.6): 支持组件库样式设计。


## 安装
- 使用bower安装:

	```
	bower install ui-xg
	```

## 使用
- 文件引入
	- angular.min.js
	- bootstrap.css
	- ui.xg.min.css
	- ui.xg.min.js

	**angular和bootstrap文件的引入要在xg文件引入之前**
- 具体使用

```
/**
 * js文件
 */
angular.module('myApp',['ui.xg']);  // 组件依赖注入
// 以alert使用为例
angular.module('xgDemo').controller('alertDemoCtrl',['$scope', function ($scope) {
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
## 鸣谢
- Gulp：[https://github.com/gulpjs/gulp](https://github.com/gulpjs/gulp)
- Jasmine：[http://jasmine.github.io/](http://jasmine.github.io/)
- Karma：[https://github.com/karma-runner/karma](https://github.com/karma-runner/karma)
- ESLint：[http://eslint.org](http://eslint.org)
- UI Bootstrap：[https://angular-ui.github.io/bootstrap/](https://angular-ui.github.io/bootstrap/)
- ui-select：[https://github.com/angular-ui/ui-select](https://github.com/angular-ui/ui-select)
- angular-growl-2：[https://github.com/JanStevens/angular-growl-2](https://github.com/JanStevens/angular-growl-2)
- angular-drag-and-drop-lists：[https://github.com/marceljuenemann/angular-drag-and-drop-lists](https://github.com/marceljuenemann/angular-drag-and-drop-lists)


## LICENSE
ISC
