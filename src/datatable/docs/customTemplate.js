import { baseData } from './data';
export default class {
    columns = [
        { key: 'name', title: '姓名' },
        { key: 'age', title: '年龄' },
        { key: 'date', title: '日期', template: '<b>日期</b>' },
        {
            key: 'address', title: '地址',
            template(row, index) {
                return `${index}: ${row.province}-${row.city} ${row.address}`;
            }
        },
    ];
    columns2 = [
        { key: 'name', title: '姓名', width: 150, fixed: 'left' },
        { key: 'age', title: '年龄', width: 150 },
        { key: 'date', title: '日期', width: 200 },
        {
            key: 'address', title: '地址', width: 400,
            templateUrl: 'addressTpl'
        }, {
            title: '配置',
            width: 200,
            templateUrl($row) {
                if ($row.age > 24) {
                    return 'settingsTpl1';
                }
                return 'settingsTpl2';
            }
        }, {
            title: '操作',
            fixed: 'right',
            width: 120,
            templateUrl: 'actionsTpl'
        }
    ];
    data = angular.copy(baseData);
    handleView() {
        alert('触发事件');
    }
}
