describe('ui.xg.accordion', function () {
    var scope;

    beforeEach(function () {
        module('ui.xg.accordion');
        module('accordion/templates/accordion.html');
        module('accordion/templates/group.html');
        inject(function ($rootScope) {
            scope = $rootScope.$new();
        });
    });
    afterEach(function () {

    });

    describe('controller', function () {
        var ctrl;
        var attrs;
        beforeEach(inject(function ($controller) {
            attrs = {};
            ctrl = $controller('uixAccordionCtrl', {
                $scope: scope,
                $attrs: attrs
            });
        }));

        describe('addGroupScope', function () {
            it('adds a the specified panel to the collection', function () {
                var group1 = scope.$new();
                var group2 = scope.$new();
                ctrl.addGroupScope(group1);
                ctrl.addGroupScope(group2);
                expect(ctrl.groupList.length).toBe(2);
                expect(ctrl.groupList[0]).toBe(group1);
                expect(ctrl.groupList[1]).toBe(group2);
            });
        });

        describe('closeOthers', function () {
            var group1;
            var group2;
            var group3;
            beforeEach(function () {
                group1 = {
                    isOpen: true,
                    $on: angular.noop
                };
                group2 = angular.copy(group1);
                group3 = angular.copy(group1);
                ctrl.addGroupScope(group1);
                ctrl.addGroupScope(group2);
                ctrl.addGroupScope(group3);
            });

            it('should close other panels if close-others attribute is not defined', function () {
                delete attrs.closeOthers;
                ctrl.closeOthers(group1);
                expect(group1.isOpen).toBe(true);
                expect(group2.isOpen).toBe(false);
                expect(group3.isOpen).toBe(false);
            });

            it('should close other panels if close-others attribute is true', function () {
                attrs.closeOthers = true;
                ctrl.closeOthers(group1);
                expect(group1.isOpen).toBe(true);
                expect(group2.isOpen).toBe(false);
                expect(group3.isOpen).toBe(false);
            });

            it('should not close other panels if close-others attribute is false', function () {
                scope.closeOthers = false;
                ctrl.closeOthers(group1);
                expect(group1.isOpen).toBe(true);
                expect(group2.isOpen).toBe(true);
                expect(group3.isOpen).toBe(true);
            });
        });

        describe('removeGroupScope', function () {
            var group1;
            var group2;
            var group3;
            beforeEach(function () {
                group1 = scope.$new();
                group2 = scope.$new();
                group3 = scope.$new();
                ctrl.addGroupScope(group1);
                ctrl.addGroupScope(group2);
                ctrl.addGroupScope(group3);
            });

            it('should remove the specified panel', function () {
                ctrl.removeGroupScope(group2);
                expect(ctrl.groupList.length).toBe(2);
                expect(ctrl.groupList[0]).toBe(group1);
                expect(ctrl.groupList[1]).toBe(group3);
            });

            it('should remove a panel when the scope is destroyed', function () {
                group2.$destroy();
                expect(ctrl.groupList.length).toBe(2);
                expect(ctrl.groupList[0]).toBe(group1);
                expect(ctrl.groupList[1]).toBe(group3);
            });
        });

        describe('uix-accordion-group', function () {
            var scope, compile;
            var element, groups;

            beforeEach(inject(function ($compile, $rootScope) {
                compile = $compile;
                scope = $rootScope.$new();
            }));

            describe('with static panels', function () {
                beforeEach(function () {
                    scope.isOpenStatusOne = false;
                    scope.isOpenStatusTwo = true;
                    var tpl =
                        '<uix-accordion>' +
                        '<div uix-accordion-group heading="title 1" is-open="isOpenStatusOne">Content 1</div>' +
                        '<div uix-accordion-group heading="title 2" is-open="isOpenStatusTwo">Content 2</div>' +
                        '</uix-accordion>';
                    element = compile(tpl)(scope);
                    scope.$digest();
                    groups = element.find('.panel');
                });

                afterEach(function () {
                    element.remove();
                });

                it('should create accordion panels with content', function () {
                    expect(groups.length).toEqual(2);
                    expect(groups.eq(0).find('.panel-collapse')).not.toHaveClass('in');
                    expect(groups.eq(1).find('.panel-collapse')).toHaveClass('in');
                });
            });


        });
    });
});
