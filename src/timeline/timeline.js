/**
 * timeline
 * timeline directive
 * Author: zhangjihu@meituan.com
 * Date:2018-09-03
 */
angular.module('ui.xg.timeline', [])
    .controller('UixTimelineController', ['$scope', '$attrs', function ($scope, $attrs) {
        $scope.mode = $attrs.mode || 'left';
        $scope.nodeData = $scope.nodeData || [];
        if ($scope.pending) {
            const lastDot = $scope.nodeData.pop();
            $scope.nodeData.push({
                title: lastDot.title || 'Recording...',
                color: lastDot.color || 'blue',
                icon: lastDot.icon || 'glyphicon glyphicon-refresh'
            });
        }

        if ($scope.reverse) {
            $scope.nodeData = $scope.nodeData.slice().reverse();
        }
    }])
    .directive('uixTimeline', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/timeline.html',
            replace: true,
            scope: {
                nodeData: '=',
                mode: '=?',     // 通过设置 mode 可以改变时间轴和内容的相对位置 left | alternate | right
                reverse: '=?',  // 用于控制节点排序，为 false 时按正序排列，为 true 时按倒序排列
                pending: '=?'   // 当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点，当 pending 为真值时展示幽灵节点
            },
            controller: 'UixTimelineController'
        };
    })
    .directive('uixTimelineItem', ['$sce', function ($sce) {
        return {
            restrict: 'E',
            templateUrl: 'templates/timelineItem.html',
            replace: true,
            scope: {
                dot: '=',
                mode: '=',
                showTail: '=',
                pending: '=?',
                reverse: '=?',
                first: '=?',
                last: '=?'
            },
            link: function ($scope) {
                $scope.$sce = $sce;
            }
        };
    }]);
