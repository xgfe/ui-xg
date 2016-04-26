describe('ui.fugu.modal', function () {
    var $controllerProvider, $rootScope, $document, $compile, $templateCache, $timeout, $q,stackedMap;
    var $fgModal, $fgModalProvider;

    beforeEach(function () {
        module('ui.fugu.modal');
        module('modal/templates/backdrop.html');
        module('modal/templates/window.html');
        module(function(_$controllerProvider_, _$fgModalProvider_){
            $controllerProvider = _$controllerProvider_;
            $fgModalProvider = _$fgModalProvider_;
        });
        inject(function (_$rootScope_, _$document_, _$compile_, _$templateCache_, _$timeout_, _$q_, _$fgModal_,$$stackedMap) {
            $rootScope = _$rootScope_;
            $document = _$document_;
            $compile = _$compile_;
            $templateCache = _$templateCache_;
            $timeout = _$timeout_;
            $q = _$q_;
            $fgModal = _$fgModal_;
            stackedMap = $$stackedMap.createNew();
        })
    });
    beforeEach(function () {
        jasmine.addMatchers({

            toBeResolvedWith: function() {
                return {
                    compare: function(actual, value) {
                        var resolved;
                        actual.then(function(result){
                            resolved = result;
                        });
                        $rootScope.$digest();

                        var result = {
                            pass: resolved === value
                        };

                        if (result.pass) {
                            result.message = 'Expected "' + angular.mock.dump(actual) + '" not to be resolved with "' + value + '".';
                        } else {
                            result.message = 'Expected "' + angular.mock.dump(actual) + '" to be resolved with "' + value + '".';
                        }

                        return result;
                    }
                };
            },

            toBeRejectedWith: function() {
                return {
                    compare: function(actual, value) {

                        var rejected;
                        actual.then(angular.noop, function(reason){
                            rejected = reason;
                        });
                        $rootScope.$digest();

                        var result = {
                            pass: rejected === value
                        };

                        if (result.pass) {
                            result.message = 'Expected "' + angular.mock.dump(actual) + '" not to be rejected with "' + value + '".';
                        } else {
                            result.message = 'Expected "' + angular.mock.dump(actual) + '" to be rejected with "' + value + '".';
                        }

                        return result;
                    }
                };
            },

            toHaveModalOpenWithContent: function() {
                return {
                    compare: function(actual, content, selector) {
                        var contentToCompare, modalDomEls = actual.find('body > div.modal > div.modal-dialog > div.modal-content');
                        contentToCompare = selector ? modalDomEls.find(selector) : modalDomEls;

                        var result = {
                            pass: modalDomEls.css('display') === 'block' &&  contentToCompare.html() == content
                        };

                        if (result.pass) {
                            result.message = '"Expected "' + angular.mock.dump(modalDomEls) + '" not to be open with "' + content + '".';
                        } else {
                            result.message = '"Expected "' + angular.mock.dump(modalDomEls) + '" to be open with "' + content + '".';
                        }

                        return result;
                    }
                };
            },

            toHaveModalsOpen: function() {
                return {
                    compare: function(actual, expected) {
                        var modalDomEls = actual.find('body > div.modal');
                        var result = {
                            pass: modalDomEls.length === expected
                        };
                        if (result.pass) {
                            result.message = 'Expected "' + actual + '" not to have ' + expected + ' modal'+(expected>1?'s.':'.');
                        } else {
                            result.message = 'Expected "' + actual + '" to have ' + expected + ' modal'+(expected>1?'s.':'.');
                        }
                        return result;
                    }
                };
            },

            toHaveBackdrop: function() {
                return {
                    compare: function (actual) {
                        var backdropDomEls = actual.find('body > div.modal-backdrop');
                        var result = {
                            pass: backdropDomEls.length === 1
                        };

                        if (result.pass) {
                            result.message = 'Expected "' + angular.mock.dump(backdropDomEls) + '" not to be a backdrop element".'
                        } else {
                            result.message = 'Expected "' + angular.mock.dump(backdropDomEls) + '" to be a backdrop element".'
                        }

                        return result;
                    }
                };
            }
        });
    });
    function triggerKeyDown(element, keyCode) {
        var e = $.Event('keydown');
        e.which = keyCode;
        element.trigger(e);
    }

    function waitForBackdropAnimation() {
        inject(function ($transition) {
            if ($transition.transitionEndEventName) {
                $timeout.flush();
            }
        });
    }
    function open(modalOptions) {
        var modal = $fgModal.open(modalOptions);
        $rootScope.$digest();
        return modal;
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
            var modal = open({template: '<div>Content</div>', resolve: {
                    ok: function() {return $q.when('ok');}
                }}
            );
            expect(modal.opened).toBeResolvedWith(true);
        });

        it('should expose a promise linked to the templateUrl / resolve promises and reject it if needed', function () {
            var modal = open({template: '<div>Content</div>', resolve: {
                    ok: function() {return $q.reject('ko');}
                }}
            );
            expect(modal.opened).toBeRejectedWith(false);
        });

    });
    describe('default options can be changed in a provider', function () {

        it('should allow overriding default options in a provider', function () {

            $fgModalProvider.options.backdrop = false;
            open({template: '<div>Content</div>'});

            expect($document).toHaveModalOpenWithContent('Content', 'div');
            expect($document).not.toHaveBackdrop();
        });

        it('should accept new objects with default options in a provider', function () {

            $fgModalProvider.options = {
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
                expect(function(){
                    open({});
                }).toThrow(new Error('One of template or templateUrl options is required.'));
            });

            it('should not fail if a templateUrl contains leading / trailing white spaces', function () {

                $templateCache.put('whitespace.html', '  <div>Whitespaces</div>  ');
                open({templateUrl: 'whitespace.html'});
                expect($document).toHaveModalOpenWithContent('Whitespaces', 'div');
            });

            it('should accept template as a function', function () {
                open({template: function() {
                    return '<div>From a function</div>';
                }});

                expect($document).toHaveModalOpenWithContent('From a function', 'div');
            });

            it('should not fail if a templateUrl as a function', function () {

                $templateCache.put('whitespace.html', '  <div>Whitespaces</div>  ');
                open({templateUrl: function(){
                    return 'whitespace.html';
                }});
                expect($document).toHaveModalOpenWithContent('Whitespaces', 'div');
            });

        });

        describe('controller', function () {

            it('should accept controllers and inject modal instances', function () {
                var TestCtrl = function($scope, $fgModalInstance) {
                    $scope.fromCtrl = 'Content from ctrl';
                    $scope.isModalInstance = angular.isObject($fgModalInstance) && angular.isFunction($fgModalInstance.close);
                };

                open({template: '<div>{{fromCtrl}} {{isModalInstance}}</div>', controller: TestCtrl});
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });

            it('should accept controllerAs alias', function () {
                $controllerProvider.register('TestCtrl', function($fgModalInstance) {
                    this.fromCtrl = 'Content from ctrl';
                    this.isModalInstance = angular.isObject($fgModalInstance) && angular.isFunction($fgModalInstance.close);
                });

                open({template: '<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>', controller: 'TestCtrl as test'});
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });

            it('should respect the controllerAs property as an alternative for the controller-as syntax', function () {
                $controllerProvider.register('TestCtrl', function($fgModalInstance) {
                    this.fromCtrl = 'Content from ctrl';
                    this.isModalInstance = angular.isObject($fgModalInstance) && angular.isFunction($fgModalInstance.close);
                });

                open({template: '<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>', controller: 'TestCtrl', controllerAs: 'test'});
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });

            it('should allow defining in-place controller-as controllers', function () {
                open({template: '<div>{{test.fromCtrl}} {{test.isModalInstance}}</div>', controller: function($fgModalInstance) {
                    this.fromCtrl = 'Content from ctrl';
                    this.isModalInstance = angular.isObject($fgModalInstance) && angular.isFunction($fgModalInstance.close);
                }, controllerAs: 'test'});
                expect($document).toHaveModalOpenWithContent('Content from ctrl true', 'div');
            });
        });

        describe('resolve', function () {

            var ExposeCtrl = function($scope, value) {
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
                        return $timeout(function(){ return 'Promise'; }, 100);
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
                    value: ['$locale', function (e) {
                        return e;
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
                var modal =open({
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

                var modal = open({ template: '<div>With backdrop</div>' });
                var backdropEl = $document.find('body > div.modal-backdrop');
                expect(backdropEl).not.toHaveClass('in');

                $timeout.flush();
                expect(backdropEl).toHaveClass('in');

                dismiss(modal);
                waitForBackdropAnimation();

                modal = open({ template: '<div>With backdrop</div>' });
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
    });

    describe('modal window', function () {

        it('should not use transclusion scope for modals content - issue 2110', function () {
            $compile('<div fugu-modal-window><span ng-init="foo=true"></span></div>')($rootScope);
            $rootScope.$digest();

            expect($rootScope.foo).toBeTruthy();
        });

        it('should support custom CSS classes as string', function () {
            var windowEl = $compile('<div fugu-modal-window window-class="test foo">content</div>')($rootScope);
            $rootScope.$digest();

            expect(windowEl).toHaveClass('test');
            expect(windowEl).toHaveClass('foo');
        });

    });
    describe('stacked map', function () {

        it('should add and remove objects by key', function () {

            stackedMap.add('foo', 'foo_value');
            expect(stackedMap.length()).toEqual(1);
            expect(stackedMap.get('foo').key).toEqual('foo');
            expect(stackedMap.get('foo').value).toEqual('foo_value');

            stackedMap.remove('foo');
            expect(stackedMap.length()).toEqual(0);
            expect(stackedMap.get('foo')).toBeUndefined();
        });

        it('should support listing keys', function () {
            stackedMap.add('foo', 'foo_value');
            stackedMap.add('bar', 'bar_value');

            expect(stackedMap.keys()).toEqual(['foo', 'bar']);
        });

        it('should get topmost element', function () {

            stackedMap.add('foo', 'foo_value');
            stackedMap.add('bar', 'bar_value');
            expect(stackedMap.length()).toEqual(2);

            expect(stackedMap.top().key).toEqual('bar');
            expect(stackedMap.length()).toEqual(2);
        });

        it('should remove topmost element', function () {

            stackedMap.add('foo', 'foo_value');
            stackedMap.add('bar', 'bar_value');

            expect(stackedMap.removeTop().key).toEqual('bar');
            expect(stackedMap.removeTop().key).toEqual('foo');
        });

        it('should preserve semantic of an empty stackedMap', function () {

            expect(stackedMap.length()).toEqual(0);
            expect(stackedMap.top()).toBeUndefined();
        });

        it('should ignore removal of non-existing elements', function () {
            expect(stackedMap.remove('non-existing')).toBeUndefined();
        });
    });
});