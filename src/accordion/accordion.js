/**
 * accordion
 * accordion directive
 * Author: chenwubai.cx@gmail.com
 * Date:2016-08-05
 */
angular.module('ui.xg.accordion', ['ui.xg.collapse'])
    .constant('uixAccordionConfig', {
        closeOthers: true
    })
    .controller('uixAccordionCtrl', ['$scope', '$attrs', 'uixAccordionConfig', function ($scope, $attrs, uixAccordionConfig) {
        this.groupList = [];
        var _this = this;
        if(angular.isUndefined($attrs.closeOthers)) {
            $scope.closeOthers = uixAccordionConfig.closeOthers;
        }
        // console.log($attrs.closeOthers, $scope.closeOthers);

        this.addGroupScope = function (groupScope) {
            _this.groupList.push(groupScope);
            groupScope.$on('$destroy', function () {
                _this.removeGroupScope(groupScope);
            });
        };

        this.removeGroupScope = function (groupScope) {
            var index = _this.groupList.indexOf(groupScope);
            if(index > -1) {
                _this.groupList.splice(index, 1);
            }
        };

        this.closeOthers = function (groupScope) {
            // console.log($scope.closeOthers);
            if($scope.closeOthers) {
                angular.forEach(_this.groupList, function (itemScope) {
                    if(itemScope !== groupScope) {
                        itemScope.isOpen = false;
                    }
                });
            }
        };
    }])
    .directive('uixAccordion', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/accordion.html',
            transclude: true,
            require: ['uixAccordion'],
            scope: {
                closeOthers: '=?'
            },
            controller: 'uixAccordionCtrl'
        };
    })
    .directive('uixAccordionGroup', function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/group.html',
            require: '^uixAccordion',
            replace: true,
            transclude: true,
            scope: {
                heading: '@',
                isDisabled: '=?',
                isOpen: '=?'
            },
            controller: function () {

            },
            link: function (scope, el, attrs, uixAccordionCtrl) {
                if(angular.isUndefined(attrs.isOpen)) {
                    scope.isOpen = true;
                }
                if(angular.isUndefined(scope.isDisabled)) {
                    scope.isDisabled = false;
                }
                uixAccordionCtrl.addGroupScope(scope);
                scope.$watch('isOpen', function (value) {
                    if(value) {
                        uixAccordionCtrl.closeOthers(scope);
                    }
                });
            }
        };
    });
