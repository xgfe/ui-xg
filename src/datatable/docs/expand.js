import { baseColumns, baseData } from './data';
let columns2 = angular.copy(baseColumns).map((column, index) => {
    // 设置冻结列
    if (index === 0) {
        column.fixed = 'left';
        column.width = 200;
    } else if (index === baseColumns.length - 1) {
        column.fixed = 'right';
        column.width = 200;
    } else {
        column.minWidth = 150;
    }
    return column;
});
columns2[0].templateUrl = 'nameTpl';
export default class {
    columns = [{
        type: 'expand',
        width: 60
    }].concat(angular.copy(baseColumns));
    columns2 = columns2;
    data = angular.copy(baseData);
}
