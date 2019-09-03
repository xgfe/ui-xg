import { baseColumns, baseData } from './data';
let cols = angular.copy(baseColumns).map((item, index) => {
    if (index === 0) {
        item.fixed = 'left';
        item.width = 200;
    } else if (index === baseColumns.length - 1) {
        item.fixed = 'right';
        item.width = 200;
    } else {
        item.minWidth = 150;
    }
    return item;
});
export default class {
    columns = cols;
    data = angular.copy(baseData);
}
