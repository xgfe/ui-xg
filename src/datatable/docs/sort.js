import { baseColumns, baseData } from './data';
let columns = angular.copy(baseColumns);
columns[1].sortable = true;
columns[3].sortable = true;
export default class {
    static $inject = ['$scope'];
    columns = columns;
    columns2 = angular.copy(columns);
    data = angular.copy(baseData);
    data2 = angular.copy(baseData);
    constructor($scope) {
        this.$scope = $scope;
    }
    onSortChange(column, order, key) {
        if (order === 'normal') {
            this.data = angular.copy(baseData);
        } else {
            this.data = [].concat(angular.copy(baseData).sort((prev, next) => {
                return (prev[key] - next[key]) * (order === 'asc' ? 1 : -1);
            }));
        }
    }
    onColumnsSort(sorts) {
        console.log(sorts);
    }
    clearSort() {
        this.$scope.$broadcast('uix-datatable-clear-sort', 'multi-sort');
    }
}
