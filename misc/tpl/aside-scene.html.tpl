<% modules.forEach(function(module){%>
<li ui-sref-active="active" title="<%=module%>"><a ui-sref="app.scene.<%=module%>"><%=module%></a></li>
<% }); %>