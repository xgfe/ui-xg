/**
 * collapse
 * collapse directive
 * Author: yjy972080142@gmail.com
 * Date:2016-08-01
 */
angular.module('ui.xg.collapse', ['ui.xg.transition'])
    .directive('uixCollapse', ['$uixTransition', function ($uixTransition) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                var initialAnimSkip = true;
                var currentTransition;

                function doTransition(change) {
                    var newTransition = $uixTransition(element, change);
                    if (currentTransition) {
                        currentTransition.cancel();
                    }
                    currentTransition = newTransition;
                    newTransition.then(newTransitionDone, newTransitionDone);
                    return newTransition;

                    function newTransitionDone() {
                        // Make sure it's this transition, otherwise, leave it alone.
                        if (currentTransition === newTransition) {
                            currentTransition = null;
                        }
                    }
                }

                // 展开
                function expand() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        expandDone();
                    } else {
                        element.removeClass('collapse').addClass('collapsing').css({
                            paddingTop: 0,
                            paddingBottom: 0
                        });
                        doTransition({height: element[0].scrollHeight + 'px'}).then(expandDone);
                    }
                }

                function expandDone() {
                    element.removeClass('collapsing')
                        .addClass('collapse in')
                        .css({
                            width: 'inherit',
                            height: 'auto'
                        });
                }

                // 收起
                function collapse() {
                    if (initialAnimSkip) {
                        initialAnimSkip = false;
                        collapseDone();
                        element.css({height: 0});
                    } else {
                        //trigger reflow so a browser realizes that height was updated from auto to a specific value
                        element.removeClass('collapse in').addClass('collapsing').css({
                            paddingTop: 0,
                            paddingBottom: 0
                        });
                        // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value
                        element.css({height: element[0].scrollHeight + 'px'});
                        doTransition({height: '0'}).then(collapseDone);
                    }
                }

                function collapseDone() {
                    element.removeClass('collapsing')
                        .addClass('collapse');
                }

                scope.$watch(attrs.uixCollapse, function (shouldCollapse) {
                    if (shouldCollapse) {
                        collapse();
                    } else {
                        expand();
                    }
                });
            }
        };
    }]);
