import { baseColumns, baseData } from './data';
export default class {
    columns = [{
        templateUrl: 'radioTpl'
    }].concat(angular.copy(baseColumns));
    data = angular.copy(baseData);
    checked = -1;
    handleRowClick(row, index) {
        this.checked = index;
    }
}
