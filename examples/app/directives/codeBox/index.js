import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';

import app from 'app';
import template from './template.html';
import './style.scss';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('html', xml);

function highlightCode(code, type) {
    let value = hljs.highlightAuto(code).value;
    if (value[0] !== '\n') {
        value = '\n' + value;
    }
    if (value[value.length - 1] !== '\n') {
        value += '\n';
    }
    if (type === 'html') {
        return value.replace(/{{(.+?)}}/g, function (match, $1) {
            return '<span>&#123;&#123;</span>' + $1 + '&#125;&#125;';
        });
    }
    return value;
}

app.directive('codeBox', [function () {
    return {
        restrict: 'E',
        template,
        replace: true,
        scope: {
            template: '@',
            script: '@'
        },
        link($scope) {
            $scope.showCode = false;
            let script = decodeURIComponent($scope.script);
            let template = decodeURIComponent($scope.template);
            $scope.content = [
                `&lt;template&gt;${highlightCode(template, 'html')}&lt;/template&gt;\n`,
                `&lt;script&gt;${highlightCode(script)}&lt;/script&gt;\n`,
            ].join('');
            $scope.toggleShow = function () {
                $scope.showCode = !$scope.showCode;
            }
        }
    };
}]);
