define([
    'jquery',
    'angular',
    'ui.router',
    'ngAnimate',
    'ui.fugu'
], function($,angular) {

    //定义angular模块
    var app = angular.module('fuguDemo', [
        'ui.router',
        'ui.fugu',
        'ngAnimate'
    ]);
    app.config(['$stateProvider','$urlRouterProvider', function ($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/app',
                templateUrl: 'partials/app.html'
            })
            .state('app.index', {
                url: "/index",
                templateUrl: 'partials/home.html'
            })
            .state('app.start',{
                url: "/start",
                templateUrl: 'partials/start.html'
            })
            .state('app.guide',{
                url: "/guide",
                templateUrl: 'partials/guide.html'
            })
            .state('app.api',{
                url: "/api",
                templateUrl: 'partials/api.html'
            });

        $urlRouterProvider.otherwise("/app/index");
    }]);

    app.config([ '$controllerProvider',  function( $controllerProvider) {
        app.controller = function() {
            $controllerProvider.register.apply(null, arguments);
        };
    }]);

    app.run(['$rootScope','$state', function ($rootScope,$state) {
        $rootScope.$state = $state;
    }]);


    return app;
});