import { baseColumns, baseData } from './data';
export default class {
    columns = [{
        type: 'index',
        width: 30
    }].concat(angular.copy(baseColumns));
    data = angular.copy(baseData);
    disableHover = false;
}
