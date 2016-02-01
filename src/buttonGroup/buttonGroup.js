/**
 * button
 * 按钮组指令
 * Author:penglu02@meituan.com
 * Date:2016-01-23
 */
angular.module('ui.fugu.buttonGroup', [])
    .constant('buttonGroupConfig', {
        size : 'default',   // 按钮组大小:x-small,small,default,larger
        type : 'radio',  // 按钮组类型:radio 或者 checkbox类型
        showClass : 'default', //按钮组样式:danger | warning | default | success | info ｜ primary
        checkboxTrue : true, // 按钮选中对应ngModel的值
        checkboxFalse : false, //按钮不选对应ngModel的值
        disabled : false  // 按钮组不可用状态
    })
    .controller('buttonGroupController',['$transclude', '$scope', '$element', '$attrs', 'buttonGroupConfig', function($transclude, $scope, $element, $attrs, buttonGroupConfig){
        var transcludeEles = $transclude(),// 获取嵌入元素 TODO:1.2.25版本不需要传入$scope，否则会报错
            i = 0,
            tagName,
            childElements = [],
            btnObj = {};

        // 根据插入按钮，生成嵌入元素数据对象
        for (;i < transcludeEles.length; i++ ){
            tagName = transcludeEles[i].tagName;
            if(tagName && tagName.toLocaleLowerCase() === 'button'){
                btnObj = {};
                btnObj.value = transcludeEles[i].innerText;   // 获取button显示内容
                btnObj.btnRadio = getAttrValue(angular.element(transcludeEles[i]).attr('btn-radio'), "");  //获取btn-radio属性对应值:控制选中状态
                btnObj.btnCheckbox = getAttrValue(angular.element(transcludeEles[i]).attr('btn-checkbox'), "");  //获取btn-checkbox属性对应值:控制勾选状态
                childElements.push(btnObj);
            }
        }

        $scope.buttons = childElements;
        $scope.type = getAttrValue($attrs.type, buttonGroupConfig.type);  //按钮组类型:radio | checkbox
        $scope.size = getAttrValue($attrs.size, buttonGroupConfig.size);  // 按钮组大小
        $scope.showClass = getAttrValue($attrs.showClass, buttonGroupConfig.showClass); //按钮组样式
        $scope.checkboxTrue = getAttrValue($attrs.checkboxTrue, buttonGroupConfig.checkboxTrue);   //checkbox选中对应model值
        $scope.checkboxFalse = getAttrValue($attrs.checkboxFalse, buttonGroupConfig.checkboxFalse);   //checkbox不选对应model值
        $scope.disabled = getAttrValue($attrs.disabled, buttonGroupConfig.disabled);

        // 设置按钮大小,转变成class
        switch($scope.size)
        {
            case 'large':
                $scope.size = 'btn-lg';
                break;
            case 'small':
                $scope.size = 'btn-sm';
                break;
            case 'x-small':
                $scope.size = 'btn-xs';
                break;
            default:
                $scope.size = 'btn-default';
                break;
        }

        // 设置按钮样式类型,转变成class
        $scope.showClass = "btn-" + $scope.showClass;

        // 设置不可用
        if($scope.disabled) {
            $scope.disabled = 'disabled';
        }
        /**
         * 获取属性值:数据绑定(通过变量设置|定义常量)|默认值
         * @param {string} attributeValue 标签绑定数据(可解析|定值)
         * @param {string | boolean} defaultValue 默认值
         * @returns {*} 最终值
         */
        function getAttrValue(attributeValue, defaultValue){
            var val = $scope.$parent.$eval(attributeValue);   //变量解析
            return angular.isDefined(val) ? val :  attributeValue ? attributeValue : defaultValue;
        }
    }])
    .directive('fuguButtonGroup', [function() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                ngModel: '='
            },
            require: '^ngModel',
            templateUrl: 'templates/buttonGroup.html',
            transclude:true,
            controller: 'buttonGroupController',
            link: function (scope, element, attrs, ngModelCtrl) {
                var _scope = scope,
                    o, i;
                scope.modelObj = angular.copy(scope.$parent.$eval(scope.ngModel));  // 复制获取元素的model
                if(scope.type === 'radio'){   //radio类型

                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        angular.forEach(scope.buttons, function(val){
                            if(!val.btnRadio){  // 没有设置btn-radio,使用元素的text作为默认值
                                val.btnRadio = val.value;
                            }
                            // 判断按钮组是否选中:btn-radio设置model值
                            if(angular.equals(ngModelCtrl.$modelValue, val.btnRadio)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                            }
                        });
                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }
                        ngModelCtrl.$setViewValue(btn.btnRadio); // 修改选中对应model值
                        ngModelCtrl.$render();
                    };
                }else{    // checkbox类型
                    // model的render事件:model->ui
                    ngModelCtrl.$render = function(){   // 重写render方法
                        angular.forEach(scope.buttons, function(val, idx){
                            i = 0;
                            if(!val.btnCheckbox){  // 没有设置值,则使用对应ng-model的key作为默认值
                                for(o in scope.modelObj){
                                    if(i === idx){
                                        val.btnCheckbox = o;
                                        break;
                                    }else{
                                        i++;
                                    }
                                }
                            }

                            // 判断给定当前checkbox状态是否选中model的值(btn-checkbox对应model中的值是否为true)
                            // btn-checkbox值的设置为ng-model对应对象的key
                            if(angular.equals(scope.modelObj[val.btnCheckbox], scope.checkboxTrue)){
                                val.active = 'active';
                            }else{
                                val.active = '';
                            }
                        });
                    };

                    // 按钮点击事件:修改model,实现ui->model
                    scope.clickFn = function(btn, event){
                        event.stopPropagation();
                        event.preventDefault();
                        if(_scope.disabled){
                            return;
                        }

                        if(btn.active){
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxFalse; // 修改选中状态:选中->不选,对应model值
                        }else{
                            scope.modelObj[btn.btnCheckbox] = _scope.checkboxTrue; //修改选中状态:不选->选中,对应model值
                        }
                        ngModelCtrl.$setViewValue(scope.modelObj);  // 修改model
                        ngModelCtrl.$render();
                    };
                }
            }
        }
    }]);
