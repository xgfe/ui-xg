require.config({
    urlArgs: '2016011903',
    paths: {
        'jquery':'lib/jquery.min.js',
        'angular': 'lib/angular.min.js',
        'lib': 'lib/lib-comb'
    },
    shim:{
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'lib':{
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