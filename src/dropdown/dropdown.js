/**
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.xg.dropdown', [])

    .constant('uixDropdownConfig', {
        openClass: 'open',
        eachItemWidth: 120,
        multiColClass: 'dropdown-multi'
    })
    .provider('uixDropdown', function () {
        var _colsNum = 3;
        this.setColsNum = function (num) {
            _colsNum = angular.isNumber(num) ? num : 3;
        };
        this.$get = function () {
            return {
                getColsNum: function () {
                    return _colsNum;
                }
            };
        };
    })
    .service('uixDropdownService', ['$document', function ($document) {
        var openScope = null;

        this.open = function (dropdownScope) {
            if (!openScope) {
                $document.on('click', closeDropdown);
                $document.on('keydown', escapeKeyBind);
            }

            if (openScope && openScope !== dropdownScope) {
                openScope.isOpen = false;
            }

            openScope = dropdownScope;
            openScope.$on('$destroy', function () {
                $document.off('click', closeDropdown);
                $document.off('keydown', escapeKeyBind);
            });
        };

        this.close = function (dropdownScope) {
            if (openScope === dropdownScope) {
                openScope = null;
                $document.off('click', closeDropdown);
                $document.off('keydown', escapeKeyBind);
            }
        };

        function closeDropdown(evt) {
            // This method may still be called during the same mouse event that
            // unbound this event handler. So check openScope before proceeding.
            if (!openScope) {
                return;
            }

            var toggleElement = openScope.getToggleElement();
            if (evt && toggleElement && toggleElement[0] && toggleElement[0].contains(evt.target)) {
                return;
            }

            openScope.$apply(function () {
                openScope.isOpen = false;
            });
        }

        function escapeKeyBind(evt) {
            if (evt.which === 27) {
                openScope.focusToggleElement();
                closeDropdown();
            }
        }
    }])

    .controller('DropdownController',
        ['$scope', '$attrs', '$parse', 'uixDropdown', 'uixDropdownConfig', 'uixDropdownService', '$animate',
            function ($scope, $attrs, $parse, uixDropdown, uixDropdownConfig, uixDropdownService, $animate) {
                var self = this,
                    scope = $scope.$new(), // create a child scope so we are not polluting original one
                    openClass = uixDropdownConfig.openClass,
                    getIsOpen,
                    setIsOpen = angular.noop,
                    toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

                this.init = function (element) {
                    self.$element = element;
                    self.colsNum = angular.isDefined($attrs.colsNum)
                        ? angular.copy($scope.$parent.$eval($attrs.colsNum)) : uixDropdown.getColsNum();
                    if ($attrs.isOpen) {
                        getIsOpen = $parse($attrs.isOpen);
                        setIsOpen = getIsOpen.assign;

                        $scope.$watch(getIsOpen, function (value) {
                            scope.isOpen = !!value;
                        });
                    }
                };

                this.toggle = function (open) {
                    scope.isOpen = arguments.length ? !!open : !scope.isOpen;
                    return scope.isOpen;
                };

                // Allow other directives to watch status
                this.isOpen = function () {
                    return scope.isOpen;
                };

                scope.getToggleElement = function () {
                    return self.toggleElement;
                };

                scope.focusToggleElement = function () {
                    if (self.toggleElement) {
                        self.toggleElement[0].focus();
                    }
                };

                scope.$watch('isOpen', function (isOpen, wasOpen) {
                    if (isOpen) {
                        setMultiCols();
                    }
                    $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

                    if (isOpen) {
                        scope.focusToggleElement();
                        uixDropdownService.open(scope);
                    } else {
                        uixDropdownService.close(scope);
                    }

                    setIsOpen($scope, isOpen);
                    if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
                        toggleInvoker($scope, {open: !!isOpen});
                    }
                });
                // set multi column
                function setMultiCols() {
                    var eachItemWidth = uixDropdownConfig.eachItemWidth;
                    var colsNum = self.colsNum;
                    var dropdownMenu = angular.element(self.$element[0].querySelector('.dropdown-menu'));
                    var dropdownList = angular.element(
                        self.$element[0].querySelectorAll('.dropdown-menu > li:not(.divider)')
                    );
                    if (dropdownList.length <= colsNum || colsNum === 1) {
                        return;
                    }
                    self.$element.addClass(uixDropdownConfig.multiColClass);
                    dropdownMenu.css('width', eachItemWidth * colsNum + 'px');
                    dropdownList.css('width', 100 / colsNum + '%');
                }

                $scope.$on('$locationChangeSuccess', function () {
                    scope.isOpen = false;
                });

                $scope.$on('$destroy', function () {
                    scope.$destroy();
                });
            }])

    .directive('uixDropdown', function () {
        return {
            controller: 'DropdownController',
            link: function (scope, element, attrs, dropdownCtrl) {
                dropdownCtrl.init(element);
            }
        };
    })

    .directive('uixDropdownToggle', function () {
        return {
            require: '?^uixDropdown',
            link: function (scope, element, attrs, dropdownCtrl) {
                if (!dropdownCtrl) {
                    return;
                }

                dropdownCtrl.toggleElement = element;

                function toggleDropdown(event) {
                    event.preventDefault();

                    if (!element.hasClass('disabled') && !attrs.disabled) {
                        scope.$apply(function () {
                            dropdownCtrl.toggle();
                        });
                    }
                }

                element.bind('click', toggleDropdown);

                // WAI-ARIA
                element.attr({'aria-haspopup': true, 'aria-expanded': false});
                scope.$watch(dropdownCtrl.isOpen, function (isOpen) {
                    element.attr('aria-expanded', !!isOpen);
                });

                scope.$on('$destroy', function () {
                    element.unbind('click', toggleDropdown);
                });
            }
        };
    });
