/**
 * cascaderSelect
 * cascaderSelect directive
 * Author: wpyqmqq@126.com
 * Date:2018-10-09
 */
angular.module('ui.xg.cascaderSelect', ['ui.xg.select'])
    .controller('uixCascaderSelectCtrl', ['$scope', function ($scope) {
        // 对外部传入的配置进行遍历，初始化，加入监控，并对首级下拉数据进行处理
        angular.forEach($scope.confs, (conf, index) => {
            // 加监控
            const watchName = `confs[${index}].value`;
            $scope.$watch(watchName, (newValue) => {
                $scope.changeHandler(conf, newValue);
            });
            // 初始化
            conf.value = conf.defaultValue || conf.emptyValue;
            // 获取首级下拉数据
            if (!conf.parentCode) {
                (conf.getData()).then((data) => {
                    conf.list = data;
                });
            }
        });

        // 当前节点的值发生变化时清空所有后代节点的值，重新获取直接子节点的值，并清空其他后代节点的下拉数据
        $scope.changeHandler = function (conf, value) {
            $scope.confs.reduce((code, item) => {
                if (item.parentCode === code) {
                    // 修改所有后代节点的值，若父节点的当前值与默认值相同，且子节点存在默认值时，子节点的值置为默认值；其他情况，子节点的值置为空值
                    if (angular.equals(conf.defaultValue, value)) {
                        item.value = item.defaultValue || item.emptyValue;
                    } else {
                        item.value = item.emptyValue;
                    }
                    // 重新获取直接子节点的下拉数据，并清空其他后代节点的下拉数据
                    if (value && value[item.itemValue] && item.parentCode === conf.code) {
                        (item.getData(value)).then((data) => {
                            item.list = data;
                            return item.code;
                        }, () => {
                            return item.code;
                        });
                    } else {
                        item.list = [];
                        item.list.unshift(item.emptyValue);
                        return item.code;
                    }
                } else {
                    return code;
                }
            }, conf.code);
        };
    }])
    .directive('uixCascaderSelect', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/cascaderSelect.html',
            replace: true,
            require: ['uixCascaderSelect'],
            scope: {
                confs: '='
            },
            controller: 'uixCascaderSelectCtrl'
        };
    });
