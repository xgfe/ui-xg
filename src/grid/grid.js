/**
 * grid
 * 布局指令
 * Author: clunt@foxmail.com
 * Date:2018-06-21
 */
(function () {
    var GRID_COLUMN = 24;
    var GRID_BREAKPOINTS = {
        xs: [],
        sm: [],
        md: [],
        lg: [],
        xl: [],
        xxl: []
    };

    var GRID_ATTR_PREFIX = 'uix-grid';
    var ITEM_ATTR_PREFIX = 'uix-grid-item';

    var GRID_CLASS_PREFIX = 'uix-grid';
    var ITEM_CLASS_PREFIX = 'uix-grid-item';

    // Allowed attributes
    var GRID_ATTRS = getAttrClassFn(GRID_CLASS_PREFIX, {
        align: ['top', 'middle', 'bottom'],
        justify: ['start', 'end', 'center', 'around', 'between'],
        gutter: Boolean,
        reverse: Boolean
    }, GRID_BREAKPOINTS);
    var ITEM_ATTRS = getAttrClassFn(ITEM_CLASS_PREFIX, {
        span: { type: Number, valid: [0, GRID_COLUMN], default: true },
        offset: { type: Number, valid: [0, GRID_COLUMN] },
        order: { type: Number, valid: [0, GRID_COLUMN] }
    }, GRID_BREAKPOINTS, 'span');

    angular.module('ui.xg.grid', [])
        .directive('uixGrid', createDirective('A', GRID_ATTR_PREFIX, GRID_ATTRS, GRID_CLASS_PREFIX))
        .directive('uixGrid', createDirective('E', GRID_ATTR_PREFIX, GRID_ATTRS, GRID_CLASS_PREFIX))
        .directive('uixGridItem', createDirective('E', ITEM_ATTR_PREFIX, ITEM_ATTRS))
        .directive('uixGridItem', createDirective('A', ITEM_ATTR_PREFIX, ITEM_ATTRS));

    function createDirective(restrict, prefix, attrs, defaultClass) {
        return ['$parse', function ($parse) {
            var directive = {
                restrict: restrict,
                compile: function (tElement) {
                    if (defaultClass) {
                        tElement.addClass(defaultClass);
                    }

                    return function ($scope, $element, $attrs, controller, $transclude) {
                        if (defaultClass) {
                            $element.addClass(defaultClass);
                        }

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

    function getAttrClassFn(prefix, attrs, breakpoints, defaultProp) {
        // generate class for attr
        var attrFns = {};

        // attr value validate fns
        // valid and return attr value
        var validate = {};

        angular.forEach(attrs, function (validation, attr) {
            validate[attr] = getValueValid(validation);
            attrFns[attr] = getClass([prefix], function (value) {
                // attr(not media attr) only support basic type value
                var props = {};
                props[attr] = value;
                return props;
            });
        });
        angular.forEach(breakpoints, function (validation, attr) {
            // media attr value support object
            attrFns[attr] = getClass([prefix, attr], parseProps);
        });

        function getClass(prefixs, parse) {
            // prefix / prefix-${media}
            var classPrefix = prefixs.join('-');
            return function (value, $parse) {
                var className = [];
                angular.forEach(parse(value, $parse), function (value, prop) {
                    var validateFn = validate[prop];
                    if (angular.isFunction(validateFn)) {
                        var validValue = validateFn(value);

                        if (angular.isDefined(validValue)) {
                            var propClass = classPrefix;

                            // omit default prop in class
                            if (prop !== defaultProp) {
                                propClass += '-' + prop;
                            }

                            // class exist / not exist, when attr only support boolean
                            if (validValue !== '') {
                                propClass += '--' + validValue;
                            }

                            className.push(propClass);
                        }
                    }
                });

                if (className.length > 0) {
                    return className.join(' ');
                }
            };
        }

        function getValueValid(validation) {
            if (angular.isArray(validation)) {
                return function (value) {
                    if (validation.indexOf(value) > -1) {
                        return value;
                    }
                };
            }

            if (validation === Boolean) {
                return function (value) {
                    if (value === '' || value === 'true') {
                        return '';
                    }
                };
            }

            if (angular.isObject(validation)) {
                if (validation.type === Number) {
                    return function (value) {
                        if (value === '') {
                            if (validation.default) {
                                return '';
                            }
                        }

                        if (/^\d+$/.test(value) && value >= validation.valid[0] && value <= validation.valid[1]) {
                            return parseInt(value, 10);
                        }
                    };
                }
            }

            if (angular.isFunction(validation)) {
                return validation;
            }

            return function () {};
        }

        function parseProps(value, $parse) {
            var props = {}; // structuring props
            // only support object value in media attr
            value = value ? $parse(value)() : value;
            if (angular.isObject(value)) {
                props = value;
            } else {
                if (defaultProp) {
                    props[defaultProp] = value;
                }
            }
            return props;
        }

        return attrFns;
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
