/**
 * radio
 * radio directive
 * Author: liuhaifeng
 * Email: 13811556973@sina.cn
 * Date:2018-07-19
 */
angular.module('ui.xg.radio', [])

    .controller('uixRadioGroupCtrl', ['$scope', '$attrs',
        function ($scope, $attrs) {
            $scope.state = {};
            $scope.state.value = $scope.value + '';
            $scope.name = $attrs.name ? $attrs.name : 'defaultRadioName' + $scope.$id;

            this.addOptions = function (scope, element, attrs) {
                scope.name = attrs.name ? attrs.name : $scope.name;
                scope.state = $scope.state;
                scope.disabled = scope.disabled || attrs.disabled === '' ? true : $scope.disabled;
                scope.defaultChecked = scope.defaultChecked || attrs.defaultChecked === '' ? true : scope.optionValue === scope.state.value;
                scope.size = $attrs.size;

                scope.radioBtnDefault = 'btn-default';
                switch ($attrs.btnStyle) {
                    case 'primary':
                        scope.radioBtnChecked = 'btn-primary';
                        break;
                    case 'success':
                        scope.radioBtnChecked = 'btn-success';
                        break;
                    case 'info':
                        scope.radioBtnChecked = 'btn-info';
                        break;
                    case 'warning':
                        scope.radioBtnChecked = 'btn-warning';
                        break;
                    case 'danger':
                        scope.radioBtnChecked = 'btn-danger';
                        break;
                    default:
                        scope.radioBtnChecked = 'btn-primary';
                }
            };

            $scope.$watch('state.value', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.changeFn({value: newVal});
                }
            });

        }])

    .directive('uixRadioGroup', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/radioGroup.html',
            replace: true,
            transclude: true,
            scope: {
                options: '=?',
                disabled: '=?',
                changeFn: '&?',
                value: '=?',
                size: '=?'
            },
            controller: 'uixRadioGroupCtrl'
        };
    })

    .directive('uixRadio', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/radio.html',
            replace: true,
            transclude: true,
            require: '?^^uixRadioGroup',
            scope: {
                disabled: '=?',
                defaultChecked: '=?'
            },
            link: function (scope, element, attrs, uixRadioGroupCtrl) {
                if (uixRadioGroupCtrl) {
                    scope.optionValue = attrs.value || element[0].innerText;
                    uixRadioGroupCtrl.addOptions(scope, element, attrs);
                } else {
                    scope.name = attrs.name ? attrs.name : 'defaultRadioName' + scope.$id;
                    scope.state = {};
                    scope.state.value = attrs.value || '';
                    scope.optionValue = element[0].lastChild.innerText;
                    scope.defaultChecked = scope.defaultChecked || attrs.defaultChecked === '' ? true : scope.optionValue === scope.state.value;
                    scope.disabled = scope.disabled || attrs.disabled === '' ? true : false;
                }
            }
        };
    })

    .directive('uixRadioBtn', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/radioBtn.html',
            replace: true,
            transclude: true,
            require: '?^^uixRadioGroup',
            scope: {
                disabled: '=?',
                defaultChecked: '=?',
                size: '=?'
            },
            link: function (scope, element, attrs, uixRadioGroupCtrl) {
                if (uixRadioGroupCtrl) {
                    scope.optionValue = attrs.value;
                    uixRadioGroupCtrl.addOptions(scope, element, attrs);
                    scope.btnModelFn = function (state, optionValue) {
                        state.value = optionValue;
                    };

                    scope.btnClassGroup = 'btn';
                    if (scope.size === 'md') {
                        scope.btnClassGroup += ' btn-md';
                    } else if (scope.size === 'sm') {
                        scope.btnClassGroup += ' btn-sm';
                    } else if (scope.size === 'xs') {
                        scope.btnClassGroup += ' btn-xs';
                    } else if (scope.size === 'lg') {
                        scope.btnClassGroup += ' btn-lg';
                    } else {
                        scope.btnClassGroup += ' btn-md';
                    }
                } else {
                    scope.name = attrs.name ? attrs.name : 'defaultRadioName' + scope.$id;
                    scope.state = {};
                    scope.state.value = element[0].lastChild.innerText;
                    scope.optionValue = attrs.value;
                    scope.defaultChecked = scope.defaultChecked || attrs.defaultChecked === '' ? true : scope.optionValue === scope.state.value;
                }
            }
        };
    });
