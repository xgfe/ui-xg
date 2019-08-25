import { baseColumns, baseData } from './data';
export default class {
    columns = [{
        type: 'radio',
    }].concat(angular.copy(baseColumns));
    data = angular.copy(baseData);
}
