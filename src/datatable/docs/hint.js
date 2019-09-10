import { baseColumns, baseData } from './data';
let columns = angular.copy(baseColumns);
columns[2].hint = '我是一个提示文案';
export default class {
    columns = columns;
    data = angular.copy(baseData);
}
