/**
 * grid
 * 布局指令
 * Author: clunt@foxmail.com
 * Date:2018-06-21
 */
(function () {
    // TODO: args valid libs
    var GRID_COLUMN = 24;
    var GRID_BREAKPOINTS = {
        'xs': [],
        'sm': [],
        'md': [],
        'lg': [],
        'xl': [],
        'xxl': []
    };

    var GRID_ATTR_PREFIX = 'uix-grid';
    var ITEM_ATTR_PREFIX = 'uix-grid-item';

    var GRID_CLASS_PREFIX = 'uix-grid';
    var ITEM_CLASS_PREFIX = 'uix-grid-item';


    // Allowed attributes
    var GRID_ATTRS = {};
    angular.forEach({
        type: {
            default: 'row',
            value: ['row', 'flex']
        },
        align: ['top', 'middle', 'bottom'],
        justify: ['start', 'end', 'center', 'around', 'between'],
        reverse: function (value) {
            if (value === '' || value === 'true') {
                return 'reverse';
            }
        }
    }, function (valid, attr) {
        GRID_ATTRS[attr] = function (value, $parse) {
            var className;
            if (angular.isFunction(valid)) {
                className = valid(value, $parse);
            } else {
                valid = angular.isArray(valid) ? { value: valid } : valid;
                className = valid.value.indexOf(value) > -1 ? value : valid.default;
            }
            if (className) {
                return GRID_CLASS_PREFIX + '-' + className;
            }
        };
    });

    var ITEM_ATTRS = {
        span: true,
        pull: true,
        push: true,
        offset: true,
        order: true
    };
    angular.forEach(angular.extend(ITEM_ATTRS, GRID_BREAKPOINTS), function (valid, attr) {
        ITEM_ATTRS[attr] = function (value, $parse) {
            if (angular.isDefined(value)) {
                // attr defined, but not set value
                value = value ? $parse(value)() : '';

                var props = {};
                // structuring props
                if (GRID_BREAKPOINTS[attr]) {
                    // only support object value in media attr
                    if (angular.isObject(value)) {
                        props = value;
                    } else {
                        // media default attr 'span'
                        props['span'] = value;
                    }
                } else {
                    props[attr] = value;
                }

                var values = {};
                // validate * format value
                angular.forEach(props, function (value, prop) {
                    // span, pull, push, offset, order
                    var validProp = ITEM_ATTRS[prop] && !GRID_BREAKPOINTS[prop];
                    var validValue = (
                        angular.isNumber(value) && /^\d+$/.test(value) && value >= 0 && value <= GRID_COLUMN
                    ) || (value === '' && prop === 'span');
                    if (validProp && validValue) {
                        values[prop] = value;
                    }
                });

                var className = [];
                // prefix / prefix-xs
                var classPrefix = GRID_BREAKPOINTS[attr] ? ITEM_CLASS_PREFIX + '-' + attr : ITEM_CLASS_PREFIX;
                angular.forEach(values, function (value, prop) {
                    // prefix-span / prefix-xs-span / prefix-span--0
                    var prefix = classPrefix + '-' + prop;
                    if (angular.isNumber(value)) {
                        prefix += '--' + value;
                    }
                    className.push(prefix);
                });

                if (className.length > 0) {
                    return className.join(' ');
                }
            }
        };
    });

    angular.module('ui.xg.grid', [])
        .directive('uixGrid', createDirective('A', GRID_ATTR_PREFIX, GRID_ATTRS))
        .directive('uixGrid', createDirective('E', GRID_ATTR_PREFIX, GRID_ATTRS))
        .directive('uixGridItem', createDirective('E', ITEM_ATTR_PREFIX, ITEM_ATTRS))
        .directive('uixGridItem', createDirective('A', ITEM_ATTR_PREFIX, ITEM_ATTRS));

    function createDirective(restrict, prefix, attrs) {
        return ['$parse', function ($parse) {
            var directive = {
                restrict: restrict,
                compile: function () {
                    return function ($scope, $element, $attrs, controller, $transclude) {
                        angular.forEach(attrs, function (getClass, attr) {
                            var attrName = getAttrName($attrs, prefix, attr);

                            var updateClassFn = updateClassWithValue(getClass, $element, $parse);
                            updateClassFn($attrs[attrName]);

                            var unwatch = $attrs.$observe(attrName, updateClassFn);
                            $scope.$on('$destroy', function () {
                                unwatch();
                            });
                        });

                        if ($transclude) {
                            $transclude($scope, function (clone) {
                                $element.append(clone);
                            });
                        }
                    };
                }
            };

            if (restrict === 'E') {
                directive.replace = true;
                directive.template = '<div></div>';
                directive.transclude = true;
            }

            return directive;
        }];
    }

    function getAttrName($attrs, prefix, name) {
        return $attrs.$normalize(prefix + '-' + name);
    }

    function updateClassWithValue(getClass, $element, $parse) {
        var lastClass;

        return function updateClassFn(newValue) {
            if (lastClass) {
                $element.removeClass(lastClass);
            }
            lastClass = getClass(newValue, $parse);
            if (lastClass) {
                $element.addClass(lastClass);
            }
        };
    }
})();
