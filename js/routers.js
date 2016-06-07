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
            
                $stateProvider.state('app.api.timepanel',{url: "/timepanel",templateUrl: 'partials/api/timepanel.html'});
            
                $stateProvider.state('app.api.calendar',{url: "/calendar",templateUrl: 'partials/api/calendar.html'});
            
                $stateProvider.state('app.api.position',{url: "/position",templateUrl: 'partials/api/position.html'});
            
                $stateProvider.state('app.api.datepicker',{url: "/datepicker",templateUrl: 'partials/api/datepicker.html'});
            
                $stateProvider.state('app.api.dropdown',{url: "/dropdown",templateUrl: 'partials/api/dropdown.html'});
            
                $stateProvider.state('app.api.modal',{url: "/modal",templateUrl: 'partials/api/modal.html'});
            
                $stateProvider.state('app.api.notification',{url: "/notification",templateUrl: 'partials/api/notification.html'});
            
                $stateProvider.state('app.api.pager',{url: "/pager",templateUrl: 'partials/api/pager.html'});
            
                $stateProvider.state('app.api.tooltip',{url: "/tooltip",templateUrl: 'partials/api/tooltip.html'});
            
                $stateProvider.state('app.api.popover',{url: "/popover",templateUrl: 'partials/api/popover.html'});
            
                $stateProvider.state('app.api.searchBox',{url: "/searchBox",templateUrl: 'partials/api/searchBox.html'});
            
                $stateProvider.state('app.api.select',{url: "/select",templateUrl: 'partials/api/select.html'});
            
                $stateProvider.state('app.api.sortable',{url: "/sortable",templateUrl: 'partials/api/sortable.html'});
            
                $stateProvider.state('app.api.switch',{url: "/switch",templateUrl: 'partials/api/switch.html'});
            
                $stateProvider.state('app.api.timepicker',{url: "/timepicker",templateUrl: 'partials/api/timepicker.html'});
            
                $stateProvider.state('app.api.tree',{url: "/tree",templateUrl: 'partials/api/tree.html'});
            
        
    }
});