<header class="navbar navbar-inverse navbar-fixed-top navbar-inner">
    <div class="container">
        <ul class="nav navbar-nav">
            <a ui-sref="app.index" class="navbar-brand">UI Fugu</a>
            <li ui-sref-active="active"><a href ui-sref="app.index"><span class="glyphicon glyphicon-home"></span> 首页</a></li>
            <li ui-sref-active="active"><a href ui-sref="app.start"><span class="glyphicon glyphicon-pushpin"></span> 开始使用</a></li>
            <li ng-class="{'active':$state.includes('app.api')}"><a href ui-sref="app.api<%if(module){%>.<%=module %><%}%>"><span class="glyphicon glyphicon-th-large"></span> 组件</a></li>
            <li ui-sref-active="active"><a href ui-sref="app.guide"><span class="glyphicon glyphicon-book"></span> 开发者文档</a></li>
        </ul>
    </div>
</header>
<div class="app-main fade-in-up table-display" ui-view></div>
<footer class="app-footer">
    <div class="footer-right">
        &copy;2016 xgfe.Licensed under ISC license.
    </div>
</footer>