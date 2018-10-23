/**
 * divider
 * divider directive
 * Author: your_email@gmail.com
 * Date:2018-10-16
 */
angular.module('ui.xg.divider', [])
    .constant('diciderConfig', {
        type: ['horizontal', 'vertical'],
        orientation: ['left', 'right'],
        defaultOrientation: '',
        defaultType: 'horizontal',
        dashed: false
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
    .directive('uixDivider', ['diciderConfig', 'uixClassName', function (diciderConfig, uixClassName) {
        return {
            restrict: 'AE',
            templateUrl: 'templates/divider.html',
            replace: true,

            scope: {
                type: '@?',
                orientation: '@?',
                dashed: '@?'
            },
            transclude: true,
            link: function (scope, el, attrs, ctrls, transclude) {
                let isChildren = transclude().length;
                let orientation = diciderConfig.orientation.includes(scope.orientation) ? scope.orientation : diciderConfig.defaultOrientation;
                let type = diciderConfig.type.includes(scope.type) ? scope.type : diciderConfig.defaultType;
                let dashed = scope.dashed;
                const orientationPrefix = (orientation.length > 0) ? '-' + orientation : orientation;
                scope.classString = uixClassName(
                    'uix-divider', `uix-divider-${type}`, {
                        [`uix-divider-with-text${orientationPrefix}`]: isChildren,
                        ['uix-divider-dashed']: !!dashed
                    });

            }
        };
    }]);
