import { baseColumns, baseData } from './data';
let columns = angular.copy(baseColumns);
columns[1].sortable = true;
columns[3].sortable = true;
export default class {
    columns = columns;
    data = angular.copy(baseData);
    onSortChange(column, order, key) {
        if (order === 'normal') {
            this.data = angular.copy(baseData);
        } else {
            this.data = [].concat(angular.copy(baseData).sort((prev, next) => {
                return (prev[key] - next[key]) * (order === 'asc' ? 1 : -1);
            }));
        }
    }
}
