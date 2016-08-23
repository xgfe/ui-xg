describe('uix-typeahead', function () {
    var elm,
        $q,
        scope,
        $compile,
        deferred,
        $document,
        $rootScope;

    beforeEach(function () {
        module('ui.xg.typeahead');
        module('typeahead/templates/typeaheadTpl.html');
    });

    beforeEach(inject(function (_$rootScope_, _$compile_, _$q_, _$document_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        $document = _$document_;
        deferred = $q.defer();
    }));

    describe('basic', function () {
        function loader($scope) {
            return $compile(
                '<uix-typeahead ng-model="selected" query-list="states" placeholder="placeholder text"></uix-typeahead>'
            )($scope);
        }

        beforeEach(function () {
            scope = $rootScope.$new();
            scope.selected = 'nomatch';
            scope.states = ['text1', 'text2', 'other'];
            elm = loader(scope);
            scope.$apply();
        });

        it('should has a typeahead directive', function () {
            expect(elm.hasClass('uix-typeahead'));
        });

        it('should has a default text', function () {
            expect(elm.find('input').attr('placeholder')).toBe('placeholder text');
            expect(elm.find('input').val()).toBe(scope.selected);
        });

        it('should be empty if input is empty', function () {
            expect(elm.find('li').length).toBe(0);
            scope.$apply(function () {
                scope.selected = 'text';
            });
            expect(elm.find('li').length).toBe(2);
            scope.$apply(function () {
                scope.selected = '';
            });
            expect(elm.find('ul')).toHaveClass('ng-hide');
        });

        it('should has matched items', function () {
            expect(elm.find('li').length).toBe(0);
            scope.$apply(function () {
                scope.selected = 'text';
            });
            expect(elm.find('li').length).toBe(2);
            scope.$apply(function () {
                scope.selected = 'e';
            });
            expect(elm.find('li').length).toBe(3);
        });

        it('could change states', function () {
            expect(elm.find('li').length).toBe(0);
            scope.$apply(function () {
                scope.states = ['nomatch1', 'nomatch2', 'nomatch3'];
                elm = loader(scope);
            });
            expect(elm.find('li').length).toBe(3);
        });
    });

    describe('junior', function () {
        function loader($scope) {
            return $compile(
                '<uix-typeahead ng-model="selected" get-async-func="getData" typeahead-loading="isLoading" typeahead-no-results="noResults"></uix-typeahead>'
            )($scope);
        }

        beforeEach(function () {
            scope = $rootScope.$new();
            scope.selected = 'ttt';
            scope.isLoading = false;
            scope.noResults = false;
            scope.getData = function () {
                return deferred.promise;
            };
            elm = loader(scope);
            scope.$apply();
        });

        it('will trigger "asyncFunc" function', function () {
            expect(elm.find('li').length).toBe(0);
            deferred.resolve(['test1', 'test2']);
            scope.$digest();
            expect(elm.find('li').length).toBe(2);
        });

        it('should not display anything when promise is rejected', function () {
            deferred.reject('fail');
            scope.$digest();
            expect(elm.find('li').length).toBe(0);
            expect(scope.isLoading).toBeFalsy();
            expect(scope.noResults).toBeTruthy();
        });

        it('loading attr should change if promise change', function () {
            expect(scope.isLoading).toBeTruthy();
            deferred.resolve(['text1', 'text2']);
            scope.$digest();
            expect(scope.isLoading).toBeFalsy();
        });

        it('result attr should change if promise change', function () {
            expect(scope.noResults).toBeFalsy();
            deferred.resolve([]);
            scope.$digest();
            expect(scope.noResults).toBeTruthy();
        });
    });

    describe('senior', function () {
        function loader($scope) {
            return $compile(
                '<uix-typeahead ng-model="selected" query-list="states" typeahead-loading="isLoading" typeahead-no-results="noResults"></uix-typeahead>'
            )($scope);
        }

        function triggerKeyDown(element, keyCode) {
            var evt = $.Event('keydown');
            evt.which = keyCode;
            element.trigger(evt);
        }

        beforeEach(function () {
            scope = $rootScope.$new();
            scope.selected = 'text';
            scope.states = ['text1', 'text2', 'other'];
            elm = loader(scope);
            scope.$apply();
        });

        it('will trigger when select a item', function () {
            expect(elm.find('ul')).not.toHaveClass('ng-hide');
            elm.find('li')[0].click();
            expect(elm.find('ul')).toHaveClass('ng-hide');
        });

        it('will trigger when click the document', function () {
            expect(elm.find('ul')).not.toHaveClass('ng-hide');
            $document.click();
            expect(elm.find('ul')).toHaveClass('ng-hide');
        });

        it('press "up&down" key should change active item', function () {
            expect(elm.find('li').eq(0)).toHaveClass('active');

            var evt = $.Event('keydown');
            evt.which = 40;
            $document.trigger(evt);

            expect(elm.find('li').eq(1)).toHaveClass('active');
        });

        it('press "up&down" key should change active item', function () {
            expect(elm.find('li').eq(0)).toHaveClass('active');
            triggerKeyDown($document, 40);
            expect(elm.find('li').eq(1)).toHaveClass('active');
            triggerKeyDown($document, 38);
            expect(elm.find('li').eq(0)).toHaveClass('active');
        });

        it('press "tab&enter" key should select an item', function () {
            expect(elm.find('ul')).not.toHaveClass('ng-hide');
            triggerKeyDown($document, 9);
            expect(elm.find('ul')).toHaveClass('ng-hide');
        });

    });

});
