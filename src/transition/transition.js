/**
 * transition
 * transition directive
 * Author: yjy972080142@gmail.com
 * Date:2016-08-01
 */
angular.module('ui.xg.transition', [])
    .factory('$uixTransition', ['$q', '$timeout', '$rootScope', '$document', function ($q, $timeout, $rootScope, $document) {
        var doc = $document[0];
        function $transition(element, trigger, options) {
            options = options || {};
            var deferred = $q.defer();
            var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];

            function transitionEndHandler() {
                $rootScope.$apply(function () {
                    element.unbind(endEventName, transitionEndHandler);
                    deferred.resolve(element);
                });
            }

            if (endEventName) {
                element.bind(endEventName, transitionEndHandler);
            }

            // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur
            $timeout(function () {
                if (angular.isString(trigger)) {
                    element.addClass(trigger);
                } else if (angular.isFunction(trigger)) {
                    trigger(element);
                } else if (angular.isObject(trigger)) {
                    element.css(trigger);
                }
                //If browser does not support transitions, instantly resolve
                if (!endEventName) {
                    deferred.resolve(element);
                }
            });

            // Add our custom cancel function to the promise that is returned
            // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
            // i.e. it will therefore never raise a transitionEnd event for that transition
            deferred.promise.cancel = function () {
                if (endEventName) {
                    element.unbind(endEventName, transitionEndHandler);
                }
                deferred.reject('Transition cancelled');
            };

            return deferred.promise;
        }

        // Work out the name of the transitionEnd event
        var transElement = doc.createElement('trans');
        var transitionEndEventNames = {
            'WebkitTransition': 'webkitTransitionEnd',
            'MozTransition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'transition': 'transitionend'
        };
        var animationEndEventNames = {
            'WebkitTransition': 'webkitAnimationEnd',
            'MozTransition': 'animationend',
            'OTransition': 'oAnimationEnd',
            'transition': 'animationend'
        };

        function findEndEventName(endEventNames) {
            for (var name in endEventNames) {
                if (angular.isDefined(transElement.style[name])) {
                    return endEventNames[name];
                }
            }
        }

        $transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
        $transition.animationEndEventName = findEndEventName(animationEndEventNames);
        return $transition;
    }]);
