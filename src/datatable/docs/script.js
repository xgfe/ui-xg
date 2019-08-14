(function () {
    const app = angular.module('uixDemo');
    const baseColumns = [{
        key: 'name',
        title: '姓名'
    }, {
        key: 'age',
        title: '年龄'
    }, {
        key: 'date',
        title: '日期'
    }, {
        key: 'province',
        title: '省份'
    }, {
        key: 'city',
        title: '城市'
    }, {
        key: 'address',
        title: '地址'
    }, {
        key: 'zip',
        title: '邮编'
    }];
    const baseData = [{
        name: 'John Brown',
        age: 18,
        address: 'New York No. 1 Lake Park',
        province: '北京市',
        city: '北京市',
        date: '2016-10-03',
        zip: '10010'
    }, {
        name: 'Jim Green',
        age: 24,
        address: 'London No. 1 Lake Park',
        date: '2016-10-01',
        province: '北京市',
        city: '北京市',
        zip: '10010'
    }, {
        name: 'Joe Black',
        age: 30,
        address: 'Sydney No. 1 Lake Park',
        date: '2016-10-02',
        province: '北京市',
        city: '北京市',
        zip: '10010'
    }, {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park',
        date: '2016-10-04',
        province: '北京市',
        city: '北京市',
        zip: '10010'
    }, {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park',
        date: '2016-10-04',
        province: '北京市',
        city: '北京市',
        zip: '10010'
    }, {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park',
        date: '2016-10-04',
        province: '北京市',
        city: '北京市',
        zip: '10010'
    }, {
        name: 'Jon Snow',
        age: 26,
        address: 'Ottawa No. 2 Lake Park',
        date: '2016-10-04',
        province: '北京市',
        city: '北京市',
        zip: '10010'
    }];
    // 基础样式
    app.controller('datatableDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 斑马纹
    app.controller('datatableStripeDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 带边框
    app.controller('datatableBorderDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 自定义样式
    app.controller('datatableCustomStylesDemoCtrl', ['$scope', function ($scope) {
        $scope.columns1 = angular.copy(baseColumns);
        let columns2 = angular.copy(baseColumns);
        columns2[1].className = 'demo-table-info-column';
        $scope.columns2 = columns2;
        $scope.data1 = angular.copy(baseData);
        let data2 = angular.copy(baseData);
        data2[0].cellClassName = {
            age: 'demo-table-info-cell-age',
            address: 'demo-table-info-cell-address'
        };
        data2[2].cellClassName = {
            name: 'demo-table-info-cell-name'
        };
        $scope.data2 = data2;
        $scope.rowClassName = function (row, index) {
            if (index === 1) {
                return 'demo-table-info-row';
            } else if (index === 3) {
                return 'demo-table-error-row';
            }
            return '';
        };
    }]);
    // 固定表头
    app.controller('datatableFixedHeaderDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData).concat(angular.copy(baseData));
        $scope.data2 = angular.copy(baseData);
        $scope.appendData = function () {
            $scope.data2 = $scope.data2.concat({
                name: 'Jim Green',
                age: 24,
                address: 'London No. 1 Lake Park',
                date: '2016-10-01',
                province: '北京市',
                city: '北京市',
                zip: '10010'
            });
        };
    }]);
    // 固定列
    app.controller('datatableFixedColumnDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns).map((item, index) => {
            item.width = 200;
            if (index === 0) {
                item.fixed = 'left';
            } else if (index === baseColumns.length - 1) {
                item.fixed = 'right';
            }
            return item;
        });
        $scope.data = angular.copy(baseData);
    }]);
    // 固定列和表头
    app.controller('datatableFixedDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns).map((item, index) => {
            item.width = 200;
            if (index === 0) {
                item.fixed = 'left';
            } else if (index === baseColumns.length - 1) {
                item.fixed = 'right';
            }
            return item;
        });
        $scope.data = angular.copy(baseData);
    }]);
    // 单选
    app.controller('datatableRadioDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 多选
    app.controller('datatableSelectionDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 排序
    app.controller('datatableSortableDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 过滤
    app.controller('datatableFilterDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 自定义模板
    app.controller('datatableCustomTemplateDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 可展开
    app.controller('datatableCollapseDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 表头分组
    app.controller('datatableHeaderGroupDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 加载中
    app.controller('datatableLoadingDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 带分页
    app.controller('datatablePageDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
    // 可拖拽
    app.controller('datatableDraggableDemoCtrl', ['$scope', function ($scope) {
        $scope.columns = angular.copy(baseColumns);
        $scope.data = angular.copy(baseData);
    }]);
})();
