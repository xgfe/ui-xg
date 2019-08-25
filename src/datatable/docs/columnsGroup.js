import { baseData } from './data';
export default class {
    columns = [
        {
            title: '基本信息',
            align: 'center',
            children: [{
                key: 'name',
                title: '姓名',
                align: 'center'
            }, {
                key: 'age',
                title: '年龄',
                align: 'center'
            }, {
                title: '时间信息',
                align: 'center',
                children: [
                    { key: 'date', title: '入职', align: 'center' },
                    { key: 'date', title: '离职', align: 'center' },
                ]
            }]
        },
        {
            title: '地址信息',
            align: 'center',
            children: [
                { key: 'province', title: '省份' },
                { key: 'city', title: '城市' },
                { key: 'address', title: '地址' },
                { key: 'zip', title: '邮编' }
            ]
        }
    ];
    data = angular.copy(baseData);
}
