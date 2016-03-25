/**
 * notification
 * 通知指令
 * Author:penglu02@meituan.com
 * Date:2016-03-22
 */
angular.module('ui.fugu.notification', ['ui.fugu.alert'])
    .service('notificationServices', ['$sce', '$interval', '$interpolate', function($sce, $interval, $interpolate){
        var self = this;
        this.directive = {};

        this.initDirective = function (limitNum) {
            this.directive.limitNum = limitNum;
            this.directive.notifications = [];
            return this.directive;
        };

        this.addNotifications = function(notification){
            var notifications, unique = true, notificationText;

            // 错误类型处理
            if (notification.type === 'error') {
                notification.type = 'danger';
            }
            // 内容处理
            notification.text = $interpolate(notification.text)(notification.variables);  //{{}}插值解析

            // TODO:使用alert不存在ng-bind-html，因此不需要对其进行特殊处理
            //notification.text = $sce.trustAsHtml(String( notification.text));   // html内容处理，用于ng-bind-html等

            notifications = this.directive.notifications;

            // 提示信息是否不重复,this.unique在provider中设置
            if(this.unique){
                angular.forEach(notifications, function(notify){
                    notificationText = notify.text;

                    //// 处理内容获取:trustAsHtml与getTrustedHtml对变量进行了一次包裹
                    //notificationText = $sce.getTrustedHtml(notify.text);

                    // 通过对比:提示内容，提示类型，提示标题来判断两个通知是否相同
                    if(notification.text === notificationText && notification.title === notify.title && notification.type === notify.type){
                        unique = false;
                    }
                });
                if(!unique){
                    return;
                }
            }

            if(notification.duration && notification.duration !== -1){ // 设置持续显示时间,-1表示一直显示
                //  持续时间之后直接删除
                $interval(angular.bind(this, function(){
                    self.deleteNotifications(notification);
                }), notification.duration, 1);
            }

            // 如果有长度限制，则移除超过长度的
            if(angular.isDefined(this.directive.limitNum)){
                var diff = notifications.length - (this.directive.limitNum - 1);
                if(diff > 0){
                    notifications.splice(0, diff);
                }
            }
            notifications.push(notification); //插入新数值
            return notification;
        };


        /**
         * 删除传入通知对象
         * @param {object} notification
         */
        this.deleteNotifications = function(notification){
            var notifications = this.directive.notifications, //获取所有通知
                index = notifications.indexOf(notification);
            if(index !== -1){
                notifications.splice(index, 1); //删除
            }
        }
    }])
    .controller('notificationController', ['$scope', '$interval', 'notification', 'notificationServices', function($scope, $interval, notification, notificationServices){
        notificationServices.initDirective($scope.limitNum);
        $scope.notifications = notificationServices.directive.notifications;

        $scope.$watch('limitNum', function(limitNum){
            var directive = notificationServices.directive;
            if(angular.isDefined(limitNum) && angular.isDefined(directive)){
                directive.limitNum = limitNum;
            }
        });

        $scope.closeFn = function(notification){
            notificationServices.deleteNotifications(notification);
        }
    }])
    .directive('fuguNotice', [function(){
        return {
            restrict: 'A',
            replace: false,
            scope: {
                limitNum: '='
            },
            templateUrl: 'templates/notification.html',
            controller: 'notificationController'
        }
    }])
    .provider('notification', [function(){

        // private variables
        var _types = {
                success: null,
                error: null,
                warning: null,
                info: null
            },
            _unique = true,
            _disableCloseBtn = false,
            _disableIcon = false;


        // this绑定的方法是可以在注入之前进行调用设置
        /**
         * 设置通知全局持续显示时间
         * @param {number} duration 持续时间毫秒,如果为-1则表示一直显示
         */
        this.globalDurationTime = function (duration){
            if(typeof duration === 'object'){
                // 以对象的形式分开设置持续时间
                for (var key in duration){
                    if(duration.hasOwnProperty(key)){
                        _types[key] = duration[key];
                    }
                }
            } else {
                // 统一设置
                for(var type in _types){
                    if(_types.hasOwnProperty(type)) {
                        _types[type] = duration;
                    }
                }
            }
            return this;
        };

        /**
         * 统一配置是否显示关闭按钮
         * @param {boolean} disableCloseBtn
         * @returns {*}
         */
        this.globalDisableCloseBtn = function (disableCloseBtn){
            _disableCloseBtn = disableCloseBtn;
            return this;
        };

        /**
         * 统一配置是否显示图标
         * @param {boolean} disableIcon
         * @returns {*}
         */
        this.globalDisableIcon = function (disableIcon) {
            _disableIcon = disableIcon;
            return this;
        };


        /**
         * 统一配置提示框是否重复显示
         * @param {boolean} unique
         * @returns {*}
         */
        this.globalUnique = function(unique) {
            _unique = unique;
            return this;
        };


        // $get方法返回的内容,注入的时候可以获取
        this.$get = [
            '$rootScope',
            '$interpolate',
            '$sce',
            '$filter',
            '$interval',
            'notificationServices',
            function ($rootScope, $interpolate, $sce, $filter, $interval, notificationServices) {
                notificationServices.unique = _unique;  //根据当前配置，设置显示的唯一性(统一)

                function sendNotification(text, config, type) {
                    var _config = config || {}, notification, addNotification;

                    // 组装新添加通知信息
                    notification = {
                        text: text,
                        type: type,
                        duration: _config.duration || _types[type],
                        disableCloseBtn: angular.isDefined(_config.disableCloseBtn) ? _config.disableCloseBtn : _disableCloseBtn,
                        disableIcon: angular.isDefined(_config.disableIcon) ? _config.disableIcon : _disableIcon,
                        variables: _config.variables || {},   // 解析text中{{}}中变量
                        destory: function () {
                            notificationServices.deleteNotifications(notification);
                        },
                        setText: function (newText) {
                            //// 对内容进行包裹用于ng-bind-html显示,后期使用getTrustedHtml获取
                            //this.text = $sce.trustAsHtml(String(newText));

                            this.text = newText;
                        }
                    };

                    addNotification = notificationServices.addNotifications(notification);
                    return addNotification;
                }

                function warning(text, config){
                    return sendNotification(text, config, 'warning');
                }

                function error(text, config){
                    return sendNotification(text, config, 'error');
                }

                function info(text, config){
                    return sendNotification(text, config, 'info');
                }

                function success(text, config){
                    return sendNotification(text, config, 'success');
                }

                function common(text, config, type){
                    var noticeType = type ? type.toLowerCase() : 'error';  // 默认为‘error’提示框
                    return sendNotification(text, config, noticeType);
                }

                return {
                    warning: warning,
                    error: error,
                    info: info,
                    success: success,
                    common: common
                };
            }
        ]
    }]);