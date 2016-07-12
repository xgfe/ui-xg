describe('uix-select tests', function () {
    var scope, $rootScope, $compile, $timeout, $injector, $document;

    var Key = {
        Enter: 13,
        Tab: 9,
        Up: 38,
        Down: 40,
        Left: 37,
        Right: 39,
        Backspace: 8,
        Delete: 46,
        Escape: 27
    };
    beforeEach(function () {
        module('ui.xg.select');
        module('select/templates/choices.html');
        module('select/templates/match.html');
        module('select/templates/match-multiple.html');
        module('select/templates/select.html');
        module('select/templates/select-multiple.html');
    });
    //create a directive that wraps uix-select
    angular.module('wrapperDirective', ['ui.xg.select']);
    angular.module('wrapperDirective').directive('wrapperUixSelect', function () {
        return {
            restrict: 'EA',
            template: '<uix-select> ' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>',
            require: 'ngModel',
            scope: true
        };
    });


    beforeEach(module('ngSanitize', 'wrapperDirective'));

    beforeEach(function () {
        module(function ($provide) {
            $provide.factory('uixSelectOffset', function () {
                return function () {
                    return {top: 100, left: 200, width: 300, height: 400};
                };
            });
        });
    });


    beforeEach(inject(function (_$rootScope_, _$compile_, _$timeout_, _$document_, _$injector_) {
        $rootScope = _$rootScope_;
        scope = $rootScope.$new();
        $compile = _$compile_;
        $timeout = _$timeout_;
        $document = _$document_;
        $injector = _$injector_;
        scope.selection = {};

        scope.getGroupLabel = function (person) {
            return person.age % 2 ? 'even' : 'odd';
        };

        scope.filterInvertOrder = function (groups) {
            return groups.sort(function (groupA, groupB) {
                return groupA.name.toLocaleLowerCase() < groupB.name.toLocaleLowerCase();
            });
        };


        scope.people = [
            {name: 'Adam', email: 'adam@email.com', group: 'Foo', age: 12},
            {name: 'Amalie', email: 'amalie@email.com', group: 'Foo', age: 12},
            {name: 'Estefanía', email: 'estefanía@email.com', group: 'Foo', age: 21},
            {name: 'Adrian', email: 'adrian@email.com', group: 'Foo', age: 21},
            {name: 'Wladimir', email: 'wladimir@email.com', group: 'Foo', age: 30},
            {name: 'Samantha', email: 'samantha@email.com', group: 'bar', age: 30},
            {name: 'Nicole', email: 'nicole@email.com', group: 'bar', age: 43},
            {name: 'Natasha', email: 'natasha@email.com', group: 'Baz', age: 54}
        ];

        scope.someObject = {};
        scope.someObject.people = [
            {name: 'Adam', email: 'adam@email.com', group: 'Foo', age: 12},
            {name: 'Amalie', email: 'amalie@email.com', group: 'Foo', age: 12},
            {name: 'Estefanía', email: 'estefanía@email.com', group: 'Foo', age: 21},
            {name: 'Adrian', email: 'adrian@email.com', group: 'Foo', age: 21},
            {name: 'Wladimir', email: 'wladimir@email.com', group: 'Foo', age: 30},
            {name: 'Samantha', email: 'samantha@email.com', group: 'bar', age: 30},
            {name: 'Nicole', email: 'nicole@email.com', group: 'bar', age: 43},
            {name: 'Natasha', email: 'natasha@email.com', group: 'Baz', age: 54}
        ];
    }));


    // DSL (domain-specific language)

    function compileTemplate(template) {
        var el = $compile(angular.element(template))(scope);
        scope.$digest();
        return el;
    }

    function createUiSelect(attrs) {
        var attrsHtml = '',
            matchAttrsHtml = '';
        if (angular.isDefined(attrs)) {
            if (angular.isDefined(attrs.disabled)) {
                attrsHtml += ' ng-disabled="' + attrs.disabled + '"';
            }
            if (angular.isDefined(attrs.required)) {
                attrsHtml += ' ng-required="' + attrs.required + '"';
            }
            if (angular.isDefined(attrs.theme)) {
                attrsHtml += ' theme="' + attrs.theme + '"';
            }
            if (angular.isDefined(attrs.tabindex)) {
                attrsHtml += ' tabindex="' + attrs.tabindex + '"';
            }
            if (angular.isDefined(attrs.tagging)) {
                attrsHtml += ' tagging="' + attrs.tagging + '"';
            }
            if (angular.isDefined(attrs.taggingTokens)) {
                attrsHtml += ' tagging-tokens="' + attrs.taggingTokens + '"';
            }
            if (angular.isDefined(attrs.title)) {
                attrsHtml += ' title="' + attrs.title + '"';
            }
            if (angular.isDefined(attrs.appendToBody)) {
                attrsHtml += ' append-to-body="' + attrs.appendToBody + '"';
            }
            if (angular.isDefined(attrs.allowClear)) {
                matchAttrsHtml += ' allow-clear="' + attrs.allowClear + '"';
            }
        }

        return compileTemplate(
            '<uix-select ng-model="selection.selected"' + attrsHtml + '> ' +
            '<uix-select-match placeholder="Pick one..."' + matchAttrsHtml + '>' +
            '{{$select.selected.name}}</uix-select-match> ' +
            '<uix-select-choices repeat="person in people | filter: $select.search"> ' +
            ' <div ng-bind-html="person.name | highlight: $select.search"></div> ' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
            '</uix-select-choices>' +
            '</uix-select>'
        );
    }

    function getMatchLabel(el) {
        return $(el).find('.uix-select-match > span:first > span[ng-transclude]:not(.ng-hide)').text();
    }


    function clickItem(el, text) {

        if (!isDropdownOpened(el)) {
            openDropdown(el);
        }

        $(el).find('.uix-select-choices-row div:contains("' + text + '")').click();
        scope.$digest();
    }

    function clickMatch(el) {
        $(el).find('.uix-select-match > span:first').click();
        scope.$digest();
    }

    function isDropdownOpened(el) {
        // Does not work with jQuery 2.*, have to use jQuery 1.11.*
        // This will be fixed in AngularJS 1.3
        // See issue with unit-testing directive using karma
        // https://github.com/angular/angular.js/issues/4640#issuecomment-35002427
        return el.scope().$select.open && el.hasClass('open');
    }

    function triggerKeydown(element, keyCode) {
        var evt = jQuery.Event('keydown');
        evt.which = keyCode;
        evt.keyCode = keyCode;
        element.trigger(evt);
    }

    function triggerPaste(element, text) {
        var evt = jQuery.Event('paste');
        evt.originalEvent = {
            clipboardData: {
                getData: function () {
                    return text;
                }
            }
        };
        element.trigger(evt);
    }

    function setSearchText(el, text) {
        el.scope().$select.search = text;
        scope.$digest();
        $timeout.flush();
    }

    function openDropdown(el) {
        var $select = el.scope().$select;
        $select.open = true;
        scope.$digest();
    }

    function closeDropdown(el) {
        var $select = el.scope().$select;
        $select.open = false;
        scope.$digest();
    }


    // Tests

    it('should compile child directives', function () {
        var el = createUiSelect();
        var searchEl = $(el).find('.uix-select-search');
        expect(searchEl.length).toEqual(1);

        var matchEl = $(el).find('.uix-select-match');
        expect(matchEl.length).toEqual(1);

        var choicesContentEl = $(el).find('.uix-select-choices-content');
        expect(choicesContentEl.length).toEqual(1);

        var choicesContainerEl = $(el).find('.uix-select-choices');
        expect(choicesContainerEl.length).toEqual(1);

        openDropdown(el);
        var choicesEls = $(el).find('.uix-select-choices-row');
        expect(choicesEls.length).toEqual(8);
    });

    it('should correctly render initial state', function () {
        scope.selection.selected = scope.people[0];

        var el = createUiSelect();

        expect(getMatchLabel(el)).toEqual('Adam');
    });

    it('should correctly render initial state with track by feature', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected"> ' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
            '<uix-select-choices repeat="person in people | filter: $select.search track by person.name"> ' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>'
        );
        scope.selection.selected = {
            name: 'Samantha',
            email: 'something different than array source',
            group: 'bar',
            age: 30
        };
        scope.$digest();
        expect(getMatchLabel(el)).toEqual('Samantha');
    });

    it('should utilize wrapper directive ng-model', function () {
        var el = compileTemplate('<wrapper-uix-select ng-model="selection.selected"/>');
        scope.selection.selected = {
            name: 'Samantha',
            email: 'something different than array source',
            group: 'bar',
            age: 30
        };
        scope.$digest();
        expect(
            $(el).find('.uix-select-container > .uix-select-match > span:first > span[ng-transclude]:not(.ng-hide)')
                .text()
        ).toEqual('Samantha');
    });

    it('should display the choices when activated', function () {
        var el = createUiSelect();

        expect(isDropdownOpened(el)).toEqual(false);

        clickMatch(el);

        expect(isDropdownOpened(el)).toEqual(true);
    });

    it('should select an item', function () {
        var el = createUiSelect();

        clickItem(el, 'Samantha');

        expect(getMatchLabel(el)).toEqual('Samantha');
    });

    it('should select an item (controller)', function () {
        var el = createUiSelect();

        el.scope().$select.select(scope.people[1]);
        scope.$digest();

        expect(getMatchLabel(el)).toEqual('Amalie');
    });

    it('should not select a non existing item', function () {
        var el = createUiSelect();

        clickItem(el, 'I don\'t exist');

        expect(getMatchLabel(el)).toEqual('');
    });

    it('should close the choices when an item is selected', function () {
        var el = createUiSelect();

        clickMatch(el);

        expect(isDropdownOpened(el)).toEqual(true);

        clickItem(el, 'Samantha');

        expect(isDropdownOpened(el)).toEqual(false);
    });


    it('should open/close dropdown when clicking caret icon', function () {

        var el = createUiSelect();
        var $select = el.scope().$select;

        expect($select.open).toEqual(false);

        el.find('.uix-select-toggle').click();
        expect($select.open).toEqual(true);

        el.find('.uix-select-toggle').click();
        expect($select.open).toEqual(true);
    });

    it('should clear selection', function () {
        scope.selection.selected = scope.people[0];

        var el = createUiSelect({allowClear: 'true'});
        var $select = el.scope().$select;

        // allowClear should be true.
        expect($select.allowClear).toEqual(true);

        // Trigger clear.
        el.find('.uix-select-allowclear').click();
        expect(scope.selection.selected).toBeUndefined();

        // If there is no selection it the X icon should be hidden.
        expect(el.find('.uix-select-allowclear').length).toEqual(0);

    });

    it('should toggle allow-clear directive', function () {
        scope.selection.selected = scope.people[0];
        scope.isClearAllowed = false;

        var el = createUiSelect({allowClear: '{{isClearAllowed}}'});
        var $select = el.scope().$select;

        expect($select.allowClear).toEqual(false);
        expect(el.find('.uix-select-allowclear').length).toEqual(0);

        // Turn clear on
        scope.isClearAllowed = true;
        scope.$digest();

        expect($select.allowClear).toEqual(true);
        expect(el.find('.uix-select-allowclear').length).toEqual(1);
    });


    it('should pass tabindex to focusser', function () {
        var el = createUiSelect({tabindex: 5});

        expect($(el).find('.uix-select-focusser').attr('tabindex')).toEqual('5');
        expect($(el).attr('tabindex')).toBeUndefined();
    });

    it('should pass tabindex to focusser when tabindex is an expression', function () {
        scope.tabValue = 22;
        var el = createUiSelect({tabindex: '{{tabValue + 10}}'});

        expect($(el).find('.uix-select-focusser').attr('tabindex')).toEqual('32');
        expect($(el).attr('tabindex')).toBeUndefined();
    });

    it('should not give focusser a tabindex when uix-select does not have one', function () {
        var el = createUiSelect();

        expect($(el).find('.uix-select-focusser').attr('tabindex')).toBeUndefined();
        expect($(el).attr('tabindex')).toBeUndefined();
    });

    it('should be disabled if the attribute says so', function () {
        var el1 = createUiSelect({disabled: true});
        expect(el1.scope().$select.disabled).toEqual(true);
        clickMatch(el1);
        expect(isDropdownOpened(el1)).toEqual(false);

        var el2 = createUiSelect({disabled: false});
        expect(el2.scope().$select.disabled).toEqual(false);
        clickMatch(el2);
        expect(isDropdownOpened(el2)).toEqual(true);

        var el3 = createUiSelect();
        expect(el3.scope().$select.disabled).toBeFalsy();
        clickMatch(el3);
        expect(isDropdownOpened(el3)).toEqual(true);
    });

    it('should allow decline tags when tagging function returns null', function () {
        scope.taggingFunc = function () {
            return null;
        };

        var el = createUiSelect({tagging: 'taggingFunc'});
        clickMatch(el);

        el.scope().$select.search = 'idontexist';
        el.scope().$select.activeIndex = 0;
        el.scope().$select.select('idontexist');

        expect(el.scope().$select.selected).not.toBeDefined();
    });

    it('should allow tagging if the attribute says so', function () {
        var el = createUiSelect({tagging: true});
        clickMatch(el);

        el.scope().$select.select('I don\'t exist');

        expect(el.scope().$select.selected).toEqual('I don\'t exist');
    });

    it('should format new items using the tagging function when the attribute is a function', function () {
        scope.taggingFunc = function (name) {
            return {
                name: name,
                email: name + '@email.com',
                group: 'Foo',
                age: 12
            };
        };

        var el = createUiSelect({tagging: 'taggingFunc'});
        clickMatch(el);

        el.scope().$select.search = 'idontexist';
        el.scope().$select.activeIndex = 0;
        el.scope().$select.select('idontexist');

        expect(el.scope().$select.selected).toEqual({
            name: 'idontexist',
            email: 'idontexist@email.com',
            group: 'Foo',
            age: 12
        });
    });

    // See when an item that evaluates to false (such as "false" or "no") is selected
    // the placeholder is shown https://github.com/angular-ui/uix-select/pull/32
    it('should not display the placeholder when item evaluates to false', function () {
        scope.items = ['false'];

        var el = compileTemplate(
            '<uix-select ng-model="selection.selected"> ' +
            '<uix-select-match>{{$select.selected}}</uix-select-match> ' +
            '<uix-select-choices repeat="item in items | filter: $select.search"> ' +
            '<div ng-bind-html="item | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>'
        );
        expect(el.scope().$select.selected).toBeUndefined();

        clickItem(el, 'false');

        expect(el.scope().$select.selected).toEqual('false');
        expect(getMatchLabel(el)).toEqual('false');
    });

    it('should close an opened select when another one is opened', function () {
        var el1 = createUiSelect();
        var el2 = createUiSelect();
        el1.appendTo($document[0].body);
        el2.appendTo($document[0].body);

        expect(isDropdownOpened(el1)).toEqual(false);
        expect(isDropdownOpened(el2)).toEqual(false);
        clickMatch(el1);
        expect(isDropdownOpened(el1)).toEqual(true);
        expect(isDropdownOpened(el2)).toEqual(false);
        clickMatch(el2);
        expect(isDropdownOpened(el1)).toEqual(false);
        expect(isDropdownOpened(el2)).toEqual(true);

        el1.remove();
        el2.remove();
    });

    describe('disabled options', function () {
        function createUiSelect(attrs) {
            var attrsDisabled = '';
            if (angular.isDefined(attrs)) {
                if (angular.isDefined(attrs.disabled)) {
                    attrsDisabled = ' ui-disable-choice="' + attrs.disabled + '"';
                } else {
                    attrsDisabled = '';
                }
            }

            return compileTemplate(
                '<uix-select ng-model="selection.selected"> ' +
                '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
                '<uix-select-choices repeat="person in people | filter: $select.search"' + attrsDisabled + '> ' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
                '</uix-select-choices> ' +
                '</uix-select>');
        }

        function disablePerson(opts) {
            opts = opts || {};

            var key = opts.key || 'people',
                disableAttr = opts.disableAttr || 'disabled',
                disableBool = angular.isUndefined(opts.disableBool) ? true : opts.disableBool,
                matchAttr = opts.match || 'name',
                matchVal = opts.matchVal || 'Wladimir';

            scope['_' + key] = angular.copy(scope[key]);
            scope[key].map(function (model) {
                if (model[matchAttr] === matchVal) {
                    model[disableAttr] = disableBool;
                }
                return model;
            });
        }

        function resetScope(opts) {
            opts = opts || {};
            var key = opts.key || 'people';
            scope[key] = angular.copy(scope['_' + key]);
        }

        describe('without disabling expression', function () {
            beforeEach(function () {
                disablePerson();
                this.el = createUiSelect();
            });

            it('should not allow disabled options to be selected', function () {
                clickItem(this.el, 'Wladimir');

                expect(getMatchLabel(this.el)).toEqual('Wladimir');
            });

            it('should set a disabled class on the option', function () {
                var option = $(this.el).find('.uix-select-choices-row div:contains("Wladimir")');
                var container = option.closest('.uix-select-choices-row');

                expect(container.hasClass('disabled')).toBeFalsy();
            });
        });

        afterEach(function () {
            resetScope();
        });
    });

    describe('choices group', function () {
        function getGroupLabel(item) {
            return item.parent('.uix-select-choices-group').find('.uix-select-choices-group-label');
        }

        function createUiSelect() {
            return compileTemplate(
                '<uix-select ng-model="selection.selected">' +
                '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
                '<uix-select-choices group-by="\'group\'" repeat="person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>');
        }

        it('should create items group', function () {
            var el = createUiSelect();
            expect(el.find('.uix-select-choices-group').length).toBe(3);
        });

        it('should show label before each group', function () {
            var el = createUiSelect();
            expect(el.find('.uix-select-choices-group .uix-select-choices-group-label').map(function () {
                return this.textContent;
            }).toArray()).toEqual(['Foo', 'bar', 'Baz']);
        });

        it('should hide empty groups', function () {
            var el = createUiSelect();
            el.scope().$select.search = 'd';
            scope.$digest();

            expect(el.find('.uix-select-choices-group .uix-select-choices-group-label').map(function () {
                return this.textContent;
            }).toArray()).toEqual(['Foo']);
        });

        it('should change activeItem through groups', function () {
            var el = createUiSelect();
            el.scope().$select.search = 't';
            scope.$digest();
            openDropdown(el);
            var choices = el.find('.uix-select-choices-row');

            expect(choices.eq(0)).toHaveClass('active');
            expect(getGroupLabel(choices.eq(0)).text()).toBe('Foo');

            triggerKeydown(el.find('input'), 40 /*Down*/);
            scope.$digest();
            expect(choices.eq(1)).toHaveClass('active');
            expect(getGroupLabel(choices.eq(1)).text()).toBe('bar');
        });
    });

    describe('choices group by function', function () {
        function createUiSelect() {
            return compileTemplate(
                '<uix-select ng-model="selection.selected"> ' +
                '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
                '<uix-select-choices group-by="getGroupLabel" repeat="person in people | filter: $select.search"> ' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
                '</uix-select-choices> ' +
                '</uix-select>'
            );
        }

        it('should extract group value through function', function () {
            var el = createUiSelect();
            expect(el.find('.uix-select-choices-group .uix-select-choices-group-label').map(function () {
                return this.textContent;
            }).toArray()).toEqual(['odd', 'even']);
        });
    });

    describe('choices group filter function', function () {
        function createUiSelect() {
            return compileTemplate('<uix-select ng-model="selection.selected"> ' +
                '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
                '<uix-select-choices group-by="\'group\'" group-filter="filterInvertOrder"  ' +
                'repeat="person in people | filter: $select.search"> ' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
                '</uix-select-choices> ' +
                '</uix-select>');
        }

        it('should sort groups using filter', function () {
            var el = createUiSelect();
            expect(el.find('.uix-select-choices-group .uix-select-choices-group-label').map(function () {
                return this.textContent;
            }).toArray()).toEqual(['Foo', 'Baz', 'bar']);
        });
    });

    describe('choices group filter array', function () {
        function createUiSelect() {
            return compileTemplate('<uix-select ng-model="selection.selected">' +
                '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
                '<uix-select-choices group-by="\'group\'" group-filter="[\'Foo\']"' +
                'repeat="person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>');
        }

        it('should sort groups using filter', function () {
            var el = createUiSelect();
            expect(el.find('.uix-select-choices-group .uix-select-choices-group-label').map(function () {
                return this.textContent;
            }).toArray()).toEqual(['Foo']);
        });
    });


    it('should throw when no uix-select-choices found', function () {
        expect(function () {
            compileTemplate(
                '<uix-select ng-model="selection.selected"> ' +
                '<uix-select-match></uix-select-match> ' +
                '</uix-select>'
            );
        }).toThrow(new Error('[ui.xg.select:transcluded]'));
    });

    it('should throw when no repeat attribute is provided to uix-select-choices', function () {
        expect(function () {
            compileTemplate(
                '<uix-select ng-model="selection.selected"> ' +
                '<uix-select-choices></uix-select-choices> ' +
                '</uix-select>'
            );
        }).toThrow(new Error('[ui.xg.select:repeat]'));
    });

    it('should throw when repeat attribute has incorrect format ', function () {
        expect(function () {
            compileTemplate(
                '<uix-select ng-model="selection.selected">' +
                '<uix-select-match></uix-select-match>' +
                '<uix-select-choices repeat="incorrect format people"></uix-select-choices>' +
                '</uix-select>'
            );
        }).toThrow(new Error('[ui.xg.select:iexp]'));
    });

    it('should throw when no uix-select-match found', function () {
        expect(function () {
            compileTemplate(
                '<uix-select ng-model="selection.selected"> ' +
                '<uix-select-choices repeat="item in items"></uix-select-choices> ' +
                '</uix-select>'
            );
        }).toThrow(new Error('[ui.xg.select:transcluded]'));
    });

    it('should format the model correctly using alias', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected"> ' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
            '<uix-select-choices repeat="person as person in people | filter: $select.search"> ' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>'
        );
        clickItem(el, 'Samantha');
        expect(scope.selection.selected).toBe(scope.people[5]);
    });

    it('should parse the model correctly using alias', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected"> ' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
            '<uix-select-choices repeat="person as person in people | filter: $select.search"> ' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>'
        );
        scope.selection.selected = scope.people[5];
        scope.$digest();
        expect(getMatchLabel(el)).toEqual('Samantha');
    });

    it('should format the model correctly using property of alias', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected"> ' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
            '<uix-select-choices repeat="person.name as person in people | filter: $select.search"> ' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>'
        );
        clickItem(el, 'Samantha');
        expect(scope.selection.selected).toBe('Samantha');
    });

    it('should parse the model correctly using property of alias', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person.name as person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );
        scope.selection.selected = 'Samantha';
        scope.$digest();
        expect(getMatchLabel(el)).toEqual('Samantha');
    });

    it('should parse the model correctly using property of alias with async choices data', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected"> ' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
            '<uix-select-choices repeat="person.name as person in peopleAsync | filter: $select.search"> ' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>'
        );
        $timeout(function () {
            scope.peopleAsync = scope.people;
        });

        scope.selection.selected = 'Samantha';
        scope.$digest();
        expect(getMatchLabel(el)).toEqual('');

        $timeout.flush(); //After choices populated (async), it should show match correctly
        expect(getMatchLabel(el)).toEqual('Samantha');

    });

    //TODO Is this really something we should expect?
    it('should parse the model correctly using property of alias but passed whole object', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person.name as person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );
        scope.selection.selected = scope.people[5];
        scope.$digest();
        expect(getMatchLabel(el)).toEqual('Samantha');
    });

    it('should format the model correctly without alias', function () {
        var el = createUiSelect();
        clickItem(el, 'Samantha');
        expect(scope.selection.selected).toBe(scope.people[5]);
    });

    it('should parse the model correctly without alias', function () {
        var el = createUiSelect();
        scope.selection.selected = scope.people[5];
        scope.$digest();
        expect(getMatchLabel(el)).toEqual('Samantha');
    });

    it('should display choices correctly with child array', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person in someObject.people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );
        scope.selection.selected = scope.people[5];
        scope.$digest();
        expect(getMatchLabel(el)).toEqual('Samantha');
    });

    it('should format the model correctly using property of alias and when using child array for choices', function () {
        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person.name as person in someObject.people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );
        clickItem(el, 'Samantha');
        expect(scope.selection.selected).toBe('Samantha');
    });

    it('should invoke select callback on select', function () {

        scope.onSelectFn = function ($item, $model) {
            scope.$item = $item;
            scope.$model = $model;
        };
        var el = compileTemplate(
            '<uix-select on-select="onSelectFn($item, $model)" ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person.name as person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        expect(scope.$item).toBeFalsy();
        expect(scope.$model).toBeFalsy();

        clickItem(el, 'Samantha');
        $timeout.flush();


        expect(scope.selection.selected).toBe('Samantha');

        expect(scope.$item).toEqual(scope.people[5]);
        expect(scope.$model).toEqual('Samantha');

    });

    it('should invoke hover callback', function () {

        var highlighted;
        scope.onHighlightFn = function ($item) {
            highlighted = $item;
        };

        var el = compileTemplate(
            '<uix-select on-select="onSelectFn($item, $model)" ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices on-highlight="onHighlightFn(person)" ' +
            'repeat="person.name as person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        expect(highlighted).toBeFalsy();

        if (!isDropdownOpened(el)) {
            openDropdown(el);
        }

        $(el).find('.uix-select-choices-row div:contains("Samantha")').trigger('mouseover');
        scope.$digest();

        expect(highlighted).toBe(scope.people[5]);
    });

    it('should set $item & $model correctly when invoking callback on select and no single prop. binding', function () {

        scope.onSelectFn = function ($item, $model) {
            scope.$item = $item;
            scope.$model = $model;
        };

        var el = compileTemplate(
            '<uix-select on-select="onSelectFn($item, $model)" ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        expect(scope.$item).toBeFalsy();
        expect(scope.$model).toBeFalsy();

        clickItem(el, 'Samantha');
        expect(scope.$item).toEqual(scope.$model);

    });

    it('should invoke remove callback on remove', function () {

        scope.onRemoveFn = function ($item, $model) {
            scope.$item = $item;
            scope.$model = $model;
        };

        var el = compileTemplate(
            '<uix-select multiple on-remove="onRemoveFn($item, $model)" ng-model="selection.selected">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person.name as person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name" | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        expect(scope.$item).toBeFalsy();
        expect(scope.$model).toBeFalsy();

        clickItem(el, 'Samantha');
        clickItem(el, 'Adrian');
        el.find('.uix-select-match-item').first().find('.uix-select-match-close').click();
        $timeout.flush();

        expect(scope.$item).toBe(scope.people[5]);
        expect(scope.$model).toBe('Samantha');

    });

    it('should set $item & $model correctly when invoking callback on remove and no single prop. binding', function () {

        scope.onRemoveFn = function ($item, $model) {
            scope.$item = $item;
            scope.$model = $model;
        };

        var el = compileTemplate(
            '<uix-select multiple on-remove="onRemoveFn($item, $model)" ng-model="selection.selected"> ' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match> ' +
            '<uix-select-choices repeat="person in people | filter: $select.search"> ' +
            '<div ng-bind-html="person.name" | highlight: $select.search"></div> ' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
            '</uix-select-choices> ' +
            '</uix-select>'
        );

        expect(scope.$item).toBeFalsy();
        expect(scope.$model).toBeFalsy();

        clickItem(el, 'Samantha');
        clickItem(el, 'Adrian');
        el.find('.uix-select-match-item').first().find('.uix-select-match-close').click();
        $timeout.flush();

        expect(scope.$item).toBe(scope.people[5]);
        expect(scope.$model).toBe(scope.$item);
    });

    it('should allow creating tag in single select mode with tagging enabled', function () {

        scope.taggingFunc = function (name) {
            return name;
        };

        var el = compileTemplate(
            '<uix-select ng-model="selection.selected" tagging="taggingFunc" tagging-label="false">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name" | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        clickMatch(el);

        var searchInput = el.find('.uix-select-search');

        setSearchText(el, 'idontexist');

        triggerKeydown(searchInput, Key.Enter);

        expect($(el).scope().$select.selected).toEqual('idontexist');
    });

    it('should allow creating tag on ENTER in multiple select mode with tagging enabled, no labels', function () {

        scope.taggingFunc = function (name) {
            return name;
        };

        var el = compileTemplate(
            '<uix-select multiple ng-model="selection.selected" tagging="taggingFunc" tagging-label="false">' +
            '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name" | highlight: $select.search"></div>' +
            '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        var searchInput = el.find('.uix-select-search');

        setSearchText(el, 'idontexist');

        triggerKeydown(searchInput, Key.Enter);

        expect($(el).scope().$select.selected).toEqual(['idontexist']);
    });

    it('should append/transclude content (with correct scope) that users add at <match> tag', function () {

        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match>' +
            '<span ng-if="$select.selected.name!==\'Wladimir\'">{{$select.selected.name}}</span>' +
            '<span ng-if="$select.selected.name===\'Wladimir\'">{{$select.selected.name | uppercase}}</span>' +
            '</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        clickItem(el, 'Samantha');
        expect(getMatchLabel(el).trim()).toEqual('Samantha');

        clickItem(el, 'Wladimir');
        expect(getMatchLabel(el).trim()).not.toEqual('Wladimir');
        expect(getMatchLabel(el).trim()).toEqual('WLADIMIR');

    });
    it('should append/transclude content (with correct scope) that users add at <choices> tag', function () {

        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match>' +
            '</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-if="person.name==\'Wladimir\'">' +
            '<span class="only-once">I should appear only once</span>' +
            '</div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        openDropdown(el);
        expect($(el).find('.only-once').length).toEqual(1);


    });

    it('should call refresh function when search text changes', function () {

        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match>' +
            '</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search"' +
            'refresh="fetchFromServer($select.search)" refresh-delay="0">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-if="person.name==\'Wladimir\'">' +
            '<span class="only-once">I should appear only once</span>' +
            '</div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        scope.fetchFromServer = function () {
        };

        spyOn(scope, 'fetchFromServer');

        el.scope().$select.search = 'r';
        scope.$digest();
        $timeout.flush();

        expect(scope.fetchFromServer).toHaveBeenCalledWith('r');

    });

    it('should call refresh function when search text changes', function () {

        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match>' +
            '</uix-select-match>' +
            '<uix-select-choices repeat="person in people | filter: $select.search"' +
            'refresh="fetchFromServer($select.search)" refresh-delay="0">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-if="person.name==\'Wladimir\'">' +
            '<span class="only-once">I should appear only once</span>' +
            '</div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        scope.fetchFromServer = function () {
        };

        spyOn(scope, 'fetchFromServer');

        el.scope().$select.search = 'r';
        scope.$digest();
        $timeout.flush();

        expect(scope.fetchFromServer).toHaveBeenCalledWith('r');

    });

    it('should format view value correctly when using single property binding and refresh function', function () {

        var el = compileTemplate(
            '<uix-select ng-model="selection.selected">' +
            '<uix-select-match>{{$select.selected.name}}</uix-select-match>' +
            '<uix-select-choices repeat="person.name as person in people | filter: $select.search"' +
            'refresh="fetchFromServer($select.search)" refresh-delay="0">' +
            '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
            '<div ng-if="person.name==\'Wladimir\'">' +
            '<span class="only-once">I should appear only once</span>' +
            '</div>' +
            '</uix-select-choices>' +
            '</uix-select>'
        );

        scope.fetchFromServer = function (searching) {

            if (searching === 's') {
                return scope.people;
            }

            if (searching === 'o') {
                scope.people = []; //To simulate cases were previously selected item isnt in the list anymore
            }

        };

        setSearchText(el, 'r');
        clickItem(el, 'Samantha');
        expect(getMatchLabel(el)).toBe('Samantha');

        setSearchText(el, 'o');
        expect(getMatchLabel(el)).toBe('Samantha');

    });

    describe('search-enabled option', function () {

        var el;

        function setupSelectComponent(searchEnabled) {
            el = compileTemplate(
                '<uix-select ng-model="selection.selected" search-enabled="' + searchEnabled + '">' +
                '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
                '<uix-select-choices repeat="person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>'
            );
        }

        describe('bootstrap theme', function () {

            it('should show search input when true', function () {
                setupSelectComponent('true');
                clickMatch(el);
                expect($(el).find('.uix-select-search')).not.toHaveClass('ng-hide');
            });

            it('should hide search input when false', function () {
                setupSelectComponent('false');
                clickMatch(el);
                expect($(el).find('.uix-select-search')).toHaveClass('ng-hide');
            });

        });

    });


    describe('multi selection', function () {

        function createUiSelectMultiple(attrs) {
            var attrsHtml = '';
            if (angular.isDefined(attrs)) {
                if (angular.isDefined(attrs.disabled)) {
                    attrsHtml += ' ng-disabled="' + attrs.disabled + '"';
                }
                if (angular.isDefined(attrs.required)) {
                    attrsHtml += ' ng-required="' + attrs.required + '"';
                }
                if (angular.isDefined(attrs.tabindex)) {
                    attrsHtml += ' tabindex="' + attrs.tabindex + '"';
                }
                if (angular.isDefined(attrs.closeOnSelect)) {
                    attrsHtml += ' close-on-select="' + attrs.closeOnSelect + '"';
                }
                if (angular.isDefined(attrs.tagging)) {
                    attrsHtml += ' tagging="' + attrs.tagging + '"';
                }
                if (angular.isDefined(attrs.taggingTokens)) {
                    attrsHtml += ' tagging-tokens="' + attrs.taggingTokens + '"';
                }
            }

            return compileTemplate(
                '<uix-select multiple ng-model="selection.selectedMultiple"' + attrsHtml + ' style="width: 800px;"> ' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;' +
                '</uix-select-match> ' +
                '<uix-select-choices repeat="person in people | filter: $select.search"> ' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
                '</uix-select-choices> ' +
                '</uix-select>'
            );
        }

        it('should render initial state', function () {
            var el = createUiSelectMultiple();
            expect(el).toHaveClass('uix-select-multiple');
            expect(el.scope().$select.selected.length).toBe(0);
            expect(el.find('.uix-select-match-item').length).toBe(0);
        });

        it('should set model as an empty array if ngModel isnt defined after an item is selected', function () {

            // scope.selection.selectedMultiple = [];
            var el = createUiSelectMultiple();
            expect(scope.selection.selectedMultiple instanceof Array).toBe(false);
            clickItem(el, 'Samantha');
            expect(scope.selection.selectedMultiple instanceof Array).toBe(true);
        });

        it('should render initial selected items', function () {
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5]]; //Wladimir & Samantha
            var el = createUiSelectMultiple();
            expect(el.scope().$select.selected.length).toBe(2);
            expect(el.find('.uix-select-match-item').length).toBe(2);
        });

        it('should remove item by pressing X icon', function () {
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5]]; //Wladimir & Samantha
            var el = createUiSelectMultiple();
            expect(el.scope().$select.selected.length).toBe(2);
            el.find('.uix-select-match-item').first().find('.uix-select-match-close').click();
            expect(el.scope().$select.selected.length).toBe(1);
            // $timeout.flush();
        });

        it('should pass tabindex to searchInput', function () {
            var el = createUiSelectMultiple({tabindex: 5});
            var searchInput = el.find('.uix-select-search');

            expect(searchInput.attr('tabindex')).toEqual('5');
            expect($(el).attr('tabindex')).toBeUndefined();
        });

        it('should pass tabindex to searchInput when tabindex is an expression', function () {
            scope.tabValue = 22;
            var el = createUiSelectMultiple({tabindex: '{{tabValue + 10}}'});
            var searchInput = el.find('.uix-select-search');

            expect(searchInput.attr('tabindex')).toEqual('32');
            expect($(el).attr('tabindex')).toBeUndefined();
        });

        it('should not give searchInput a tabindex when uix-select does not have one', function () {
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            expect(searchInput.attr('tabindex')).toBeUndefined();
            expect($(el).attr('tabindex')).toBeUndefined();
        });

        it('should update size of search input after removing an item', function () {
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5]]; //Wladimir & Samantha
            var el = createUiSelectMultiple();

            spyOn(el.scope().$select, 'sizeSearchInput');


            el.find('.uix-select-match-item').first().find('.uix-select-match-close').click();
            expect(el.scope().$select.sizeSearchInput).toHaveBeenCalled();

        });

        it('should move to last match when pressing BACKSPACE key from search', function () {

            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            expect(isDropdownOpened(el)).toEqual(false);
            triggerKeydown(searchInput, Key.Backspace);
            expect(isDropdownOpened(el)).toEqual(false);
            expect(el.scope().$selectMultiple.activeMatchIndex).toBe(el.scope().$select.selected.length - 1);

        });

        it('should remove highlighted match when pressing BACKSPACE key from search and decrease activeMatchIndex',
            function () {
                scope.selection.selectedMultiple = [scope.people[4], scope.people[5], scope.people[6]];
                var el = createUiSelectMultiple();
                var searchInput = el.find('.uix-select-search');

                expect(isDropdownOpened(el)).toEqual(false);
                triggerKeydown(searchInput, Key.Left);
                triggerKeydown(searchInput, Key.Left);
                triggerKeydown(searchInput, Key.Backspace);
                expect(el.scope().$select.selected).toEqual([scope.people[4], scope.people[6]]); //Wladimir & Nicole

                expect(el.scope().$selectMultiple.activeMatchIndex).toBe(0);
            }
        );

        it('should remove highlighted match when pressing DELETE key from search and keep same activeMatchIndex',
            function () {

                //Wladimir, Samantha & Nicole
                scope.selection.selectedMultiple = [scope.people[4], scope.people[5], scope.people[6]];
                var el = createUiSelectMultiple();
                var searchInput = el.find('.uix-select-search');

                expect(isDropdownOpened(el)).toEqual(false);
                triggerKeydown(searchInput, Key.Left);
                triggerKeydown(searchInput, Key.Left);
                triggerKeydown(searchInput, Key.Delete);
                expect(el.scope().$select.selected).toEqual([scope.people[4], scope.people[6]]); //Wladimir & Nicole

                expect(el.scope().$selectMultiple.activeMatchIndex).toBe(1);

            });

        it('should move to last match when pressing LEFT key from search', function () {

            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            expect(isDropdownOpened(el)).toEqual(false);
            triggerKeydown(searchInput, Key.Left);
            expect(isDropdownOpened(el)).toEqual(false);
            expect(el.scope().$selectMultiple.activeMatchIndex).toBe(el.scope().$select.selected.length - 1);

        });

        it('should move between matches when pressing LEFT key from search', function () {

            //Wladimir, Samantha & Nicole
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5], scope.people[6]];
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            expect(isDropdownOpened(el)).toEqual(false);
            triggerKeydown(searchInput, Key.Left);
            triggerKeydown(searchInput, Key.Left);
            expect(isDropdownOpened(el)).toEqual(false);
            expect(el.scope().$selectMultiple.activeMatchIndex).toBe(el.scope().$select.selected.length - 2);
            triggerKeydown(searchInput, Key.Left);
            triggerKeydown(searchInput, Key.Left);
            triggerKeydown(searchInput, Key.Left);
            expect(el.scope().$selectMultiple.activeMatchIndex).toBe(0);

        });

        it('should decrease $selectMultiple.activeMatchIndex when pressing LEFT key', function () {

            //Wladimir, Samantha & Nicole
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5], scope.people[6]];
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            el.scope().$selectMultiple.activeMatchIndex = 3;
            triggerKeydown(searchInput, Key.Left);
            triggerKeydown(searchInput, Key.Left);
            expect(el.scope().$selectMultiple.activeMatchIndex).toBe(1);

        });

        it('should increase $selectMultiple.activeMatchIndex when pressing RIGHT key', function () {

            //Wladimir, Samantha & Nicole
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5], scope.people[6]];
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            el.scope().$selectMultiple.activeMatchIndex = 0;
            triggerKeydown(searchInput, Key.Right);
            triggerKeydown(searchInput, Key.Right);
            expect(el.scope().$selectMultiple.activeMatchIndex).toBe(2);

        });

        it('should open dropdown when pressing DOWN key', function () {

            scope.selection.selectedMultiple = [scope.people[4], scope.people[5]]; //Wladimir & Samantha
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            expect(isDropdownOpened(el)).toEqual(false);
            triggerKeydown(searchInput, Key.Down);
            expect(isDropdownOpened(el)).toEqual(true);

        });

        it('should search/open dropdown when writing to search input', function () {

            scope.selection.selectedMultiple = [scope.people[5]]; //Wladimir & Samantha
            var el = createUiSelectMultiple();

            el.scope().$select.search = 'r';
            scope.$digest();
            expect(isDropdownOpened(el)).toEqual(true);

        });

        it('should add selected match to selection array', function () {

            scope.selection.selectedMultiple = [scope.people[5]]; //Samantha
            var el = createUiSelectMultiple();

            clickItem(el, 'Wladimir');
            expect(scope.selection.selectedMultiple).toEqual([scope.people[5], scope.people[4]]); //Samantha & Wladimir

        });

        it('should close dropdown after selecting', function () {

            scope.selection.selectedMultiple = [scope.people[5]]; //Samantha
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            expect(isDropdownOpened(el)).toEqual(false);
            triggerKeydown(searchInput, Key.Down);
            expect(isDropdownOpened(el)).toEqual(true);

            clickItem(el, 'Wladimir');

            expect(isDropdownOpened(el)).toEqual(false);

        });

        it('should not close dropdown after selecting if closeOnSelect=false', function () {

            scope.selection.selectedMultiple = [scope.people[5]]; //Samantha
            var el = createUiSelectMultiple({closeOnSelect: false});
            var searchInput = el.find('.uix-select-search');

            expect(isDropdownOpened(el)).toEqual(false);
            triggerKeydown(searchInput, Key.Down);
            expect(isDropdownOpened(el)).toEqual(true);

            clickItem(el, 'Wladimir');

            expect(isDropdownOpened(el)).toEqual(true);

        });

        it('should closes dropdown when pressing ESC key from search input', function () {

            //Wladimir, Samantha & Nicole
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5], scope.people[6]];
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            expect(isDropdownOpened(el)).toEqual(false);
            triggerKeydown(searchInput, Key.Down);
            expect(isDropdownOpened(el)).toEqual(true);
            triggerKeydown(searchInput, Key.Escape);
            expect(isDropdownOpened(el)).toEqual(false);

        });

        it('should select highlighted match when pressing ENTER key from dropdown', function () {

            scope.selection.selectedMultiple = [scope.people[5]]; //Samantha
            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            triggerKeydown(searchInput, Key.Down);
            triggerKeydown(searchInput, Key.Enter);
            expect(scope.selection.selectedMultiple.length).toEqual(2);

        });

        it('should stop the propagation when pressing ENTER key from dropdown', function () {

            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');
            spyOn(jQuery.Event.prototype, 'preventDefault');
            spyOn(jQuery.Event.prototype, 'stopPropagation');

            triggerKeydown(searchInput, Key.Down);
            triggerKeydown(searchInput, Key.Enter);
            expect(jQuery.Event.prototype.preventDefault).toHaveBeenCalled();
            expect(jQuery.Event.prototype.stopPropagation).toHaveBeenCalled();

        });

        it('should stop the propagation when pressing ESC key from dropdown', function () {

            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');
            spyOn(jQuery.Event.prototype, 'preventDefault');
            spyOn(jQuery.Event.prototype, 'stopPropagation');

            triggerKeydown(searchInput, Key.Down);
            triggerKeydown(searchInput, Key.Escape);
            expect(jQuery.Event.prototype.preventDefault).toHaveBeenCalled();
            expect(jQuery.Event.prototype.stopPropagation).toHaveBeenCalled();

        });

        it('should increase $select.activeIndex when pressing DOWN key from dropdown', function () {

            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            triggerKeydown(searchInput, Key.Down); //Open dropdown

            el.scope().$select.activeIndex = 0;
            triggerKeydown(searchInput, Key.Down);
            triggerKeydown(searchInput, Key.Down);
            expect(el.scope().$select.activeIndex).toBe(2);

        });

        it('should decrease $select.activeIndex when pressing UP key from dropdown', function () {

            var el = createUiSelectMultiple();
            var searchInput = el.find('.uix-select-search');

            triggerKeydown(searchInput, Key.Down); //Open dropdown

            el.scope().$select.activeIndex = 5;
            triggerKeydown(searchInput, Key.Up);
            triggerKeydown(searchInput, Key.Up);
            expect(el.scope().$select.activeIndex).toBe(3);

        });

        it('should render initial selected items', function () {
            scope.selection.selectedMultiple = [scope.people[4], scope.people[5]]; //Wladimir & Samantha
            var el = createUiSelectMultiple();
            expect(el.scope().$select.selected.length).toBe(2);
            expect(el.find('.uix-select-match-item').length).toBe(2);
        });

        it('should parse the items correctly using single property binding', function () {

            scope.selection.selectedMultiple = ['wladimir@email.com', 'samantha@email.com'];

            var el = compileTemplate(
                '<uix-select multiple ng-model="selection.selectedMultiple"  style="width: 800px;">' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;</uix-select-match>' +
                '<uix-select-choices repeat="person.email as person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>'
            );

            expect(el.scope().$select.selected).toEqual([scope.people[4], scope.people[5]]);

        });

        it('should add selected match to selection array using single property binding', function () {

            scope.selection.selectedMultiple = ['wladimir@email.com', 'samantha@email.com'];

            var el = compileTemplate(
                '<uix-select multiple ng-model="selection.selectedMultiple" style="width: 800px;">' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;</uix-select-match>' +
                '<uix-select-choices repeat="person.email as person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>'
            );


            clickItem(el, 'Natasha');

            expect(el.scope().$select.selected).toEqual([scope.people[4], scope.people[5], scope.people[7]]);
            scope.selection.selectedMultiple = ['wladimir@email.com', 'samantha@email.com', 'natasha@email.com'];

        });

        it('should format view value correctly when using single property binding and refresh function', function () {

            scope.selection.selectedMultiple = ['wladimir@email.com', 'samantha@email.com'];

            var el = compileTemplate(
                '<uix-select multiple ng-model="selection.selectedMultiple"  style="width: 800px;">' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;</uix-select-match>' +
                '<uix-select-choices repeat="person.email as person in people | filter: $select.search"' +
                'refresh="fetchFromServer($select.search)" refresh-delay="0">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>'
            );


            scope.fetchFromServer = function (searching) {

                if (searching === 'n') {
                    return scope.people;
                }

                if (searching === 'o') {
                    scope.people = []; //To simulate cases were previously selected item isnt in the list anymore
                }

            };

            setSearchText(el, 'n');
            clickItem(el, 'Nicole');

            expect(el.find('.uix-select-match-item [uix-transclude-append]:not(.ng-hide)').text())
                .toBe('Wladimir <wladimir@email.com>Samantha <samantha@email.com>Nicole <nicole@email.com>');

            setSearchText(el, 'o');

            expect(el.find('.uix-select-match-item [uix-transclude-append]:not(.ng-hide)').text())
                .toBe('Wladimir <wladimir@email.com>Samantha <samantha@email.com>Nicole <nicole@email.com>');

        });

        it('should watch changes for $select.selected and update formatted value correctly', function () {

            scope.selection.selectedMultiple = ['wladimir@email.com', 'samantha@email.com'];

            var el = compileTemplate(
                '<uix-select multiple ng-model="selection.selectedMultiple"  style="width: 800px;">' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;</uix-select-match>' +
                '<uix-select-choices repeat="person.email as person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>'
            );

            expect(el.find('.uix-select-match-item [uix-transclude-append]:not(.ng-hide)').text())
                .toBe('Wladimir <wladimir@email.com>Samantha <samantha@email.com>');

            clickItem(el, 'Nicole');

            expect(el.find('.uix-select-match-item [uix-transclude-append]:not(.ng-hide)').text())
                .toBe('Wladimir <wladimir@email.com>Samantha <samantha@email.com>Nicole <nicole@email.com>');

            expect(scope.selection.selectedMultiple.length).toBe(3);

        });


        it('should change viewvalue only once when updating modelvalue', function () {

            scope.selection.selectedMultiple = ['wladimir@email.com', 'samantha@email.com'];

            var el = compileTemplate(
                '<uix-select ng-change="onlyOnce()" multiple ' +
                'ng-model="selection.selectedMultiple"  style="width: 800px;">' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;</uix-select-match>' +
                '<uix-select-choices repeat="person.email as person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>'
            );

            scope.counter = 0;
            scope.onlyOnce = function () {
                scope.counter++;
            };

            clickItem(el, 'Nicole');

            expect(scope.counter).toBe(1);

        });


        it('should run $formatters when changing model directly', function () {

            scope.selection.selectedMultiple = ['wladimir@email.com', 'samantha@email.com'];

            var el = compileTemplate(
                '<uix-select multiple ng-model="selection.selectedMultiple"  style="width: 800px;"> ' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;</uix-select-match> ' +
                '<uix-select-choices repeat="person.email as person in people | filter: $select.search"> ' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div> ' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div> ' +
                '</uix-select-choices> ' +
                '</uix-select> ');

            // var el2 = compileTemplate('<span class="resultDiv" ng-bind="selection.selectedMultiple"></span>');

            scope.selection.selectedMultiple.push('nicole@email.com');

            scope.$digest();
            // 2nd $digest needed when using angular 1.3.0-rc.1+
            // might be related with the fact that the value is an array
            scope.$digest();

            expect(el.find('.uix-select-match-item [uix-transclude-append]:not(.ng-hide)').text())
                .toBe('Wladimir <wladimir@email.com>Samantha <samantha@email.com>Nicole <nicole@email.com>');

        });

        it('should support multiple="multiple" attribute', function () {

            var el = compileTemplate(
                '<uix-select multiple="multiple" ng-model="selection.selectedMultiple"  style="width: 800px;">' +
                '<uix-select-match placeholder="Pick one...">' +
                '{{$item.name}} &lt;{{$item.email}}&gt;</uix-select-match>' +
                '<uix-select-choices repeat="person.email as person in people | filter: $select.search">' +
                '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                '</uix-select-choices>' +
                '</uix-select>'
            );

            expect(el.scope().$select.multiple).toBe(true);
        });

        it('should allow paste tag from clipboard', function () {
            scope.taggingFunc = function (name) {
                return {
                    name: name,
                    email: name + '@email.com',
                    group: 'Foo',
                    age: 12
                };
            };

            var el = createUiSelectMultiple({tagging: 'taggingFunc', taggingTokens: ',|ENTER'});
            clickMatch(el);
            triggerPaste(el.find('input'), 'tag1');

            expect($(el).scope().$select.selected.length).toBe(1);
        });

        it('should allow paste multiple tags', function () {
            scope.taggingFunc = function (name) {
                return {
                    name: name,
                    email: name + '@email.com',
                    group: 'Foo',
                    age: 12
                };
            };

            var el = createUiSelectMultiple({tagging: 'taggingFunc', taggingTokens: ',|ENTER'});
            clickMatch(el);
            triggerPaste(el.find('input'), ',tag1,tag2,tag3,,tag5,');

            expect($(el).scope().$select.selected.length).toBe(5);
        });
    });

    describe('default configuration via uixSelectConfig', function () {

        describe('searchEnabled option', function () {

            function setupWithoutAttr() {
                return compileTemplate(
                    '<uix-select ng-model="selection.selected">' +
                    '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
                    '<uix-select-choices repeat="person in people | filter: $select.search">' +
                    '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                    '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                    '</uix-select-choices>' +
                    '</uix-select>'
                );
            }

            function setupWithAttr(searchEnabled) {
                return compileTemplate(
                    '<uix-select ng-model="selection.selected" search-enabled="' + searchEnabled + '">' +
                    '<uix-select-match placeholder="Pick one...">{{$select.selected.name}}</uix-select-match>' +
                    '<uix-select-choices repeat="person in people | filter: $select.search">' +
                    '<div ng-bind-html="person.name | highlight: $select.search"></div>' +
                    '<div ng-bind-html="person.email | highlight: $select.search"></div>' +
                    '</uix-select-choices>' +
                    '</uix-select>'
                );
            }

            it('should be true by default', function () {
                var el = setupWithoutAttr();
                expect(el.scope().$select.searchEnabled).toBe(true);
            });

            it('should disable search if default set to false', function () {
                var uixSelectConfig = $injector.get('uixSelectConfig');
                uixSelectConfig.searchEnabled = false;

                var el = setupWithoutAttr();
                expect(el.scope().$select.searchEnabled).not.toBe(true);
            });

            it('should be overridden by inline option search-enabled=true', function () {
                var uixSelectConfig = $injector.get('uixSelectConfig');
                uixSelectConfig.searchEnabled = false;

                var el = setupWithAttr(true);
                expect(el.scope().$select.searchEnabled).toBe(true);
            });

            it('should be overridden by inline option search-enabled=false', function () {
                var uixSelectConfig = $injector.get('uixSelectConfig');
                uixSelectConfig.searchEnabled = true;

                var el = setupWithAttr(false);
                expect(el.scope().$select.searchEnabled).not.toBe(true);
            });
        });

    });

    describe('accessibility', function () {
        it('should have baseTitle in scope', function () {
            expect(createUiSelect().scope().$select.baseTitle).toBe('Select box');
            expect(createUiSelect().scope().$select.focusserTitle).toBe('Select box focus');
            expect(createUiSelect({title: 'Choose a person'}).scope().$select.baseTitle).toBe('Choose a person');
            expect(createUiSelect({title: 'Choose a person'}).scope()
                .$select.focusserTitle).toBe('Choose a person focus');
        });

        it('should have aria-label on all input and button elements', function () {
            checkTheme();
            checkTheme('select2');
            checkTheme('selectize');
            checkTheme('bootstrap');

            function checkTheme(theme) {
                var el = createUiSelect({theme: theme});
                checkElements(el.find('input'));
                checkElements(el.find('button'));

                function checkElements(els) {
                    for (var i = 0; i < els.length; i++) {
                        expect(els[i].attributes['aria-label']).toBeTruthy();
                    }
                }
            }
        });
    });

    describe('select with the append to body option', function () {
        var body;

        beforeEach(inject(function ($document) {
            body = $document.find('body')[0];
        }));

        it('should only be moved to the body when the appendToBody option is true', function () {
            var el = createUiSelect({appendToBody: false});
            openDropdown(el);
            expect(el.parent()[0]).not.toBe(body);
        });

        it('should be moved to the body when the appendToBody is true in uixSelectConfig',
            inject(function (uixSelectConfig) {
                uixSelectConfig.appendToBody = true;
                var el = createUiSelect();
                openDropdown(el);
                expect(el.parent()[0]).toBe(body);
            })
        );

        it('should be moved to the body when opened', function () {
            var el = createUiSelect({appendToBody: true});
            openDropdown(el);
            expect(el.parent()[0]).toBe(body);
            closeDropdown(el);
            expect(el.parent()[0]).not.toBe(body);
        });

        it('should remove itself from the body when the scope is destroyed', function () {
            var el = createUiSelect({appendToBody: true});
            openDropdown(el);
            expect(el.parent()[0]).toBe(body);
            el.scope().$destroy();
            expect(el.parent()[0]).not.toBe(body);
        });

        it('should have specific position and dimensions', function () {
            var el = createUiSelect({appendToBody: true});
            var originalPosition = el.css('position');
            var originalTop = el.css('top');
            var originalLeft = el.css('left');
            var originalWidth = el.css('width');
            openDropdown(el);
            expect(el.css('position')).toBe('absolute');
            expect(el.css('top')).toBe('100px');
            expect(el.css('left')).toBe('200px');
            expect(el.css('width')).toBe('300px');
            closeDropdown(el);
            expect(el.css('position')).toBe(originalPosition);
            expect(el.css('top')).toBe(originalTop);
            expect(el.css('left')).toBe(originalLeft);
            expect(el.css('width')).toBe(originalWidth);
        });
    });

});
