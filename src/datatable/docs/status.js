import { baseColumns, baseData } from './data';
import app from 'app';
app.config(['uixDatatableProvider', function (uixDatatableProvider) {
    uixDatatableProvider.setStatusText({
        loading: '加载中。。。（全局配置）',
        error: '加载错误。。。（全局配置）'
    });
}]);
export default class {
    static $inject = ['$timeout'];
    constructor($timeout) {
        this.$timeout = $timeout;
    }
    status = '';
    status2 = '';
    columns = angular.copy(baseColumns);
    data = [];
    handleLoading() {
        this.status2 = 'loading';
        this.$timeout(() => {
            let random = Math.random();
            if (random < 0.33) { // 加载成功
                this.status2 = '';
                this.data = angular.copy(baseData);
            } else if (random < 0.66) { // 数据为空
                this.status2 = 'empty';
            } else {  // 加载失败
                this.status2 = 'error';
            }
        }, 2000);
    }
}
