<ul class="nav nav-tabs" id="codeTabs">
    <%if(html){%>
    <li class="active" data-tab="index_html"><a href="javascript:;">index.html</a></li>
    <%}%>
    <%if(js){%>
    <li class="<%if(!html){%>active<%}%>" data-tab="script_js"><a href="javascript:;">script.js</a></li>
    <%}%>
    <%if(css){%>
    <li class="<%if(!html&&!script){%>active<%}%>" data-tab="style_css"><a href="javascript:;">style.css</a></li>
    <%}%>
</ul>
<div class="tab-content" id="codeTabPabels">
    <%if(html){%>
    <div class="tab-pane active" id="index_html">
<pre><code><%-html%></code></pre>
    </div>
    <%}%>
    <%if(js){%>
    <div class="tab-pane <%if(!html){%>active<%}%>" id="script_js">
<pre><code><%-js%></code></pre>
    </div>
    <%}%>
    <%if(css){%>
    <div class="tab-pane <%if(!html&&!script){%>active<%}%>" id="style_css">
<pre><code><%-css%></code></pre>
    </div>
    <%}%>
</div>
<script>
    $(function () {
        var tabs = $('#codeTabs > li'),
            tabPanels = $('.tab-pane');
        tabs.on('click',function (e) {
            e.preventDefault();
            tabs.removeClass('active');
            $(this).addClass('active');
            var id = $(this).data('tab');
            tabPanels.removeClass('active');
            $('#'+id).addClass('active');
        });
    });
</script>