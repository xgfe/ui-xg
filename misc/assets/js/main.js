require.config({
    urlArgs: '2016011903',
    paths: {
        'jquery':'lib/jquery.min',
        'angular': 'lib/angular.min',
        'ui.router': 'lib/angular-ui-router.min',
        'ngAnimate': 'lib/angular-animate.min',
        'ui.fugu': 'lib/ui-fugu'
    },
    shim:{
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'ngAnimate': {
            'deps': ['angular']
        },
        'ui.router': {
            'deps': ['angular']
        },
        'ui.fugu':{
            'deps': ['angular']
        }
    }
});
require(['app','angular','routers'], function(app, angular) {
    angular.element(document).ready(function() {
        angular.bootstrap(document, [app.name, function() {
            angular.element(document).find('html').addClass('ng-app');
        }]);
    });
});