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
        <% if (modules.length) { %>
            <% modules.forEach(function(module,index){%>
                $stateProvider.state('app.api.<%= module %>',{url: "/<%= module %>",templateUrl: 'partials/api/<%= module %>.html'});
            <%})%>
        <% }%>
    }
});