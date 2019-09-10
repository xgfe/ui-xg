import { baseData } from './data';
export default class {
    columns = [{
        title: '一级表头',
        fixed: 'left',
        children: [{
            title: '二级表头-1',
            fixed: 'left',
            children: [{
                title: '三级表头-1',
                fixed: 'left',
                key: 'name',
                width: 100
            }, {
                title: '三级表头-2',
                fixed: 'left',
                key: 'name',
                width: 100
            }]
        }, {
            title: '二级表头-2',
            fixed: 'left',
            children: [{
                title: '三级表头-3',
                fixed: 'left',
                key: 'name',
                width: 100
            }, {
                title: '三级表头-4',
                fixed: 'left',
                key: 'name',
                width: 100
            }]
        }]
    }, {
        title: '基本信息',
        align: 'center',
        children: [{
            key: 'name',
            title: '姓名',
            align: 'center',
            width: 200
        }, {
            key: 'age',
            title: '年龄',
            width: 200,
            align: 'center'
        }]
    }, {
        title: '地址信息',
        align: 'center',
        children: [
            { key: 'province', title: '省份', width: 200 },
            { key: 'city', title: '城市', width: 200 },
            { key: 'address', title: '地址', width: 200 },
            { key: 'zip', title: '邮编', width: 200 }
        ]
    }, {
        title: '时间信息',
        align: 'center',
        fixed: 'right',
        children: [
            { key: 'date', title: '入职', width: 150, fixed: 'right' },
            { key: 'date', title: '离职', width: 150, fixed: 'right' },
        ]
    }];
    data = angular.copy(baseData);
}
