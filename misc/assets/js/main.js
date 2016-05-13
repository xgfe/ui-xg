require.config({
    urlArgs: '2016011903',
    paths: {
        'jquery':'http://cdn.bootcss.com/jquery/1.11.3/jquery.min',
        'angular':'http://cdn.bootcss.com/angular.js/1.2.25/angular.min',
        'ngAnimate':'http://cdn.bootcss.com/angular.js/1.2.25/angular-animate.min',
        'uiRouter':'http://cdn.bootcss.com/angular-ui-router/0.2.15/angular-ui-router.min',
        'uiFugu': 'lib/ui-fugu.min'
    },
    shim:{
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'ngAnimate':{
            'deps': ['angular']
        },
        'uiRouter':{
            'deps': ['angular']
        },
        'uiFugu':{
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