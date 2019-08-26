import app from './app.js';
import appCtrl from './appCtrl';
import home from './pages/home';
import gettingStart from './pages/start';
import componentDoc from './pages/component-doc';
import guide from './pages/guide';
import { ROUTES } from './routes';

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('app', appCtrl)
        .state('app.docs', {
            url: '/docs',
            template: '<div ui-view></div>'
        })
        .state('app.components', {
            url: '/components',
            abstract: true,
            template: '<div class="components-router-view" ui-view></div>'
        })
        .state(home)
        .state(gettingStart)
        .state(guide)
        .state(componentDoc);

    $urlRouterProvider.otherwise(`/app${home.url}`);
    $locationProvider.html5Mode(true);
}]);

ROUTES.forEach(addRoutes);

function addRoutes({ name, template }) {
    app.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.components.' + name, {
                url: '/' + name,
                template
            });
    }]);
}

