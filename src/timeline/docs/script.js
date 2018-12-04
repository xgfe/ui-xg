angular.module('uixDemo').controller('timelineDemoCtrl', ['$scope', function ($scope) {
    // your js code here
    $scope.node0Data = [
        {
            'title': '标题一'
        }, {
            'title': '标题二'
        }, {
            'title': '标题三'
        }];
    $scope.nodeData = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'icon': 'glyphicon glyphicon-user',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'icon': 'glyphicon glyphicon-ok',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'icon': 'glyphicon glyphicon-cog',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'icon': 'glyphicon glyphicon-repeat',
            'color': 'green'
        }];
    $scope.node1Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'icon': 'glyphicon glyphicon-user',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'icon': 'glyphicon glyphicon-ok',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'icon': 'glyphicon glyphicon-cog',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'icon': 'glyphicon glyphicon-repeat',
            'color': 'green'
        }];
    $scope.node2Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'icon': 'glyphicon glyphicon-user',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'icon': 'glyphicon glyphicon-ok',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'icon': 'glyphicon glyphicon-cog',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'icon': 'glyphicon glyphicon-repeat',
            'color': 'green'
        }];
    $scope.node3Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'icon': 'glyphicon glyphicon-user',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'icon': 'glyphicon glyphicon-ok',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'icon': 'glyphicon glyphicon-cog',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'icon': 'glyphicon glyphicon-repeat',
            'color': 'green'
        }];
    $scope.node4Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'color': 'green'
        }];
    $scope.node5Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'color': 'green'
        }];
    $scope.node6Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'color': 'green'
        }];
    $scope.node7Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Recording...',
            'icon': 'glyphicon glyphicon-dashboard'
        }];
    $scope.node8Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'loading...',
            'color': 'blue'
        }];
    $scope.node9Data = [
        {
            'title': '标题一',
            'desc': '我是描述一',
            'other': '2018-09-06 12:39:39',
            'color': 'blue'
        }, {
            'title': '标题二',
            'desc': '我是描述二',
            'other': '2018-09-06 13:00:00',
            'color': 'red'
        }, {
            'title': '标题三',
            'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
            'other': '2018-09-06 14:39:00',
            'color': 'green'
        }, {
            'title': 'Network problems being ',
            'other': '2015-09-01 14:39:00',
            'color': 'blue'
        }, {
            'title': 'Create a services site ',
            'desc': 'Solve initial network problems',
            'other': '2018-11-06 14:39:00',
            'color': 'green'
        }, {
            'title': '进行中...',
            'color': 'blue',
            'icon': 'glyphicon glyphicon-refresh'
        }];
}]);
