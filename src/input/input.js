/**
 * input
 * input directive
 * Author: your_email@gmail.com
 * Date:2018-08-31
 */
angular.module('ui.xg.input', [])
    .constant('inputConfig', {
        prefixCls: 'uix-input',
        sizeGroup: ['small', 'large', 'default'],
        defaultSize: 'default',
        defaultType: 'text',
        _disabled: false
    })
    .factory('uixClassName', () => function classNames() {
        let classes = [];
        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];
            if (!arg) { continue; }
            if (angular.isString(arg) || angular.isNumber(arg)) {
                classes.push(arg);
            }
            else if (angular.isArray(arg) && arg.length) {
                var inner = classNames.apply(null, arg);
                if (inner) {
                    classes.push(inner);
                }
            } else if (angular.isObject(arg)) {
                for (var key in arg) {
                    if (Object.hasOwnProperty.call(arg, key) && arg[key]) {
                        classes.push(key);
                    }
                }
            }
        }
        return classes.join(' ');
    })
    .directive('uixInput', ['inputConfig', 'uixClassName', function (inputConfig, uixClassName) {
        return {
            restrict: 'A',
            replace: true,

            link: function ($scope, el, attrs) {

                // judje el type equal textarea 
                if (angular.element(el)[0].tagName.toLowerCase() === 'textarea') {
                    if (angular.isDefined(attrs.cols)) {
                        el[0].style.width = 'auto';
                    }
                    if (angular.isDefined(attrs.rows)) {
                        el[0].style.height = 'auto';
                    }
                }
                // get attrs 
                let getSize = getRealAttr($scope.$parent, attrs.size);
                let getDisabled = getRealAttr($scope.$parent, attrs.disabled);
                let _size = inputConfig.sizeGroup.includes(getSize) ? getSize : inputConfig.defaultSize;
                let _disabled = getDisabled;

                // set style 
                el.addClass(getInputClassName());

                // watching 'disabled' to change style 
                attrs.$observe('disabled', function (val) {
                    el.toggleClass(`${inputConfig.prefixCls}-disabled`, !!val);
                });

                // setclass 
                function getInputClassName() {
                    let prefixCls = 'uix-input';
                    return uixClassName(prefixCls, {
                        [`${prefixCls}-sm`]: _size === 'small',
                        [`${prefixCls}-lg`]: _size === 'large',
                        [`${prefixCls}-disabled`]: _disabled
                    });
                }

                function getRealAttr(scope, val) {
                    if (angular.isUndefined(val)) {
                        return val;
                    }
                    return scope.$eval(val) ? scope.$eval(val) : val;
                }
            }
        };
    }])
    .directive('uixInputGroup', [function () {
        return {
            restrict: 'E',
            templateUrl: 'templates/input-group-template.html',
            replace: true,
            transclude: true,
            scope: {
                addonBefore: '=?',
                addonAfter: '=?',
                size: '=?'
            },
            link: function ($scope) {
                $scope.isSmall = $scope.size === 'small';
                $scope.isLarge = $scope.size === 'large';
            }
        };
    }])
    .directive('uixInputNumber', [function () {
        return {
            restrict: 'A',
            require: '?^ngModel',
            scope: {
                max: '@?',
                min: '@?',
                step: '@?'
            },
            link: function (scope, el, attrs, modelCtrl) {

                if (!modelCtrl) {
                    return;
                }
                var max = +scope.max || Infinity;
                var min = +scope.min || -Infinity;
                var step = +scope.step || 1;

                modelCtrl.$formatters.push(function (val) {
                    return modelCtrl.$isEmpty(val) ? val : getCompareVal(val);
                });

                modelCtrl.$parsers.push(function (inputVal) {
                    let val = toPrecisionAsStep(inputVal);
                    val = modelCtrl.$isEmpty(val) ? val : getCompareVal(val);
                    if (val !== inputVal) {
                        modelCtrl.$setViewValue(val);
                        modelCtrl.$render();
                    }
                    return val;
                });

                function getCompareVal(val) {
                    val = Number(val);
                    if (val < min) {
                        val = min;
                    }
                    if (val > max) {
                        val = max;
                    }
                    return val;
                }

                function toPrecisionAsStep(num) {
                    if (isNaN(num) || num === '' || num === null) {
                        return num;
                    }
                    var precision = getPrecision();
                    return Number(Number(num).toFixed(precision));
                }

                function getPrecision() {
                    var stepString = step.toString();
                    var precision = 0;
                    if (stepString.indexOf('.') >= 0) {
                        precision = stepString.length - stepString.indexOf('.') - 1;
                    }
                    return precision;
                }
            }
        };
    }]);
