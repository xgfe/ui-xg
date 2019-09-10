import { baseColumns, baseData } from './data';
let data = angular.copy(baseData);
data[2].disabled = true;
data[2].checked = true;
data[3].checked = true;
export default class {
    columns = [{
        type: 'selection',
        width: 50
    }].concat(angular.copy(baseColumns));
    data = data;
    disabledRowClickSelect = false;
    onSelectionChange(newRows, oldRows) {
        console.log(newRows, oldRows);
    }
}
