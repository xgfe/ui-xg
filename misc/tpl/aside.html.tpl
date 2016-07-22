<% modules.forEach(function(module){%>
<li ui-sref-active="active" title="<%=module%>"><a ui-sref="app.<%=type%>.<%=module%>"><%=module%></a></li>
<% }); %>