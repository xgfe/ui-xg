import { baseColumns, baseData } from './data';
let columns = angular.copy(baseColumns);
columns[1].sortable = true;
columns[3].sortable = true;
export default class {
    static $inject = ['$log'];
    constructor($log) {
        this.$log = $log;
    }
    columns = columns;
    data = angular.copy(baseData);
    onSortChange(column, order, key) {
        this.$log.log(column, order, key);
    }
}
