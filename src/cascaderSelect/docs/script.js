angular.module('uixDemo').controller('cascaderSelectDemoCtrl', ['$scope', '$q', function ($scope, $q) {
    $scope.category1 = [
        {
            code: 'catId1',
            label: '一级分类',
            emptyValue: {
                id: '',
                name: '全部'
            },
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId2',
            label: '二级分类',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId1',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId3',
            label: '三级分类',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId2',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId4',
            label: '四级分类',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId3',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        }
    ];
    $scope.category2 = [
        {
            code: 'catId1',
            label: '分类',
            emptyValue: {
                id: '',
                name: '全部'
            },
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId2',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId1',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId3',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId2',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId4',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId3',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        }
    ];
    $scope.category3 = [
        {
            code: 'catId1',
            label: '分类',
            defaultValue: {
                id: '1',
                name: '火锅'
            },
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId2',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId1',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId3',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId2',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId4',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId3',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        }
    ];
    $scope.category4 = [
        {
            code: 'catId1',
            label: '分类',
            defaultValue: {
                id: '1',
                name: '火锅'
            },
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId2',
            label: '',
            defaultValue: {
                id: '1-child1',
                name: '火锅-child1'
            },
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId1',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId3',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId2',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId4',
            label: '',
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId3',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        }
    ];
    $scope.category5 = [
        {
            code: 'catId1',
            label: '分类',
            defaultValue: {
                id: '1',
                name: '火锅'
            },
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId2',
            label: '',
            defaultValue: {
                id: '1-child1',
                name: '火锅-child1'
            },
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId1',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId3',
            label: '',
            defaultValue: {
                id: '1-child1-child1',
                name: '火锅-child1-child1'
            },
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId2',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId4',
            label: '',
            defaultValue: {
                id: '1-child1-child1-child1',
                name: '火锅-child1-child1-child1'
            },
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId3',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-3',
            getData: getCategoryData.bind($scope)
        }
    ];
    $scope.category6 = [
        {
            code: 'catId1',
            label: '分类',
            defaultValue: {
                id: '1',
                name: '火锅'
            },
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-6',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId2',
            label: '',
            defaultValue: {
                id: '1-child1',
                name: '火锅-child1'
            },
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId1',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-6',
            getData: getCategoryData.bind($scope)
        }
    ];
    $scope.category7 = [
        {
            code: 'catId1',
            label: '分类',
            defaultValue: {
                id: '1',
                name: '火锅'
            },
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-4',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId2',
            label: '',
            defaultValue: {
                id: '1-child1',
                name: '火锅-child1'
            },
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId1',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-4',
            getData: getCategoryData.bind($scope)
        },
        {
            code: 'catId3',
            label: '',
            defaultValue: {
                id: '1-child1-child1',
                name: '火锅-child1-child1'
            },
            emptyValue: {
                id: '',
                name: '全部'
            },
            parentCode: 'catId2',
            itemLabel: 'name',
            itemValue: 'id',
            className: 'form-group col-md-4',
            getData: getCategoryData.bind($scope)
        }
    ];
    function getCategoryData(item) {
        let data;
        const arr = [
            {
                id: '1',
                name: '火锅'
            },
            {
                id: '2',
                name: '果蔬、薯类制品'
            },
            {
                id: '3',
                name: '肉制品'
            },
            {
                id: '4',
                name: '米面粮油'
            },
            {
                id: '5',
                name: '焙烤食品'
            }
        ];
        if(!item) {
            data = arr;
        } else {
            data = Array.from(arr).map(function (value, key) {
                return {
                    id: item.id + '-child' + (key + 1),
                    name: item.name + '-child' + (key + 1)
                };
            });
        }
        data.unshift({
            id: '',
            name: '全部'
        });
        let defer = $q.defer();
        defer.resolve(data);
        return defer.promise;
    }
}]);
