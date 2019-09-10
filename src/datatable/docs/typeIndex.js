import { baseColumns, baseData } from './data';
export default class {
    columns = [{
        type: 'index',
        width: 30
    }].concat(angular.copy(baseColumns));
    columns2 = [{
        type: 'index',
        title: '序号',
        width: 80,
        indexMethod(row, rowIndex) {
            return `第${rowIndex + 1}行`;
        }
    }].concat(angular.copy(baseColumns));
    data = angular.copy(baseData);
    disableHover = false;
}
