/**
 * popover
 * 提示指令
 * Author:heqingyang@meituan.com
 * Date:2016-02-18
 */
angular.module('ui.fugu.popover',['ui.fugu.position'])

.controller('fuguPopoverCtrl',['$scope','$element','$compile', '$attrs', '$timeout','$interpolate','$fuguPosition',
        function ($scope,$element,$compile,$attrs,$timeout,$interpolate,$position) {

            //指令初始化
            function initConfig() {
                $scope.trigger = ($scope.trigger&&($scope.trigger==="hover"))?"hover":"click";
                $scope.content = $scope.content||"请设置提示文字";
                // 设置初始值
                $scope.isHover = false;
                $scope.popoverIsOpen = $scope.popoverIsOpen||false;
            }
            initConfig();

            //popover模板
            var elementTemplate =
                '<div class="fugu-popover popover"'+
                    'ng-class="{ in: popoverIsOpen||isHover }">'+
                    '<div class="popover-arrow"></div>'+

                    '<div class="popover-inner">'+
                        '<h3 class="popover-title" ng-bind="uibTitle" ng-if="uibTitle"></h3>'+
                        '<div class="popover-content" ng-bind="content"></div>'+
                    '</div>'+
                '</div>';
            var element = angular.element(elementTemplate);
            element = $compile(element)($scope);

            //判断触发方式
            if($scope.trigger==="hover") {
                $element.on('mouseenter',function(){
                    addDom();
                    element.css({display:'block'});
                    $scope.$digest();
                })
                $element.on('mouseleave',function(){
                    addDom();
                    element.css({display:'none'});
                    $scope.$digest();
                })
            }

            //计算位移并添加至DOM中
            function addDom() {

                //将计算的偏移量进行填充
                var elePosition = $position.positionElements($element,element,'bottom','false');
                $position.positionArrow(element, elePosition.placement);
                element.addClass("bottom");
                element.css({ top: elePosition.top + 'px', left:elePosition.left + 'px', visibility: 'visible'})
                $element.after(element);
                if(elePosition.left>element.width()){
                    element.css({ 'margin-left': '-'+element.width()/2+'px'});
                }
            }

            $scope.$watch('popoverIsOpen',function(){
                addDom();
                if($scope.popoverIsOpen){
                    element.css({display:'block'});
                }else{
                    element.css({display:'none'});
                }
            })
}])
.directive('fuguPopover',function () {
    return {
        restrict: 'AE',
        scope:{
            content:'=?',
            trigger:'@',
            popoverIsOpen:'=?'
        },
        controller:'fuguPopoverCtrl',
        controllerAs: 'popover'
    }
});