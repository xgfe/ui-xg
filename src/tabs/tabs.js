angular.module('ui.xg.tabs', [])
    .controller('tabsController', ['$scope', function ($scope) {
        var ctrl = this;
        var oldIndex;
        ctrl.subTabNum = 1;   //tabs子tab的个数
        ctrl.tabs = [];
        ctrl.onChange = null;
        ctrl.active = $scope.active;
        ctrl.select = function (index) {
            var prevIndex = ctrl.findTabIndex(oldIndex);
            var prevSelected = ctrl.tabs[prevIndex];
            if (prevSelected) {  // 取消之前选中
                prevSelected.active = false;  // scope域上的active属性
            }
            var oldVal = oldIndex;
            var newVal = oldIndex;
            var selected = ctrl.tabs[index];   // 当前选中tab(scope)
            if (selected) {
                selected.active = true;   // 选中
                ctrl.active = selected.index;  // 设置当前选择index
                oldIndex = selected.index;
                newVal = selected.index;
                if ($scope.active !== selected.index) {
                    $scope.active = selected.index;
                    if (angular.isDefined($scope.onChange && oldVal)) {
                        $scope.onChange({
                            $oldVal: oldVal,
                            $newVal: newVal
                        });
                    }
                }
            }
        };

        ctrl.addTab = function (tab) {
            ctrl.subTabNum++;
            // tab加入
            ctrl.tabs.push(tab);  // 插入整个scope域
            // 设置新增标签为激活标签或者新增标签为第一个,默认选中第一个
            if (tab.index === ctrl.active || angular.isUndefined(ctrl.active) && ctrl.tabs.length === 1) {
                var newActiveIndex = ctrl.findTabIndex(tab.index);
                ctrl.select(newActiveIndex);
            }
        };

//
//         ctrl.removeTab = function (tab) {
//             var index = ctrl.findTabIndex(tab);
//             // TODO 如果删除的是当前激活状态的tab
// //                if(ctrl.tabs[index].index === ctrl.active){
// //                    var newActiveTabIndex = index === ctrl.tas
// //                }
//             ctrl.tabs.splice(index, 1); //删除tab
//         };


        ctrl.findTabIndex = function (index) {
            for (var i = 0; i < ctrl.tabs.length; i++) {
                if (ctrl.tabs[i].index === index) {
                    return i;
                }
            }
        };

        $scope.$watch('active', function (val) {
            if (val && val !== oldIndex) {  // 重新选择
                var newActiveIndex = ctrl.findTabIndex(val);
                if (angular.isUndefined(newActiveIndex)) {
                    newActiveIndex = 0;  // 如果设置的值找不到,则默认选中第一个
                }
                ctrl.select(newActiveIndex); // tab切换
            }
        });
    }])
    .directive('uixTabPanel', ['$interpolate', function () {
        return {
            restrict: 'E',
            require: '^uixTabs',
            scope: {},
            link: function (scope, element, attrs) {
                var tabScope = scope.$parent.$eval(attrs.tab);
                element.append(tabScope.tab);
            }
        };
    }])
    .directive('uixTab', ['$sce', function ($sce) {
        return {
            restrict: 'E',
            scope: {},
            require: '^uixTabs',
            templateUrl: 'templates/tab.html',
            replace: true,
            transclude: true,
            link: function (scope, element, attrs, tabsCtrl, transclude) {
                scope.heading = $sce.trustAsHtml(getRealAttr(scope.$parent.$parent.$parent, attrs.heading, 'Tab'));  // 获取元素标题
                scope.index = getRealAttr(scope.$parent.$parent.$parent, attrs.index, tabsCtrl.subTabNum);  // 获取元素index
                scope.disabled = getRealAttr(scope.$parent.$parent.$parent, attrs.disabled, false);

                transclude(scope.$parent.$parent.$parent, function (clone) {
                    angular.forEach(clone, function (ele) {
                        if (angular.isDefined(ele.outerHTML)) {
                            scope.tab = ele;
                            tabsCtrl.addTab(scope);
                        }
                    });
                });

                scope.changeTab = function () {
                    if (scope.disabled) {
                        return;
                    }
                    tabsCtrl.select(tabsCtrl.findTabIndex(scope.index));
                };

            }
        };
    }])
    .directive('uixTabs', function () {
        return {
            restrict: 'E',
            scope: {
                active: '=?',
                onChange: '&?'
            },
            templateUrl: 'templates/tabs.html',
            transclude: true,
            replace: true,
            controller: 'tabsController',
            controllerAs: 'tabsCtrl',
            link: function (scope, element, attrs, tabCtrl) {
                tabCtrl.index = scope.active;
                if (angular.isDefined(attrs.type)) {
                    scope.type = getRealAttr(scope.$parent, attrs.type);
                } else {
                    scope.type = 'tabs'; //默认类型
                }

//                    if(angular.isDefined(attrs.tabPosition)){
//                        scope.tabPosition = getRealAttr(scope.$parent, attrs.tabPosition);
//                    } else {
//                        scope.tabPosition = 'top'; //默认位置
//                    }

                /**
                 * 在父作用scope解析属性值
                 * @param {object} scope 变量所在scope域
                 * @param {string} val 从标签上获取的属性值
                 * @returns {*}
                 */
                function getRealAttr(scope, val) {
                    return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
                }
            }
        };
    });

/**
 * 在父作用scope解析属性值
 * @param {object} scope 变量所在scope域
 * @param {string} val 从标签上获取的属性值
 * @param {string} defaultVal 属性默认值
 * @returns {*}
 */
function getRealAttr(scope, val, defaultVal) {
    if (angular.isDefined(val)) {
        return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
    } else {
        return defaultVal;
    }
}

