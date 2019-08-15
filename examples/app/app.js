import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import uiRouter from 'angular-ui-router';
import '../../dist/js/ui-xg';

//定义angular模块
const app = angular.module('uixDemo', [
    uiRouter,
    ngAnimate,
    ngSanitize,
    'ui.xg'
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
