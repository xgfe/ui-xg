/* eslint angular/timeout-service:0 */
describe('ui.xg.modal', function () {
    var $controllerProvider, $rootScope, $document, $compile, $templateCache, $timeout, $q;
    var $uixModal, $uixConfirm, $uixModalProvider;

    beforeEach(function () {
        module('ui.xg.modal');
        module('ui.xg.stackedMap');
        module('ui.xg.button');
        module('ui.xg.transition');
        module('button/templates/button.html');
        module('modal/templates/backdrop.html');
        module('modal/templates/window.html');
        module('modal/templates/confirm.html');
        module(function (_$controllerProvider_, _$uixModalProvider_) {
            $controllerProvider = _$controllerProvider_;
            $uixModalProvider = _$uixModalProvider_;
        });
        inject(function (_$rootScope_, _$document_, _$compile_, _$templateCache_,
                         _$timeout_, _$q_, _$uixModal_, _$uixConfirm_) {
            $rootScope = _$rootScope_;
            $document = _$document_;
            $compile = _$compile_;
            $templateCache = _$templateCache_;
            $timeout = _$timeout_;
            $q = _$q_;
            $uixModal = _$uixModal_;
            $uixConfirm = _$uixConfirm_;
        });
    });
    beforeEach(function () {
        jasmine.addMatchers({

            toBeResolvedWith: function () {
                return {
                    compare: function (actual, value) {
                        var resolved;
                        actual.then(function (result) {
                            resolved = result;
                        });
                        $rootScope.$digest();

                        var result = {
                            pass: resolved === value
                        };

                        if (result.pass) {
                            result.message = 'Expected "' + angular.mock.dump(actual) +
                                '" not to be resolved with "' + value + '".';
                        } else {
                            result.message = 'Expected "' + angular.mock.dump(actual) +
                                '" to be resolved with "' + value + '".';
                        }

                        return result;
                    }
                };
            },

            toBeRejectedWith: function () {
                return {
                    compare: function (actual, value) {

                        var rejected;
                        actual.then(angular.noop, function (reason) {
                            rejected = reason;
                        });
                        $rootScope.$digest();

                        var result = {
                            pass: rejected === value
                        };

                        if (result.pass) {
                            result.message = 'Expected "' + angular.mock.dump(actual) +
                                '" not to be rejected with "' + value + '".';
                        } else {
                            result.message = 'Expected "' + angular.mock.dump(actual) +
                                '" to be rejected with "' + value + '".';
                        }

                        return result;
                    }
                };
            },

            toHaveModalOpenWithContent: function () {
                return {
                    compare: function (actual, content, selector) {
                        var contentToCompare,
                            modalDomEls = actual.find('body > div.modal > div.modal-dialog > div.modal-content');
                        contentToCompare = selector ? modalDomEls.find(selector) : modalDomEls;

                        var result = {
                            pass: modalDomEls.css('display') === 'block' && contentToCompare.html() === content
                        };

                        if (result.pass) {
                            result.message = '"Expected "' + angular.mock.dump(modalDomEls) +
                                '" not to be open with "' + content + '".';
                        } else {
                            result.message = '"Expected "' + angular.mock.dump(modalDomEls) +
                                '" to be open with "' + content + '".';
                        }

                        return result;
                    }
                };
            },

            toHaveModalsOpen: function () {
                return {
                    compare: function (actual, expected) {
                        var modalDomEls = actual.find('body > div.modal');
                        var result = {
                            pass: modalDomEls.length === expected
                        };
                        if (result.pass) {
                            result.message = 'Expected "' + actual +
                                '" not to have ' + expected + ' modal' + (expected > 1 ? 's.' : '.');
                        } else {
                            result.message = 'Expected "' + actual +
                                '" to have ' + expected + ' modal' + (expected > 1 ? 's.' : '.');
                        }
                        return result;
                    }
                };
            },

            toHaveBackdrop: function () {
                return {
                    compare: function (actual) {
                        var backdropDomEls = actual.find('body > div.modal-backdrop');
                        var result = {
                            pass: backdropDomEls.length === 1
                        };

                        if (result.pass) {
                            result.message = 'Expected "' + angular.mock.dump(backdropDomEls) +
                                '" not to be a backdrop element".';
                        } else {
                            result.message = 'Expected "' + angular.mock.dump(backdropDomEls) +
                                '" to be a backdrop element".';
                        }

                        return result;
                    }
                };
            }
        });
    });
    function triggerKeyDown(element, keyCode) {
        var evt = $.Event('keydown');
        evt.which = keyCode;
        element.trigger(evt);
    }

    function waitForBackdropAnimation() {
        inject(function ($uixTransition) {
            if ($uixTransition.transitionEndEventName) {
                $timeout.flush();
            }
        });
    }

    function open(modalOptions) {
        var modal = $uixModal.open(modalOptions);
        $rootScope.$digest();
        return modal;
    }

    function confirm(confirmOptions) {
        var modal = $uixConfirm(confirmOptions);
        $rootScope.$digest();
        return modal;
    }

    function triggerConfirm() {
        var buttons = $document.find('div.modal-dialog button');
        buttons.eq(0).click();
        $timeout.flush();
        $rootScope.$digest();
    }

    function triggerCancel() {
        var buttons = $document.find('div.modal-dialog button');
        buttons.eq(1).click();
        $timeout.flush();
        $rootScope.$digest();
    }

    function close(modal, result) {
        modal.close(result);
        $timeout.flush();
        $rootScope.$digest();
    }

    function dismiss(modal, reason) {
        modal.dismiss(reason);
        $timeout.flush();
        $rootScope.$digest();
    }

    afterEach(function () {
        var body = $document.find('body');
        body.find('div.modal').remove();
        body.find('div.modal-backdrop').remove();
        body.removeClass('modal-open');
    });

    describe('basic scenarios with default options', function () {

        it('should open and dismiss a modal with a minimal set of options', function () {

            var modal = open({template: '<div>Content</div>'});

            expect($document).toHaveModalsOpen(1);
            expect($document).toHaveModalOpenWithContent('Content', 'div');
            expect($document).toHaveBackdrop();

            dismiss(modal, 'closing in test');

            expect($document).toHaveModalsOpen(0);

            waitForBackdropAnimation();
            expect($document).not.toHaveBackdrop();
        });

        it('should not throw an exception on a second dismiss', function () {

            var modal = open({template: '<div>Content</div>'});

            expect($document).toHaveModalsOpen(1);
            expect($document).toHaveModalOpenWithContent('Content', 'div');
            expect($document).toHaveBackdrop();

            dismiss(modal, 'closing in test');

            expect($document).toHaveModalsOpen(0);

            dismiss(modal, 'closing in test');
        });

        it('should not throw an exception on a second close', function () {

            var modal = open({template: '<div>Content</div>'});

            expect($document).toHaveModalsOpen(1);
            expect($document).toHaveModalOpenWithContent('Content', 'div');
            expect($document).toHaveBackdrop();

            close(modal, 'closing in test');

            expect($document).toHaveModalsOpen(0);

            close(modal, 'closing in test');
        });

        it('should open a modal from templateUrl', function () {

            $templateCache.put('content.html', '<div>URL Content</div>');
            var modal = open({templateUrl: 'content.html'});

            expect($document).toHaveModalsOpen(1);
            expect($document).toHaveModalOpenWithContent('URL Content', 'div');
            expect($document).toHaveBackdrop();

            dismiss(modal, 'closing in test');

            expect($document).toHaveModalsOpen(0);

            waitForBackdropAnimation();
            expect($document).not.toHaveBackdrop();
        });

        it('should support closing on ESC', function () {

            open({template: '<div>Content</div>'});
            expect($document).toHaveModalsOpen(1);

            triggerKeyDown($document, 27);
            $timeout.flush();
            $rootScope.$digest();

            expect($document).toHaveModalsOpen(0);
        });

        it('should support closing on backdrop click', function () {

            open({template: '<div>Content</div>'});
            expect($document).toHaveModalsOpen(1);

            $document.find('body > div.modal').click();
            $timeout.flush();
            $rootScope.$digest();

            expect($document).toHaveModalsOpen(0);
        });

        it('should resolve returned promise on close', function () {
            var modal = open({template: '<div>Content</div>'});
            close(modal, 'closed ok');

            expect(modal.result).toBeResolvedWith('closed ok');
        });

        it('should reject returned promise on dismiss', function () {

            var modal = open({template: '<div>Content</div>'});
            dismiss(modal, 'esc');

            expect(modal.result).toBeRejectedWith('esc');
        });

        it('should expose a promise linked to the templateUrl / resolve promises', function () {
            var modal = open({
                template: '<div>Content</div>', resolve: {
                    ok: function () {
                        return $q.when('ok');
                    }
                }
            });
            expect(modal.opened).toBeResolvedWith(true);
        });

        it('should expose a promise linked to the templateUrl / resolve promises and reject it if needed', function () {
            var modal = open({
                template: '<div>Content</div>', resolve: {
                    ok: function () {
                        return $q.reject('ko');
                    }
                }
            });
            expect(modal.opened).toBeRejectedWith(false);
        });

    });
    describe('default options can be changed in a provider', function () {

        it('should allow overriding default options in a provider', function () {

            $uixModalProvider.options.backdrop = false;
            open({template: '<div>Content</div>'});

            expect($document).toHaveModalOpenWithContent('Content', 'div');
            expect($document).not.toHaveBackdrop();
        });

        it('should accept new objects with default options in a provider', function () {

            $uixModalProvider.options = {
                backdrop: false
            };
            open({template: '<div>Content</div>'});

            expect($document).toHaveModalOpenWithContent('Content', 'div');
            expect($document).not.toHaveBackdrop();
        });
    });

    describe('option by option', function () {

        describe('template and templateUrl', function () {

            it('should throw an error if none of template and templateUrl are provided', function () {
                expect(function () {
                    open({});
                }).toThrow(new Error('One of template or templateUrl options is required.'));
            });

            it('should not fail if a templateUrl contains leading / trailing white spaces', function () {

                $templateCache.put('whitespace.html', '  <div>Whitespaces</div>  ');
                open({templateUrl: 'whitespace.html'});
                expect($document).toHaveModalOpenWithContent('Whitespaces', 'div');
            });

            it('should accept template as a function', function () {
                open({
                    template: function () {
                        return '<div>From a function</div>';
                    }
                });

                expect($document).toHaveModalOpenWithContent('From a function', 'div');
            });

            it('should not fail if a templateUrl as a function', function () {

                $templateCache.put('whitespace.html', '  <div>Whitespaces</div>  ');
                open({
                    templateUrl: function () {
                        return 'whitespace.html';
                    }
                });
                expect($document).toHaveModalOpenWithContent('Whitespaces', 'div');
            });

        });

        describe('controller', function () {

            it('should accept controllers and inject modal instances', function () {
                var TestCtrl = function ($scope, $uixModalInstance) {
                    $scope.fromCtrl = 'Content from ctrl';
                    $scope.isModalInstance = angular.isObject($uixModalInstance) &&
                        angular.isFunction($uixModalInstance.close);
                };

                open({template: '<div>{{fromCtrl}} {{isModalInstance}}</div>', controller: TestCtrl});
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });

            it('should accept controllerAs alias', function () {
                $controllerProvider.register('TestCtrl', function ($uixModalInstance) {
                    this.fromCtrl = 'Content from ctrl';
                    this.isModalInstance = angular.isObject($uixModalInstance) &&
                        angular.isFunction($uixModalInstance.close);
                });

                open({
                    template: '<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>',
                    controller: 'TestCtrl as test'
                });
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });

            it('should respect the controllerAs property as an alternative for the controller-as syntax', function () {
                $controllerProvider.register('TestCtrl', function ($uixModalInstance) {
                    this.fromCtrl = 'Content from ctrl';
                    this.isModalInstance = angular.isObject($uixModalInstance) &&
                        angular.isFunction($uixModalInstance.close);
                });

                open({
                    template: '<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>',
                    controller: 'TestCtrl',
                    controllerAs: 'test'
                });
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });

            it('should allow defining in-place controller-as controllers', function () {
                open({
                    template: '<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>',
                    controller: function ($uixModalInstance) {
                        this.fromCtrl = 'Content from ctrl';
                        this.isModalInstance = angular.isObject($uixModalInstance) &&
                            angular.isFunction($uixModalInstance.close);
                    },
                    controllerAs: 'test'
                });
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });
        });

        describe('resolve', function () {

            var ExposeCtrl = function ($scope, value) {
                $scope.value = value;
            };

            function modalDefinition(template, resolve) {
                return {
                    template: template,
                    controller: ExposeCtrl,
                    resolve: resolve
                };
            }

            it('should resolve simple values', function () {
                open(modalDefinition('<div>{{value}}</div>', {
                    value: function () {
                        return 'Content from resolve';
                    }
                }));

                expect($document).toHaveModalOpenWithContent('Content from resolve', 'div');
            });

            it('should delay showing modal if one of the resolves is a promise', function () {

                open(modalDefinition('<div>{{value}}</div>', {
                    value: function () {
                        return $timeout(function () {
                            return 'Promise';
                        }, 100);
                    }
                }));
                expect($document).toHaveModalsOpen(0);

                $timeout.flush();
                expect($document).toHaveModalOpenWithContent('Promise', 'div');
            });

            it('should not open dialog (and reject returned promise) if one of resolve fails', function () {

                var deferred = $q.defer();

                var modal = open(modalDefinition('<div>{{value}}</div>', {
                    value: function () {
                        return deferred.promise;
                    }
                }));
                expect($document).toHaveModalsOpen(0);

                deferred.reject('error in test');
                $rootScope.$digest();

                expect($document).toHaveModalsOpen(0);
                expect(modal.result).toBeRejectedWith('error in test');
            });

            it('should support injection with minification-safe syntax in resolve functions', function () {

                open(modalDefinition('<div>{{value.id}}</div>', {
                    value: ['$locale', function (evt) {
                        return evt;
                    }]
                }));

                expect($document).toHaveModalOpenWithContent('en-us', 'div');
            });

            //TODO: resolves with dependency injection - do we want to support them?
        });

        describe('scope', function () {

            it('should use custom scope if provided', function () {
                var $scope = $rootScope.$new();
                $scope.fromScope = 'Content from custom scope';
                open({
                    template: '<div>{{fromScope}}</div>',
                    scope: $scope
                });
                expect($document).toHaveModalOpenWithContent('Content from custom scope', 'div');
            });

            it('should create and use child of $rootScope if custom scope not provided', function () {

                $rootScope.fromScope = 'Content from root scope';
                open({
                    template: '<div>{{fromScope}}</div>'
                });
                expect($document).toHaveModalOpenWithContent('Content from root scope', 'div');
            });
        });

        describe('keyboard', function () {

            it('should not close modals if keyboard option is set to false', function () {
                open({
                    template: '<div>No keyboard</div>',
                    keyboard: false
                });

                expect($document).toHaveModalsOpen(1);

                triggerKeyDown($document, 27);
                $rootScope.$digest();

                expect($document).toHaveModalsOpen(1);
            });
        });

        describe('backdrop', function () {

            it('should not have any backdrop element if backdrop set to false', function () {
                var modal = open({
                    template: '<div>No backdrop</div>',
                    backdrop: false
                });
                expect($document).toHaveModalOpenWithContent('No backdrop', 'div');
                expect($document).not.toHaveBackdrop();

                dismiss(modal);
                expect($document).toHaveModalsOpen(0);
            });

            it('should not close modal on backdrop click if backdrop is specified as "static"', function () {
                open({
                    template: '<div>Static backdrop</div>',
                    backdrop: 'static'
                });

                $document.find('body > div.modal-backdrop').click();
                $rootScope.$digest();

                expect($document).toHaveModalOpenWithContent('Static backdrop', 'div');
                expect($document).toHaveBackdrop();
            });

            it('should animate backdrop on each modal opening', function () {

                var modal = open({template: '<div>With backdrop</div>'});
                var backdropEl = $document.find('body > div.modal-backdrop');
                expect(backdropEl).not.toHaveClass('in');

                $timeout.flush();
                expect(backdropEl).toHaveClass('in');

                dismiss(modal);
                waitForBackdropAnimation();

                modal = open({template: '<div>With backdrop</div>'});
                backdropEl = $document.find('body > div.modal-backdrop');
                expect(backdropEl).not.toHaveClass('in');

            });

            describe('custom backdrop classes', function () {

                it('should support additional backdrop class as string', function () {
                    open({
                        template: '<div>With custom backdrop class</div>',
                        backdropClass: 'additional'
                    });

                    expect($document.find('div.modal-backdrop')).toHaveClass('additional');
                });
            });
        });

        describe('custom window classes', function () {

            it('should support additional window class as string', function () {
                open({
                    template: '<div>With custom window class</div>',
                    windowClass: 'additional'
                });

                expect($document.find('div.modal')).toHaveClass('additional');
            });
        });

        describe('size', function () {

            it('should support creating small modal dialogs', function () {
                open({
                    template: '<div>Small modal dialog</div>',
                    size: 'sm'
                });

                expect($document.find('div.modal-dialog')).toHaveClass('modal-sm');
            });

            it('should support creating large modal dialogs', function () {
                open({
                    template: '<div>Large modal dialog</div>',
                    size: 'lg'
                });

                expect($document.find('div.modal-dialog')).toHaveClass('modal-lg');
            });
        });
    });

    describe('multiple modals', function () {

        it('it should allow opening of multiple modals', function () {

            var modal1 = open({template: '<div>Modal1</div>'});
            var modal2 = open({template: '<div>Modal2</div>'});
            expect($document).toHaveModalsOpen(2);

            dismiss(modal2);
            expect($document).toHaveModalsOpen(1);
            expect($document).toHaveModalOpenWithContent('Modal1', 'div');

            dismiss(modal1);
            expect($document).toHaveModalsOpen(0);
        });

        it('should not close any modals on ESC if the topmost one does not allow it', function () {

            open({template: '<div>Modal1</div>'});
            open({template: '<div>Modal2</div>', keyboard: false});

            triggerKeyDown($document, 27);
            $rootScope.$digest();

            expect($document).toHaveModalsOpen(2);
        });

        it('should not close any modals on click if a topmost modal does not have backdrop', function () {

            open({template: '<div>Modal1</div>'});
            open({template: '<div>Modal2</div>', backdrop: false});

            $document.find('body > div.modal-backdrop').click();
            $rootScope.$digest();

            expect($document).toHaveModalsOpen(2);
        });

        it('multiple modals should not interfere with default options', function () {

            open({template: '<div>Modal1</div>', backdrop: false});
            open({template: '<div>Modal2</div>'});
            $rootScope.$digest();

            expect($document).toHaveBackdrop();
        });

        it('should add "modal-open" class when a modal gets opened', function () {

            var body = $document.find('body');
            expect(body).not.toHaveClass('modal-open');

            var modal1 = open({template: '<div>Content1</div>'});
            expect(body).toHaveClass('modal-open');

            var modal2 = open({template: '<div>Content1</div>'});
            expect(body).toHaveClass('modal-open');

            dismiss(modal1);
            expect(body).toHaveClass('modal-open');

            dismiss(modal2);
            expect(body).not.toHaveClass('modal-open');
        });
        it('should close modal when trigger location change event', function () {
            open({template: '<div>Modal</div>'});
            expect($document).toHaveModalsOpen(1);
            $rootScope.$broadcast('$locationChangeSuccess');
            $timeout.flush();
            $rootScope.$digest();
            expect($document).toHaveModalsOpen(0);
        });
        it('should close all modal when trigger location change event', function () {
            open({template: '<div>Modal1</div>'});
            open({template: '<div>Modal2</div>'});
            open({template: '<div>Modal3</div>'});
            expect($document).toHaveModalsOpen(3);
            $rootScope.$broadcast('$locationChangeSuccess');
            $timeout.flush();
            $rootScope.$digest();
            expect($document).toHaveModalsOpen(0);
        });
    });

    describe('modal window', function () {

        it('should not use transclusion scope for modals content - issue 2110', function () {
            $compile('<div uix-modal-window><span ng-init="foo=true"></span></div>')($rootScope);
            $rootScope.$digest();

            expect($rootScope.foo).toBeTruthy();
        });

        it('should support custom CSS classes as string', function () {
            var windowEl = $compile('<div uix-modal-window window-class="test foo">content</div>')($rootScope);
            $rootScope.$digest();

            expect(windowEl).toHaveClass('test');
            expect(windowEl).toHaveClass('foo');
        });

    });

    describe('confirm modal', function () {
        describe('confirm by factory', function () {
            it('should show a confirm modal', function () {
                var text = '确定取消吗?';
                confirm({
                    content: text,
                    confirm: function () {
                        return true;
                    }
                });
                expect($document.find('div.modal-dialog .modal-body').text()).toEqual(text);
            });
            it('confirm modal should be small size', function () {
                var text = '确定取消吗?';
                confirm({
                    content: text,
                    confirm: function () {
                        return true;
                    }
                });
                expect($document.find('div.modal-dialog')).toHaveClass('modal-sm');
            });
            it('confirm modal should be small size', function () {
                var text = '确定取消吗?';
                confirm({
                    content: text,
                    confirm: function () {
                        return true;
                    }
                });
                expect($document.find('div.modal-dialog')).toHaveClass('modal-sm');
            });
            it('should close when no confirm and cancel options', function () {
                confirm({
                    content: '确定取消吗?'
                });
                expect($document.find('div.modal-dialog').length).toBe(1);
                triggerConfirm();
                expect($document.find('div.modal-dialog').length).toBe(0);
                confirm({
                    content: '确定取消吗?'
                });
                expect($document.find('div.modal-dialog').length).toBe(1);
                triggerCancel();
                expect($document.find('div.modal-dialog').length).toBe(0);
            });
            it('should not close after 100ms', function () {
                confirm({
                    content: '确定取消吗?',
                    confirm: function () {
                        return $timeout(function () {
                            return false;
                        }, 100);
                    }
                });
                expect($document.find('div.modal-dialog').length).toBe(1);
                triggerConfirm();
                expect($document.find('div.modal-dialog').length).toBe(1);
            });
        });
        describe('confirm directive', function () {
            it('should show confirm modal', function () {
                var text = '确定取消吗?';
                var modalEle = $compile('<div id="confirmModal" uix-confirm="' + text + '"></div>')($rootScope);
                $rootScope.$digest();
                modalEle.click();
                $rootScope.$digest();

                expect($document.find('div.modal-dialog .modal-body').text()).toEqual(text);
            });
            it('should auto close', function () {
                var text = '确定取消吗?';
                var modalEle = $compile('<div id="confirmModal" uix-confirm="' + text + '"></div>')($rootScope);
                $rootScope.$digest();
                modalEle.click();
                $rootScope.$digest();
                expect($document.find('div.modal-dialog').length).toBe(1);
                triggerConfirm();
                expect($document.find('div.modal-dialog').length).toBe(0);
                modalEle.click();
                $rootScope.$digest();
                expect($document.find('div.modal-dialog').length).toBe(1);
                triggerCancel();
                expect($document.find('div.modal-dialog').length).toBe(0);
            });
            it('confirm attribute', function () {
                var text = '确定取消吗?';
                $rootScope.onConfirm = function () {
                    return $timeout(function () {
                        return false;
                    }, 100);
                };
                var modalEle = $compile('<div id="confirmModal" confirm="onConfirm()" uix-confirm="' + text + '"></div>')($rootScope);
                $rootScope.$digest();
                modalEle.click();
                $rootScope.$digest();
                expect($document.find('div.modal-dialog').length).toBe(1);
                triggerConfirm();
                expect($document.find('div.modal-dialog').length).toBe(1);
            });
            it('cancel attribute', function (done) {
                var text = '确定取消吗?';
                $rootScope.onCancel = function (modalInstance) {
                    $timeout(function () {
                        modalInstance.close();
                    }, 200);
                };
                var modalEle = $compile('<div id="confirmModal" cancel="onCancel($modal)" uix-confirm="' + text + '"></div>')($rootScope);
                $rootScope.$digest();
                modalEle.click();
                $rootScope.$digest();
                expect($document.find('div.modal-dialog').length).toBe(1);
                triggerCancel();
                expect($document.find('div.modal-dialog').length).toBe(1);
                setTimeout(function () {
                    $timeout.flush();
                    expect($document.find('div.modal-dialog').length).toBe(0);
                    done();
                }, 300);
            });
        });
    });
});
