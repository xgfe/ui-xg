import { baseColumns, baseData } from './data';

let columns2 = angular.copy(baseColumns);
columns2[1].className = 'demo-table-info-column';
let data2 = angular.copy(baseData);
data2[0].cellClassName = {
    age: 'demo-table-info-cell-age',
    address: 'demo-table-info-cell-address'
};
data2[2].cellClassName = {
    name: 'demo-table-info-cell-name'
};
export default class {
    columns1 = angular.copy(baseColumns);
    columns2 = columns2;
    data1 = angular.copy(baseData);

    data2 = data2;
    rowClassName(row, index) {
        if (index === 1) {
            return 'demo-table-info-row';
        } else if (index === 3) {
            return 'demo-table-error-row';
        }
        return '';
    }
}
