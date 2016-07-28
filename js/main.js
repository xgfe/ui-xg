require.config({
    urlArgs: '2016011903',
    paths: {
        'jquery': '//cdn.bootcss.com/jquery/1.11.3/jquery.min',
        'angular': '//cdn.bootcss.com/angular.js/1.2.25/angular.min',
        'ngAnimate': '//cdn.bootcss.com/angular.js/1.2.25/angular-animate.min',
        'uiRouter': '//cdn.bootcss.com/angular-ui-router/0.2.15/angular-ui-router.min',
        'ngSanitize': '//cdn.bootcss.com/angular-sanitize/1.2.29/angular-sanitize.min',
        'uiXg': 'lib/ui-xg.min'
    },
    shim: {
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'ngAnimate': {
            'deps': ['angular']
        },
        'ngSanitize': {
            'deps': ['angular']
        },
        'uiRouter': {
            'deps': ['angular']
        },
        'uiXg': {
            'deps': ['angular']
        }
    }
});
require(['app', 'angular', 'routers'], function (app, angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, [app.name, function () {
            angular.element(document).find('html').addClass('ng-app');
        }]);
    });
});
