import { baseData } from './data';
export default class {
    columns = [
        {
            title: '姓名',
            key: 'name',
            headerFormat(column) {
                return column.title.split('').join('-');
            }
        },
        { key: 'age', title: '年龄' },
        { key: 'date', title: '日期', headerTemplate: '<b>日期</b>' },
        {
            key: 'address', title: '地址',
            headerTemplate: '{{colIndex}}: {{column.key}} {{column.title}}'
        },
    ];
    columns2 = [
        {
            key: 'name', title: '姓名', width: 150,
            headerTemplateUrl: 'nameHeaderTpl'
        },
        {
            key: 'age', title: '年龄', width: 150,
            headerTemplate: `<div>近7/15/30日加权平均销量<span uix-popover="（近7日总销量÷7+近15日总销量÷15+近30日总销量÷30）÷3" popover-trigger="mouseenter" popover-placement="top" popover-append-to-body="true"><i class="glyphicon glyphicon-question-sign"></i></span></div>`,
            sortable: true
        },
        { key: 'date', title: '日期', width: 200 },
        {
            key: 'address', title: '地址', width: 400,
            templateUrl: 'addressTpl'
        }
    ];
    data = angular.copy(baseData);
    handleView() {
        alert('触发事件');
    }
}
