/**
 * searchBox
 * 搜索框
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-25
 */
angular.module('ui.xg.searchBox', [])
    .constant('uixSearchBoxConfig', {
        btnText: '搜索', // 默认搜索按钮文本
        showBtn: true   // 默认显示按钮
    })
    .controller('uixSearchBoxCtrl', ['$scope', '$attrs', 'uixSearchBoxConfig', function ($scope, $attrs, uixSearchBoxConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        $scope.searchBox = {};
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            $scope.showBtn = angular.isDefined($attrs.showBtn) ? $scope.$parent.$eval($attrs.showBtn) : uixSearchBoxConfig.showBtn;
        };
        var btnText;
        $scope.getText = function () {
            if (btnText) {
                return btnText;
            }
            btnText = angular.isDefined($attrs.btnText) ? $attrs.btnText : uixSearchBoxConfig.btnText;
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
            if (angular.isDefined($scope.search) && angular.isFunction($scope.search)) {
                $scope.search();
            }
        };
        this.render = function () {
            $scope.searchBox.query = ngModelCtrl.$modelValue;
        };
    }])
    .directive('uixSearchBox', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/searchBox.html',
            replace: true,
            require: ['uixSearchBox', '?ngModel'],
            scope: {
                btnText: '@?',
                showBtn: '=?',
                placeholder: '@?',
                search: '&?'
            },
            controller: 'uixSearchBoxCtrl',
            link: function (scope, el, attrs, ctrls) {
                var searchBoxCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                searchBoxCtrl.init(ngModelCtrl);
            }
        };
    });
