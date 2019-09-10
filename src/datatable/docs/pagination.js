import { baseColumns, baseData } from './data';
export default class {
    static $inject = ['$timeout'];
    columns = angular.copy(baseColumns);
    data = angular.copy(baseData).concat(baseData);
    status = '';
    pager = {
        totalCount: 0,
    };
    pager2 = {
        totalCount: 200,
        pageSize: 20,
        pageNo: 1
    }
    constructor($timeout) {
        this.$timeout = $timeout;
        this.handlePageChange(1, 20);
    }
    handlePageChange($pageNo, $pageSize) {
        this.status = 'loading';
        console.log('pageSize:%s，pageNo:%s', $pageSize, $pageNo);
        this.$timeout(() => {
            this.status = '';
            this.pager.totalCount = Math.random() > 0.5 ? 200 : 150;
        }, 2000);
    }
}
