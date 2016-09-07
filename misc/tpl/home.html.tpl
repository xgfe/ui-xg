<div class="app-wrapper">
    <header class="app-home">
        <h1 class="text-gradient">UI XG</h1>
        <h2>基于<a href="http://getbootstrap.com/" class="a-link">Bootstrap</a>的<a href="https://angularjs.org/" class="a-link">Angular</a>组件库</h2>
        <p class="padder-t-s">
            <a target="_blank" href="http://github.com/xgfe/ui-xg" class="btn btn-outline-inverse btn-lg link-btn">Code on Github</a>
            <button type="button" class="btn btn-outline-inverse btn-lg link-btn">
                <i class="glyphicon glyphicon-download-alt"></i> Download
            </button>
            <!--<button type="button" class="btn btn-outline-inverse btn-lg">
                <i class="glyphicon glyphicon-wrench"></i>  Create a Build
            </button>-->
        </p>
    </header>
    <% if(modules && modules.length){ %>
    <div class="container">
        <% for(var i=0;i< rowNum;i++){ %>
            <div class="row">
                <% for(var j=i*4;j< (i+1)*4;j++){ %>
                <div class="col-md-3 component-image">
                    <a ui-sref="app.api.<%=modules[j]%>">
                        <img class="img-thumbnail" src="images/<%=modules[j]%>.<%=suffixObj[modules[j]]%>" alt="<%=modules[j]%>">
                    </a>
                    <div>
                        <a ui-sref="app.api.<%=modules[j]%>"><%=modules[j]%></a>
                    </div>
                </div>
                <% } %>
            </div>
        <% } %>
    </div>
    <% } %>
</div>
