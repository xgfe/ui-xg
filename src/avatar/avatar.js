/**
 * avatar
 * avatar directive
 * Author: bewithyouzyn@gmail.com
 * Date:2018-07-23
 */
angular.module('ui.xg.avatar', [])
    .constant('avatarConfig', {
        shapeGroup: ['circle', 'square'],
        defaultShape: 'circle',
        sizeGroup: ['small', 'large', 'default'],
        defaultSize: 'default'
    })
    .directive('uixAvatar', ['$compile', 'avatarConfig', '$timeout', function ($compile, avatarConfig, $timeout) {
        return {
            restrict: 'E',
            templateUrl: 'templates/avatar.html',
            replace: true,
            require: '?ngModel',
            scope: {
                src: '=?',
                icon: '=?',
                content: '=?',
                shape: '=?',
                size: '=?'
            },
            link: function ($scope, $element, $attrs) {
                
                $scope.shape = avatarConfig.shapeGroup.includes($scope.shape) ? $scope.shape : avatarConfig.defaultShape;
                $scope.size = avatarConfig.sizeGroup.includes($scope.size) ? $scope.size : avatarConfig.defaultSize;
                const { src, icon, content } = $scope;

                // watch content change
                $scope.$watch('content', (newVal, oldVal) => {
                    if (newVal === oldVal) {
                        return;
                    }
                    $scope.setScale(newVal)
                })

                // set scale
                $scope.setScale = function (content) {
                    if (angular.isUndefined(content)) {
                        return;
                    }

                    // add content
                    $element.empty();
                    let children = '<span class="uix-avatar-content">' + content + '</span>';
                    $element.append(children);

                    const childrenWidth = $element.find('span')[0].offsetWidth;
                    const avatarWidth = $element[0].getBoundingClientRect().width;

                    if (avatarWidth - 8 < childrenWidth) {
                        $scope.scale = (avatarWidth - 8) / childrenWidth;
                    } else {
                        $scope.scale = 1;
                    }

                    // set content style
                    $element.find('span').css({
                        '-ms-transform': `scale(${$scope.scale})`,
                        '-webkit-transform': `scale(${$scope.scale})`,
                        'transform': `scale(${$scope.scale})`,
                        'position': 'absolute',
                        'display': 'inline-block',
                        'left': `calc(50% - ${Math.round(childrenWidth / 2)}px)`
                    })
                }

                $element.empty();
                let children = null;
                if (src) {
                    children = '<img src="' + src + '"/>';
                } else if (icon) {
                    children = '<i class="' + icon + '"></i>';
                } else if (content) {
                    $scope.setScale(content);
                } else {
                    return;
                }
                $element.append(children);
            }
        }
    }])
