import { baseColumns, baseData } from './data';
export default class {
    static $inject = ['$timeout'];
    constructor($timeout) {
        this.$timeout = $timeout;
    }
    columns = angular.copy(baseColumns);
    data = angular.copy(baseData);
    page = {
        totalItems: 150,
        pageSize: 20,
        pageNo: 1
    };
    status = '';
    pageChanged() {
        this.status = 'loading';
        console.log('pageSize:%s，pageNo:%s', this.page.pageSize, this.page.pageNo);
        this.$timeout(() => {
            this.status = '';
        }, 2000);
    }
}
