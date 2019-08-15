import angular from 'angular';
import uiXg from '../../src/ui-xg';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import uiRouter from 'angular-ui-router';

//定义angular模块
const app = angular.module('uixDemo', [
    uiRouter,
    uiXg,
    ngAnimate,
    ngSanitize
]);

app.config(['$controllerProvider', function ($controllerProvider) {
    app.controller = function () {
        $controllerProvider.register.apply(null, arguments);
    };
}]);

app.run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.$state = $state;
}]);

export default app;
