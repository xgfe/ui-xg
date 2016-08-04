describe('loader', function () {
    var $compile, $rootScope, element, $scope, $timeout;

    beforeEach(module('ui.xg.loader'));

    beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $timeout = _$timeout_;
    }));

    describe('basic', function () {
        function loader($scope) {
            return $compile(
                '<div>' +
                '<div uix-loader="isLoading">' +
                '</div>' +
                '</div>'
            )($scope);
        }

        beforeEach(function () {
            $scope = $rootScope.$new();
            element = loader($scope);
            $scope.isLoading = 0;
        });

        it('should has a loader class', function () {
            expect(element.hasClass('uix-loader')).toBe(true);
        });

        it('should has a loader Tpl', function () {
            expect(element.find('.loading').length).toBe(0);
            $scope.$apply(function () {
                $scope.isLoading = 1;
            });
            expect(element.find('.loading').length).toBe(1);
            $scope.$apply(function () {
                $scope.isLoading = 0;
            });
            $timeout(function () {
                expect(element.find('.loading').length).toBe(0);
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
    });

    describe('senior', function () {
        function loader($scope) {
            return $compile(
                '<div>' +
                '<div uix-loader="isLoading" loader-height="300" loader-width="300">' +
                '</div>' +
                '</div>'
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
            expect(element.find('.loading').width()).toBe(300);
            expect(element.find('.loading').height()).toBe(300);
        });

        it('should has a fixed height error', function () {
            expect(element.find('.error-tip').length).toBe(0);
            $scope.$apply(function () {
                $scope.isLoading = 1;
                $scope.isLoading = -1;
            });
            $timeout(function () {
                expect(element.find('.error-tip').width()).toBe(300);
                expect(element.find('.error-tip').height()).toBe(300);
            }, 1000);
        });
    });
});
