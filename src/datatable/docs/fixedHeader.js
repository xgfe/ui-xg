import { baseColumns, baseData } from './data';
export default class {
    columns = angular.copy(baseColumns);
    data = angular.copy(baseData).concat(angular.copy(baseData));
    data2 = angular.copy(baseData).slice(1, 5);
    appendData() {
        this.data2 = this.data2.concat({
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01',
            province: '北京市',
            city: '北京市',
            zip: '10010'
        });
    }
}
