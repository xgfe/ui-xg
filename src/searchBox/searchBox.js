/**
 * searchBox
 * 搜索框
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-25
 */
angular.module('ui.fugu.searchBox',[])
.constant('fuguSearchBoxConfig', {
    btnText: '搜索', // 默认搜索按钮文本
    showBtn: true   // 默认显示按钮
})
.controller('fuguSearchBoxCtrl',['$scope','$attrs','fuguSearchBoxConfig', function ($scope,$attrs,fuguSearchBoxConfig) {
    var ngModelCtrl = { $setViewValue: angular.noop };
    $scope.searchBox = {};
    this.init = function (_ngModelCtrl) {
        if(_ngModelCtrl){
            ngModelCtrl = _ngModelCtrl;
        }
        ngModelCtrl.$render = this.render;
        $scope.showBtn = angular.isDefined($attrs.showBtn) ? $scope.$parent.$eval($attrs.showBtn) : fuguSearchBoxConfig.showBtn;
    };
    var btnText;
    $scope.getText = function () {
        if(btnText){
            return btnText;
        }
        btnText = angular.isDefined($attrs.btnText) ? $attrs.btnText : fuguSearchBoxConfig.btnText;
        return btnText;
    };
    $scope.$watch('searchBox.query', function (val) {
        ngModelCtrl.$setViewValue(val);
        ngModelCtrl.$render();
    });
    $scope.keyUpToSearch = function (evt) {
        if (evt && evt.keyCode === 13) {
            evt.preventDefault();
            evt.stopPropagation();
            $scope.doSearch();
        }
    };
    $scope.doSearch = function () {
        if(angular.isDefined($scope.search) && typeof $scope.search === 'function'){
            $scope.search();
        }
    };
    this.render = function() {
        if(ngModelCtrl.$viewValue){
            $scope.searchBox.query = ngModelCtrl.$viewValue;
        }
    };
}])
.directive('fuguSearchBox',function () {
    return {
        restrict: 'E',
        templateUrl:'templates/searchBox.html',
        replace:true,
        require:['fuguSearchBox', '?ngModel'],
        scope:{
            btnText:'@?',
            showBtn:'=?',
            placeholder:'@?',
            search:'&?'
        },
        controller:'fuguSearchBoxCtrl',
        link: function (scope,el,attrs,ctrls) {
            var searchBoxCtrl = ctrls[0], ngModelCtrl = ctrls[1];
            searchBoxCtrl.init(ngModelCtrl);
        }
    }
});