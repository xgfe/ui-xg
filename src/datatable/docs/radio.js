import { baseColumns, baseData } from './data';
let data = angular.copy(baseData);
data[2].disabled = true;
data[3].checked = true;
export default class {
    columns = [{
        type: 'selection',
        singleSelect: true,
        width: 60
    }].concat(angular.copy(baseColumns));
    data = data;
    selectRow = null;
    rowClassName(row) {
        return row.disabled ? 'custom-disabled-checked' : '';
    }
    handleCurrentChange(newRow, oldRow, newIndex, oldIndex) {
        console.log(newRow, oldRow);
        console.log(newIndex, oldIndex);
        this.selectRow = newIndex + 1;
    }
}
