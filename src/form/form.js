/**
 * form
 * form directive
 * Author: your_email@gmail.com
 * Date:2019-09-02
 */
angular.module('ui.xg.form', [])
    .controller('uixFormCtrl', ['$scope', '$attrs', '$compile', '$templateCache', '$element', function ($scope, $attrs, $compile, $templateCache, $element) {
        const $form = this;
        $form.html = '';
        $form.layout = $scope.layout || 'search';
        let compileScope = $scope.$parent.$new();
        $form.init = function () {
            $scope.data.map((item, index) => {
                let content = '';
                let tag = '';
                let contentTag = '';
                if (item.tplUrl) {
                    content = $templateCache.get(item.tplUrl);
                }
                switch (item.type) {
                    case 'input':
                        tag = `<input type="text" class="form-control input-sm"
                            ng-model="$scope.data[${index}].value" ng-change="$form.checkChange()"></input>`
                        break;
                    case 'datepicker':
                        tag = `<uix-datepicker size="sm" ng-model="$scope.data[index].value"></uix-datepicker>`
                        break;
                    default:
                        break;
                }
                if (item.tplUrl) {
                    contentTag = content;
                } else {
                    contentTag = tag;
                }
                if ($form.layout === 'search') {
                    $form.html += `<div class="form-group col-md-${item.divWidth || 3}">
                        <label class="text-${item.textalign} uix-form-necessary">${item.text}</label>
                        ${contentTag}
                        </div>`
                }
                if ($form.layout === 'form') {
                    $form.html += `<div class="form-group row">
                            <label class="col-md-{{item.labelWidth?item.labelWidth:2}} text-${item.textalign}" ng-class="{'uix-form-necessary':${item.necessary}}" >${item.text}</label>
                            <div class="col-md-${item.divWidth?item.divWidth:4}">
                                ${contentTag}
                            </div>
                            </div>`
                }
                
            });
            $form.getTpl();
        }
        $form.getTpl = () => {
            $compile($form.html)(compileScope, (clonedElement) => {
                let tableWrap = angular.element($element[0]
                    .querySelector('.uix-form'));
                tableWrap.empty().append(clonedElement);
            });
        }
        $form.submit = () => {
            console.log($scope.data)
        }
        $form.checkChange = () => {
            console.log(4555);
        }
    }])
    .directive('uixForm', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/form.html',
            replace: true,
            require: ['uixForm'],
            scope: {data: '=', layout: '@?'},
            controller: 'uixFormCtrl',
            controllerAs: '$form',
            link: function ($scope, el, attrs, ctrls) {
                var formCtrl = ctrls[0];
                formCtrl.init();
                $scope.layout = $scope.layout ? $scope.layout : 'search';
            }
        }
    });