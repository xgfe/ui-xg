/**
 * tooltip
 * 提示指令
 * Author:heqingyang@meituan.com
 * Update:yjy972080142@gmail.com
 * Date:2016-02-18
 */
angular.module('ui.xg.tooltip', ['ui.xg.position', 'ui.xg.stackedMap'])

    /**
     * The $tooltip service creates tooltip- and popover-like directives as well as
     * houses global options for them.
     */
    .provider('$uixTooltip', function () {
        // The default options tooltip and popover.
        var defaultOptions = {
            placement: 'top',
            placementClassPrefix: '',
            animation: true,
            popupDelay: 0,
            popupCloseDelay: 0,
            useContentExp: false
        };

        // Default hide triggers for each show trigger
        var triggerMap = {
            'mouseenter': 'mouseleave',
            'click': 'click',
            'outsideClick': 'outsideClick',
            'focus': 'blur',
            'none': ''
        };

        // The options specified to the provider globally.
        var globalOptions = {};

        /**
         * `options({})` allows global configuration of all tooltips in the
         * application.
         *
         *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } );
   *   });
         */
        this.options = function (value) {
            angular.extend(globalOptions, value);
        };

        /**
         * This allows you to extend the set of trigger mappings available. E.g.:
         *
         *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
         */
        this.setTriggers = function setTriggers(triggers) {
            angular.extend(triggerMap, triggers);
        };

        /**
         * This is a helper function for translating camel-case to snake-case.
         */
        function snake_case(name) {
            var regexp = /[A-Z]/g;
            var separator = '-';
            return name.replace(regexp, function (letter, pos) {
                return (pos ? separator : '') + letter.toLowerCase();
            });
        }

        /**
         * Returns the actual instance of the $tooltip service.
         * TODO support multiple triggers
         */
        this.$get = ['$window', '$compile', '$timeout', '$document', '$uixPosition', '$interpolate', '$rootScope', '$parse', '$uixStackedMap', function ($window, $compile, $timeout, $document, $position, $interpolate, $rootScope, $parse, $$stackedMap) {
            var openedTooltips = $$stackedMap.createNew();
            $document.on('keypress', keypressListener);

            $rootScope.$on('$destroy', function () {
                $document.off('keypress', keypressListener);
            });

            function keypressListener(e) {
                if (e.which === 27) {
                    var last = openedTooltips.top();
                    if (last) {
                        last.value.close();
                        openedTooltips.removeTop();
                        last = null;
                    }
                }
            }

            return function $tooltip(ttType, prefix, defaultTriggerShow, options) {
                options = angular.extend({}, defaultOptions, globalOptions, options);

                /**
                 * Returns an object of show and hide triggers.
                 *
                 * If a trigger is supplied,
                 * it is used to show the tooltip; otherwise, it will use the `trigger`
                 * option passed to the `$tooltipProvider.options` method; else it will
                 * default to the trigger supplied to this directive factory.
                 *
                 * The hide trigger is based on the show trigger. If the `trigger` option
                 * was passed to the `$tooltipProvider.options` method, it will use the
                 * mapped trigger from `triggerMap` or the passed trigger if the map is
                 * undefined; otherwise, it uses the `triggerMap` value of the show
                 * trigger; else it will just use the show trigger.
                 */
                function getTriggers(trigger) {
                    var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
                    var hide = show.map(function (trigger) {
                        return triggerMap[trigger] || trigger;
                    });
                    return {
                        show: show,
                        hide: hide
                    };
                }

                var directiveName = snake_case(ttType);

                var startSym = $interpolate.startSymbol();
                var endSym = $interpolate.endSymbol();
                var template =
                    '<div ' + directiveName + '-popup ' +
                    'title="' + startSym + 'title' + endSym + '" ' +
                    (options.useContentExp ?
                        'content-exp="contentExp()" ' :
                    'content="' + startSym + 'content' + endSym + '" ') +
                    'placement="' + startSym + 'placement' + endSym + '" ' +
                    'popup-class="' + startSym + 'popupClass' + endSym + '" ' +
                    'animation="animation" ' +
                    'is-open="isOpen"' +
                    'origin-scope="origScope" ' +
                    'style="visibility: hidden; display: block; top: -9999px; left: -9999px;"' +
                    '>' +
                    '</div>';

                return {
                    compile: function () {
                        var tooltipLinker = $compile(template);

                        return function link(scope, element, attrs) {
                            var tooltip;
                            var tooltipLinkedScope;
                            var transitionTimeout;
                            var showTimeout;
                            var hideTimeout;
                            var positionTimeout;
                            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
                            var triggers = getTriggers();
                            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
                            var ttScope = scope.$new(true);
                            var repositionScheduled = false;
                            var isOpenParse = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;
                            var contentParse = options.useContentExp ? $parse(attrs[ttType]) : false;
                            var observers = [];

                            var positionTooltip = function () {
                                // check if tooltip exists and is not empty
                                if (!tooltip || !tooltip.html()) {
                                    return;
                                }
                                if (!positionTimeout) {
                                    positionTimeout = $timeout(function () {
                                        if (!tooltip) {
                                            return;
                                        }
                                        // Reset the positioning.
                                        tooltip.css({top: 0, left: 0});

                                        // Now set the calculated positioning.
                                        var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                                        tooltip.css({
                                            top: ttPosition.top + 'px',
                                            left: ttPosition.left + 'px',
                                            visibility: 'visible'
                                        });

                                        // If the placement class is prefixed, still need
                                        // to remove the TWBS standard class.
                                        if (options.placementClassPrefix) {
                                            tooltip.removeClass('top bottom left right');
                                        }

                                        tooltip.removeClass(
                                            options.placementClassPrefix + 'top ' +
                                            options.placementClassPrefix + 'top-left ' +
                                            options.placementClassPrefix + 'top-right ' +
                                            options.placementClassPrefix + 'bottom ' +
                                            options.placementClassPrefix + 'bottom-left ' +
                                            options.placementClassPrefix + 'bottom-right ' +
                                            options.placementClassPrefix + 'left ' +
                                            options.placementClassPrefix + 'left-top ' +
                                            options.placementClassPrefix + 'left-bottom ' +
                                            options.placementClassPrefix + 'right ' +
                                            options.placementClassPrefix + 'right-top ' +
                                            options.placementClassPrefix + 'right-bottom');

                                        var placement = ttPosition.placement.split('-');
                                        tooltip.addClass(placement[0], options.placementClassPrefix + ttPosition.placement);
                                        $position.positionArrow(tooltip, ttPosition.placement);

                                        positionTimeout = null;
                                    }, 0, false);
                                }
                            };

                            // Set up the correct scope to allow transclusion later
                            ttScope.origScope = scope;

                            // By default, the tooltip is not open.
                            // TODO add ability to start tooltip opened
                            ttScope.isOpen = false;
                            openedTooltips.add(ttScope, {
                                close: hide
                            });

                            function toggleTooltipBind() {
                                if (!ttScope.isOpen) {
                                    showTooltipBind();
                                } else {
                                    hideTooltipBind();
                                }
                            }

                            // Show the tooltip with delay if specified, otherwise show it immediately
                            function showTooltipBind() {
                                if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                                    return;
                                }

                                cancelHide();
                                prepareTooltip();

                                if (ttScope.popupDelay) {
                                    // Do nothing if the tooltip was already scheduled to pop-up.
                                    // This happens if show is triggered multiple times before any hide is triggered.
                                    if (!showTimeout) {
                                        showTimeout = $timeout(show, ttScope.popupDelay, false);
                                    }
                                } else {
                                    show();
                                }
                            }

                            function hideTooltipBind() {
                                cancelShow();

                                if (ttScope.popupCloseDelay) {
                                    if (!hideTimeout) {
                                        hideTimeout = $timeout(hide, ttScope.popupCloseDelay, false);
                                    }
                                } else {
                                    hide();
                                }
                            }

                            // Show the tooltip popup element.
                            function show() {
                                cancelShow();
                                cancelHide();

                                // Don't show empty tooltips.
                                if (!ttScope.content) {
                                    return angular.noop;
                                }

                                createTooltip();

                                // And show the tooltip.
                                ttScope.$evalAsync(function () {
                                    ttScope.isOpen = true;
                                    assignIsOpen(true);
                                    positionTooltip();
                                });
                            }

                            function cancelShow() {
                                if (showTimeout) {
                                    $timeout.cancel(showTimeout);
                                    showTimeout = null;
                                }

                                if (positionTimeout) {
                                    $timeout.cancel(positionTimeout);
                                    positionTimeout = null;
                                }
                            }

                            // Hide the tooltip popup element.
                            function hide() {
                                if (!ttScope) {
                                    return;
                                }

                                // First things first: we don't show it anymore.
                                ttScope.$evalAsync(function () {
                                    ttScope.isOpen = false;
                                    assignIsOpen(false);
                                    // And now we remove it from the DOM. However, if we have animation, we
                                    // need to wait for it to expire beforehand.
                                    // FIXME: this is a placeholder for a port of the transitions library.
                                    // The fade transition in TWBS is 150ms.
                                    if (ttScope.animation) {
                                        if (!transitionTimeout) {
                                            transitionTimeout = $timeout(removeTooltip, 150, false);
                                        }
                                    } else {
                                        removeTooltip();
                                    }
                                });
                            }

                            function cancelHide() {
                                if (hideTimeout) {
                                    $timeout.cancel(hideTimeout);
                                    hideTimeout = null;
                                }
                                if (transitionTimeout) {
                                    $timeout.cancel(transitionTimeout);
                                    transitionTimeout = null;
                                }
                            }

                            function createTooltip() {
                                // There can only be one tooltip element per directive shown at once.
                                if (tooltip) {
                                    return;
                                }

                                tooltipLinkedScope = ttScope.$new();
                                tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
                                    if (appendToBody) {
                                        $document.find('body').append(tooltip);
                                    } else {
                                        element.after(tooltip);
                                    }
                                });

                                prepObservers();
                            }

                            function removeTooltip() {
                                cancelShow();
                                cancelHide();
                                unregisterObservers();

                                if (tooltip) {
                                    tooltip.remove();
                                    tooltip = null;
                                }
                                if (tooltipLinkedScope) {
                                    tooltipLinkedScope.$destroy();
                                    tooltipLinkedScope = null;
                                }
                            }

                            /**
                             * Set the inital scope values. Once
                             * the tooltip is created, the observers
                             * will be added to keep things in synch.
                             */
                            function prepareTooltip() {
                                ttScope.title = attrs[prefix + 'Title'];
                                if (contentParse) {
                                    ttScope.content = contentParse(scope);
                                } else {
                                    ttScope.content = attrs[ttType];
                                }

                                ttScope.popupClass = attrs[prefix + 'Class'];
                                ttScope.placement = angular.isDefined(attrs[prefix + 'Placement']) ? attrs[prefix + 'Placement'] : options.placement;

                                var delay = parseInt(attrs[prefix + 'PopupDelay'], 10);
                                var closeDelay = parseInt(attrs[prefix + 'PopupCloseDelay'], 10);
                                ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
                                ttScope.popupCloseDelay = !isNaN(closeDelay) ? closeDelay : options.popupCloseDelay;
                            }

                            function assignIsOpen(isOpen) {
                                if (isOpenParse && angular.isFunction(isOpenParse.assign)) {
                                    isOpenParse.assign(scope, isOpen);
                                }
                            }

                            ttScope.contentExp = function () {
                                return ttScope.content;
                            };

                            /**
                             * Observe the relevant attributes.
                             */
                            attrs.$observe('disabled', function (val) {
                                if (val) {
                                    cancelShow();
                                }

                                if (val && ttScope.isOpen) {
                                    hide();
                                }
                            });

                            if (isOpenParse) {
                                scope.$watch(isOpenParse, function (val) {
                                    if (ttScope && !val === ttScope.isOpen) {
                                        toggleTooltipBind();
                                    }
                                });
                            }

                            function prepObservers() {
                                observers.length = 0;

                                if (contentParse) {
                                    observers.push(
                                        scope.$watch(contentParse, function (val) {
                                            ttScope.content = val;
                                            if (!val && ttScope.isOpen) {
                                                hide();
                                            }
                                        })
                                    );

                                    observers.push(
                                        tooltipLinkedScope.$watch(function () {
                                            if (!repositionScheduled) {
                                                repositionScheduled = true;
                                                tooltipLinkedScope.$$postDigest(function () {
                                                    repositionScheduled = false;
                                                    if (ttScope && ttScope.isOpen) {
                                                        positionTooltip();
                                                    }
                                                });
                                            }
                                        })
                                    );
                                } else {
                                    observers.push(
                                        attrs.$observe(ttType, function (val) {
                                            ttScope.content = val;
                                            if (!val && ttScope.isOpen) {
                                                hide();
                                            } else {
                                                positionTooltip();
                                            }
                                        })
                                    );
                                }

                                observers.push(
                                    attrs.$observe(prefix + 'Title', function (val) {
                                        ttScope.title = val;
                                        if (ttScope.isOpen) {
                                            positionTooltip();
                                        }
                                    })
                                );

                                observers.push(
                                    attrs.$observe(prefix + 'Placement', function (val) {
                                        ttScope.placement = val ? val : options.placement;
                                        if (ttScope.isOpen) {
                                            positionTooltip();
                                        }
                                    })
                                );
                            }

                            function unregisterObservers() {
                                if (observers.length) {
                                    angular.forEach(observers, function (observer) {
                                        observer();
                                    });
                                    observers.length = 0;
                                }
                            }

                            // hide tooltips/popovers for outsideClick trigger
                            function bodyHideTooltipBind(e) {
                                if (!ttScope || !ttScope.isOpen || !tooltip) {
                                    return;
                                }
                                // make sure the tooltip/popover link or tool tooltip/popover itself were not clicked
                                if (!element[0].contains(e.target) && !tooltip[0].contains(e.target)) {
                                    hideTooltipBind();
                                }
                            }

                            var unregisterTriggers = function () {
                                triggers.show.forEach(function (trigger) {
                                    if (trigger === 'outsideClick') {
                                        element[0].removeEventListener('click', toggleTooltipBind);
                                    } else {
                                        element[0].removeEventListener(trigger, showTooltipBind);
                                        element[0].removeEventListener(trigger, toggleTooltipBind);
                                    }
                                });
                                triggers.hide.forEach(function (trigger) {
                                    trigger.split(' ').forEach(function (hideTrigger) {
                                        if (trigger === 'outsideClick') {
                                            $document[0].removeEventListener('click', bodyHideTooltipBind);
                                        } else {
                                            element[0].removeEventListener(hideTrigger, hideTooltipBind);
                                        }
                                    });
                                });
                            };

                            function prepTriggers() {
                                var val = attrs[prefix + 'Trigger'];
                                unregisterTriggers();

                                triggers = getTriggers(val);

                                if (triggers.show !== 'none') {
                                    triggers.show.forEach(function (trigger, idx) {
                                        // Using raw addEventListener due to jqLite/jQuery bug - #4060
                                        if (trigger === 'outsideClick') {
                                            element[0].addEventListener('click', toggleTooltipBind);
                                            $document[0].addEventListener('click', bodyHideTooltipBind);
                                        } else if (trigger === triggers.hide[idx]) {
                                            element[0].addEventListener(trigger, toggleTooltipBind);
                                        } else if (trigger) {
                                            element[0].addEventListener(trigger, showTooltipBind);
                                            triggers.hide[idx].split(' ').forEach(function (trigger) {
                                                element[0].addEventListener(trigger, hideTooltipBind);
                                            });
                                        }

                                        element.on('keypress', function (e) {
                                            if (e.which === 27) {
                                                hideTooltipBind();
                                            }
                                        });
                                    });
                                }
                            }

                            prepTriggers();

                            var animation = scope.$eval(attrs[prefix + 'Animation']);
                            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;

                            var appendToBodyVal;
                            var appendKey = prefix + 'AppendToBody';
                            if (appendKey in attrs && angular.isUndefined(attrs[appendKey])) {
                                appendToBodyVal = true;
                            } else {
                                appendToBodyVal = scope.$eval(attrs[appendKey]);
                            }

                            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody;

                            // if a tooltip is attached to <body> we need to remove it on
                            // location change as its parent scope will probably not be destroyed
                            // by the change.
                            if (appendToBody) {
                                scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
                                    if (ttScope.isOpen) {
                                        hide();
                                    }
                                });
                            }

                            // Make sure tooltip is destroyed and removed.
                            scope.$on('$destroy', function onDestroyTooltip() {
                                unregisterTriggers();
                                removeTooltip();
                                openedTooltips.remove(ttScope);
                                ttScope = null;
                            });
                        };
                    }
                };
            };
        }];
    })

    // This is mostly ngInclude code but with a custom scope
    .directive('uixTooltipTemplateTransclude', [
        '$animate', '$sce', '$compile', '$templateCache', '$http',
        function ($animate, $sce, $compile, $templateCache, $http) {
            return {
                link: function (scope, elem, attrs) {
                    var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);

                    var changeCounter = 0,
                        currentScope,
                        previousElement,
                        currentElement;

                    function cleanupLastIncludeContent() {
                        if (previousElement) {
                            previousElement.remove();
                            previousElement = null;
                        }

                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }

                        if (currentElement) {
                            $animate.leave(currentElement, function () {
                                previousElement = null;
                            });
                            previousElement = currentElement;
                            currentElement = null;
                        }
                    }

                    var thisChangeId = changeCounter;

                    function compileTemplate(template, src) {
                        if (thisChangeId !== changeCounter) {
                            return;
                        }
                        var newScope = origScope.$new();

                        var clone = $compile(template)(newScope, function (clone) {
                            cleanupLastIncludeContent();
                            $animate.enter(clone, elem);
                        });

                        currentScope = newScope;
                        currentElement = clone;

                        currentScope.$emit('$includeContentLoaded', src);
                        scope.$emit('$includeContentRequested', src);
                    }

                    scope.$watch($sce.parseAsResourceUrl(attrs.uixTooltipTemplateTransclude), function (src) {
                        thisChangeId = ++changeCounter;
                        if (src) {
                            // ng1.2没有templateRequestProvider,用$templateCache+$http代替
                            // 先判断$templateCache中有没有,因为templateCache可以拿到ng-template脚本中的代码片段
                            // 如果没有的话,则使用$http获取,并把获取到的内容存放到templateCache中
                            var template = $templateCache.get(src);
                            if (angular.isDefined(template)) {
                                compileTemplate(template, src);
                            } else {
                                $http.get(src).then(function (response) {
                                    template = response.data;
                                    $templateCache.put(src,template);
                                    compileTemplate(template, src);
                                }, function () {
                                    if (thisChangeId === changeCounter) {
                                        cleanupLastIncludeContent();
                                        scope.$emit('$includeContentError', src);
                                    }
                                });
                            }
                        } else {
                            cleanupLastIncludeContent();
                        }
                    });

                    scope.$on('$destroy', cleanupLastIncludeContent);
                }
            };
        }])
    /**
     * Note that it's intentional that these classes are *not* applied through $animate.
     * They must not be animated as they're expected to be present on the tooltip on
     * initialization.
     */
    .directive('uixTooltipClasses', ['$uixPosition', function ($uixPosition) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                // need to set the primary position so the
                // arrow has space during position measure.
                // tooltip.positionTooltip()
                if (scope.placement) {
                    // // There are no top-left etc... classes
                    // // in TWBS, so we need the primary position.
                    var position = $uixPosition.parsePlacement(scope.placement);
                    element.addClass(position[0]);
                } else {
                    element.addClass('top');
                }

                if (scope.popupClass) {
                    element.addClass(scope.popupClass);
                }

                if (scope.animation()) {
                    element.addClass(attrs.tooltipAnimationClass);
                }
            }
        };
    }])

    .directive('uixTooltipPopup', function () {
        return {
            replace: true,
            scope: {content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&'},
            templateUrl: 'templates/tooltip-popup.html'
        };
    })

    .directive('uixTooltip', ['$uixTooltip', function ($uixTooltip) {
        return $uixTooltip('uixTooltip', 'tooltip', 'mouseenter');
    }])

    .directive('uixTooltipHtmlPopup', function () {
        return {
            replace: true,
            scope: {contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&'},
            templateUrl: 'templates/tooltip-html-popup.html'
        };
    })

    .directive('uixTooltipHtml', ['$uixTooltip', function ($uixTooltip) {
        return $uixTooltip('uixTooltipHtml', 'tooltip', 'mouseenter', {
            useContentExp: true
        });
    }])
    .directive('uixTooltipTemplatePopup', function () {
        return {
            replace: true,
            scope: {
                contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
                originScope: '&'
            },
            templateUrl: 'templates/tooltip-template-popup.html'
        };
    })

    .directive('uixTooltipTemplate', ['$uixTooltip', function ($uixTooltip) {
        return $uixTooltip('uixTooltipTemplate', 'tooltip', 'mouseenter', {
            useContentExp: true
        });
    }]);