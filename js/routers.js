/**
 * @file routers.js
 * @authors yangjiyuan (yjy972080142@gmail.com)
 * @description 组件路由定义
 */

define([
    'app'
], function (app) {
    app.config(configure);

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {
        
            
                $stateProvider.state('app.api.alert',{url: "/alert",templateUrl: 'partials/api/alert.html'});
            
                $stateProvider.state('app.api.button',{url: "/button",templateUrl: 'partials/api/button.html'});
            
                $stateProvider.state('app.api.buttonGroup',{url: "/buttonGroup",templateUrl: 'partials/api/buttonGroup.html'});
            
                $stateProvider.state('app.api.dropdown',{url: "/dropdown",templateUrl: 'partials/api/dropdown.html'});
            
                $stateProvider.state('app.api.pager',{url: "/pager",templateUrl: 'partials/api/pager.html'});
            
                $stateProvider.state('app.api.searchBox',{url: "/searchBox",templateUrl: 'partials/api/searchBox.html'});
            
                $stateProvider.state('app.api.tree',{url: "/tree",templateUrl: 'partials/api/tree.html'});
            
        
    }
});