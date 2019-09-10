describe('uix-tooltip', function () {
    var elm,
        elmBody,
        scope,
        elmScope,
        tooltipScope,
        $timeout,
        $document;

    // load the tooltip code
    beforeEach(function () {
        module('ui.xg.tooltip');
        module('ui.xg.position');
        module('ui.xg.stackedMap');
        module('tooltip/templates/tooltip-popup.html');
        module('tooltip/templates/tooltip-html-popup.html');
    });

    beforeEach(inject(function ($rootScope, $compile, _$document_, _$timeout_) {
        elmBody = angular.element(
            '<div><span uix-tooltip="tooltip text" tooltip-animation="false">Selector Text</span></div>'
        );

        $document = _$document_;
        $timeout = _$timeout_;
        scope = $rootScope;
        $compile(elmBody)(scope);
        scope.$digest();
        elm = elmBody.find('span');
        elmScope = elm.scope();
        tooltipScope = elmScope.$$childTail;
    }));

    afterEach(function () {
        $document.off('keypress');
    });

    function trigger(element, evt) {
        evt = new Event(evt);

        element[0].dispatchEvent(evt);
        element.scope().$$childTail.$digest();
    }

    it('should not be open initially', inject(function () {
        expect(tooltipScope.isOpen).toBe(false);

        // We can only test *that* the tooltip-popup element wasn't created as the
        // implementation is templated and replaced.
        expect(elmBody.children().length).toBe(1);
    }));

    it('should open on mouseenter', inject(function () {
        trigger(elm, 'mouseenter');
        expect(tooltipScope.isOpen).toBe(true);

        // We can only test *that* the tooltip-popup element was created as the
        // implementation is templated and replaced.
        expect(elmBody.children().length).toBe(2);
    }));

    it('should close on mouseleave', inject(function () {
        trigger(elm, 'mouseenter');
        trigger(elm, 'mouseleave');
        $timeout(() => {
            expect(tooltipScope.isOpen).toBe(false);
        }, tooltipScope.popupCloseDelay);
    }));

    it('should not animate on animation set to false', inject(function () {
        expect(tooltipScope.animation).toBe(false);
    }));

    it('should have default placement of "top"', inject(function () {
        trigger(elm, 'mouseenter');
        expect(tooltipScope.placement).toBe('top');
    }));

    it('should allow specification of placement', inject(function ($compile) {
        elm = $compile(angular.element(
            '<span uix-tooltip="tooltip text" tooltip-placement="bottom">Selector Text</span>'
        ))(scope);
        scope.$apply();
        elmScope = elm.scope();
        tooltipScope = elmScope.$$childTail;

        trigger(elm, 'mouseenter');
        expect(tooltipScope.placement).toBe('bottom');
    }));

    it('should update placement dynamically', inject(function ($compile, $timeout) {
        scope.place = 'bottom';
        elm = $compile(angular.element(
            '<span uix-tooltip="tooltip text" tooltip-placement="{{place}}">Selector Text</span>'
        ))(scope);
        scope.$apply();
        elmScope = elm.scope();
        tooltipScope = elmScope.$$childTail;

        trigger(elm, 'mouseenter');
        expect(tooltipScope.placement).toBe('bottom');

        scope.place = 'right';
        scope.$digest();
        $timeout.flush();
        expect(tooltipScope.placement).toBe('right');
    }));

    it('should work inside an ngRepeat', inject(function ($compile) {
        elm = $compile(angular.element(
            '<ul>' +
            '<li ng-repeat="item in items">' +
            '<span uix-tooltip="{{item.tooltip}}">{{item.name}}</span>' +
            '</li>' +
            '</ul>'
        ))(scope);

        scope.items = [
            { name: 'One', tooltip: 'First Tooltip' }
        ];

        scope.$digest();

        var tt = angular.element(elm.find('li > span')[0]);
        trigger(tt, 'mouseenter');

        expect(tt.text()).toBe(scope.items[0].name);

        tooltipScope = tt.scope().$$childTail;
        expect(tooltipScope.content).toBe(scope.items[0].tooltip);

        trigger(tt, 'mouseleave');
        $timeout(() => {
            expect(tooltipScope.isOpen).toBeFalsy();
        }, tooltipScope.popupCloseDelay);
    }));

    it('should show correct text when in an ngRepeat', inject(function ($compile, $timeout) {
        elm = $compile(angular.element(
            '<ul>' +
            '<li ng-repeat="item in items">' +
            '<span uix-tooltip="{{item.tooltip}}">{{item.name}}</span>' +
            '</li>' +
            '</ul>'
        ))(scope);

        scope.items = [
            { name: 'One', tooltip: 'First Tooltip' },
            { name: 'Second', tooltip: 'Second Tooltip' }
        ];

        scope.$digest();

        var tooltip1 = angular.element(elm.find('li > span')[0]);
        var tooltip2 = angular.element(elm.find('li > span')[1]);

        trigger(tooltip1, 'mouseenter');
        trigger(tooltip1, 'mouseleave');

        $timeout.flush();

        trigger(tooltip2, 'mouseenter');

        expect(tooltip1.text()).toBe(scope.items[0].name);
        expect(tooltip2.text()).toBe(scope.items[1].name);

        tooltipScope = tooltip2.scope().$$childTail;
        expect(tooltipScope.content).toBe(scope.items[1].tooltip);
        $timeout(() => {
            expect(elm.find('.tooltip-inner').text()).toBe(scope.items[1].tooltip);

            trigger(tooltip2, 'mouseleave');
        }, tooltipScope.popupCloseDelay);
    }));

    it('should only have an isolate scope on the popup', inject(function ($compile) {
        var ttScope;

        scope.tooltipMsg = 'Tooltip Text';
        scope.alt = 'Alt Message';

        elmBody = $compile(angular.element(
            '<div><span alt={{alt}} uix-tooltip="{{tooltipMsg}}" tooltip-animation="false">Selector Text</span></div>'
        ))(scope);

        $compile(elmBody)(scope);
        scope.$digest();
        elm = elmBody.find('span');
        elmScope = elm.scope();

        trigger(elm, 'mouseenter');
        expect(elm.attr('alt')).toBe(scope.alt);

        ttScope = angular.element(elmBody.children()[1]).isolateScope();
        expect(ttScope.placement).toBe('top');
        expect(ttScope.content).toBe(scope.tooltipMsg);

        trigger(elm, 'mouseleave');

        //Isolate scope contents should be the same after hiding and showing again (issue 1191)
        trigger(elm, 'mouseenter');

        ttScope = angular.element(elmBody.children()[1]).isolateScope();
        expect(ttScope.placement).toBe('top');
        expect(ttScope.content).toBe(scope.tooltipMsg);
    }));

    it('should not show tooltips if there is nothing to show - issue #129', inject(function ($compile) {
        elmBody = $compile(angular.element(
            '<div><span uix-tooltip="">Selector Text</span></div>'
        ))(scope);
        scope.$digest();
        elmBody.find('span').trigger('mouseenter');

        expect(elmBody.children().length).toBe(1);
    }));

    it('should close the tooltip when its trigger element is destroyed', inject(function () {
        trigger(elm, 'mouseenter');
        expect(tooltipScope.isOpen).toBe(true);

        elm.remove();
        elmScope.$destroy();
        expect(elmBody.children().length).toBe(0);
    }));

    it('issue 1191 - scope on the popup should always be child of correct element scope', function () {
        var ttScope;
        trigger(elm, 'mouseenter');

        ttScope = angular.element(elmBody.children()[1]).scope();
        expect(ttScope.$parent).toBe(tooltipScope);

        trigger(elm, 'mouseleave');

        // After leaving and coming back, the scope's parent should be the same
        trigger(elm, 'mouseenter');

        ttScope = angular.element(elmBody.children()[1]).scope();
        expect(ttScope.$parent).toBe(tooltipScope);

        trigger(elm, 'mouseleave');
    });

    describe('with specified enable expression', function () {
        beforeEach(inject(function ($compile) {
            scope.enable = false;
            elmBody = $compile(angular.element(
                '<div><span uix-tooltip="tooltip text" tooltip-enable="enable">Selector Text</span></div>'
            ))(scope);
            scope.$digest();
            elm = elmBody.find('span');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
        }));

        it('should not open ', inject(function () {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBeFalsy();
            expect(elmBody.children().length).toBe(1);
        }));

        it('should open', inject(function () {
            scope.enable = true;
            scope.$digest();
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBeTruthy();
            expect(elmBody.children().length).toBe(2);
        }));
    });

    describe('with specified popup delay', function () {
        var $timeout;
        beforeEach(inject(function ($compile, _$timeout_) {
            $timeout = _$timeout_;
            scope.delay = '1000';
            elm = $compile(angular.element(
                '<span uix-tooltip="tooltip text" tooltip-popup-delay="{{delay}}" ng-disabled="disabled">' +
                'Selector Text' +
                '</span>'
            ))(scope);
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
            scope.$digest();
        }));

        it('should open after timeout', function () {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(false);

            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(true);
        });

        it('should not open if mouseleave before timeout', function () {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(false);

            trigger(elm, 'mouseleave');
            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(false);
        });

        it('should use default popup delay if specified delay is not a number', function () {
            scope.delay = 'text1000';
            scope.$digest();
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(true);
        });

        it('should not open if disabled is present', function () {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(false);

            $timeout.flush(500);
            expect(tooltipScope.isOpen).toBe(false);
            elmScope.disabled = true;
            elmScope.$digest();

            expect(tooltipScope.isOpen).toBe(false);
        });

        it('should open when not disabled after being disabled - issue #4204', function () {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(false);

            $timeout.flush(500);
            elmScope.disabled = true;
            elmScope.$digest();

            $timeout.flush(500);
            expect(tooltipScope.isOpen).toBe(false);

            elmScope.disabled = false;
            elmScope.$digest();

            trigger(elm, 'mouseenter');
            $timeout.flush();

            expect(tooltipScope.isOpen).toBe(true);
        });

        it('should close the tooltips in order', inject(function ($compile) {
            var elm2 = $compile('<div>' +
                '<span uix-tooltip="tooltip #2" tooltip-is-open="isOpen2">Selector Text</span>' +
                '</div>')(scope);
            scope.$digest();
            elm2 = elm2.find('span');
            var tooltipScope2 = elm2.scope().$$childTail;
            tooltipScope2.isOpen = false;
            scope.$digest();

            trigger(elm, 'mouseenter');
            tooltipScope2.$digest();
            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(true);
            expect(tooltipScope2.isOpen).toBe(false);

            trigger(elm2, 'mouseenter');
            tooltipScope2.$digest();
            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(true);
            expect(tooltipScope2.isOpen).toBe(true);

            var evt = $.Event('keypress');
            evt.which = 27;

            $document.trigger(evt);
            tooltipScope.$digest();
            tooltipScope2.$digest();

            expect(tooltipScope.isOpen).toBe(true);
            expect(tooltipScope2.isOpen).toBe(false);

            var evt2 = $.Event('keypress');
            evt2.which = 27;

            $document.trigger(evt2);
            tooltipScope.$digest();
            tooltipScope2.$digest();

            expect(tooltipScope.isOpen).toBe(false);
            expect(tooltipScope2.isOpen).toBe(false);
        }));
    });

    describe('with specified popup close delay', function () {
        var $timeout;
        beforeEach(inject(function ($compile, _$timeout_) {
            $timeout = _$timeout_;
            scope.delay = '1000';
            elm = $compile(angular.element(
                '<span uix-tooltip="tooltip text" tooltip-popup-close-delay="{{delay}}" ng-disabled="disabled">' +
                'Selector Text' +
                '</span>'
            ))(scope);
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
            scope.$digest();
        }));

        it('should close after timeout', function () {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(true);
            trigger(elm, 'mouseleave');
            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(false);
        });

        it('should use default popup close delay if specified delay is not a number', function () {
            scope.delay = 'text1000';
            scope.$digest();
            trigger(elm, 'mouseenter');
            expect(tooltipScope.popupCloseDelay).toBe(200);
            expect(tooltipScope.isOpen).toBe(true);
            trigger(elm, 'mouseleave');
            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(false);
        });

        it('should open when not disabled after being disabled and close after delay - issue #4204', function () {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(true);

            elmScope.disabled = true;
            elmScope.$digest();

            $timeout.flush(500);
            expect(tooltipScope.isOpen).toBe(false);

            elmScope.disabled = false;
            elmScope.$digest();

            trigger(elm, 'mouseenter');

            expect(tooltipScope.isOpen).toBe(true);
            trigger(elm, 'mouseleave');
            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(false);
        });
    });

    describe('with specified popup and popup close delay', function () {
        var $timeout;
        beforeEach(inject(function ($compile, _$timeout_) {
            $timeout = _$timeout_;
            scope.delay = '1000';
            elm = $compile(angular.element(
                '<span uix-tooltip="tooltip text" tooltip-popup-close-delay="{{delay}}" ' +
                'tooltip-popup-close-delay="{{delay}}" ng-disabled="disabled">Selector Text</span>'
            ))(scope);
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
            scope.$digest();
        }));

        it('should not open if mouseleave before timeout', function () {
            trigger(elm, 'mouseenter');
            $timeout.flush(500);
            trigger(elm, 'mouseleave');
            $timeout.flush();

            expect(tooltipScope.isOpen).toBe(false);
        });
    });

    describe('with an is-open attribute', function () {
        beforeEach(inject(function ($compile) {
            scope.isOpen = false;
            elm = $compile(angular.element(
                '<span uix-tooltip="tooltip text" tooltip-is-open="isOpen" >Selector Text</span>'
            ))(scope);
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
            scope.$digest();
        }));

        it('should show and hide with the controller value', function () {
            expect(tooltipScope.isOpen).toBe(false);
            elmScope.isOpen = true;
            elmScope.$digest();
            expect(tooltipScope.isOpen).toBe(true);
            elmScope.isOpen = false;
            elmScope.$digest();
            $timeout(() => {
                expect(tooltipScope.isOpen).toBe(false);
            }, tooltipScope.popupCloseDelay);
        });

        it('should update the controller value', function () {
            trigger(elm, 'mouseenter');
            expect(elmScope.isOpen).toBe(true);
            trigger(elm, 'mouseleave');
            $timeout(() => {
                expect(elmScope.isOpen).toBe(false);
            }, tooltipScope.popupCloseDelay);
        });
    });

    describe('with an is-open attribute expression', function () {
        beforeEach(inject(function ($compile) {
            scope.isOpen = false;
            elm = $compile(angular.element(
                '<span uix-tooltip="tooltip text" tooltip-is-open="isOpen === true" >Selector Text</span>'
            ))(scope);
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
            scope.$digest();
        }));

        it('should show and hide with the expression', function () {
            expect(tooltipScope.isOpen).toBe(false);
            elmScope.isOpen = true;
            elmScope.$digest();
            expect(tooltipScope.isOpen).toBe(true);
            elmScope.isOpen = false;
            elmScope.$digest();
            $timeout(() => {
                expect(tooltipScope.isOpen).toBe(false);
            }, tooltipScope.popupCloseDelay);
        });
    });

    describe('with a trigger attribute', function () {
        var scope, elmBody, elm, elmScope;

        beforeEach(inject(function ($rootScope) {
            scope = $rootScope;
        }));

        it('should use it to show but set the hide trigger based on the map for mapped triggers',
            inject(function ($compile) {
                elmBody = angular.element(
                    '<div><input uix-tooltip="Hello!" tooltip-trigger="focus" /></div>'
                );
                $compile(elmBody)(scope);
                scope.$apply();
                elm = elmBody.find('input');
                elmScope = elm.scope();
                tooltipScope = elmScope.$$childTail;

                expect(tooltipScope.isOpen).toBeFalsy();
                trigger(elm, 'focus');
                expect(tooltipScope.isOpen).toBeTruthy();
                trigger(elm, 'blur');
                $timeout(() => {
                    expect(tooltipScope.isOpen).toBeFalsy();
                }, tooltipScope.popupCloseDelay);
            })
        );

        it('should use it as both the show and hide triggers for unmapped triggers', inject(function ($compile) {
            elmBody = angular.element(
                '<div><input uix-tooltip="Hello!" tooltip-trigger="fakeTriggerAttr" /></div>'
            );
            $compile(elmBody)(scope);
            scope.$apply();
            elm = elmBody.find('input');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;

            expect(tooltipScope.isOpen).toBeFalsy();
            trigger(elm, 'fakeTriggerAttr');
            expect(tooltipScope.isOpen).toBeTruthy();
            trigger(elm, 'fakeTriggerAttr');
            $timeout(() => {
                expect(tooltipScope.isOpen).toBeFalsy();
            }, tooltipScope.popupCloseDelay);
        }));

        it('should only set up triggers once', inject(function ($compile) {
            scope.test = true;
            elmBody = angular.element(
                '<div>' +
                '<input uix-tooltip="Hello!" tooltip-trigger="{{ (test && \'mouseenter\' || \'click\') }}" />' +
                '<input uix-tooltip="Hello!" tooltip-trigger="{{ (test && \'mouseenter\' || \'click\') }}" />' +
                '</div>'
            );

            $compile(elmBody)(scope);
            scope.$apply();
            var elm = elmBody.find('input').eq(1);
            var elmScope = elm.scope();
            var tooltipScope = elmScope.$$childTail;

            scope.$apply('test = false');

            // click trigger isn't set
            elm.click();
            expect(tooltipScope.isOpen).toBeFalsy();

            // mouseenter trigger is still set
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBeTruthy();
        }));

        it('should accept multiple triggers based on the map for mapped triggers', inject(function ($compile) {
            elmBody = angular.element(
                '<div><input uix-tooltip="Hello!" tooltip-trigger="focus fakeTriggerAttr" /></div>'
            );
            $compile(elmBody)(scope);
            scope.$apply();
            elm = elmBody.find('input');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;

            expect(tooltipScope.isOpen).toBeFalsy();
            trigger(elm, 'focus');
            expect(tooltipScope.isOpen).toBeTruthy();
            trigger(elm, 'blur');
            $timeout(() => {
                expect(tooltipScope.isOpen).toBeFalsy();
                trigger(elm, 'fakeTriggerAttr');
                expect(tooltipScope.isOpen).toBeTruthy();
                trigger(elm, 'fakeTriggerAttr');
                expect(tooltipScope.isOpen).toBeFalsy();
            }, tooltipScope.popupCloseDelay);
        }));

        it('should not show when trigger is set to "none"', inject(function ($compile) {
            elmBody = angular.element(
                '<div><input uix-tooltip="Hello!" tooltip-trigger="none" /></div>'
            );
            $compile(elmBody)(scope);
            scope.$apply();
            elm = elmBody.find('input');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
            expect(tooltipScope.isOpen).toBeFalsy();
            elm.trigger('mouseenter');
            expect(tooltipScope.isOpen).toBeFalsy();
        }));

        it('should toggle on click and hide when anything else is clicked when trigger is set to "outsideClick"',
            inject(function ($compile, $document) {
                elm = $compile(angular.element(
                    '<span uix-tooltip="tooltip text" tooltip-trigger="outsideClick">Selector Text</span>'
                ))(scope);
                scope.$apply();
                elmScope = elm.scope();
                tooltipScope = elmScope.$$childTail;

                // start off
                expect(tooltipScope.isOpen).toBeFalsy();

                // toggle
                trigger(elm, 'click');
                expect(tooltipScope.isOpen).toBeTruthy();
                trigger(elm, 'click');
                $timeout(() => {
                    expect(tooltipScope.isOpen).toBeFalsy();

                    // click on, outsideClick off
                    trigger(elm, 'click');
                    expect(tooltipScope.isOpen).toBeTruthy();
                    angular.element($document[0].body).trigger('click');
                    tooltipScope.$digest();
                    expect(tooltipScope.isOpen).toBeFalsy();
                }, tooltipScope.popupCloseDelay);
            })
        );
    });

    describe('with an append-to-body attribute', function () {
        var scope, elmBody, elm, elmScope, $body;

        beforeEach(inject(function ($rootScope) {
            scope = $rootScope;
        }));

        afterEach(function () {
            $body.find('.tooltip').remove();
        });

        it('should append to the body', inject(function ($compile, $document) {
            $body = $document.find('body');
            elmBody = angular.element(
                '<div><span uix-tooltip="tooltip text" tooltip-append-to-body="true">Selector Text</span></div>'
            );

            $compile(elmBody)(scope);
            scope.$digest();
            elm = elmBody.find('span');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;

            var bodyLength = $body.children().length;
            trigger(elm, 'mouseenter');

            expect(tooltipScope.isOpen).toBe(true);
            expect(elmBody.children().length).toBe(1);
            expect($body.children().length).toEqual(bodyLength + 1);
        }));
    });

    describe('cleanup', function () {
        var elmBody, elm, elmScope, tooltipScope;

        function inCache() {
            var match = false;

            angular.forEach(angular.element.cache, function (item) {
                if (item.data && item.data.$scope === tooltipScope) {
                    match = true;
                }
            });

            return match;
        }

        beforeEach(inject(function ($compile, $rootScope) {
            elmBody = angular.element('<div><input uix-tooltip="Hello!" tooltip-trigger="fooTrigger" /></div>');

            $compile(elmBody)($rootScope);
            $rootScope.$apply();

            elm = elmBody.find('input');
            elmScope = elm.scope();
            trigger(elm, 'fooTrigger');
            tooltipScope = elmScope.$$childTail.$$childTail;
        }));

        it('should not contain a cached reference when not visible', inject(function () {
            expect(inCache()).toBeTruthy();
            elmScope.$destroy();
            expect(inCache()).toBeFalsy();
        }));
    });

    describe('observers', function () {
        var elmBody, elm, elmScope, scope, tooltipScope;

        beforeEach(inject(function ($compile, $rootScope) {
            scope = $rootScope;
            scope.content = 'tooltip content';
            scope.placement = 'top';
            elmBody = angular.element('<div><input uix-tooltip="{{content}}" tooltip-placement={{placement}} /></div>');
            $compile(elmBody)(scope);
            scope.$apply();

            elm = elmBody.find('input');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
        }));

        it('should be removed when tooltip hides', inject(function ($timeout) {
            expect(tooltipScope.content).toBeUndefined();
            expect(tooltipScope.placement).toBeUndefined();

            trigger(elm, 'mouseenter');
            expect(tooltipScope.content).toBe('tooltip content');
            expect(tooltipScope.placement).toBe('top');
            scope.content = 'tooltip content updated';

            scope.placement = 'bottom';
            scope.$apply();
            expect(tooltipScope.content).toBe('tooltip content updated');
            expect(tooltipScope.placement).toBe('bottom');

            trigger(elm, 'mouseleave');
            $timeout.flush();
            scope.content = 'tooltip content updated after close';
            scope.placement = 'left';
            scope.$apply();
            expect(tooltipScope.content).toBe(scope.content);
            expect(tooltipScope.placement).toBe(scope.placement);
        }));
    });
});

describe('tooltipWithDifferentSymbols', function () {
    var elmBody;

    // load the tooltip code
    beforeEach(function () {
        module('ui.xg.tooltip');
        module('ui.xg.position');
        module('ui.xg.stackedMap');
        module('tooltip/templates/tooltip-popup.html');
        module('tooltip/templates/tooltip-html-popup.html');
    });

    // configure interpolate provider to use [[ ]] instead of {{ }}
    beforeEach(module(function ($interpolateProvider) {
        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.startSymbol(']]');
    }));

    function trigger(element, evt) {
        evt = new Event(evt);

        element[0].dispatchEvent(evt);
        element.scope().$$childTail.$digest();
    }

    it('should show the correct tooltip text', inject(function ($compile, $rootScope) {
        elmBody = angular.element(
            '<div>' +
            '<input type="text" uix-tooltip="My tooltip" tooltip-trigger="focus" tooltip-placement="right" />' +
            '</div>'
        );
        $compile(elmBody)($rootScope);
        $rootScope.$apply();
        var elmInput = elmBody.find('input');
        trigger(elmInput, 'focus');

        expect(elmInput.next().find('div').next().html()).toBe('My tooltip');
    }));
});

describe('tooltip positioning', function () {
    var elm, elmBody, scope;
    var $position;

    // load the tooltip code
    beforeEach(function () {
        module('ui.xg.tooltip', function ($uixTooltipProvider) {
            $uixTooltipProvider.options({ animation: false });
        });
        module('ui.xg.position');
        module('ui.xg.stackedMap');
        module('tooltip/templates/tooltip-popup.html');
        module('tooltip/templates/tooltip-html-popup.html');
    });

    beforeEach(inject(function ($rootScope, $compile, $uixPosition) {
        $position = $uixPosition;
        spyOn($position, 'positionElements').and.callThrough();

        scope = $rootScope;
        scope.text = 'Some Text';

        elmBody = $compile(angular.element(
            '<div><span uix-tooltip="{{ text }}">Selector Text</span></div>'
        ))(scope);
        scope.$digest();
        elm = elmBody.find('span');
    }));

    function trigger(element, evt) {
        evt = new Event(evt);

        element[0].dispatchEvent(evt);
        element.scope().$$childTail.$digest();
    }

    it('should re-position when value changes', inject(function ($timeout) {
        trigger(elm, 'mouseenter');

        scope.$digest();
        $timeout.flush();
        var startingPositionCalls = $position.positionElements.calls.count();

        scope.text = 'New Text';
        scope.$digest();
        $timeout.flush();
        expect(elm.attr('uix-tooltip')).toBe('New Text');
        expect($position.positionElements.calls.count()).toEqual(startingPositionCalls + 1);
        // Check that positionElements was called with elm
        expect($position.positionElements.calls.argsFor(startingPositionCalls)[0][0])
            .toBe(elm[0]);

        scope.$digest();
        $timeout.verifyNoPendingTasks();
        expect($position.positionElements.calls.count()).toEqual(startingPositionCalls + 1);
        expect($position.positionElements.calls.argsFor(startingPositionCalls)[0][0])
            .toBe(elm[0]);
        scope.$digest();
    }));

});

describe('tooltipHtml', function () {
    var elm, elmBody, elmScope, tooltipScope, scope, $timeout;

    // load the tooltip code
    beforeEach(function () {
        module('ui.xg.tooltip', function ($uixTooltipProvider) {
            $uixTooltipProvider.options({ animation: false });
        });
        module('ui.xg.position');
        module('ui.xg.stackedMap');
        module('tooltip/templates/tooltip-popup.html');
        module('tooltip/templates/tooltip-html-popup.html');
    });

    beforeEach(inject(function ($rootScope, $compile, $sce, _$timeout_) {
        $timeout = _$timeout_;
        scope = $rootScope;
        scope.html = 'I say: <strong class="hello">Hello!</strong>';
        scope.safeHtml = $sce.trustAsHtml(scope.html);

        elmBody = $compile(angular.element(
            '<div><span uix-tooltip-html="safeHtml">Selector Text</span></div>'
        ))(scope);
        scope.$digest();
        elm = elmBody.find('span');
        elmScope = elm.scope();
        tooltipScope = elmScope.$$childTail;
    }));

    function trigger(element, evt) {
        evt = new Event(evt);

        element[0].dispatchEvent(evt);
        element.scope().$$childTail.$digest();
    }

    it('should render html properly', inject(function () {
        trigger(elm, 'mouseenter');
        expect(elmBody.find('.tooltip-inner').html()).toBe(scope.html);
    }));

    it('should not open if html is empty', function () {
        scope.safeHtml = null;
        scope.$digest();
        trigger(elm, 'mouseenter');
        expect(tooltipScope.isOpen).toBe(false);
    });

    it('should show on mouseenter and hide on mouseleave', inject(function ($sce) {
        expect(tooltipScope.isOpen).toBe(false);

        trigger(elm, 'mouseenter');
        expect(tooltipScope.isOpen).toBe(true);
        expect(elmBody.children().length).toBe(2);

        expect($sce.getTrustedHtml(tooltipScope.contentExp())).toEqual(scope.html);

        trigger(elm, 'mouseleave');
        $timeout(() => {
            expect(tooltipScope.isOpen).toBe(false);
            expect(elmBody.children().length).toBe(1);
        }, tooltipScope.popupCloseDelay);
    }));
});

describe('$uixTooltipProvider', function () {
    var elm,
        elmBody,
        scope,
        elmScope,
        $timeout,
        tooltipScope;

    function trigger(element, evt) {
        evt = new Event(evt);

        element[0].dispatchEvent(evt);
        element.scope().$$childTail.$digest();
    }

    describe('popupDelay', function () {
        beforeEach(function () {
            module('ui.xg.tooltip', function ($uixTooltipProvider) {
                $uixTooltipProvider.options({ popupDelay: 1000 });
            });
            module('ui.xg.position');
            module('ui.xg.stackedMap');
            module('tooltip/templates/tooltip-popup.html');
            module('tooltip/templates/tooltip-html-popup.html');
        });

        beforeEach(inject(function ($rootScope, $compile, _$timeout_) {
            elmBody = angular.element(
                '<div><span uix-tooltip="tooltip text">Selector Text</span></div>'
            );
            $timeout = _$timeout_;

            scope = $rootScope;
            $compile(elmBody)(scope);
            scope.$digest();
            elm = elmBody.find('span');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;
        }));

        it('should open after timeout', inject(function ($timeout) {
            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(false);

            $timeout.flush();
            expect(tooltipScope.isOpen).toBe(true);
        }));
    });

    describe('appendToBody', function () {
        var $body;

        beforeEach(function () {
            module('ui.xg.tooltip', function ($uixTooltipProvider) {
                $uixTooltipProvider.options({ appendToBody: true });
            });
            module('ui.xg.position');
            module('ui.xg.stackedMap');
            module('tooltip/templates/tooltip-popup.html');
            module('tooltip/templates/tooltip-html-popup.html');
        });

        afterEach(function () {
            $body.find('.tooltip').remove();
        });

        it('should append to the body', inject(function ($rootScope, $compile, $document) {
            $body = $document.find('body');
            elmBody = angular.element(
                '<div><span uix-tooltip="tooltip text">Selector Text</span></div>'
            );

            scope = $rootScope;
            $compile(elmBody)(scope);
            scope.$digest();
            elm = elmBody.find('span');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;

            var bodyLength = $body.children().length;
            trigger(elm, 'mouseenter');

            expect(tooltipScope.isOpen).toBe(true);
            expect(elmBody.children().length).toBe(1);
            expect($body.children().length).toEqual(bodyLength + 1);
        }));

        it('should append to the body when only attribute present', inject(function ($rootScope, $compile, $document) {
            $body = $document.find('body');
            elmBody = angular.element(
                '<div><span uix-tooltip="tooltip text" tooltip-append-to-body>Selector Text</span></div>'
            );

            scope = $rootScope;
            $compile(elmBody)(scope);
            scope.$digest();
            elm = elmBody.find('span');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;

            var bodyLength = $body.children().length;
            trigger(elm, 'mouseenter');

            expect(tooltipScope.isOpen).toBe(true);
            expect(elmBody.children().length).toBe(1);
            expect($body.children().length).toEqual(bodyLength + 1);
        }));

        it('should not append to the body when attribute value is false',
            inject(function ($rootScope, $compile, $document) {
                $body = $document.find('body');
                elmBody = angular.element(
                    '<div><span uix-tooltip="tooltip text" tooltip-append-to-body="false">Selector Text</span></div>'
                );

                scope = $rootScope;
                $compile(elmBody)(scope);
                scope.$digest();
                elm = elmBody.find('span');
                elmScope = elm.scope();
                tooltipScope = elmScope.$$childTail;

                var bodyLength = $body.children().length;
                trigger(elm, 'mouseenter');

                expect(tooltipScope.isOpen).toBe(true);
                expect(elmBody.children().length).toBe(2);
                expect($body.children().length).toEqual(bodyLength);
            })
        );

        it('should close on location change', inject(function ($rootScope, $compile) {
            elmBody = angular.element(
                '<div><span uix-tooltip="tooltip text">Selector Text</span></div>'
            );

            scope = $rootScope;
            $compile(elmBody)(scope);
            scope.$digest();
            elm = elmBody.find('span');
            elmScope = elm.scope();
            tooltipScope = elmScope.$$childTail;

            trigger(elm, 'mouseenter');
            expect(tooltipScope.isOpen).toBe(true);

            scope.$broadcast('$locationChangeSuccess');
            scope.$digest();
            expect(tooltipScope.isOpen).toBe(false);
        }));
    });

    describe('triggers', function () {
        describe('triggers with a mapped value', function () {
            beforeEach(function () {
                module('ui.xg.tooltip', function ($uixTooltipProvider) {
                    $uixTooltipProvider.options({ trigger: 'focus' });
                });
                module('ui.xg.position');
                module('ui.xg.stackedMap');
                module('tooltip/templates/tooltip-popup.html');
                module('tooltip/templates/tooltip-html-popup.html');
            });

            it('should use the show trigger and the mapped value for the hide trigger',
                inject(function ($rootScope, $compile) {
                    elmBody = angular.element(
                        '<div><input uix-tooltip="tooltip text" /></div>'
                    );

                    scope = $rootScope;
                    $compile(elmBody)(scope);
                    scope.$digest();
                    elm = elmBody.find('input');
                    elmScope = elm.scope();
                    tooltipScope = elmScope.$$childTail;

                    expect(tooltipScope.isOpen).toBeFalsy();
                    trigger(elm, 'focus');
                    expect(tooltipScope.isOpen).toBeTruthy();
                    trigger(elm, 'blur');
                    $timeout(() => {
                        expect(tooltipScope.isOpen).toBeFalsy();
                    }, tooltipScope.popupCloseDelay);
                })
            );

            it('should override the show and hide triggers if there is an attribute',
                inject(function ($rootScope, $compile) {
                    elmBody = angular.element(
                        '<div><input uix-tooltip="tooltip text" tooltip-trigger="mouseenter"/></div>'
                    );

                    scope = $rootScope;
                    $compile(elmBody)(scope);
                    scope.$digest();
                    elm = elmBody.find('input');
                    elmScope = elm.scope();
                    tooltipScope = elmScope.$$childTail;

                    expect(tooltipScope.isOpen).toBeFalsy();
                    trigger(elm, 'mouseenter');
                    expect(tooltipScope.isOpen).toBeTruthy();
                    trigger(elm, 'mouseleave');
                    $timeout(() => {
                        expect(tooltipScope.isOpen).toBeFalsy();
                    }, tooltipScope.popupCloseDelay);
                })
            );
        });

        describe('triggers with a custom mapped value', function () {
            beforeEach(function () {
                module('ui.xg.tooltip', function ($uixTooltipProvider) {
                    $uixTooltipProvider.setTriggers({ customOpenTrigger: 'foo bar' });
                    $uixTooltipProvider.options({ trigger: 'customOpenTrigger' });
                });
                module('ui.xg.position');
                module('ui.xg.stackedMap');
                module('tooltip/templates/tooltip-popup.html');
                module('tooltip/templates/tooltip-html-popup.html');
            });

            it('should use the show trigger and the mapped value for the hide trigger',
                inject(function ($rootScope, $compile) {
                    elmBody = angular.element(
                        '<div><input uix-tooltip="tooltip text" /></div>'
                    );

                    scope = $rootScope;
                    $compile(elmBody)(scope);
                    scope.$digest();
                    elm = elmBody.find('input');
                    elmScope = elm.scope();
                    tooltipScope = elmScope.$$childTail;

                    expect(tooltipScope.isOpen).toBeFalsy();
                    trigger(elm, 'customOpenTrigger');
                    expect(tooltipScope.isOpen).toBeTruthy();
                    trigger(elm, 'foo');
                    $timeout(() => {
                        expect(tooltipScope.isOpen).toBeFalsy();
                        trigger(elm, 'customOpenTrigger');
                        expect(tooltipScope.isOpen).toBeTruthy();
                        trigger(elm, 'bar');
                        $timeout(() => {
                            expect(tooltipScope.isOpen).toBeFalsy();
                        }, tooltipScope.popupCloseDelay);
                    }, tooltipScope.popupCloseDelay);
                })
            );
        });

        describe('triggers without a mapped value', function () {
            beforeEach(function () {
                module('ui.xg.tooltip', function ($uixTooltipProvider) {
                    $uixTooltipProvider.options({ trigger: 'fakeTrigger' });
                });
                module('ui.xg.position');
                module('ui.xg.stackedMap');
                module('tooltip/templates/tooltip-popup.html');
                module('tooltip/templates/tooltip-html-popup.html');
            });


            it('should use the show trigger to hide', inject(function ($rootScope, $compile) {
                elmBody = angular.element(
                    '<div><span uix-tooltip="tooltip text">Selector Text</span></div>'
                );

                scope = $rootScope;
                $compile(elmBody)(scope);
                scope.$digest();
                elm = elmBody.find('span');
                elmScope = elm.scope();
                tooltipScope = elmScope.$$childTail;

                expect(tooltipScope.isOpen).toBeFalsy();
                trigger(elm, 'fakeTrigger');
                expect(tooltipScope.isOpen).toBeTruthy();
                trigger(elm, 'fakeTrigger');
                $timeout(() => {
                    expect(tooltipScope.isOpen).toBeFalsy();
                }, 300);
            }));
        });
    });
});
