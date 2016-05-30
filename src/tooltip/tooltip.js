/**
 * tooltip
 * 提示指令
 * Author:heqingyang@meituan.com
 * Date:2016-02-18
 */
angular.module('ui.fugu.tooltip',['ui.fugu.position'])

.controller('fuguTooltipCtrl',['$scope','$element','$compile', '$attrs', '$timeout','$interpolate','$fuguPosition',
        function ($scope,$element,$compile,$attrs,$timeout,$interpolate,$position) {

            //指令初始化
            function initConfig() {
                $scope.trigger = ($scope.trigger&&($scope.trigger==="hover"))?"hover":"click";
                $scope.content = $scope.content||"请设置提示文字";
                // 设置初始值
                $scope.isHover = false;
                $scope.tooltipIsOpen = $scope.tooltipIsOpen||false;
            }
            initConfig();

            //tooltip模板
            var elementTemplate =
                '<div class="tooltip fugu-tooltip"'+
                'ng-class="{in:tooltipIsOpen||isHover}">'+
                '<div class="tooltip-arrow"></div>'+
                '<div class="tooltip-inner" ng-bind="content"></div>'+
                '</div>';
            var element;
            element = angular.element(elementTemplate);
            element = $compile(element)($scope);
            element.addClass("bottom");
            $element.after(element);
            changeDom();

            //判断触发方式
            if($scope.trigger==="hover") {
                $element.on('mouseenter',function(){
                    changeDom();
                    $scope.isHover = true;
                    $scope.$digest();
                })
                $element.on('mouseleave',function(){
                    $scope.isHover = false;
                    $scope.$digest();
                })
            }

            //调整tooltip的位置
            function changeDom() {
                //将计算的偏移量进行填充
                var elePosition = $position.positionElements($element,element,'bottom','false');
                $position.positionArrow(element, elePosition.placement);
                var posParentElm = $position.offsetParent($element), oldParentElm;
                var offsetTop = elePosition.top,//垂直偏移：定位垂直偏移-定位父元素垂直偏移
                    offsetLeft = elePosition.left; //水平偏移：定位水平偏移-定位父元素水平偏移
                //重复递归定位父节点，减去父节点的offset距离
                while(posParentElm != oldParentElm) {
                    offsetTop = offsetTop - posParentElm.offsetTop;
                    offsetLeft = offsetLeft-posParentElm.offsetLeft;
                    oldParentElm = posParentElm;
                    posParentElm = $position.offsetParent(posParentElm);
                }
                element.css({ top: offsetTop, left: offsetLeft, visibility: 'visible' })
            }

            $scope.$watch('tooltipIsOpen',function(newValue){
                if(newValue){
                    changeDom();
                }
            })
}])
.directive('fuguTooltip',function () {
    return {
        restrict: 'AE',
        scope:{
            content:'=?',
            trigger:'@',
            tooltipIsOpen:'=?'
        },
        controller:'fuguTooltipCtrl',
        controllerAs: 'tooltip'
    }
});