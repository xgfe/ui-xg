/**
 * notify
 * 通知指令
 * Author:penglu02@meituan.com
 * Date:2016-03-22
 */
angular.module('ui.xg.notify', [])
    .service('notifyServices', [
        '$sce',
        '$interval',
        function ($sce, $interval) {
            var self = this;
            this.directives = {};
            var preloadDirectives = {};

            function preLoad(referenceId) {
                var directive;
                if (preloadDirectives[referenceId]) {
                    directive = preloadDirectives[referenceId];
                } else {
                    directive = preloadDirectives[referenceId] = {messages: []};
                }
                return directive;
            }

            function directiveForRefId(referenceId) {
                var refId = referenceId || 0;
                return self.directives[refId] || preloadDirectives[refId];
            }

            this.initDirective = function (referenceId, limitMessages) {
                if (preloadDirectives[referenceId]) {
                    this.directives[referenceId] = preloadDirectives[referenceId];
                    this.directives[referenceId].limitMessages = limitMessages;
                } else {
                    this.directives[referenceId] = {
                        messages: [],
                        limitMessages: limitMessages
                    };
                }
                return this.directives[referenceId];
            };
            this.getAllMessages = function (referenceId) {
                referenceId = referenceId || 0;
                var messages;
                if (directiveForRefId(referenceId)) {
                    messages = directiveForRefId(referenceId).messages;
                } else {
                    messages = [];
                }
                return messages;
            };
            this.destroyAllMessages = function (referenceId) {
                var messages = this.getAllMessages(referenceId);
                for (var i = messages.length - 1; i >= 0; i--) {
                    messages[i].destroy();
                }
                var directive = directiveForRefId(referenceId);
                if (directive) {
                    directive.messages = [];
                }
            };
            this.addMessage = function (message) {
                var directive, messages, found, msgText;
                if (this.directives[message.referenceId]) {
                    directive = this.directives[message.referenceId];
                } else {
                    directive = preLoad(message.referenceId);
                }
                messages = directive.messages;
                if (this.onlyUnique) {
                    angular.forEach(messages, function (msg) {
                        msgText = $sce.getTrustedHtml(msg.text);
                        if (message.text === msgText && message.severity === msg.severity && message.title === msg.title) {
                            found = true;
                        }
                    });
                    if (found) {
                        return;
                    }
                }
                //message.text = $sce.trustAsHtml(String(message.text));
                if (message.ttl && message.ttl !== -1) {
                    message.countdown = message.ttl / 1000;
                    message.promises = [];
                    message.close = false;
                    message.countdownFunction = function () {
                        if (message.countdown > 1) {
                            message.countdown--;
                            message.promises.push($interval(message.countdownFunction, 1000, 1, 1));
                        } else {
                            message.countdown--;
                        }
                    };
                }
                if (angular.isDefined(directive.limitMessages)) {
                    var diff = messages.length - (directive.limitMessages - 1);
                    if (diff > 0) {
                        messages.splice(directive.limitMessages - 1, diff);
                    }
                }
                if (this.reverseOrder) {
                    messages.unshift(message);
                } else {
                    messages.push(message);
                }
                if (angular.isFunction(message.onopen)) {
                    message.onopen();
                }
                if (message.ttl && message.ttl !== -1) {
                    var self = this;
                    message.promises.push($interval(angular.bind(this, function () {
                        self.deleteMessage(message);
                    }), message.ttl, 1, 1));
                    message.promises.push($interval(message.countdownFunction, 1000, 1, 1));
                }
                return message;
            };
            this.deleteMessage = function (message) {
                var messages = this.getAllMessages(message.referenceId), index = messages.indexOf(message);
                if (index > -1) {
                    messages[index].close = true;
                    messages.splice(index, 1);
                }
                if (angular.isFunction(message.onclose)) {
                    message.onclose();
                }
            };
        }
    ])
    .controller('notifyController', [
        '$scope',
        '$interval',
        '$uixNotify',
        'notifyServices',
        function ($scope, $interval, $uixNotify, notifyServices) {
            $scope.referenceId = $scope.reference || 0;
            notifyServices.initDirective($scope.referenceId, $scope.limitMessages);
            $scope.notifyServices = notifyServices;
            $scope.inlineMessage = angular.isDefined($scope.inline) ? $scope.inline : $uixNotify.inlineMessages();
            $scope.$watch('limitMessages', function (limitMessages) {
                var directive = notifyServices.directives[$scope.referenceId];
                if (angular.isDefined(limitMessages) && angular.isDefined(directive)) {
                    directive.limitMessages = limitMessages;
                }
            });
            $scope.stopTimeoutClose = function (message) {
                if (!message.clickToClose) {
                    angular.forEach(message.promises, function (promise) {
                        $interval.cancel(promise);
                    });
                    if (message.close) {
                        notifyServices.deleteMessage(message);
                    } else {
                        message.close = true;
                    }
                }
            };
            $scope.alertClasses = function (message) {
                return {
                    'alert-success': message.severity === 'success',
                    'alert-error': message.severity === 'error',
                    'alert-danger': message.severity === 'error',
                    'alert-info': message.severity === 'info',
                    'alert-warning': message.severity === 'warning',
                    'icon': message.disableIcons === false,
                    'alert-dismissable': !message.disableCloseButton
                };
            };
            $scope.showCountDown = function (message) {
                return !message.disableCountDown && message.ttl > 0;
            };
            $scope.wrapperClasses = function () {
                var classes = {};
                classes['uix-notify-fixed'] = !$scope.inlineMessage;
                classes[$uixNotify.position()] = true;
                return classes;
            };
            $scope.computeTitle = function (message) {
                var ret = {
                    'success': 'Success',
                    'error': 'Error',
                    'info': 'Information',
                    'warn': 'Warning'
                };
                return ret[message.severity];
            };
        }
    ])
    .provider('$uixNotify', function () {

        var _ttl = {
                success: null,
                error: null,
                warning: null,
                info: null
            }, _messagesKey = 'messages', _messageTextKey = 'text', _messageTitleKey = 'title',
            _messageSeverityKey = 'severity', _onlyUniqueMessages = true, _messageVariableKey = 'variables',
            _referenceId = 0, _inline = false, _position = 'top-right', _disableCloseButton = false,
            _disableIcons = false, _reverseOrder = false, _disableCountDown = false, _translateMessages = true;
        this.globalTimeToLive = function (ttl) {
            if (angular.isObject(ttl)) {
                for (var k in ttl) {
                    if (ttl.hasOwnProperty(k)) {
                        _ttl[k] = ttl[k];
                    }
                }
            } else {
                for (var severity in _ttl) {
                    if (_ttl.hasOwnProperty(severity)) {
                        _ttl[severity] = ttl;
                    }
                }
            }
            return this;
        };
        this.globalTranslateMessages = function (translateMessages) {
            _translateMessages = translateMessages;
            return this;
        };
        this.globalDisableCloseButton = function (disableCloseButton) {
            _disableCloseButton = disableCloseButton;
            return this;
        };
        this.globalDisableIcons = function (disableIcons) {
            _disableIcons = disableIcons;
            return this;
        };
        this.globalReversedOrder = function (reverseOrder) {
            _reverseOrder = reverseOrder;
            return this;
        };
        this.globalDisableCountDown = function (countDown) {
            _disableCountDown = countDown;
            return this;
        };
        this.messageVariableKey = function (messageVariableKey) {
            _messageVariableKey = messageVariableKey;
            return this;
        };
        this.globalInlineMessages = function (inline) {
            _inline = inline;
            return this;
        };
        this.globalPosition = function (position) {
            _position = position;
            return this;
        };
        this.messagesKey = function (messagesKey) {
            _messagesKey = messagesKey;
            return this;
        };
        this.messageTextKey = function (messageTextKey) {
            _messageTextKey = messageTextKey;
            return this;
        };
        this.messageTitleKey = function (messageTitleKey) {
            _messageTitleKey = messageTitleKey;
            return this;
        };
        this.messageSeverityKey = function (messageSeverityKey) {
            _messageSeverityKey = messageSeverityKey;
            return this;
        };
        this.onlyUniqueMessages = function (onlyUniqueMessages) {
            _onlyUniqueMessages = onlyUniqueMessages;
            return this;
        };
        this.serverMessagesInterceptor = [
            '$q',
            '$uixNotify',
            function ($q, notify) {
                function checkResponse(response) {
                    if (angular.isDefined(response) && response.data && response.data[_messagesKey] && response.data[_messagesKey].length > 0) {
                        notify.addServerMessages(response.data[_messagesKey]);
                    }
                }

                return {
                    'response': function (response) {
                        checkResponse(response);
                        return response;
                    },
                    'responseError': function (rejection) {
                        checkResponse(rejection);
                        return $q.reject(rejection);
                    }
                };
            }
        ];
        this.$get = [
            '$rootScope',
            '$interpolate',
            '$filter',
            '$interval',
            'notifyServices',
            function ($rootScope, $interpolate, $filter, $interval, notifyServices) {
                var translate;
                notifyServices.onlyUnique = _onlyUniqueMessages;
                notifyServices.reverseOrder = _reverseOrder;
                try {
                    translate = $filter('translate');
                } catch (error) {
                    translate = null;
                }
                function broadcastMessage(message) {
                    if (translate && message.translateMessage) {
                        message.text = translate(message.text, message.variables) || message.text;
                        message.title = translate(message.title) || message.title;
                    } else {
                        var polation = $interpolate(message.text);
                        message.text = polation(message.variables);
                    }
                    var addedMessage = notifyServices.addMessage(message);
                    $rootScope.$broadcast('notifyMessage', message);
                    $interval(function () {
                    }, 0, 1);
                    return addedMessage;
                }

                function sendMessage(text, config, severity) {
                    var _config = config || {}, message;
                    message = {
                        text: text,
                        title: _config.title,
                        severity: severity,
                        allowTag: _config.allowTag,
                        ttl: _config.ttl || _ttl[severity],
                        variables: _config.variables || {},
                        disableCloseButton: angular.isUndefined(_config.disableCloseButton) ? _disableCloseButton : _config.disableCloseButton,
                        disableIcons: angular.isUndefined(_config.disableIcons) ? _disableIcons : _config.disableIcons,
                        disableCountDown: angular.isUndefined(_config.disableCountDown) ? _disableCountDown : _config.disableCountDown,
                        position: _config.position || _position,
                        referenceId: _config.referenceId || _referenceId,
                        translateMessage: angular.isUndefined(_config.translateMessage) ? _translateMessages : _config.translateMessage,
                        destroy: function () {
                            notifyServices.deleteMessage(message);
                        },
                        onclose: _config.onclose,
                        onopen: _config.onopen
                    };
                    return broadcastMessage(message);
                }

                function warning(text, config) {
                    return sendMessage(text, config, 'warning');
                }

                function error(text, config) {
                    return sendMessage(text, config, 'error');
                }

                function info(text, config) {
                    return sendMessage(text, config, 'info');
                }

                function success(text, config) {
                    return sendMessage(text, config, 'success');
                }

                function general(text, config, severity) {
                    severity = (severity || 'error').toLowerCase();
                    return sendMessage(text, config, severity);
                }

                function addServerMessages(messages) {
                    if (!messages || !messages.length) {
                        return;
                    }
                    var i, message, severity, length;
                    length = messages.length;
                    for (i = 0; i < length; i++) {
                        message = messages[i];
                        if (message[_messageTextKey]) {
                            severity = (message[_messageSeverityKey] || 'error').toLowerCase();
                            var config = {};
                            config.variables = message[_messageVariableKey] || {};
                            config.title = message[_messageTitleKey];
                            sendMessage(message[_messageTextKey], config, severity);
                        }
                    }
                }

                function onlyUnique() {
                    return _onlyUniqueMessages;
                }

                function reverseOrder() {
                    return _reverseOrder;
                }

                function inlineMessages() {
                    return _inline;
                }

                function position() {
                    return _position;
                }

                return {
                    warning: warning,
                    error: error,
                    info: info,
                    success: success,
                    general: general,
                    addServerMessages: addServerMessages,
                    onlyUnique: onlyUnique,
                    reverseOrder: reverseOrder,
                    inlineMessages: inlineMessages,
                    position: position
                };
            }
        ];
    })
    .directive('uixNotify', [function () {
        return {
            restrict: 'A',
            templateUrl: 'templates/notify.html',
            replace: false,
            scope: {
                reference: '@',
                inline: '=',
                limitMessages: '='
            },
            controller: 'notifyController'
        };
    }]);
