<% modules.forEach(function(module){%>
<li ui-sref-active="active" title="<%=module%>"><a ui-sref="app.api.<%=module%>"><%=module%></a></li>
<% }); %>