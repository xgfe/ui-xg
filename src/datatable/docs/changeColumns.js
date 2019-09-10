import { baseColumns, baseData } from './data';
export default class {
    columns = [{
        type: 'index',
        width: 30
    }].concat(angular.copy(baseColumns));
    data = angular.copy(baseData);
    disableHover = false;
    showColumn = true;
    changeColumns() {
        this.columns = angular.copy(baseColumns).sort(() => Math.random() - 0.5);
    }
    toggleColumn() {
        this.columns[3].hidden = this.showColumn;
        this.showColumn = !this.showColumn;
        this.columns = this.columns.slice(0); // 必须修改引用对象
    }
}
