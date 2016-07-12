/**
 * switch
 * 开关
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-31
 */
angular.module('ui.xg.switch', [])
    .constant('uixSwitchConfig', {
        type: 'default',
        size: 'md',
        isDisabled: false,
        trueValue: true,
        falseValue: false
    })
    .controller('uixSwitchCtrl', ['$scope', '$attrs', 'uixSwitchConfig', function ($scope, $attrs, uixSwitchConfig) {
        var ngModelCtrl = {$setViewValue: angular.noop};
        $scope.switchObj = {};
        this.init = function (_ngModelCtrl) {
            ngModelCtrl = _ngModelCtrl;
            ngModelCtrl.$render = this.render;
            $scope.switchObj.isDisabled = getAttrValue('ngDisabled', 'isDisabled');
            $scope.switchObj.type = $scope.type || uixSwitchConfig.type;
            $scope.switchObj.size = $scope.size || uixSwitchConfig.size;
            $scope.switchObj.trueValue = getAttrValue('trueValue');
            $scope.switchObj.falseValue = getAttrValue('falseValue');
        };
        $scope.$watch('switchObj.query', function (val) {
            ngModelCtrl.$setViewValue(val ? $scope.switchObj.trueValue : $scope.switchObj.falseValue);
            ngModelCtrl.$render();
        });
        $scope.changeSwitchHandler = function () {
            if ($scope.onChange) {
                $scope.onChange();
            }
        };
        this.render = function () {
            $scope.switchObj.query = ngModelCtrl.$viewValue === $scope.switchObj.trueValue;
        };
        function getAttrValue(attributeValue, defaultValue) {
            var val = $scope.$parent.$eval($attrs[attributeValue]);   //变量解析
            return angular.isDefined(val) ? val : uixSwitchConfig[defaultValue || attributeValue];
        }
    }])
    .directive('uixSwitch', function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/switch.html',
            replace: true,
            require: ['uixSwitch', 'ngModel'],
            scope: {
                type: '@?',
                size: '@?',
                onChange: '&?'
            },
            controller: 'uixSwitchCtrl',
            link: function (scope, el, attrs, ctrls) {
                var switchCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                switchCtrl.init(ngModelCtrl);
            }
        };
    });
