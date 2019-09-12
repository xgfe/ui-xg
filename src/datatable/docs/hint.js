import { baseColumns, baseData } from './data';
let columns = angular.copy(baseColumns);
columns[2].hint = '我是一个提示文案';
columns[3].hint = '我是自定义的ICON';
columns[3].hintIcon = 'iconfont icon-question text-success';
export default class {
    columns = columns;
    data = angular.copy(baseData);
}
