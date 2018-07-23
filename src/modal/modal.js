/**
 * modal
 * modal directive
 * 不太会写,基本是照搬的 ui-bootstrap v0.12.1 https://github.com/angular-ui/bootstrap/blob/0.12.1/src/modal/modal.js
 * 先抄着,后面再写吧,心好累
 *
 * Author: yjy972080142@gmail.com
 * Date:2016-03-23
 */
angular.module('ui.xg.modal', ['ui.xg.stackedMap', 'ui.xg.transition', 'ui.xg.button'])
/**
 * A helper directive for the $uixModal service. It creates a backdrop element.
 */
    .directive('uixModalBackdrop', ['$timeout', function ($timeout) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'templates/backdrop.html',
            link: function (scope, element, attrs) {
                scope.backdropClass = attrs.backdropClass || '';

                scope.animate = false;

                //trigger CSS transitions
                $timeout(function () {
                    scope.animate = true;
                });
            }
        };
    }])

    .directive('uixModalWindow', ['$uixModalStack', '$timeout', function ($uixModalStack, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                index: '@',
                animate: '='
            },
            replace: true,
            transclude: true,
            templateUrl: 'templates/window.html',
            link: function (scope, element, attrs) {
                element.addClass(attrs.windowClass || '');
                scope.size = attrs.size;

                $timeout(function () {
                    // trigger CSS transitions
                    scope.animate = true;

                    /**
                     * Auto-focusing of a freshly-opened modal element causes any child elements
                     * with the autofocus attribute to lose focus. This is an issue on touch
                     * based devices which will show and then hide the onscreen keyboard.
                     * Attempts to refocus the autofocus element via JavaScript will not reopen
                     * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
                     * the modal element if the modal does not contain an autofocus element.
                     */
                    if (!element[0].querySelectorAll('[autofocus]').length) {
                        element[0].focus();
                    }
                });

                scope.close = function (evt) {
                    var modal = $uixModalStack.getTop();
                    if (modal && modal.value.backdrop && modal.value.backdrop !== 'static' &&
                        (evt.target === evt.currentTarget)) {
                        evt.preventDefault();
                        evt.stopPropagation();
                        $uixModalStack.dismiss(modal.key, 'backdrop click');
                    }
                };
            }
        };
    }]) /// TODO 修改变量

    .directive('uixModalTransclude', function () {
        return {
            link: function ($scope, $element, $attrs, controller, $transclude) {
                // TODO 这个$transclude是自动注入的吗?
                $transclude($scope.$parent, function (clone) {
                    $element.empty();
                    $element.append(clone);
                });
            }
        };
    })

    .factory('$uixModalStack', ['$uixTransition', '$timeout', '$document', '$compile', '$rootScope', '$uixStackedMap',
        function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {

            var OPENED_MODAL_CLASS = 'modal-open';

            var backdropDomEl, backdropScope;
            var openedWindows = $$stackedMap.createNew();
            var $uixModalStack = {};

            function backdropIndex() {
                var topBackdropIndex = -1;
                var opened = openedWindows.keys();
                for (var i = 0; i < opened.length; i++) {
                    if (openedWindows.get(opened[i]).value.backdrop) {
                        topBackdropIndex = i;
                    }
                }
                return topBackdropIndex;
            }

            $rootScope.$watch(backdropIndex, function (newBackdropIndex) {
                if (backdropScope) {
                    backdropScope.index = newBackdropIndex;
                }
            });

            function removeModalWindow(modalInstance) {

                var body = $document.find('body').eq(0);
                var modalWindow = openedWindows.get(modalInstance).value;
                //clean up the stack
                openedWindows.remove(modalInstance);

                //remove window DOM element
                removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function () {
                    modalWindow.modalScope.$destroy();
                    body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
                    checkRemoveBackdrop();
                });
            }

            function checkRemoveBackdrop() {
                //remove backdrop if no longer needed
                if (backdropDomEl && backdropIndex() === -1) {
                    var backdropScopeRef = backdropScope;
                    removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
                        backdropScopeRef.$destroy();
                        backdropScopeRef = null;
                    });
                    backdropDomEl = null;
                    backdropScope = null;
                }
            }

            function removeAfterAnimate(domEl, scope, emulateTime, done) {
                // Closing animation
                scope.animate = false;

                var transitionEndEventName = $transition.transitionEndEventName;
                if (transitionEndEventName) {
                    // transition out
                    var timeout = $timeout(afterAnimating, emulateTime);

                    domEl.bind(transitionEndEventName, function () {
                        $timeout.cancel(timeout);
                        afterAnimating();
                        scope.$apply();
                    });
                } else {
                    // Ensure this call is async
                    $timeout(afterAnimating);
                }

                function afterAnimating() {
                    if (afterAnimating.done) {
                        return;
                    }
                    afterAnimating.done = true;

                    domEl.remove();
                    if (done) {
                        done();
                    }
                }
            }

            $document.bind('keydown', function (evt) {
                var modal;
                // 点击ESC关闭
                if (evt.which === 27) {
                    modal = openedWindows.top();
                    if (modal && modal.value.keyboard) {
                        evt.preventDefault();
                        $rootScope.$apply(function () {
                            $uixModalStack.dismiss(modal.key, 'escape key press');
                        });
                    }
                }
            });

            $uixModalStack.open = function (modalInstance, modal) {

                openedWindows.add(modalInstance, {
                    deferred: modal.deferred,
                    modalScope: modal.scope,
                    backdrop: modal.backdrop,
                    keyboard: modal.keyboard
                });

                var body = $document.find('body').eq(0),
                    currBackdropIndex = backdropIndex();

                // 保证只会插入一次蒙版
                if (currBackdropIndex >= 0 && !backdropDomEl) {
                    backdropScope = $rootScope.$new(true);
                    backdropScope.index = currBackdropIndex;
                    var angularBackgroundDomEl = angular.element('<div uix-modal-backdrop></div>');
                    angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
                    backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
                    body.append(backdropDomEl);
                }

                var angularDomEl = angular.element('<div uix-modal-window></div>');
                angularDomEl.attr({
                    'window-class': modal.windowClass,
                    'size': modal.size,
                    'index': openedWindows.length() - 1,
                    'animate': 'animate'
                }).html(modal.content);
                var modalDomEl = $compile(angularDomEl)(modal.scope);
                openedWindows.top().value.modalDomEl = modalDomEl;
                body.append(modalDomEl);
                body.addClass(OPENED_MODAL_CLASS);
            };

            $uixModalStack.close = function (modalInstance, result) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.resolve(result);
                    removeModalWindow(modalInstance);
                }
            };

            $uixModalStack.dismiss = function (modalInstance, reason) {
                var modalWindow = openedWindows.get(modalInstance);
                if (modalWindow) {
                    modalWindow.value.deferred.reject(reason);
                    removeModalWindow(modalInstance);
                }
            };

            $uixModalStack.dismissAll = function (reason) {
                var topModal = this.getTop();
                while (topModal) {
                    this.dismiss(topModal.key, reason);
                    topModal = this.getTop();
                }
            };

            $uixModalStack.getTop = function () {
                return openedWindows.top();
            };

            return $uixModalStack;
        }])

    .provider('$uixModal', function () {
        var self = this;
        this.options = {
            backdrop: true, //can be also false or 'static'
            keyboard: true
        };
        this.$get = ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$uixModalStack',
            function ($injector, $rootScope, $q, $http, $templateCache, $controller, $uixModalStack) {
                /**
                 * 获取模板
                 * @param options - 配置信息
                 * @returns {*|Promise}
                 */
                function getTemplatePromise(options) {
                    return options.template ? $q.when(options.template)
                        : $http.get(
                            angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl,
                            {cache: $templateCache}
                        ).then(function (result) {
                            return result.data;
                        });
                }

                /**
                 * TODO 不明白是干啥的,好像是获取modalInstance依赖的
                 * @param resolves
                 * @returns {Array}
                 */
                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function (value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        }
                    });
                    return promisesArr;
                }

                return {
                    open: function (modalOptions) {
                        var modalResultDeferred = $q.defer();
                        var modalOpenedDeferred = $q.defer();

                        //prepare an instance of a modal to be injected into controllers and returned to a caller
                        var modalInstance = {
                            result: modalResultDeferred.promise,
                            opened: modalOpenedDeferred.promise,
                            close: function (result) {
                                $uixModalStack.close(modalInstance, result);
                            },
                            dismiss: function (reason) {
                                $uixModalStack.dismiss(modalInstance, reason);
                            }
                        };

                        //merge and clean up options
                        modalOptions = angular.extend({}, self.options, modalOptions);
                        modalOptions.resolve = modalOptions.resolve || {};

                        //verify options
                        if (!modalOptions.template && !modalOptions.templateUrl) {
                            throw new Error('One of template or templateUrl options is required.');
                        }

                        var templateAndResolvePromise =
                            $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

                        templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
                            var modalScope = (modalOptions.scope || $rootScope).$new();
                            modalScope.$close = modalInstance.close;
                            modalScope.$dismiss = modalInstance.dismiss;

                            var ctrlInstance, ctrlLocals = {};
                            var resolveIter = 1;

                            //controllers
                            if (modalOptions.controller) {
                                // 使用$controller创建controller并注入$scope,$uixModalInstance和resolve
                                ctrlLocals.$scope = modalScope;
                                ctrlLocals.$uixModalInstance = modalInstance;
                                angular.forEach(modalOptions.resolve, function (value, key) {
                                    ctrlLocals[key] = tplAndVars[resolveIter++];
                                });

                                ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                                if (modalOptions.controllerAs) {
                                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                                }
                            }
                            $uixModalStack.open(modalInstance, {
                                scope: modalScope,
                                deferred: modalResultDeferred,
                                content: tplAndVars[0],
                                backdrop: modalOptions.backdrop,
                                keyboard: modalOptions.keyboard,
                                backdropClass: modalOptions.backdropClass,
                                windowClass: modalOptions.windowClass,
                                size: modalOptions.size
                            });
                            // close all modal when location changed
                            var locationChanged = $rootScope.$on('$locationChangeSuccess', function () {
                                $uixModalStack.dismissAll();
                            });
                            modalScope.$on('$destroy', locationChanged);

                        }, function resolveError(reason) {
                            modalResultDeferred.reject(reason);
                        });

                        templateAndResolvePromise.then(function () {
                            modalOpenedDeferred.resolve(true);
                        }, function () {
                            modalOpenedDeferred.reject(false);
                        });

                        return modalInstance;
                    }
                };
            }];
    })
    .factory('$uixConfirm', ['$uixModal', '$q', function ($uixModal, $q) {
        return function (opt) {
            opt = opt || {};
            return $uixModal.open({
                templateUrl: 'templates/confirm.html',
                size: 'sm',
                controller: ['$scope', '$uixModalInstance', function ($scope, $uixModalInstance) {
                    $scope.modalBodyText = opt.content || '';
                    $scope.confirmBtnText = opt.confirmBtnText || '确定';
                    $scope.cancelBtnText = opt.cancelBtnText || '取消';
                    var okCallback = opt.confirm ||
                        function () {
                            return true;
                        };
                    $scope.ok = function () {
                        if ($scope.loading) {
                            return;
                        }
                        var handler = okCallback();
                        $scope.loading = true;
                        $q.when(handler).then(function (success) {
                            if (success) {
                                $uixModalInstance.close();
                            } else {
                                $scope.loading = false;
                            }
                        }, function () {
                            $scope.loading = false;
                        });
                    };
                    $scope.cancel = opt.cancel ||
                        function () {
                            $uixModalInstance.dismiss();
                        };
                }]
            });
        };
    }])
    .directive('uixConfirm', ['$uixConfirm', function ($uixConfirm) {
        return {
            restrict: 'EA',
            scope: {
                content: '@uixConfirm',
                confirm: '&',
                cancel: '&',
                confirmBtnText: '@',
                cancelBtnText: '@'
            },
            replace: true,
            link: function (scope, element, attrs) {
                var content = scope.content || '';
                element.on('click', function () {
                    var modalInstance = $uixConfirm({
                        content: content,
                        confirmBtnText: scope.confirmBtnText,
                        cancelBtnText: scope.cancelBtnText,
                        confirm: function () {
                            return attrs.confirm ? scope.confirm({
                                $modal: modalInstance
                            }) : true;
                        },
                        cancel: function () {
                            if (attrs.cancel) {
                                scope.cancel({
                                    $modal: modalInstance
                                });
                            } else {
                                modalInstance.dismiss('cancel');
                            }
                        }
                    });
                });
            }
        };
    }]);

