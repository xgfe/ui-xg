describe('tableLoader', function () {
    var $compile, $rootScope, element, $scope, $timeout, tbody, thead;

    beforeEach(module('ui.xg.tableLoader'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    describe('basic', function () {
        function loader($scope) {
            return $compile(
                '<table uix-table-loader="isLoading" no-thead="false">' +
                '<thead><tr><th></th></tr></thead>' +
                '<tbody><tr><td></td></tr></tbody>' +
                '</table>'
            )($scope);
        }

        beforeEach(function () {
            $scope = $rootScope.$new();
            element = loader($scope);
            $scope.isLoading = 0;
            tbody = element.find('tbody');
            thead = element.find('thead');
        });

        it('should has a tableLoader class', function () {
            expect(element.hasClass('uix-table-loader')).toBe(true);
        });

        it('should has a loader Tpl', function () {
            expect(tbody.length).toBe(1);
            expect(thead.length).toBe(1);
            expect(element.find('.loading').length).toBe(0);
            $scope.$apply(function () {
                $scope.isLoading = 1;
            });
            expect(thead).not.toBeHidden();
            expect(tbody).toBeHidden();
            expect(element.find('.loading').length).toBe(1);

            $scope.$apply(function () {
                $scope.isLoading = 0;
            });
            $timeout(function () {
                expect(element.find('.loading').length).toBe(0);
                expect(thead).not.toBeHidden();
                expect(tbody).not.toBeHidden();
            }, 1000);
        });

        it('should has a error Tpl', function () {
            expect(element.find('.loading').length).toBe(0);
            expect(element.find('.error-tip').length).toBe(0);
            $scope.$apply(function () {
                $scope.isLoading = 1;
            });
            expect(element.find('.loading').length).toBe(1);
            $scope.$apply(function () {
                $scope.isLoading = -1;
            });
            $timeout(function () {
                expect(element.find('.loading').length).toBe(0);
                expect(element.find('.error-tip').length).toBe(1);
            }, 1000);
        });

        it('should has a thead', function () {
            expect(tbody.length).toBe(1);
            expect(thead.length).toBe(1);
            $scope.$apply(function () {
                $scope.isLoading = 1;
            });
            expect(thead).not.toBeHidden();
            expect(tbody).toBeHidden();

            $scope.$apply(function () {
                $scope.isLoading = 0;
            });
            $timeout(function () {
                expect(thead).not.toBeHidden();
                expect(tbody).not.toBeHidden();
            }, 1000);
        });
    });

    describe('junior', function () {
        function loader($scope) {
            return $compile(
                '<table uix-table-loader="isLoading" no-thead="true">' +
                '<thead><tr><th></th></tr></thead>' +
                '<tbody><tr><td></td></tr></tbody>' +
                '</table>'
            )($scope);
        }

        beforeEach(function () {
            $scope = $rootScope.$new();
            element = loader($scope);
            $scope.isLoading = 0;
            tbody = element.find('tbody');
            thead = element.find('thead');
        });


        it('should has no thead', function () {
            expect(thead).not.toBeHidden();
            expect(tbody).not.toBeHidden();
            $scope.$apply(function () {
                $scope.isLoading = 1;
            });
            expect(thead).toBeHidden();
            expect(tbody).toBeHidden();

            $scope.$apply(function () {
                $scope.isLoading = 0;
            });
            $timeout(function () {
                expect(thead).not.toBeHidden();
                expect(tbody).not.toBeHidden();
            }, 1000);
        });
    });

    describe('senior', function () {
        function loader($scope) {
            return $compile(
                '<table uix-table-loader="isLoading" loader-height="300">' +
                '<thead><tr><th></th></tr></thead>' +
                '<tbody><tr><td></td></tr></tbody>' +
                '</table>'
            )($scope);
        }

        beforeEach(function () {
            $scope = $rootScope.$new();
            element = loader($scope);
            $scope.isLoading = 0;
        });

        it('should has a fixed height loader', function () {
            expect(element.find('.loading').length).toBe(0);
            $scope.$apply(function () {
                $scope.isLoading = 1;
            });
            expect(element.find('.loading').height()).toBe(300);
        });

        it('should has a fixed height error', function () {
            expect(element.find('.error-tip').length).toBe(0);
            $scope.$apply(function () {
                $scope.isLoading = 1;
                $scope.isLoading = -1;
            });
            $timeout(function () {
                expect(element.find('.error-tip').height()).toBe(300);
            }, 1000);
        });
    });


});
