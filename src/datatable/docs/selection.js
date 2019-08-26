import { baseColumns, baseData } from './data';
export default class {
    columns = [{
        headerTemplateUrl: 'selectAllTpl',
        templateUrl: 'selectTpl',
    }].concat(angular.copy(baseColumns));
    data = angular.copy(baseData);
    selectAll = false;
    selectMap = {};

    constructor() {
        this.selectMap = this.data.reduce((prev, item) => {
            prev[item.id] = false;
            return prev;
        }, {});
    }

    handleSelectAll() {
        angular.forEach(this.selectMap, (value, id) => {
            this.selectMap[id] = this.selectAll;
        });
    }

    getSelectedItems() {
        let result = [];
        angular.forEach(this.selectMap, (value, id) => {
            if (value) {
                result.push(id);
            }
        });
        return result;
    }

    handleSelect() {
        this.selectAll = this.getSelectedItems().length >= this.data.length;
    }
}
