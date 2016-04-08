/**
 * switch
 * 开关
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-31
 */
angular.module('ui.fugu.switch', [])
    .constant('fuguSwitchConfig', {
        type: 'default',
        size: 'md',
        isDisabled: false,
        trueValue:true,
        falseValue:false
    })
    .controller('fuguSwitchCtrl', ['$scope', '$attrs','fuguSwitchConfig', function ($scope, $attrs,fuguSwitchConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        $scope.switchObj = {};
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            $scope.switchObj.isDisabled = getAttrValue('ngDisabled','isDisabled');
            $scope.switchObj.type = $scope.type || fuguSwitchConfig.type;
            $scope.switchObj.size = $scope.size || fuguSwitchConfig.size;
            $scope.switchObj.trueValue = getAttrValue('trueValue');
            $scope.switchObj.falseValue = getAttrValue('falseValue');
        };
        $scope.$watch('switchObj.query', function (val) {
            ngModelCtrl.$setViewValue(val?$scope.switchObj.trueValue:$scope.switchObj.falseValue);
            ngModelCtrl.$render();
        });
        $scope.changeSwitchHandler = function () {
            if($scope.onChange){
                $scope.onChange();
            }
        };
        this.render = function () {
            $scope.switchObj.query = ngModelCtrl.$viewValue === $scope.switchObj.trueValue;
        };
        function getAttrValue(attributeValue,defaultValue) {
            var val = $scope.$parent.$eval($attrs[attributeValue]);   //变量解析
            return angular.isDefined(val) ? val : fuguSwitchConfig[defaultValue||attributeValue];
        }
    }])
    .directive('fuguSwitch', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/switch.html',
            replace: true,
            require: ['fuguSwitch', 'ngModel'],
            scope: {
                type:'@?',
                size:'@?',
                onChange:'&?'
            },
            controller: 'fuguSwitchCtrl',
            link: function (scope, el, attrs, ctrls) {
                var switchCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                switchCtrl.init(ngModelCtrl);
            }
        }
    });