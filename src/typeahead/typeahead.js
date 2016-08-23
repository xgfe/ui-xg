/**
 * typeahead
 * 搜索提示指令
 * Author:heqingyang@meituan.com
 * Date:2016-08-17
 */

angular.module('ui.xg.typeahead', [])
    .filter('html', ['$sce', function ($sce) {
        return function (input, type) {
            if (angular.isString(input)) {
                return $sce.trustAs(type || 'html', input);
            } else {
                return '';
            }
        };
    }])
    .controller('uixTypeaheadCtrl', ['$scope', '$attrs', '$element', '$document', '$q', '$log',
        function ($scope, $attrs, $element, $document, $q, $log) {

            var $ = angular.element;
            var listElm = $('[uix-typeahead-popup]');
            var ngModelCtrl = {$setViewValue: angular.noop};
            var placeholder = angular.isDefined($scope.placeholder) ? $scope.placeholder : '';
            var asyncFunc = $scope.$parent.$eval($attrs.getAsyncFunc);
            var openScope = null;
            var isResult = false;

            $scope.$q = $q;
            $scope.typeahead = {};
            $scope.matchList = [];
            $scope.queryList = $scope.queryList || [];
            $scope.typeaheadLoading = $scope.typeaheadLoading || false;
            $scope.typeaheadNoResults = $scope.typeaheadNoResults || false;
            $scope.activeIndex = 0;
            $scope.listLength = 0;
            $scope.isShow = false;

            this.elm = $element;
            this.init = function (_ngModelCtrl) {
                ngModelCtrl = _ngModelCtrl;
                ngModelCtrl.$render = this.render;
            };
            this.render = function () {
                $scope.typeahead.query = ngModelCtrl.$modelValue;
            };

            $element.addClass('.uix-typeahead');
            $element.find('input').attr('placeholder', placeholder);
            listElm.bind('click', function (evt) {
                evt.preventDefault();
                evt.stopPropagation();
            });

            // 监听typeahead.query变量,对matchList进行处理
            $scope.$watch('typeahead.query', function (newValue) {
                var Reg = new RegExp(newValue, 'gim');
                ngModelCtrl.$setViewValue(newValue);
                ngModelCtrl.$render();

                if(isResult) {
                    isResult = false;
                    return;
                }
                if(newValue === '') {
                    $scope.isShow = false;
                    return;
                }
                $scope.matchList = [];

                // 如果有异步处理函数,直接执行,否则使用本地数据
                if(asyncFunc) {
                    $scope.typeaheadLoading = true;
                    $scope.$q.when(asyncFunc(newValue))
                        .then(function (matches) {
                            $scope.typeaheadLoading = false;
                            $scope.matchList = matches.map(function (item) {
                                return {'text': item, 'html': item};
                            });
                            if($scope.matchList.length === 0) {
                                $scope.typeaheadNoResults = true;
                            } else {
                                $scope.typeaheadNoResults = false;
                            }
                            $scope.listLength = $scope.matchList.length;
                            $scope.activeIndex = 0;
                            $scope.isShow = ($scope.listLength > 0) ? true : false;
                        }, function (error) {
                            $scope.typeaheadLoading = false;
                            $scope.typeaheadNoResults = true;
                            $scope.activeIndex = 0;
                            $scope.matchList = [];
                            $scope.listLength = 0;
                            $scope.isShow = false;
                            $log.log(error);
                        });
                } else {
                    $scope.queryList.forEach(function (item) {
                        var match = item.match(Reg);
                        if(match) {
                            $scope.matchList.push({ 'text': item, 'html': parseNode(item, newValue)});
                        }
                    });
                    if($scope.matchList.length === 0) {
                        $scope.typeaheadNoResults = true;
                    } else {
                        $scope.typeaheadNoResults = false;
                    }
                    $scope.listLength = $scope.matchList.length;
                    $scope.activeIndex = 0;
                    $scope.isShow = ($scope.listLength > 0) ? true : false;
                }
            });

            // 监听isShow变量,进行事件绑定控制
            $scope.$watch('isShow', function (newValue) {
                if (newValue) {
                    if(!openScope) {
                        $document.bind('click', closeTypeahead);
                        $document.bind('keydown', arrowKeyBind);
                    }
                    openScope = $scope;
                } else {
                    $document.unbind('click', closeTypeahead);
                    $document.unbind('keydown', arrowKeyBind);
                    openScope = null;
                }

            });

            $scope.selectItem = function (item) {
                isResult = true;
                $scope.typeahead.query = item.text;
                $scope.isShow = false;
            };

            $scope.isActive = function (index) {
                if(index === $scope.activeIndex) {
                    return true;
                } else {
                    return false;
                }
            };

            // document绑定点击事件
            function closeTypeahead() {
                if (!openScope) {
                    return;
                }
                $scope.$apply(function () {
                    $scope.isShow = false;
                });
            }

            // document绑定键盘事件
            function arrowKeyBind(evt) {
                if(evt.which === 9 || evt.which === 13) {
                    $scope.$apply(function () {
                        $scope.selectItem($scope.matchList[$scope.activeIndex]);
                    });
                    evt.preventDefault();
                    evt.stopPropagation();
                } else
                if(evt.which === 40) {
                    if($scope.activeIndex + 1 < $scope.listLength) {
                        $scope.$apply(function () {
                            $scope.activeIndex++;
                        });
                    }
                    evt.preventDefault();
                    evt.stopPropagation();
                } else
                if(evt.which === 38) {
                    if($scope.activeIndex > 0) {
                        $scope.$apply(function () {
                            $scope.activeIndex--;
                        });
                    }
                    evt.preventDefault();
                    evt.stopPropagation();
                }
            }

            // 代码高亮处理
            function parseNode(item, str) {
                var Reg = new RegExp(str, 'gim');
                return item.replace(Reg, function (message) {return '<strong>' + message + '</strong>';});
            }
        }])
    .directive('uixTypeahead', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                queryList: '=?',
                placeholder: '@?',
                getAsyncFunc: '&?',
                typeaheadLoading: '=?',
                typeaheadNoResults: '=?',
                ngModel: '='
            },
            require: ['uixTypeahead', '?ngModel'],
            controller: 'uixTypeaheadCtrl',
            templateUrl: 'templates/typeaheadTpl.html',
            link: function (scope, el, attrs, ctrls) {
                var typeaheadCtrl = ctrls[0], ngModelCtrl = ctrls[1];
                typeaheadCtrl.init(ngModelCtrl, el);
            }
        };
    });
