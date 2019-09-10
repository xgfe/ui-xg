import { baseColumns, baseData } from './data';
export default class {
    columns = angular.copy(baseColumns).map((item, index) => {
        item.width = 200;
        if (index === 0) {
            item.fixed = 'left';
        } else if (index === baseColumns.length - 1) {
            item.fixed = 'right';
        }
        return item;
    });
    data = angular.copy(baseData).concat(angular.copy(baseData));
}
