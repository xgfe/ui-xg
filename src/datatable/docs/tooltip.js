import { baseColumns, baseData } from './data';
let columns = angular.copy(baseColumns);
columns[1].format = (row) => row.age + '岁';
columns[1].ellipsis = true; // 因为设置了format，所以ellipsis不会生效
columns[2].ellipsis = true;
columns[5].ellipsis = true;
export default class {
    columns = columns;
    data = angular.copy(baseData);
    disableHover = false;
}
