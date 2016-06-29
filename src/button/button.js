/**
 * button
 * 按钮指令
 * Author:penglu02@meituan.com
 * Date:2016-01-12
 */
angular.module('ui.xg.button', [])
    .directive('uixButton', [function(){
        return {
            restrict: 'AE',
            scope:{
                disabled: '=?',   // 对于不是必须传递需要使用?
                loading: '=?',
                onClick : '&?click'
            },
            replace:false,
            templateUrl: 'templates/button.html',
            controller: 'buttonController',
            link: function(scope, element, attrs){
               element = angular.element(element.children()[0]);
               var btnClass = getAttrValue(attrs.btnclass, 'default'), // 样式:primary|info等,默认default
                    size  = getAttrValue(attrs.size, 'default'), // 大小:x-small,small等,默认为default
                    block = getAttrValue(attrs.block, false), //是否按100%的width填充父标签,默认为false
                    active = getAttrValue(attrs.active, false),// 激活状态,默认为false
                    type = getAttrValue(attrs.type, 'button'), // 按钮类型:button|submit|reset,默认为button
                    text = getAttrValue(attrs.text, 'button'), //按钮显示文本,默认为Button
                    icon = getAttrValue(attrs.icon, ''); //按钮图标,默认没有
                scope.text = scope.initText = text;
                scope.type = type;
                scope.icon = 'glyphicon-' + icon;
                scope.iconFlag = icon !== ''  ? true : false;
                scope.disabled =  scope.initDisabled =angular.isDefined(scope.disabled) ?  scope.disabled : false; // 是否不可用,默认为false
                scope.loading = angular.isDefined(scope.loading) ?  scope.loading : false; // 是否有加载效果,默认为false
               /**
                 * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
                 * @param {string} attributeValue 标签绑定数据(可解析|定值)
                 * @param {string | boolean} defaultValue 默认值
                 * @returns {*} 最终值
                 */
               function getAttrValue(attributeValue, defaultValue){
                    var val = scope.$parent.$eval(attributeValue);   //变量解析
                    return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
               }
               element.addClass('btn-' + btnClass); //设置按钮样式

               // 设置按钮大小
               switch(size)
               {
                    case 'large':
                        size = 'lg';
                        break;
                    case 'small':
                        size = 'sm';
                        break;
                    case 'x-small':
                        size = 'xs';
                        break;
                    default:
                        size = 'default';
                        break;
               }

               element.addClass('btn-' + size); //设置按钮大小

               // 设置block
               if(block){
                    element.addClass('btn-block');
               }

               // 设置active状态
               if(active){
                    element.addClass('active');
               }

               scope.$watch('disabled', function(val){
                    if(val){
                        element.attr('disabled', 'disabled');
                    }else{
                        element.removeAttr('disabled');
                    }
               });

               // button绑定click事件
               element.bind('click', function(){
                    if(scope.onClick){
                        scope.onClick();
                        scope.$parent.$apply();
                    }
               });
               scope.$watch('loading', function(val){
                    var spanEle = element.children('span.glyphicon-refresh-animate'),
                        ele = null;
                   if(val){
                        scope.disabled = val;
                        if(spanEle.length > 0){
                            spanEle.removeClass('hidden');
                        }else{
                            scope.text = 'isLoading...';
                            ele = '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>';
                            element.prepend(ele);
                        }
                    }else{
                        scope.disabled = scope.initDisabled;
                        scope.text = scope.initText;
                        if(spanEle.length > 0){
                            spanEle.addClass('hidden');
                        }
                    }
               });
            }
        }
    }])
    .controller('buttonController', ['$scope', function($scope){
        $scope.btnClassArr = ['default', 'primary', 'success', 'info', 'warning', 'danger', 'link'];  // 所有可设置样式
        $scope.sizeArr = ['large', 'small', 'x-small', 'default'];  // 所有可设置大小
        $scope.typeArr = ['button', 'reset', 'submit'];  // 所有可设置类型
    }]);
