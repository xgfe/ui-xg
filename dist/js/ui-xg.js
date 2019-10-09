/*
 * ui-xg
 * Version: 2.1.17 - 2019-10-09
 * License: MIT
 */
angular.module("ui.xg", ["ui.xg.tpls","ui.xg.transition","ui.xg.collapse","ui.xg.accordion","ui.xg.alert","ui.xg.avatar","ui.xg.button","ui.xg.buttonGroup","ui.xg.timepanel","ui.xg.calendar","ui.xg.carousel","ui.xg.position","ui.xg.stackedMap","ui.xg.tooltip","ui.xg.popover","ui.xg.dropdown","ui.xg.cityselect","ui.xg.datatable","ui.xg.datepicker","ui.xg.form","ui.xg.grid","ui.xg.loader","ui.xg.modal","ui.xg.notify","ui.xg.pager","ui.xg.progressbar","ui.xg.rate","ui.xg.searchBox","ui.xg.select","ui.xg.sortable","ui.xg.step","ui.xg.steps","ui.xg.switch","ui.xg.tableLoader","ui.xg.tabs","ui.xg.timeline","ui.xg.timepicker","ui.xg.typeahead"]);
angular.module("ui.xg.tpls", ["accordion/templates/accordion.html","accordion/templates/group.html","alert/templates/alert.html","avatar/templates/avatar.html","button/templates/button.html","buttonGroup/templates/buttonGroup.html","timepanel/templates/timepanel.html","calendar/templates/calendar.html","carousel/templates/carousel-item.html","carousel/templates/carousel.html","tooltip/templates/tooltip-html-popup.html","tooltip/templates/tooltip-popup.html","tooltip/templates/tooltip-template-popup.html","popover/templates/popover-html-popup.html","popover/templates/popover-popup.html","popover/templates/popover-template-popup.html","cityselect/templates/citypanel.html","datatable/templates/datatable-body-tpl.html","datatable/templates/datatable-foot.html","datatable/templates/datatable-head-tpl.html","datatable/templates/datatable-table-left.html","datatable/templates/datatable-table-main.html","datatable/templates/datatable-table-right.html","datatable/templates/datatable.html","datepicker/templates/datepicker-calendar.html","datepicker/templates/datepicker.html","form/templates/form.html","modal/templates/backdrop.html","modal/templates/confirm.html","modal/templates/window.html","notify/templates/notify.html","pager/templates/pager.html","progressbar/templates/bar.html","progressbar/templates/progress.html","progressbar/templates/progressbar.html","rate/templates/rate.html","searchBox/templates/searchBox.html","select/templates/choices.html","select/templates/match-multiple.html","select/templates/match.html","select/templates/select-multiple.html","select/templates/select.html","step/templates/step.html","switch/templates/switch.html","tabs/templates/tab.html","tabs/templates/tabs.html","timeline/templates/timeline.html","timeline/templates/timelineItem.html","timepicker/templates/timepicker-timepanel.html","timepicker/templates/timepicker.html","typeahead/templates/typeaheadTpl.html"]);
"use strict";

/**
 * transition
 * transition directive
 * Author: yjy972080142@gmail.com
 * Date:2016-08-01
 */
angular.module('ui.xg.transition', []).factory('$uixTransition', ['$q', '$timeout', '$rootScope', '$document', function ($q, $timeout, $rootScope, $document) {
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
    } // Wrap in a timeout to allow the browser time to update the DOM before the transition is to occur


    $timeout(function () {
      if (angular.isString(trigger)) {
        element.addClass(trigger);
      } else if (angular.isFunction(trigger)) {
        trigger(element);
      } else if (angular.isObject(trigger)) {
        element.css(trigger);
      } //If browser does not support transitions, instantly resolve


      if (!endEventName) {
        deferred.resolve(element);
      }
    }); // Add our custom cancel function to the promise that is returned
    // We can call this if we are about to run a new transition, which we know will prevent this transition from ending,
    // i.e. it will therefore never raise a transitionEnd event for that transition

    deferred.promise.cancel = function () {
      if (endEventName) {
        element.unbind(endEventName, transitionEndHandler);
      }

      deferred.reject('Transition cancelled');
    };

    return deferred.promise;
  } // Work out the name of the transitionEnd event


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
"use strict";

/**
 * collapse
 * collapse directive
 * Author: yjy972080142@gmail.com
 * Date:2016-08-01
 */
angular.module('ui.xg.collapse', ['ui.xg.transition']).directive('uixCollapse', ['$uixTransition', function ($uixTransition) {
  return {
    restrict: 'AE',
    link: function link(scope, element, attrs) {
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
      } // 展开


      function expand() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          expandDone();
        } else {
          element.removeClass('collapse').addClass('collapsing');
          doTransition({
            height: element[0].scrollHeight + 'px'
          }).then(expandDone);
        }
      }

      function expandDone() {
        element.removeClass('collapsing');
        element.addClass('collapse in');
        element.css({
          width: 'inherit',
          height: 'auto'
        });
      } // 收起


      function collapse() {
        if (initialAnimSkip) {
          initialAnimSkip = false;
          collapseDone();
          element.css({
            height: 0
          });
        } else {
          //trigger reflow so a browser realizes that height was updated from auto to a specific value
          element.removeClass('collapse in').addClass('collapsing'); // CSS transitions don't work with height: auto, so we have to manually change the height to a specific value

          element.css({
            height: element[0].scrollHeight + 'px'
          });
          doTransition({
            height: '0'
          }).then(collapseDone);
        }
      }

      function collapseDone() {
        element.removeClass('collapsing');
        element.addClass('collapse');
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
"use strict";

/**
 * accordion
 * accordion directive
 * Author: chenwubai.cx@gmail.com
 * Date:2016-08-05
 */
angular.module('ui.xg.accordion', ['ui.xg.collapse']).constant('uixAccordionConfig', {
  closeOthers: true
}).controller('uixAccordionCtrl', ['$scope', '$attrs', 'uixAccordionConfig', function ($scope, $attrs, uixAccordionConfig) {
  this.groupList = [];

  var _this = this;

  if (angular.isUndefined($attrs.closeOthers)) {
    $scope.closeOthers = uixAccordionConfig.closeOthers;
  } // console.log($attrs.closeOthers, $scope.closeOthers);


  this.addGroupScope = function (groupScope) {
    _this.groupList.push(groupScope);

    groupScope.$on('$destroy', function () {
      _this.removeGroupScope(groupScope);
    });
  };

  this.removeGroupScope = function (groupScope) {
    var index = _this.groupList.indexOf(groupScope);

    if (index > -1) {
      _this.groupList.splice(index, 1);
    }
  };

  this.closeOthers = function (groupScope) {
    // console.log($scope.closeOthers);
    if ($scope.closeOthers) {
      angular.forEach(_this.groupList, function (itemScope) {
        if (itemScope !== groupScope) {
          itemScope.isOpen = false;
        }
      });
    }
  };
}]).directive('uixAccordion', function () {
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
}).directive('uixAccordionGroup', function () {
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
    controller: function controller() {},
    link: function link(scope, el, attrs, uixAccordionCtrl) {
      if (angular.isUndefined(attrs.isOpen)) {
        scope.isOpen = true;
      }

      if (angular.isUndefined(scope.isDisabled)) {
        scope.isDisabled = false;
      }

      uixAccordionCtrl.addGroupScope(scope);
      scope.$watch('isOpen', function (value) {
        if (value) {
          uixAccordionCtrl.closeOthers(scope);
        }
      });
    }
  };
});
"use strict";

/**
 * alert
 * 警告提示指令
 * Author:heqingyang@meituan.com
 * Date:2015-01-11
 */
angular.module('ui.xg.alert', []).controller('uixAlertCtrl', ['$scope', '$attrs', '$timeout', '$interpolate', function ($scope, $attrs, $timeout, $interpolate) {
  //指令初始化
  function initConfig() {
    $scope.closeable = !!($scope.close && ($scope.close === 'true' || $scope.close === '1'));
    $scope.defaultclose = false;
    $scope.hasIcon = !!($scope.hasIcon && ($scope.hasIcon === 'true' || $scope.hasIcon === '1'));
  }

  initConfig(); //添加默认close方法

  if (!$attrs.closeFunc) {
    $scope.closeFunc = function () {
      $scope.defaultclose = true;
    };
  } //判断是否显示图标


  var type = angular.isDefined($attrs.type) ? $interpolate($attrs.type)($scope.$parent) : null;

  if ($scope.hasIcon) {
    switch (type) {
      case 'danger':
        $scope.iconClass = 'remove-sign';
        break;

      case 'success':
        $scope.iconClass = 'ok-sign';
        break;

      case 'info':
        $scope.iconClass = 'info-sign';
        break;

      default:
        $scope.iconClass = 'exclamation-sign';
        break;
    }
  } //判断是否有时间参数


  var dismissOnTimeout = angular.isUndefined($attrs.dismissOnTimeout) ? null : $interpolate($attrs.dismissOnTimeout)($scope.$parent);

  if (dismissOnTimeout) {
    $timeout(function () {
      $scope.closeFunc();
    }, parseInt(dismissOnTimeout, 10));
  }
}]).directive('uixAlert', function () {
  return {
    restrict: 'E',
    templateUrl: function templateUrl(element, attrs) {
      return attrs.templateUrl || 'templates/alert.html';
    },
    replace: true,
    transclude: true,
    scope: {
      type: '@',
      close: '@',
      closeFunc: '&',
      closeText: '@',
      hasIcon: '@'
    },
    controller: 'uixAlertCtrl',
    controllerAs: 'alert'
  };
});
"use strict";

/**
 * avatar
 * avatar directive
 * Author: bewithyouzyn@gmail.com
 * Date:2018-07-23
 */
angular.module('ui.xg.avatar', []).constant('avatarConfig', {
  shapeGroup: ['circle', 'square'],
  defaultShape: 'circle',
  sizeGroup: ['small', 'large', 'default'],
  defaultSize: 'default'
}).directive('uixAvatar', ['$compile', 'avatarConfig', '$timeout', function ($compile, avatarConfig, $timeout) {
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
    link: function link($scope, $element, $attrs) {
      $scope.shape = avatarConfig.shapeGroup.includes($scope.shape) ? $scope.shape : avatarConfig.defaultShape;
      $scope.size = avatarConfig.sizeGroup.includes($scope.size) ? $scope.size : avatarConfig.defaultSize;
      var src = $scope.src,
          icon = $scope.icon,
          content = $scope.content; // watch content change

      $scope.$watch('content', function (newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }

        $scope.setScale(newVal);
      }); // set scale

      $scope.setScale = function (content) {
        if (angular.isUndefined(content)) {
          return;
        } // add content


        $element.empty();
        var children = '<span class="uix-avatar-content">' + content + '</span>';
        $element.append(children);
        var childrenWidth = $element.find('span')[0].offsetWidth;
        var avatarWidth = $element[0].getBoundingClientRect().width;

        if (avatarWidth - 8 < childrenWidth) {
          $scope.scale = (avatarWidth - 8) / childrenWidth;
        } else {
          $scope.scale = 1;
        } // set content style


        $element.find('span').css({
          '-ms-transform': "scale(".concat($scope.scale, ")"),
          '-webkit-transform': "scale(".concat($scope.scale, ")"),
          'transform': "scale(".concat($scope.scale, ")"),
          'position': 'absolute',
          'display': 'inline-block',
          'left': "calc(50% - ".concat(Math.round(childrenWidth / 2), "px)")
        });
      };

      $element.empty();
      var children = null;

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
  };
}]);
"use strict";

/**
 * button
 * 按钮指令
 * Author:penglu02@meituan.com
 * Date:2016-01-12
 */
angular.module('ui.xg.button', []).directive('uixButton', [function () {
  return {
    restrict: 'E',
    scope: {
      loading: '=?'
    },
    replace: true,
    transclude: true,
    templateUrl: 'templates/button.html',
    link: function link(scope, element, attrs) {
      // 默认值处理
      if (angular.isUndefined(attrs.loading)) {
        scope.loading = false;
      }

      scope.type = getRealAttr(scope.$parent, attrs.bType, 'button');
      /**
       * 在父作用scope解析属性值
       * @param {object} scope 变量所在scope域
       * @param {string} val 从标签上获取的属性值
       * @param {string} defaultVal 属性默认值
       * @returns {*}
       */

      function getRealAttr(scope, val, defaultVal) {
        if (angular.isDefined(val)) {
          return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
        } else {
          return defaultVal;
        }
      }
    }
  };
}]);
"use strict";

/**
 * buttonGroup
 * 按钮组指令
 * Author:penglu02@meituan.com
 * Date:2016-01-23
 */
angular.module('ui.xg.buttonGroup', []).constant('buttonGroupConfig', {
  activeClass: 'active',
  toggleEvent: 'click'
}).controller('buttonGroupController', ['buttonGroupConfig', function (buttonGroupConfig) {
  this.activeClass = buttonGroupConfig.activeClass || 'active';
  this.toggleEvent = buttonGroupConfig.toggleEvent || 'click';
}]).directive('uixButtonRadio', [function () {
  return {
    controller: 'buttonGroupController',
    require: 'uixButtonRadio',
    scope: true,
    // 继承父scope的新scope
    link: function link(scope, element, attrs, btnRadioCtrl) {
      var uncheckable;
      scope.btnRadioVal = getRealAttr(scope.$parent.$parent, attrs.btnRadioVal, false); // 默认值为false

      scope.uncheckable = getRealAttr(scope.$parent.$parent, attrs.uncheckable, false); // 控制双向数据绑定

      if (angular.isDefined(attrs.uncheckable)) {
        uncheckable = attrs.uncheckable;
        scope.$parent.$parent.$watch(uncheckable, function (val) {
          scope.uncheckable = val;
        });
      }

      var render = scope.ngModelCtrl.$render; // 重写render方法

      scope.ngModelCtrl.$render = function () {
        // 第二个参数确定是否添加样式
        element.toggleClass(btnRadioCtrl.activeClass, angular.equals(scope.ngModelCtrl.$modelValue, scope.btnRadioVal)); // 添加类样式

        render();
      }; // 外部触发事件,修改ng-model的值


      element.on(btnRadioCtrl.toggleEvent, function () {
        if (angular.isDefined(attrs.disabled) || attrs.ngDisabled) {
          return;
        }

        var isActive = element.hasClass(btnRadioCtrl.activeClass); //获取当前radio激活状态

        if (!isActive || scope.uncheckable) {
          // 非激活状态
          scope.ngModelCtrl.$setViewValue(isActive ? null : scope.btnRadioVal);
          scope.$apply(function () {
            scope.ngModelCtrl.$render();
          });
        }
      });
      /**
       * 在父作用scope解析属性值
       * @param {object} scope 变量所在scope域
       * @param {string} val 从标签上获取的属性值
       * @param {string} defaultVal 属性默认值
       * @returns {*}
       */

      function getRealAttr(scope, val, defaultVal) {
        if (angular.isDefined(val)) {
          return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
        } else {
          return defaultVal;
        }
      }
    }
  };
}]).directive('uixButtonCheckbox', function () {
  return {
    require: 'uixButtonCheckbox',
    controller: 'buttonGroupController',
    scope: true,
    link: function link(scope, element, attrs, btnCheckboxCtrl) {
      scope.btnCheckboxFalse = getRealAttr(scope.$parent.$parent, attrs.btnCheckboxFalse, false);
      scope.btnCheckboxTrue = getRealAttr(scope.$parent.$parent, attrs.btnCheckboxTrue, true);
      scope.ngModel[attrs.name] = angular.isDefined(scope.ngModel[attrs.name]) ? scope.ngModel[attrs.name] : scope.btnCheckboxFalse; // 初始化model值

      var render = scope.ngModelCtrl.$render;

      scope.ngModelCtrl.$render = function () {
        var ele = scope.ngModelCtrl.$modelValue ? scope.ngModelCtrl.$modelValue[attrs.name] : null;
        element.toggleClass(btnCheckboxCtrl.activeClass, angular.equals(ele, scope.btnCheckboxTrue)); // 添加类样式

        render();
      }; // 外部触发事件,修改ng-model的值


      element.on(btnCheckboxCtrl.toggleEvent, function () {
        if (angular.isDefined(attrs.disabled) || attrs.ngDisabled) {
          return;
        }

        var isActive = element.hasClass(btnCheckboxCtrl.activeClass); //获取当前radio激活状态

        scope.ngModel[attrs.name] = isActive ? scope.btnCheckboxFalse : scope.btnCheckboxTrue;
        scope.ngModelCtrl.$setViewValue(scope.ngModel);
        scope.$apply(function () {
          scope.ngModelCtrl.$render();
        });
      });
      /**
       * 在父作用scope解析属性值
       * @param {object} scope 变量所在scope域
       * @param {string} val 从标签上获取的属性值
       * @param {string} defaultVal 属性默认值
       * @returns {*}
       */

      function getRealAttr(scope, val, defaultVal) {
        if (angular.isDefined(val)) {
          return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
        } else {
          return defaultVal;
        }
      }
    }
  };
}).directive('uixButtonGroup', ['$compile', '$interpolate', '$parse', function ($compile, $interpolate, $parse) {
  return {
    require: 'ngModel',
    restrict: 'AE',
    scope: {},
    templateUrl: 'templates/buttonGroup.html',
    replace: true,
    transclude: true,
    link: function link(scope, element, attrs, ngModelCtrl, transclude) {
      scope.ngModelCtrl = ngModelCtrl;
      scope.ngModel = $parse(attrs.ngModel)(scope.$parent);
      scope.type = getRealAttr(scope.$parent, attrs.bgType, 'radio');
      angular.forEach(transclude(), function (ele) {
        if (angular.isDefined(ele.outerHTML)) {
          ele = angular.element($interpolate(ele.outerHTML)(scope.$parent).replace('"{', '"{').replace('}"', '"}"')).attr('uix-button-' + scope.type, '');
          ele.addClass('btn-item'); // 添加一个公共类

          element.append($compile(ele)(scope));
        }
      });
      /**
       * 在父作用scope解析属性值
       * @param {object} scope 变量所在scope域
       * @param {string} val 从标签上获取的属性值
       * @param {string} defaultVal 属性默认值
       * @returns {*}
       */

      function getRealAttr(scope, val, defaultVal) {
        if (angular.isDefined(val)) {
          return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
        } else {
          return defaultVal;
        }
      }
    }
  };
}]);
"use strict";

/**
 * timepanel
 * timepanel directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.xg.timepanel', []).constant('uixTimepanelConfig', {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  showSeconds: true,
  mousewheel: true,
  arrowkeys: true,
  readonlyInput: false
}).controller('uixTimepanelCtrl', ['$scope', '$attrs', '$parse', '$log', 'uixTimepanelConfig', function ($scope, $attrs, $parse, $log, timepanelConfig) {
  var ngModelCtrl = {
    $setViewValue: angular.noop
  };

  this.init = function (_ngModelCtrl, inputs) {
    ngModelCtrl = _ngModelCtrl;
    ngModelCtrl.$render = this.render;
    ngModelCtrl.$formatters.unshift(function (modelValue) {
      return modelValue ? new Date(modelValue) : null;
    }); //$scope.$$postDigest(function(){}); // 如果showSeconds用的是ng-if，此时second还没有插入DOM，无法获取元素和绑定事件

    var hoursInputEl = inputs.eq(0),
        minutesInputEl = inputs.eq(1),
        secondsInputEl = inputs.eq(2);
    hoursInputEl.on('focus', function () {
      hoursInputEl[0].select();
    });
    minutesInputEl.on('focus', function () {
      minutesInputEl[0].select();
    });
    secondsInputEl.on('focus', function () {
      secondsInputEl[0].select();
    });
    var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepanelConfig.mousewheel;

    if (mousewheel) {
      this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
    }

    var arrowkeys = angular.isDefined($attrs.arrowkeys) ? $scope.$parent.$eval($attrs.arrowkeys) : timepanelConfig.arrowkeys;

    if (arrowkeys) {
      this.setupArrowkeyEvents(hoursInputEl, minutesInputEl, secondsInputEl);
    }
  };

  $scope.hourStep = angular.isDefined($attrs.hourStep) ? $scope.$parent.$eval($attrs.hourStep) : timepanelConfig.hourStep;
  $scope.minuteStep = angular.isDefined($attrs.minuteStep) ? $scope.$parent.$eval($attrs.minuteStep) : timepanelConfig.minuteStep;
  $scope.secondStep = angular.isDefined($attrs.secondStep) ? $scope.$parent.$eval($attrs.secondStep) : timepanelConfig.secondStep; // show seconds

  $scope.showSeconds = timepanelConfig.showSeconds;

  if ($attrs.showSeconds) {
    $scope.$parent.$watch($parse($attrs.showSeconds), function (value) {
      $scope.showSeconds = !!value;

      if (!$scope.showSeconds) {
        $scope.panelStyles = {
          width: '75px'
        };
      } else {
        $scope.panelStyles = {
          width: '50px'
        };
      }
    });
  } // readonly input


  $scope.readonlyInput = timepanelConfig.readonlyInput;

  if ($attrs.readonlyInput) {
    $scope.$parent.$watch($parse($attrs.readonlyInput), function (value) {
      $scope.readonlyInput = !!value;
    });
  } // 使用对象存储是否可以点击某一个时间进行增长或减少


  $scope.isMaxTime = {};
  $scope.isMinTime = {}; //减少时/分/秒

  $scope.decrease = function (type) {
    if ($scope.isMinTime[type]) {
      return;
    }

    var step = parseInt($scope[type + 'Step'], 10);
    var oldVal = parseInt($scope[type], 10);
    var smallerVal = $scope['smaller' + type[0].toUpperCase() + type.slice(1)];

    if (timeIsOutOfRange(type, smallerVal)) {
      return;
    }

    $scope[type] = smallerVal;

    if (oldVal - step < 0) {
      carryTime(type, 'decrease');
    }

    changeHandler();
  }; //增加时/分/秒


  $scope.increase = function (type) {
    if ($scope.isMaxTime[type]) {
      return;
    }

    var maxValue = type === 'minute' || type === 'second' ? 60 : 24;
    var step = parseInt($scope[type + 'Step'], 10);
    var oldVal = parseInt($scope[type], 10);
    var largerValue = $scope['larger' + type[0].toUpperCase() + type.slice(1)];

    if (timeIsOutOfRange(type, largerValue)) {
      return;
    }

    $scope[type] = largerValue;

    if (oldVal + step >= maxValue) {
      carryTime(type, 'increase');
    }

    changeHandler();
  };

  $scope.$watch('hour', function (newVal) {
    var step = parseInt($scope.hourStep, 10);
    $scope.smallerHour = getSmallerVal(newVal, step, 24);
    $scope.largerHour = getLargerVal(newVal, step, 24);
  });
  $scope.$watch('minute', function (newVal) {
    var step = parseInt($scope.minuteStep, 10);
    $scope.smallerMinute = getSmallerVal(newVal, step, 60);
    $scope.largerMinute = getLargerVal(newVal, step, 60);
  });
  $scope.$watch('second', function (newVal) {
    var step = parseInt($scope.secondStep, 10);
    $scope.smallerSecond = getSmallerVal(newVal, step, 60);
    $scope.largerSecond = getLargerVal(newVal, step, 60);
  });

  function getSmallerVal(val, step, maxValue) {
    var result = parseInt(val, 10) - parseInt(step, 10);

    if (result < 0) {
      result = maxValue + result;
    }

    if (result < 10) {
      result = '0' + result;
    }

    return result;
  }

  function getLargerVal(val, step, maxValue) {
    var result = parseInt(val, 10) + parseInt(step, 10);

    if (result >= maxValue) {
      result = result - maxValue;
    }

    if (result < 10) {
      result = '0' + result;
    }

    return result;
  } // 时间进位,秒和分钟满60进一


  var timeCarrys = {
    hour: null,
    minute: 'hour',
    second: 'minute'
  };

  function carryTime(type, dir) {
    var val = timeCarrys[type];

    if (!val) {
      return;
    }

    $scope[dir](val);
  }

  $scope.changeInputValue = function (type, maxValue) {
    if (isNaN($scope[type])) {
      return;
    }

    $scope[type] = parseInt($scope[type], 10);

    if ($scope[type] < 0) {
      $scope[type] = 0;
    }

    if ($scope[type] > maxValue) {
      $scope[type] = maxValue;
    }

    $scope[type] = addZero($scope[type]);
    changeHandler();
  };

  this.render = function () {
    var date = ngModelCtrl.$modelValue;

    if (isNaN(date)) {
      $log.warn('Timepicker directive: "ng-model" value must be a Date object, ' + 'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
      date = new Date(); // fix #1 如果没有传入日期,或者清空的话,设置当前time
    }

    $scope.hour = date ? addZero(date.getHours()) : null;
    $scope.minute = date ? addZero(date.getMinutes()) : null;
    $scope.second = date ? addZero(date.getSeconds()) : null;
  };

  this.setupMousewheelEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
    function isScrollingUp(evt) {
      if (evt.originalEvent) {
        evt = evt.originalEvent;
      }

      var delta = evt.wheelDelta ? evt.wheelDelta : -evt.deltaY;
      return evt.detail || delta > 0;
    }

    hoursInputEl.on('mousewheel wheel', function (evt) {
      $scope.$apply(isScrollingUp(evt) ? $scope.increase('hour') : $scope.decrease('hour'));
      evt.preventDefault();
    });
    minutesInputEl.on('mousewheel wheel', function (evt) {
      $scope.$apply(isScrollingUp(evt) ? $scope.increase('minute') : $scope.decrease('minute'));
      evt.preventDefault();
    });
    secondsInputEl.on('mousewheel wheel', function (evt) {
      $scope.$apply(isScrollingUp(evt) ? $scope.increase('second') : $scope.decrease('second'));
      evt.preventDefault();
    });
  };

  this.setupArrowkeyEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
    hoursInputEl.on('keydown', arrowkeyEventHandler('hour'));
    minutesInputEl.on('keydown', arrowkeyEventHandler('minute'));
    secondsInputEl.on('keydown', arrowkeyEventHandler('second'));
  };

  function changeHandler() {
    var dt = angular.copy(ngModelCtrl.$modelValue);

    if (timeIsInvalid(dt)) {
      dt = new Date();
    }

    dt.setHours($scope.hour);
    dt.setMinutes($scope.minute);
    dt.setSeconds($scope.second);

    if ($scope.onChange) {
      var fn = $scope.onChange();

      if (angular.isFunction(fn)) {
        fn(dt);
      }
    }

    ngModelCtrl.$setViewValue(dt);
    ngModelCtrl.$render();
  } // 判断time是否是时间对象


  function timeIsInvalid(time) {
    var dt = new Date(time);
    return isNaN(dt.getTime());
  }
  /**
   * 判断时间是否超出min和max设置的时间范围
   * @param type - 类型,hour,minute,second
   * @param value - 需要改变的值
   * @returns {boolean}
   */


  function timeIsOutOfRange(type, value) {
    var method = 'set' + type[0].toUpperCase() + type.slice(1) + 's';
    var result = false;
    var currentTime, minTime, maxTime;

    if (angular.isDefined($attrs.minTime) && angular.isDefined($scope.minTime)) {
      if (timeIsInvalid($scope.minTime)) {
        $log.warn('Timepicker directive: "min-time" value must be a Date object, ' + 'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
      } else {
        currentTime = buildDate();
        minTime = buildDate($scope.minTime);
        currentTime[method](value);
        result = currentTime <= minTime;
      }
    }

    if (result) {
      return true;
    }

    if (angular.isDefined($attrs.maxTime) && angular.isDefined($scope.maxTime)) {
      if (timeIsInvalid($scope.maxTime)) {
        $log.warn('Timepicker directive: "max-time" value must be a Date object,' + ' a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
      } else {
        currentTime = buildDate();
        maxTime = buildDate($scope.maxTime);
        currentTime[method](value);
        result = currentTime >= maxTime;
      }
    }

    return result;
  } // 根据输入框的内容或一个时间生成时间


  function buildDate(time) {
    var dt = new Date();
    var hour = $scope.hour;
    var minute = $scope.minute;
    var second = $scope.second;

    if (time) {
      time = new Date(time);
      hour = time.getHours();
      minute = time.getMinutes();
      second = time.getSeconds();
    }

    dt.setHours(hour);
    dt.setMinutes(minute);
    dt.setSeconds(second);
    return dt;
  }

  function arrowkeyEventHandler(type) {
    return function (evt) {
      if (evt.which === 38) {
        // up
        evt.preventDefault();
        $scope.increase(type);
        $scope.$apply();
      } else if (evt.which === 40) {
        // down
        evt.preventDefault();
        $scope.decrease(type);
        $scope.$apply();
      }
    };
  }

  function addZero(value) {
    return value > 9 ? value : '0' + value;
  }
}]).directive('uixTimepanel', function () {
  return {
    restrict: 'AE',
    templateUrl: 'templates/timepanel.html',
    replace: true,
    require: ['uixTimepanel', 'ngModel'],
    scope: {
      onChange: '&',
      minTime: '=?',
      maxTime: '=?'
    },
    controller: 'uixTimepanelCtrl',
    link: function link(scope, el, attrs, ctrls) {
      var timepanelCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];
      timepanelCtrl.init(ngModelCtrl, el.find('input'));
    }
  };
});
"use strict";

/**
 * calendar
 * calendar directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-14
 */
angular.module('ui.xg.calendar', ['ui.xg.timepanel']).constant('uixCalendarConfig', {
  startingDay: 0,
  // 一周的开始天,0-周日,1-周一,以此类推
  showTime: true,
  // 是否显示时间选择
  showSeconds: true,
  // 是否显示秒
  minDate: null,
  // 最小可选日期
  maxDate: null,
  // 最大可选日期
  exceptions: [] // 不可选日期中的例外,比如3月份的日期都不可选,但是3月15日却是可选择的

}).provider('uixCalendar', function () {
  var FORMATS = {};

  this.setFormats = function (formats, subFormats) {
    if (subFormats) {
      FORMATS[formats] = subFormats;
    } else {
      FORMATS = formats;
    }
  };

  this.$get = ['$locale', '$log', function ($locale, $log) {
    return {
      getFormats: function getFormats() {
        FORMATS = angular.extend(angular.copy($locale.DATETIME_FORMATS), FORMATS);

        if (!FORMATS.TODAY) {
          if ($locale.id === 'en-us') {
            FORMATS.TODAY = 'today';
          } else if ($locale.id === 'zh-cn') {
            FORMATS.TODAY = '今天';
          }
        }

        if (!angular.isArray(FORMATS.SHORTMONTH) || FORMATS.SHORTMONTH.length !== 12 || !angular.isArray(FORMATS.MONTH) || FORMATS.MONTH.length !== 12 || !angular.isArray(FORMATS.SHORTDAY) || FORMATS.SHORTDAY.length !== 7) {
          $log.warn('invalid date time formats');
          FORMATS = $locale.DATETIME_FORMATS;
        }

        return FORMATS;
      }
    };
  }];
}).controller('uixCalendarCtrl', ['$scope', '$attrs', '$log', 'uixCalendar', 'uixCalendarConfig', function ($scope, $attrs, $log, uixCalendarProvider, calendarConfig) {
  var FORMATS = uixCalendarProvider.getFormats();
  var MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //每个月的天数,2月会根据闰年调整

  var ngModelCtrl = {
    $setViewValue: angular.noop
  };
  $scope.FORMATS = FORMATS;
  $scope.panels = {
    year: false,
    month: false,
    day: true,
    time: false
  };
  var self = this;
  angular.forEach(['startingDay', 'exceptions'], function (key) {
    self[key] = angular.isDefined($attrs[key]) ? angular.copy($scope.$parent.$eval($attrs[key])) : calendarConfig[key];
  });
  $scope.showTime = angular.isDefined($attrs.showTime) ? $scope.$parent.$eval($attrs.showTime) : calendarConfig.showTime; // 是否展示秒

  $scope.showSeconds = angular.isDefined($attrs.showSeconds) ? $scope.$parent.$eval($attrs.showSeconds) : calendarConfig.showSeconds;

  if (self.startingDay > 6 || self.startingDay < 0) {
    self.startingDay = calendarConfig.startingDay;
  }

  $scope.dayNames = dayNames(this.startingDay);
  $scope.allDays = [];

  this.init = function (_ngModelCtrl) {
    ngModelCtrl = _ngModelCtrl;
    ngModelCtrl.$render = this.render;
    ngModelCtrl.$formatters.unshift(function (modelValue) {
      return modelValue ? new Date(modelValue) : null;
    });
  };

  this.render = function () {
    var date = ngModelCtrl.$modelValue;

    if (isNaN(date) || !date) {
      $log.warn('Calendar directive: "ng-model" value must be a Date object, ' + 'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
      date = new Date(); // fix #1 如果没有传入日期,或者清空的话,设置当前time
    }

    date = new Date(date);
    $scope.selectDate = angular.copy(date);
    $scope.currentYear = $scope.selectDate.getFullYear();
    $scope.currentMonth = $scope.selectDate.getMonth();
    $scope.currentDay = $scope.currentYear + '-' + $scope.currentMonth + '-' + $scope.selectDate.getDate();
    $scope.allDays = getDays($scope.selectDate);
  }; // 选择某一个面板


  $scope.selectPanel = function (panel) {
    angular.forEach($scope.panels, function (pan, index) {
      $scope.panels[index] = false;
    });
    $scope.panels[panel] = true;
  }; // 切换上一个月


  $scope.prevMonth = function () {
    if ($scope.currentMonth === 0) {
      $scope.currentYear -= 1;
      $scope.currentMonth = 11;
    } else {
      $scope.currentMonth -= 1;
    }

    buildDayPanel();
  }; // 切换到下一个月


  $scope.nextMonth = function () {
    if ($scope.currentMonth === 11) {
      $scope.currentYear += 1;
      $scope.currentMonth = 0;
    } else {
      $scope.currentMonth += 1;
    }

    buildDayPanel();
  }; // 选择日期


  $scope.selectDayHandler = function (day) {
    if (day.isDisabled) {
      return;
    }

    $scope.selectDate.setFullYear(day.year);
    $scope.selectDate.setMonth(0); // 先把月份设置为1月，保证setDate的时候不会跨月份

    $scope.selectDate.setDate(day.day);
    $scope.selectDate.setMonth(day.month);

    if (!day.inMonth) {
      if (day.isNext) {
        $scope.nextMonth();
      } else {
        $scope.prevMonth();
      }
    }

    $scope.currentDay = $scope.currentYear + '-' + $scope.currentMonth + '-' + $scope.selectDate.getDate();
    fireRender();
  }; // 选择今天


  $scope.chooseToday = function () {
    if ($scope.disableToday) {
      return;
    }

    var today = splitDate(new Date());
    $scope.selectDate.setFullYear(today.year);
    $scope.selectDate.setMonth(0); // set to Jan firstly

    $scope.selectDate.setDate(today.day);
    $scope.selectDate.setMonth(today.month);
    $scope.currentYear = today.year;
    $scope.currentMonth = today.month;
    $scope.currentDay = $scope.currentYear + '-' + $scope.currentMonth + '-' + $scope.selectDate.getDate();
    buildDayPanel();
    fireRender();
  };

  $scope.$watch('minDate', function (newVal) {
    if (angular.isUndefined(newVal)) {
      return;
    }

    if (!angular.isDate(new Date(newVal))) {
      $log.warn('Calendar directive: "minDate" value must be a Date object, ' + 'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
      return;
    }

    dateRangeChaned();
  });
  $scope.$watch('maxDate', function (newVal) {
    if (angular.isUndefined(newVal)) {
      return;
    }

    if (!angular.isDate(new Date(newVal))) {
      $log.warn('Calendar directive: "maxDate" value must be a Date object, ' + 'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
      return;
    }

    dateRangeChaned();
  });

  function dateRangeChaned() {
    $scope.disableToday = todayIsDisabled();
    buildDayPanel();
  } // 判断今天是否是不可选的


  function todayIsDisabled() {
    var date = formatDate(new Date());
    return date.isDisabled;
  }

  var cacheTime; // 点击时间进入选择时间面板

  $scope.selectTimePanelHandler = function () {
    cacheTime = angular.copy($scope.selectDate);
    var sDay = $scope.selectDate.getDate();
    var minDate = $scope.minDate;
    var maxDate = $scope.maxDate;

    if (minDate) {
      var minDay = new Date(minDate).getDate();

      if (sDay !== minDay) {
        $scope.minTime = createTime();
      } else {
        $scope.minTime = angular.copy(minDate);
      }
    }

    if (maxDate) {
      var maxDay = new Date(maxDate).getDate();

      if (sDay !== maxDay) {
        $scope.maxTime = createTime(23, 59, 59);
      } else {
        $scope.maxTime = angular.copy(maxDate);
      }
    }

    $scope.selectPanel('time');
  }; // 时间面板返回


  $scope.timePanelBack = function () {
    $scope.selectDate = angular.copy(cacheTime);
    $scope.selectPanel('day');
  }; // 确定选择时间


  $scope.timePanelOk = function () {
    $scope.selectPanel('day');
    fireRender();
  }; // 选择此刻


  $scope.timePanelSelectNow = function () {
    var dt = new Date();
    var date = angular.copy($scope.selectDate);
    date.setHours(dt.getHours());
    date.setMinutes(dt.getMinutes());
    date.setSeconds(dt.getSeconds());
    $scope.selectDate = date;
  }; // 获取所有月份,分4列


  $scope.allMonths = function () {
    var res = [],
        MONTHS = FORMATS.MONTH,
        temp = [];

    for (var i = 0, len = MONTHS.length; i < len; i++) {
      if (temp.length >= 3) {
        res.push(temp);
        temp = [];
      }

      temp.push({
        name: MONTHS[i],
        index: i
      });
    }

    res.push(temp);
    return res;
  }(); // 在月份视图显示某一月份


  $scope.chooseMonthHandler = function (month) {
    $scope.currentMonth = month;
    buildDayPanel();
    $scope.selectPanel('day');
  };

  $scope.allYears = [];

  $scope.selectYearPanelHandler = function () {
    $scope.selectPanel('year');
    var year = $scope.currentYear;
    $scope.allYears = getYears(year);
  }; // 获取上一个12年


  $scope.prev12Years = function () {
    var year = $scope.allYears[0][0] - 8;
    $scope.allYears = getYears(year);
  }; // 获取下一个12年


  $scope.next12Years = function () {
    var year = $scope.allYears[3][2] + 5;
    $scope.allYears = getYears(year);
  }; // 在月份视图显示某一月份


  $scope.chooseYearHandler = function (year) {
    $scope.currentYear = year;
    buildDayPanel();
    $scope.selectPanel('month');
  };

  function fireRender() {
    ngModelCtrl.$setViewValue($scope.selectDate);
    ngModelCtrl.$render();
    var fn = $scope.onChange ? $scope.onChange() : angular.noop();

    if (fn && angular.isFunction(fn)) {
      fn($scope.selectDate);
    }
  } // 根据年,月构建日视图


  function buildDayPanel() {
    var date = createDate($scope.currentYear, $scope.currentMonth);
    $scope.allDays = getDays(date);
  } // 获取所有的最近的12年


  function getYears(year) {
    var res = [],
        temp = [];

    for (var i = -4; i < 8; i++) {
      if (temp.length >= 3) {
        res.push(temp);
        temp = [];
      }

      temp.push(year + i);
    }

    res.push(temp);
    return res;
  } // 获取周一到周日的名字


  function dayNames(startingDay) {
    var shortDays = angular.copy(FORMATS.SHORTDAY).map(function (day) {
      return day;
    });
    var delDays = shortDays.splice(0, startingDay);
    return shortDays.concat(delDays);
  } // 根据日期获取当月的所有日期


  function getDays(date) {
    var dayRows = [];
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth(); // 添加当月之前的天数

    var firstDayOfMonth = createDate(currentYear, currentMonth, 1);
    var day = firstDayOfMonth.getDay();
    var len = day >= self.startingDay ? day - self.startingDay : 7 - self.startingDay + day;

    for (var i = 0; i < len; i++) {
      pushDay(dayRows, dayBefore(firstDayOfMonth, len - i));
    } // 添加本月的天


    var lastDayOfMonth = getLastDayOfMonth(currentYear, currentMonth);
    var tempDay;

    for (var j = 1; j <= lastDayOfMonth; j++) {
      tempDay = createDate(currentYear, currentMonth, j);
      pushDay(dayRows, tempDay);
    } // 补全本月之后的天


    len = 7 - dayRows[dayRows.length - 1].length;

    for (var k = 1; k <= len; k++) {
      pushDay(dayRows, dayAfter(tempDay, k));
    }

    return dayRows;
  } // 存储计算出的日期


  function pushDay(dayRows, date) {
    var hasInsert = false;
    angular.forEach(dayRows, function (row) {
      if (row && row.length < 7) {
        row.push(formatDate(date));
        hasInsert = true;
      }
    });

    if (hasInsert) {
      return;
    }

    dayRows.push([formatDate(date)]);
  } // 根据日期date获取gapDay之后的日期


  function dayAfter(date, gapDay) {
    gapDay = gapDay || 1;
    var time = date.getTime();
    time += gapDay * 24 * 60 * 60 * 1000;
    return new Date(time);
  } // 根据日期date获取gapDay之前几天的日期


  function dayBefore(date, gapDay) {
    gapDay = gapDay || 1;
    var time = date.getTime();
    time -= gapDay * 24 * 60 * 60 * 1000;
    return new Date(time);
  } //获取一个月里最后一天是几号


  function getLastDayOfMonth(year, month) {
    var months = MONTH_DAYS.slice(0);

    if (year % 100 === 0 && year % 400 === 0 || year % 100 !== 0 && year % 4 === 0) {
      months[1] = 29;
    }

    return months[month];
  } //创建日期


  function createDate(year, month, day) {
    var date = new Date();
    date.setMonth(0);
    date.setDate(31); // set date to 1.31 first

    date.setFullYear(year);
    date.setDate(day || 1); // set date before set month

    date.setMonth(month || 0);
    return date;
  }

  function createTime(hour, minute, seconds) {
    var date = new Date();
    date.setHours(hour || 0);
    date.setMinutes(minute || 0);
    date.setSeconds(seconds || 0);
    return date;
  } // date1 是否比date2小,


  function earlierThan(date1, date2) {
    var tempDate1 = splitDate(date1);
    var tempDate2 = splitDate(date2);

    if (tempDate1.year < tempDate2.year) {
      return true;
    } else if (tempDate1.year > tempDate2.year) {
      return false;
    }

    if (tempDate1.month < tempDate2.month) {
      return true;
    } else if (tempDate1.month > tempDate2.month) {
      return false;
    }

    return tempDate1.day < tempDate2.day;
  }

  var dateFilter = angular.isDefined($attrs.dateFilter) ? $scope.dateFilter : function () {
    return true;
  }; //对日期进行格式化

  function formatDate(date) {
    var tempDate = splitDate(date);
    var selectedDt = splitDate($scope.selectDate);
    var today = splitDate(new Date());
    var isToday = tempDate.year === today.year && tempDate.month === today.month && tempDate.day === today.day;
    var isSelected = tempDate.year === selectedDt.year && tempDate.month === selectedDt.month && tempDate.day === selectedDt.day;
    var isDisabled = $scope.minDate && earlierThan(date, $scope.minDate) && !isExceptionDay(date) || $scope.maxDate && earlierThan($scope.maxDate, date) && !isExceptionDay(date) || !dateFilter({
      $date: date
    }) && !isExceptionDay(date);
    var day = date.getDay();
    return {
      date: date,
      year: tempDate.year,
      month: tempDate.month,
      day: tempDate.day,
      isWeekend: day === 0 || day === 6,
      isToday: isToday,
      inMonth: tempDate.month === $scope.currentMonth,
      isNext: tempDate.month > $scope.currentMonth,
      isSelected: isSelected,
      isDisabled: isDisabled,
      index: tempDate.year + '-' + tempDate.month + '-' + tempDate.day
    };
  }

  function isExceptionDay(date) {
    self.exceptions = [].concat(self.exceptions);
    var day1,
        day2 = splitDate(date);
    return self.exceptions.some(function (excepDay) {
      day1 = splitDate(excepDay);
      return day1.year === day2.year && day1.month === day2.month && day1.day === day2.day;
    });
  }

  function splitDate(date) {
    var dt = new Date(date);

    if (!angular.isDate(dt)) {
      $log.error('Calendar directive: date is not a Date Object');
      return;
    }

    return {
      year: dt.getFullYear(),
      month: dt.getMonth(),
      day: dt.getDate()
    };
  }
}]).directive('uixCalendar', function () {
  return {
    restrict: 'AE',
    templateUrl: 'templates/calendar.html',
    replace: true,
    require: ['uixCalendar', 'ngModel'],
    scope: {
      minDate: '=?',
      maxDate: '=?',
      onChange: '&?',
      dateFilter: '&?'
    },
    controller: 'uixCalendarCtrl',
    link: function link(scope, el, attrs, ctrls) {
      var calendarCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];
      calendarCtrl.init(ngModelCtrl);
    }
  };
});
"use strict";

/**
 * carousel
 * carousel directive
 * Author: your_email@gmail.com
 * Date:2016-08-05
 */
angular.module('ui.xg.carousel', ['ui.xg.transition']).controller('uixCarouselCtrl', ['$scope', '$timeout', '$uixTransition', function ($scope, $timeout, $uixTransition) {
  $scope.itemList = [];
  $scope.indexNumber = 0;
  $scope.currentItem = null;
  $scope.pause = false;
  var transition = null;
  var transitionRemove = {
    list: [],
    done: function done() {
      var itemList = $scope.itemList; // 双重循环,一个一个的删

      for (var i = 0; i < this.list.length; i++) {
        for (var j = 0; j < itemList.length; j++) {
          if (this.list[i] === itemList[j]) {
            nextShow();
            itemList.splice(j, 1);
            break;
          }
        }
      }
    }
  };

  this.addItem = function (scope, ele, active) {
    $scope.itemList.push({
      scope: scope,
      ele: ele
    });

    if (active === true) {
      $scope.index = scope.index;
    } // 如果用户没传值,则默认第一个为初始显示


    if (angular.isUndefined($scope.index)) {
      $scope.index = scope.index;
    } // 设置默认显示


    if (scope.index === $scope.index) {
      // 防止多个item设置active
      for (var i = 0; i < $scope.itemList.length - 1; i++) {
        $scope.itemList[i].ele.removeClass('active');
        $scope.itemList[i].scope.active = false;
      }

      ele.addClass('active');
      $scope.indexNumber = $scope.itemList.length - 1;
      $scope.currentItem = $scope.itemList[$scope.indexNumber];
    } // 触发一次


    $scope.loop();
  };

  this.removeItem = function (scope, ele) {
    if (transition) {
      transition.cancel();
      transition = null;
    }

    var itemList = $scope.itemList;

    for (var i = 0; i < itemList.length; i++) {
      var item = itemList[i];

      if (item.scope === scope && item.ele === ele) {
        // 需要判断当前item是否含有 active,prev,next。如果有证明当前或者即将显示自己,需要挪到下一帧
        if (scope.active === true) {
          $scope.indexNumber = i;
          nextShow();
          itemList.splice(i, 1);
        } else if (ele.hasClass('prev') || ele.hasClass('next')) {
          // 证明还在动画效果中,加入列表等待动画结束后删除
          transitionRemove.list.push(item);
        } else {
          // 直接删除
          itemList.splice(i, 1);
        }

        return true;
      }
    }
  };

  function nextShow() {
    // 当前显示状态,把active挪到下一帧
    var noTransition = $scope.noTransition;
    $scope.noTransition = true;
    $scope.next();
    $scope.noTransition = noTransition;
  } // 点击更换次序


  $scope.change = function (oldNum, newNum) {
    if (transition !== null) {
      // 还在动画效果中,禁止点击
      return true;
    }

    if (oldNum === newNum) {
      $scope.itemList[oldNum].active = true;
      $scope.itemList[oldNum].ele.addClass('active');
      return true;
    }

    $scope.killLoop();
    $scope.indexNumber = newNum;
    var oldItem = $scope.itemList[oldNum];
    var newItem = $scope.itemList[newNum];
    oldItem.scope.active = false;
    newItem.scope.active = true;

    if ($scope.noTransition === true) {
      // 无动画效果
      oldItem.ele.removeClass('active');
      newItem.ele.addClass('active');
      $scope.loop();
      return true;
    }

    var nextCss = 'next';
    var animateCss = 'left';

    if (oldNum > newNum) {
      nextCss = 'prev';
      animateCss = 'right';
    } // 加个timeout,让下一个item先就位,否则会出现无动画现象


    newItem.ele.addClass(nextCss);
    $timeout(function () {
      // 监听oldItem
      transition = $uixTransition(oldItem.ele, animateCss);
      newItem.ele.addClass(animateCss);
      transition.then(function () {
        transitionDone(oldItem, newItem, nextCss, animateCss);
      }, function () {
        transitionDone(oldItem, newItem, nextCss, animateCss);
      }); // 这里的50ms是用来防止chrome同时加入class丢失动画
    }, 50);
  };

  function transitionDone(oldItem, newItem, nextCss, animateCss) {
    // 更换item显示
    oldItem.ele.removeClass('active');
    oldItem.ele.removeClass(animateCss);
    newItem.ele.removeClass(nextCss);
    newItem.ele.removeClass(animateCss);
    newItem.ele.addClass('active');
    transition = null;
    $scope.loop();
    transitionRemove.done();
  }

  var timer = null;

  $scope.loop = function () {
    if (!!$scope.noLoop || $scope.pause || $scope.interval === 0) {
      return true;
    } // 先kill一次,防止多个定时器出现


    $scope.killLoop();
    timer = $timeout(function () {
      $scope.next();
    }, $scope.interval);
  };

  $scope.killLoop = function () {
    if (timer !== null) {
      $timeout.cancel(timer);
      timer = null;
    }

    return true;
  };

  $scope.next = function () {
    var oldNum = $scope.indexNumber;
    var newNum = 1 + oldNum;

    if (newNum >= $scope.itemList.length) {
      newNum = 0;
    }

    $scope.change(oldNum, newNum);
  };

  $scope.prev = function () {
    var oldNum = $scope.indexNumber;
    var newNum = oldNum - 1;

    if (newNum < 0) {
      newNum = $scope.itemList.length - 1;
    }

    $scope.change(oldNum, newNum);
  };

  $scope.$on('$destroy', function () {
    $scope.killLoop(); // 动画效果结束后会手动调用一次loop,置为空函数

    $scope.loop = function () {};
  });
}]).directive('uixCarousel', function () {
  return {
    restrict: 'AE',
    templateUrl: 'templates/carousel.html',
    replace: true,
    scope: {
      index: '=?active',
      interval: '=?',
      noLoop: '=?',
      noPause: '=?',
      noTransition: '=?'
    },
    controller: 'uixCarouselCtrl',
    controllerAs: 'carouselCtrl',
    transclude: true,
    link: function link(scope, ele) {
      var interval = parseInt(scope.interval, 10);
      interval = isNaN(interval) ? 0 : interval;
      scope.interval = interval;
      scope.$watch('noLoop', function (newValue) {
        if (newValue === true) {
          scope.killLoop();
        } else {
          scope.noLoop = false;
          scope.loop();
        }
      });
      ele.on('mouseenter', function () {
        if (scope.noPause) {
          return true;
        }

        scope.pause = true;
        scope.killLoop();
      });
      ele.on('mouseleave', function () {
        if (scope.noPause) {
          return true;
        }

        scope.pause = false;
        scope.loop();
      });
    }
  };
}).directive('uixCarouselItem', function () {
  return {
    restrict: 'AE',
    templateUrl: 'templates/carousel-item.html',
    require: '^uixCarousel',
    scope: {
      index: '=',
      active: '=?'
    },
    transclude: true,
    link: function link(scope, el, attrs, carouselCtrl) {
      carouselCtrl.addItem(scope, el, scope.active);
      el.addClass('item');
      scope.$on('$destroy', function () {
        carouselCtrl.removeItem(scope, el);
      });
    }
  };
});
"use strict";

/**
 * position
 * position factory
 * Author: ui.bootstrap https://github.com/angular-ui/bootstrap
 * Date:2016-05-25
 */
angular.module('ui.xg.position', []).factory('$uixPosition', ['$document', '$window', function ($document, $window) {
  /**
   * Used by scrollbarWidth() function to cache scrollbar's width.
   * Do not access this variable directly, use scrollbarWidth() instead.
   */
  var SCROLLBAR_WIDTH;
  var OVERFLOW_REGEX = {
    normal: /(auto|scroll)/,
    hidden: /(auto|scroll|hidden)/
  };
  var PLACEMENT_REGEX = {
    auto: /\s?auto?\s?/i,
    primary: /^(top|bottom|left|right)$/,
    secondary: /^(top|bottom|left|right|center)$/,
    vertical: /^(top|bottom)$/
  };
  return {
    /**
     * Provides a raw DOM element from a jQuery/jQLite element.
     *
     * @param {element} elem - The element to convert.
     *
     * @returns {element} A HTML element.
     */
    getRawNode: function getRawNode(elem) {
      return elem[0] || elem;
    },

    /**
     * Provides a parsed number for a style property.  Strips
     * units and casts invalid numbers to 0.
     *
     * @param {string} value - The style value to parse.
     *
     * @returns {number} A valid number.
     */
    parseStyle: function parseStyle(value) {
      value = parseFloat(value);
      return isFinite(value) ? value : 0;
    },

    /**
     * Provides the closest positioned ancestor.
     *
     * @param {element} element - The element to get the offest parent for.
     *
     * @returns {element} The closest positioned ancestor.
     */
    offsetParent: function offsetParent(elem) {
      elem = this.getRawNode(elem);
      var offsetParent = elem.offsetParent || $document[0].documentElement;

      function isStaticPositioned(el) {
        return ($window.getComputedStyle(el).position || 'static') === 'static';
      }

      while (offsetParent && offsetParent !== $document[0].documentElement && isStaticPositioned(offsetParent)) {
        offsetParent = offsetParent.offsetParent;
      }

      return offsetParent || $document[0].documentElement;
    },

    /**
     * Provides the scrollbar width, concept from TWBS measureScrollbar()
     * function in https://github.com/twbs/bootstrap/blob/master/js/modal.js
     *
     * @returns {number} The width of the browser scollbar.
     */
    scrollbarWidth: function scrollbarWidth() {
      if (angular.isUndefined(SCROLLBAR_WIDTH)) {
        var scrollElem = angular.element('<div style="position: absolute; top: -9999px; width: 50px; height: 50px; overflow: scroll;"></div>');
        $document.find('body').append(scrollElem);
        SCROLLBAR_WIDTH = scrollElem[0].offsetWidth - scrollElem[0].clientWidth;
        SCROLLBAR_WIDTH = isFinite(SCROLLBAR_WIDTH) ? SCROLLBAR_WIDTH : 0;
        scrollElem.remove();
      }

      return SCROLLBAR_WIDTH;
    },

    /**
     * Provides the closest scrollable ancestor.
     * A port of the jQuery UI scrollParent method:
     * https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
     *
     * @param {element} elem - The element to find the scroll parent of.
     * @param {boolean=} [includeHidden=false] - Should scroll style of 'hidden' be considered,
     *   default is false.
     *
     * @returns {element} A HTML element.
     */
    scrollParent: function scrollParent(elem, includeHidden) {
      elem = this.getRawNode(elem);
      var overflowRegex = includeHidden ? OVERFLOW_REGEX.hidden : OVERFLOW_REGEX.normal;
      var documentEl = $document[0].documentElement;
      var elemStyle = $window.getComputedStyle(elem);
      var excludeStatic = elemStyle.position === 'absolute';
      var scrollParent = elem.parentElement || documentEl;

      if (scrollParent === documentEl || elemStyle.position === 'fixed') {
        return documentEl;
      }

      while (scrollParent.parentElement && scrollParent !== documentEl) {
        var spStyle = $window.getComputedStyle(scrollParent);

        if (excludeStatic && spStyle.position !== 'static') {
          excludeStatic = false;
        }

        if (!excludeStatic && overflowRegex.test(spStyle.overflow + spStyle.overflowY + spStyle.overflowX)) {
          break;
        }

        scrollParent = scrollParent.parentElement;
      }

      return scrollParent;
    },

    /**
     * Provides read-only equivalent of jQuery's position function:
     * http://api.jquery.com/position/ - distance to closest positioned
     * ancestor.  Does not account for margins by default like jQuery position.
     *
     * @param {element} elem - The element to caclulate the position on.
     * @param {boolean=} [includeMargins=false] - Should margins be accounted
     * for, default is false.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**width**: the width of the element</li>
     *     <li>**height**: the height of the element</li>
     *     <li>**top**: distance to top edge of offset parent</li>
     *     <li>**left**: distance to left edge of offset parent</li>
     *   </ul>
     */
    position: function position(elem, includeMagins) {
      elem = this.getRawNode(elem);
      var elemOffset = this.offset(elem);

      if (includeMagins) {
        var elemStyle = $window.getComputedStyle(elem);
        elemOffset.top -= this.parseStyle(elemStyle.marginTop);
        elemOffset.left -= this.parseStyle(elemStyle.marginLeft);
      }

      var parent = this.offsetParent(elem);
      var parentOffset = {
        top: 0,
        left: 0
      };

      if (parent !== $document[0].documentElement) {
        parentOffset = this.offset(parent);
        parentOffset.top += parent.clientTop - parent.scrollTop;
        parentOffset.left += parent.clientLeft - parent.scrollLeft;
      }

      return {
        width: Math.round(angular.isNumber(elemOffset.width) ? elemOffset.width : elem.offsetWidth),
        height: Math.round(angular.isNumber(elemOffset.height) ? elemOffset.height : elem.offsetHeight),
        top: Math.round(elemOffset.top - parentOffset.top),
        left: Math.round(elemOffset.left - parentOffset.left)
      };
    },

    /**
     * Provides read-only equivalent of jQuery's offset function:
     * http://api.jquery.com/offset/ - distance to viewport.  Does
     * not account for borders, margins, or padding on the body
     * element.
     *
     * @param {element} elem - The element to calculate the offset on.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**width**: the width of the element</li>
     *     <li>**height**: the height of the element</li>
     *     <li>**top**: distance to top edge of viewport</li>
     *     <li>**right**: distance to bottom edge of viewport</li>
     *   </ul>
     */
    offset: function offset(elem) {
      elem = this.getRawNode(elem);
      var elemBCR = elem.getBoundingClientRect();
      return {
        width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
        height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
        top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
        left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
      };
    },

    /**
     * Provides offset distance to the closest scrollable ancestor
     * or viewport.  Accounts for border and scrollbar width.
     *
     * Right and bottom dimensions represent the distance to the
     * respective edge of the viewport element.  If the element
     * edge extends beyond the viewport, a negative value will be
     * reported.
     *
     * @param {element} elem - The element to get the viewport offset for.
     * @param {boolean=} [useDocument=false] - Should the viewport be the document element instead
     * of the first scrollable element, default is false.
     * @param {boolean=} [includePadding=true] - Should the padding on the offset parent element
     * be accounted for, default is true.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**top**: distance to the top content edge of viewport element</li>
     *     <li>**bottom**: distance to the bottom content edge of viewport element</li>
     *     <li>**left**: distance to the left content edge of viewport element</li>
     *     <li>**right**: distance to the right content edge of viewport element</li>
     *   </ul>
     */
    viewportOffset: function viewportOffset(elem, useDocument, includePadding) {
      elem = this.getRawNode(elem);
      includePadding = includePadding !== false ? true : false;
      var elemBCR = elem.getBoundingClientRect();
      var offsetBCR = {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      };
      var offsetParent = useDocument ? $document[0].documentElement : this.scrollParent(elem);
      var offsetParentBCR = offsetParent.getBoundingClientRect();
      offsetBCR.top = offsetParentBCR.top + offsetParent.clientTop;
      offsetBCR.left = offsetParentBCR.left + offsetParent.clientLeft;

      if (offsetParent === $document[0].documentElement) {
        offsetBCR.top += $window.pageYOffset;
        offsetBCR.left += $window.pageXOffset;
      }

      offsetBCR.bottom = offsetBCR.top + offsetParent.clientHeight;
      offsetBCR.right = offsetBCR.left + offsetParent.clientWidth;

      if (includePadding) {
        var offsetParentStyle = $window.getComputedStyle(offsetParent);
        offsetBCR.top += this.parseStyle(offsetParentStyle.paddingTop);
        offsetBCR.bottom -= this.parseStyle(offsetParentStyle.paddingBottom);
        offsetBCR.left += this.parseStyle(offsetParentStyle.paddingLeft);
        offsetBCR.right -= this.parseStyle(offsetParentStyle.paddingRight);
      }

      return {
        top: Math.round(elemBCR.top - offsetBCR.top),
        bottom: Math.round(offsetBCR.bottom - elemBCR.bottom),
        left: Math.round(elemBCR.left - offsetBCR.left),
        right: Math.round(offsetBCR.right - elemBCR.right)
      };
    },

    /**
     * Provides an array of placement values parsed from a placement string.
     * Along with the 'auto' indicator, supported placement strings are:
     *   <ul>
     *     <li>top: element on top, horizontally centered on host element.</li>
     *     <li>top-left: element on top, left edge aligned with host element left edge.</li>
     *     <li>top-right: element on top, lerightft edge aligned with host element right edge.</li>
     *     <li>bottom: element on bottom, horizontally centered on host element.</li>
     *     <li>bottom-left: element on bottom, left edge aligned with host element left edge.</li>
     *     <li>bottom-right: element on bottom, right edge aligned with host element right edge.</li>
     *     <li>left: element on left, vertically centered on host element.</li>
     *     <li>left-top: element on left, top edge aligned with host element top edge.</li>
     *     <li>left-bottom: element on left, bottom edge aligned with host element bottom edge.</li>
     *     <li>right: element on right, vertically centered on host element.</li>
     *     <li>right-top: element on right, top edge aligned with host element top edge.</li>
     *     <li>right-bottom: element on right, bottom edge aligned with host element bottom edge.</li>
     *   </ul>
     * A placement string with an 'auto' indicator is expected to be
     * space separated from the placement, i.e: 'auto bottom-left'  If
     * the primary and secondary placement values do not match 'top,
     * bottom, left, right' then 'top' will be the primary placement and
     * 'center' will be the secondary placement.  If 'auto' is passed, true
     * will be returned as the 3rd value of the array.
     *
     * @param {string} placement - The placement string to parse.
     *
     * @returns {array} An array with the following values
     * <ul>
     *   <li>**[0]**: The primary placement.</li>
     *   <li>**[1]**: The secondary placement.</li>
     *   <li>**[2]**: If auto is passed: true, else undefined.</li>
     * </ul>
     */
    parsePlacement: function parsePlacement(placement) {
      var autoPlace = PLACEMENT_REGEX.auto.test(placement);

      if (autoPlace) {
        placement = placement.replace(PLACEMENT_REGEX.auto, '');
      }

      placement = placement.split('-');
      placement[0] = placement[0] || 'top';

      if (!PLACEMENT_REGEX.primary.test(placement[0])) {
        placement[0] = 'top';
      }

      placement[1] = placement[1] || 'center';

      if (!PLACEMENT_REGEX.secondary.test(placement[1])) {
        placement[1] = 'center';
      }

      if (autoPlace) {
        placement[2] = true;
      } else {
        placement[2] = false;
      }

      return placement;
    },

    /**
     * Provides coordinates for an element to be positioned relative to
     * another element.  Passing 'auto' as part of the placement parameter
     * will enable smart placement - where the element fits. i.e:
     * 'auto left-top' will check to see if there is enough space to the left
     * of the hostElem to fit the targetElem, if not place right (same for secondary
     * top placement).  Available space is calculated using the viewportOffset
     * function.
     *
     * @param {element} hostElem - The element to position against.
     * @param {element} targetElem - The element to position.
     * @param {string=} [placement=top] - The placement for the targetElem,
     *   default is 'top'. 'center' is assumed as secondary placement for
     *   'top', 'left', 'right', and 'bottom' placements.  Available placements are:
     *   <ul>
     *     <li>top</li>
     *     <li>top-right</li>
     *     <li>top-left</li>
     *     <li>bottom</li>
     *     <li>bottom-left</li>
     *     <li>bottom-right</li>
     *     <li>left</li>
     *     <li>left-top</li>
     *     <li>left-bottom</li>
     *     <li>right</li>
     *     <li>right-top</li>
     *     <li>right-bottom</li>
     *   </ul>
     * @param {boolean=} [appendToBody=false] - Should the top and left values returned
     *   be calculated from the body element, default is false.
     *
     * @returns {object} An object with the following properties:
     *   <ul>
     *     <li>**top**: Value for targetElem top.</li>
     *     <li>**left**: Value for targetElem left.</li>
     *     <li>**placement**: The resolved placement.</li>
     *   </ul>
     */
    positionElements: function positionElements(hostElem, targetElem, placement, appendToBody) {
      hostElem = this.getRawNode(hostElem);
      targetElem = this.getRawNode(targetElem); // need to read from prop to support tests.

      var targetWidth = angular.isDefined(targetElem.offsetWidth) ? targetElem.offsetWidth : targetElem.prop('offsetWidth');
      var targetHeight = angular.isDefined(targetElem.offsetHeight) ? targetElem.offsetHeight : targetElem.prop('offsetHeight');
      placement = this.parsePlacement(placement);
      var hostElemPos = appendToBody ? this.offset(hostElem) : this.position(hostElem);
      var targetElemPos = {
        top: 0,
        left: 0,
        placement: ''
      };

      if (placement[2]) {
        var viewportOffset = this.viewportOffset(hostElem);
        var targetElemStyle = $window.getComputedStyle(targetElem);
        var adjustedSize = {
          width: targetWidth + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginLeft) + this.parseStyle(targetElemStyle.marginRight))),
          height: targetHeight + Math.round(Math.abs(this.parseStyle(targetElemStyle.marginTop) + this.parseStyle(targetElemStyle.marginBottom)))
        };
        placement[0] = placement[0] === 'top' && adjustedSize.height > viewportOffset.top && adjustedSize.height <= viewportOffset.bottom ? 'bottom' : placement[0] === 'bottom' && adjustedSize.height > viewportOffset.bottom && adjustedSize.height <= viewportOffset.top ? 'top' : placement[0] === 'left' && adjustedSize.width > viewportOffset.left && adjustedSize.width <= viewportOffset.right ? 'right' : placement[0] === 'right' && adjustedSize.width > viewportOffset.right && adjustedSize.width <= viewportOffset.left ? 'left' : placement[0];
        placement[1] = placement[1] === 'top' && adjustedSize.height - hostElemPos.height > viewportOffset.bottom && adjustedSize.height - hostElemPos.height <= viewportOffset.top ? 'bottom' : placement[1] === 'bottom' && adjustedSize.height - hostElemPos.height > viewportOffset.top && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom ? 'top' : placement[1] === 'left' && adjustedSize.width - hostElemPos.width > viewportOffset.right && adjustedSize.width - hostElemPos.width <= viewportOffset.left ? 'right' : placement[1] === 'right' && adjustedSize.width - hostElemPos.width > viewportOffset.left && adjustedSize.width - hostElemPos.width <= viewportOffset.right ? 'left' : placement[1];

        if (placement[1] === 'center') {
          if (PLACEMENT_REGEX.vertical.test(placement[0])) {
            var xOverflow = hostElemPos.width / 2 - targetWidth / 2;

            if (viewportOffset.left + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.right) {
              placement[1] = 'left';
            } else if (viewportOffset.right + xOverflow < 0 && adjustedSize.width - hostElemPos.width <= viewportOffset.left) {
              placement[1] = 'right';
            }
          } else {
            var yOverflow = hostElemPos.height / 2 - adjustedSize.height / 2;

            if (viewportOffset.top + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.bottom) {
              placement[1] = 'top';
            } else if (viewportOffset.bottom + yOverflow < 0 && adjustedSize.height - hostElemPos.height <= viewportOffset.top) {
              placement[1] = 'bottom';
            }
          }
        }
      }

      switch (placement[0]) {
        case 'top':
          targetElemPos.top = hostElemPos.top - targetHeight;
          break;

        case 'bottom':
          targetElemPos.top = hostElemPos.top + hostElemPos.height;
          break;

        case 'left':
          targetElemPos.left = hostElemPos.left - targetWidth;
          break;

        case 'right':
          targetElemPos.left = hostElemPos.left + hostElemPos.width;
          break;
      }

      switch (placement[1]) {
        case 'top':
          targetElemPos.top = hostElemPos.top;
          break;

        case 'bottom':
          targetElemPos.top = hostElemPos.top + hostElemPos.height - targetHeight;
          break;

        case 'left':
          targetElemPos.left = hostElemPos.left;
          break;

        case 'right':
          targetElemPos.left = hostElemPos.left + hostElemPos.width - targetWidth;
          break;

        case 'center':
          if (PLACEMENT_REGEX.vertical.test(placement[0])) {
            targetElemPos.left = hostElemPos.left + hostElemPos.width / 2 - targetWidth / 2;
          } else {
            targetElemPos.top = hostElemPos.top + hostElemPos.height / 2 - targetHeight / 2;
          }

          break;
      }

      targetElemPos.top = Math.round(targetElemPos.top);
      targetElemPos.left = Math.round(targetElemPos.left);
      targetElemPos.placement = placement[1] === 'center' ? placement[0] : placement[0] + '-' + placement[1];
      return targetElemPos;
    },

    /**
     * Provides a way for positioning tooltip & dropdown
     * arrows when using placement options beyond the standard
     * left, right, top, or bottom.
     *
     * @param {element} elem - The tooltip/dropdown element.
     * @param {string} placement - The placement for the elem.
     */
    positionArrow: function positionArrow(elem, placement) {
      elem = this.getRawNode(elem);
      var isTooltip = true;
      var innerElem = elem.querySelector('.tooltip-inner');

      if (!innerElem) {
        isTooltip = false;
        innerElem = elem.querySelector('.popover-inner');
      }

      if (!innerElem) {
        return;
      }

      var arrowElem = isTooltip ? elem.querySelector('.tooltip-arrow') : elem.querySelector('.arrow');

      if (!arrowElem) {
        return;
      }

      placement = this.parsePlacement(placement);

      if (placement[1] === 'center') {
        // no adjustment necessary - just reset styles
        angular.element(arrowElem).css({
          top: '',
          bottom: '',
          right: '',
          left: '',
          margin: ''
        });
        return;
      }

      var borderProp = 'border-' + placement[0] + '-width';
      var borderWidth = $window.getComputedStyle(arrowElem)[borderProp];
      var borderRadiusProp = 'border-';

      if (PLACEMENT_REGEX.vertical.test(placement[0])) {
        borderRadiusProp += placement[0] + '-' + placement[1];
      } else {
        borderRadiusProp += placement[1] + '-' + placement[0];
      }

      borderRadiusProp += '-radius';
      var borderRadius = $window.getComputedStyle(isTooltip ? innerElem : elem)[borderRadiusProp];
      var arrowCss = {
        top: 'auto',
        bottom: 'auto',
        left: 'auto',
        right: 'auto',
        margin: 0
      };

      switch (placement[0]) {
        case 'top':
          arrowCss.bottom = isTooltip ? '0' : '-' + borderWidth;
          break;

        case 'bottom':
          arrowCss.top = isTooltip ? '0' : '-' + borderWidth;
          break;

        case 'left':
          arrowCss.right = isTooltip ? '0' : '-' + borderWidth;
          break;

        case 'right':
          arrowCss.left = isTooltip ? '0' : '-' + borderWidth;
          break;
      }

      arrowCss[placement[1]] = borderRadius;
      angular.element(arrowElem).css(arrowCss);
    }
  };
}]);
"use strict";

/**
 * stackedMap
 * stackedMap factory
 * Author: yjy972080142@gmail.com
 * Date:2016-06-06
 */
angular.module('ui.xg.stackedMap', []).factory('$uixStackedMap', function () {
  return {
    createNew: function createNew() {
      var stack = [];
      return {
        add: function add(key, value) {
          stack.push({
            key: key,
            value: value
          });
        },
        get: function get(key) {
          for (var i = 0; i < stack.length; i++) {
            if (key === stack[i].key) {
              return stack[i];
            }
          }
        },
        keys: function keys() {
          var keys = [];

          for (var i = 0; i < stack.length; i++) {
            keys.push(stack[i].key);
          }

          return keys;
        },
        top: function top() {
          return stack[stack.length - 1];
        },
        remove: function remove(key) {
          var idx = -1;

          for (var i = 0; i < stack.length; i++) {
            if (key === stack[i].key) {
              idx = i;
              break;
            }
          }

          return stack.splice(idx, 1)[0];
        },
        removeTop: function removeTop() {
          return stack.splice(stack.length - 1, 1)[0];
        },
        length: function length() {
          return stack.length;
        }
      };
    }
  };
});
"use strict";

/**
 * tooltip
 * 提示指令
 * Author:heqingyang@meituan.com
 * Update:yjy972080142@gmail.com
 * Date:2016-02-18
 */
angular.module('ui.xg.tooltip', ['ui.xg.position', 'ui.xg.stackedMap'])
/**
 * The $tooltip service creates tooltip- and popover-like directives as well as
 * houses global options for them.
 */
.provider('$uixTooltip', function () {
  // The default options tooltip and popover.
  var defaultOptions = {
    placement: 'top',
    placementClassPrefix: '',
    animation: true,
    popupDelay: 0,
    popupCloseDelay: 200,
    useContentExp: false
  }; // Default hide triggers for each show trigger

  var triggerMap = {
    'mouseenter': 'mouseleave',
    'click': 'click',
    'outsideClick': 'outsideClick',
    'focus': 'blur',
    'none': ''
  }; // The options specified to the provider globally.

  var globalOptions = {};

  this.options = function (value) {
    angular.extend(globalOptions, value);
  };
  /**
   * This allows you to extend the set of trigger mappings available. E.g.:
   *
   *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
   */


  this.setTriggers = function setTriggers(triggers) {
    angular.extend(triggerMap, triggers);
  };
  /**
   * This is a helper function for translating camel-case to snake-case.
   */


  function snakeCase(name) {
    var regexp = /[A-Z]/g;
    var separator = '-';
    return name.replace(regexp, function (letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }
  /**
   * Returns the actual instance of the $tooltip service.
   * TODO support multiple triggers
   */


  this.$get = ['$compile', '$timeout', '$document', '$uixPosition', '$interpolate', '$rootScope', '$parse', '$uixStackedMap', function ($compile, $timeout, $document, $position, $interpolate, $rootScope, $parse, $uixStackedMap) {
    var openedTooltips = $uixStackedMap.createNew();
    $document.on('keypress', keypressListener);
    $rootScope.$on('$destroy', function () {
      $document.off('keypress', keypressListener);
    });

    function keypressListener(evt) {
      if (evt.which === 27) {
        var last = openedTooltips.top();

        if (last) {
          last.value.close();
          openedTooltips.removeTop();
          last = null;
        }
      }
    }

    return function $tooltip(ttType, prefix, defaultTriggerShow, options) {
      options = angular.extend({}, defaultOptions, globalOptions, options);
      /**
       * Returns an object of show and hide triggers.
       *
       * If a trigger is supplied,
       * it is used to show the tooltip; otherwise, it will use the `trigger`
       * option passed to the `$tooltipProvider.options` method; else it will
       * default to the trigger supplied to this directive factory.
       *
       * The hide trigger is based on the show trigger. If the `trigger` option
       * was passed to the `$tooltipProvider.options` method, it will use the
       * mapped trigger from `triggerMap` or the passed trigger if the map is
       * undefined; otherwise, it uses the `triggerMap` value of the show
       * trigger; else it will just use the show trigger.
       */

      function getTriggers(trigger) {
        var show = (trigger || options.trigger || defaultTriggerShow).split(' ');
        var hide = show.map(function (trigger) {
          return triggerMap[trigger] || trigger;
        });
        return {
          show: show,
          hide: hide
        };
      }

      var directiveName = snakeCase(ttType);
      var startSym = $interpolate.startSymbol();
      var endSym = $interpolate.endSymbol();
      var template = '<div ' + directiveName + '-popup ' + 'title="' + startSym + 'title' + endSym + '" ' + (options.useContentExp ? 'content-exp="contentExp()" ' : 'content="' + startSym + 'content' + endSym + '" ') + 'placement="' + startSym + 'placement' + endSym + '" ' + 'popup-class="' + startSym + 'popupClass' + endSym + '" ' + 'animation="animation" ' + 'is-open="isOpen"' + 'origin-scope="origScope" ' + 'style="visibility: hidden; display: block; top: -9999px; left: -9999px;"' + '>' + '</div>';
      return {
        compile: function compile() {
          var tooltipLinker = $compile(template);
          return function link(scope, element, attrs) {
            var tooltip;
            var tooltipLinkedScope;
            var transitionTimeout;
            var showTimeout;
            var hideTimeout;
            var positionTimeout;
            var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false;
            var triggers = getTriggers();
            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);
            var ttScope = scope.$new(true);
            var repositionScheduled = false;
            var isOpenParse = angular.isDefined(attrs[prefix + 'IsOpen']) ? $parse(attrs[prefix + 'IsOpen']) : false;
            var contentParse = options.useContentExp ? $parse(attrs[ttType]) : false;
            var observers = [];

            var positionTooltip = function positionTooltip() {
              // check if tooltip exists and is not empty
              if (!tooltip || !tooltip.html()) {
                return;
              }

              if (!positionTimeout) {
                positionTimeout = $timeout(function () {
                  if (!tooltip) {
                    return;
                  } // Reset the positioning.


                  tooltip.css({
                    top: 0,
                    left: 0
                  }); // Now set the calculated positioning.

                  var ttPosition = $position.positionElements(element, tooltip, ttScope.placement, appendToBody);
                  tooltip.css({
                    top: ttPosition.top + 'px',
                    left: ttPosition.left + 'px',
                    visibility: 'visible'
                  }); // If the placement class is prefixed, still need
                  // to remove the TWBS standard class.

                  if (options.placementClassPrefix) {
                    tooltip.removeClass('top bottom left right');
                  }

                  tooltip.removeClass(options.placementClassPrefix + 'top ' + options.placementClassPrefix + 'top-left ' + options.placementClassPrefix + 'top-right ' + options.placementClassPrefix + 'bottom ' + options.placementClassPrefix + 'bottom-left ' + options.placementClassPrefix + 'bottom-right ' + options.placementClassPrefix + 'left ' + options.placementClassPrefix + 'left-top ' + options.placementClassPrefix + 'left-bottom ' + options.placementClassPrefix + 'right ' + options.placementClassPrefix + 'right-top ' + options.placementClassPrefix + 'right-bottom');
                  var placement = ttPosition.placement.split('-');
                  tooltip.addClass(placement[0], options.placementClassPrefix + ttPosition.placement);
                  $position.positionArrow(tooltip, ttPosition.placement);
                  positionTimeout = null;
                }, 0, false);
              }
            }; // Set up the correct scope to allow transclusion later


            ttScope.origScope = scope; // By default, the tooltip is not open.
            // TODO add ability to start tooltip opened

            ttScope.isOpen = false;
            openedTooltips.add(ttScope, {
              close: hide
            });

            function toggleTooltipBind() {
              if (!ttScope.isOpen) {
                showTooltipBind();
              } else {
                hideTooltipBind();
              }
            } // Show the tooltip with delay if specified, otherwise show it immediately


            function showTooltipBind() {
              if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                return;
              }

              cancelHide();
              prepareTooltip();

              if (ttScope.popupDelay) {
                // Do nothing if the tooltip was already scheduled to pop-up.
                // happens if show is triggered multiple times before any hide is triggered.
                if (!showTimeout) {
                  showTimeout = $timeout(show, ttScope.popupDelay, false);
                }
              } else {
                show();
              }
            }

            function hideTooltipBind() {
              cancelShow();

              if (ttScope.popupCloseDelay) {
                if (!hideTimeout) {
                  hideTimeout = $timeout(hide, ttScope.popupCloseDelay, false);
                }
              } else {
                hide();
              }
            } // Show the tooltip popup element.


            function show() {
              cancelShow();
              cancelHide(); // Don't show empty tooltips.

              if (!ttScope.content) {
                return angular.noop;
              }

              createTooltip(); // And show the tooltip.

              ttScope.$evalAsync(function () {
                ttScope.isOpen = true;
                assignIsOpen(true);
                positionTooltip();
              });
            }

            function cancelShow() {
              if (showTimeout) {
                $timeout.cancel(showTimeout);
                showTimeout = null;
              }

              if (positionTimeout) {
                $timeout.cancel(positionTimeout);
                positionTimeout = null;
              }
            } // Hide the tooltip popup element.


            function hide() {
              if (!ttScope) {
                return;
              } // First things first: we don't show it anymore.


              ttScope.$evalAsync(function () {
                if (!ttScope) {
                  return;
                }

                ttScope.isOpen = false;
                assignIsOpen(false); // And now we remove it from the DOM. However, if we have animation, we
                // need to wait for it to expire beforehand.
                // FIXME: this is a placeholder for a port of the transitions library.
                // The fade transition in TWBS is 150ms.

                if (ttScope.animation) {
                  if (!transitionTimeout) {
                    transitionTimeout = $timeout(removeTooltip, 150, false);
                  }
                } else {
                  removeTooltip();
                }
              });
            }

            function cancelHide() {
              if (hideTimeout) {
                $timeout.cancel(hideTimeout);
                hideTimeout = null;
              }

              if (transitionTimeout) {
                $timeout.cancel(transitionTimeout);
                transitionTimeout = null;
              }
            }

            function createTooltip() {
              // There can only be one tooltip element per directive shown at once.
              if (tooltip) {
                return;
              }

              tooltipLinkedScope = ttScope.$new();
              tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
                var val = attrs[prefix + 'Trigger'];
                triggers = getTriggers(val);

                if (triggers.show !== 'none') {
                  triggers.show.forEach(function (trigger, idx) {
                    if (trigger !== triggers.hide[idx]) {
                      tooltip[0].addEventListener(trigger, showTooltipBind);
                      triggers.hide[idx].split(' ').forEach(function (trigger) {
                        tooltip[0].addEventListener(trigger, hideTooltipBind);
                      });
                    }
                  });
                }

                if (appendToBody) {
                  $document.find('body').append(tooltip);
                } else {
                  element.after(tooltip);
                }
              });
              prepObservers();
            }

            function removeTooltip() {
              cancelShow();
              cancelHide();
              unregisterObservers();

              if (tooltip) {
                unregisterTooltipTriggers();
                tooltip.remove();
                tooltip = null;
              }

              if (tooltipLinkedScope) {
                tooltipLinkedScope.$destroy();
                tooltipLinkedScope = null;
              }
            }
            /**
             * Set the inital scope values. Once
             * the tooltip is created, the observers
             * will be added to keep things in synch.
             */


            function prepareTooltip() {
              ttScope.title = attrs[prefix + 'Title'];

              if (contentParse) {
                ttScope.content = contentParse(scope);
              } else {
                ttScope.content = attrs[ttType];
              }

              ttScope.popupClass = attrs[prefix + 'Class'];
              ttScope.placement = angular.isDefined(attrs[prefix + 'Placement']) ? attrs[prefix + 'Placement'] : options.placement;
              var delay = parseInt(attrs[prefix + 'PopupDelay'], 10);
              var closeDelay = parseInt(attrs[prefix + 'PopupCloseDelay'], 10);
              ttScope.popupDelay = !isNaN(delay) ? delay : options.popupDelay;
              ttScope.popupCloseDelay = !isNaN(closeDelay) ? closeDelay : options.popupCloseDelay;
            }

            function assignIsOpen(isOpen) {
              if (isOpenParse && angular.isFunction(isOpenParse.assign)) {
                isOpenParse.assign(scope, isOpen);
              }
            }

            ttScope.contentExp = function () {
              return ttScope.content;
            };
            /**
             * Observe the relevant attributes.
             */


            attrs.$observe('disabled', function (val) {
              if (val) {
                cancelShow();
              }

              if (val && ttScope.isOpen) {
                hide();
              }
            });

            if (isOpenParse) {
              scope.$watch(isOpenParse, function (val) {
                if (ttScope && !val === ttScope.isOpen) {
                  toggleTooltipBind();
                }
              });
            }

            function prepObservers() {
              observers.length = 0;

              if (contentParse) {
                observers.push(scope.$watch(contentParse, function (val) {
                  ttScope.content = val;

                  if (!val && ttScope.isOpen) {
                    hide();
                  }
                }));
                observers.push(tooltipLinkedScope.$watch(function () {
                  if (!repositionScheduled) {
                    repositionScheduled = true;
                    tooltipLinkedScope.$$postDigest(function () {
                      repositionScheduled = false;

                      if (ttScope && ttScope.isOpen) {
                        positionTooltip();
                      }
                    });
                  }
                }));
              } else {
                observers.push(attrs.$observe(ttType, function (val) {
                  ttScope.content = val;

                  if (!val && ttScope.isOpen) {
                    hide();
                  } else {
                    positionTooltip();
                  }
                }));
              }

              observers.push(attrs.$observe(prefix + 'Title', function (val) {
                ttScope.title = val;

                if (ttScope.isOpen) {
                  positionTooltip();
                }
              }));
              observers.push(attrs.$observe(prefix + 'Placement', function (val) {
                ttScope.placement = val ? val : options.placement;

                if (ttScope.isOpen) {
                  positionTooltip();
                }
              }));
            }

            function unregisterObservers() {
              if (observers.length) {
                angular.forEach(observers, function (observer) {
                  observer();
                });
                observers.length = 0;
              }
            } // hide tooltips/popovers for outsideClick trigger


            function bodyHideTooltipBind(evt) {
              if (!ttScope || !ttScope.isOpen || !tooltip) {
                return;
              } // make sure the tooltip/popover link
              // or tool tooltip/popover itself were not clicked


              if (!element[0].contains(evt.target) && !tooltip[0].contains(evt.target)) {
                hideTooltipBind();
              }
            }

            var unregisterTriggers = function unregisterTriggers() {
              triggers.show.forEach(function (trigger) {
                if (trigger === 'outsideClick') {
                  element[0].removeEventListener('click', toggleTooltipBind);
                } else {
                  element[0].removeEventListener(trigger, showTooltipBind);
                  element[0].removeEventListener(trigger, toggleTooltipBind);
                }
              });
              triggers.hide.forEach(function (trigger) {
                trigger.split(' ').forEach(function (hideTrigger) {
                  if (trigger === 'outsideClick') {
                    $document[0].removeEventListener('click', bodyHideTooltipBind);
                  } else {
                    element[0].removeEventListener(hideTrigger, hideTooltipBind);
                  }
                });
              });
            };

            function unregisterTooltipTriggers() {
              triggers.show.forEach(function (trigger) {
                if (trigger === 'outsideClick') {
                  tooltip[0].removeEventListener('click', toggleTooltipBind);
                } else {
                  tooltip[0].removeEventListener(trigger, showTooltipBind);
                  tooltip[0].removeEventListener(trigger, toggleTooltipBind);
                }
              });
              triggers.hide.forEach(function (trigger) {
                trigger.split(' ').forEach(function (hideTrigger) {
                  if (trigger === 'outsideClick') {
                    $document[0].removeEventListener('click', bodyHideTooltipBind);
                  } else {
                    tooltip[0].removeEventListener(hideTrigger, hideTooltipBind);
                  }
                });
              });
            }

            function prepTriggers() {
              var val = attrs[prefix + 'Trigger'];
              unregisterTriggers();
              triggers = getTriggers(val);

              if (triggers.show !== 'none') {
                triggers.show.forEach(function (trigger, idx) {
                  // Using raw addEventListener due to jqLite/jQuery bug - #4060
                  if (trigger === 'outsideClick') {
                    element[0].addEventListener('click', toggleTooltipBind);
                    $document[0].addEventListener('click', bodyHideTooltipBind);
                  } else if (trigger === triggers.hide[idx]) {
                    element[0].addEventListener(trigger, toggleTooltipBind);
                  } else if (trigger) {
                    element[0].addEventListener(trigger, showTooltipBind);
                    triggers.hide[idx].split(' ').forEach(function (trigger) {
                      element[0].addEventListener(trigger, hideTooltipBind);
                    });
                  }

                  element.on('keypress', function (evt) {
                    if (evt.which === 27) {
                      hideTooltipBind();
                    }
                  });
                });
              }
            }

            prepTriggers();
            var animation = scope.$eval(attrs[prefix + 'Animation']);
            ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation;
            var appendToBodyVal;
            var appendKey = prefix + 'AppendToBody';

            if (appendKey in attrs && angular.isUndefined(attrs[appendKey])) {
              appendToBodyVal = true;
            } else {
              appendToBodyVal = scope.$eval(attrs[appendKey]);
            }

            appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody; // if a tooltip is attached to <body> we need to remove it on
            // location change as its parent scope will probably not be destroyed
            // by the change.

            if (appendToBody) {
              scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {
                if (ttScope.isOpen) {
                  hide();
                }
              });
            } // Make sure tooltip is destroyed and removed.


            scope.$on('$destroy', function onDestroyTooltip() {
              unregisterTriggers();
              removeTooltip();
              openedTooltips.remove(ttScope);
              ttScope = null;
            });
          };
        }
      };
    };
  }];
}) // This is mostly ngInclude code but with a custom scope
.directive('uixTooltipTemplateTransclude', ['$animate', '$sce', '$compile', '$templateCache', '$http', function ($animate, $sce, $compile, $templateCache, $http) {
  return {
    link: function link(scope, elem, attrs) {
      var origScope = scope.$eval(attrs.tooltipTemplateTranscludeScope);
      var changeCounter = 0,
          currentScope,
          previousElement,
          currentElement;

      function cleanupLastIncludeContent() {
        if (previousElement) {
          previousElement.remove();
          previousElement = null;
        }

        if (currentScope) {
          currentScope.$destroy();
          currentScope = null;
        }

        if (currentElement) {
          $animate.leave(currentElement, function () {
            previousElement = null;
          });
          previousElement = currentElement;
          currentElement = null;
        }
      }

      var thisChangeId = changeCounter;

      function compileTemplate(template, src) {
        if (thisChangeId !== changeCounter) {
          return;
        }

        var newScope = origScope.$new();
        var clone = $compile(template)(newScope, function (clone) {
          cleanupLastIncludeContent();
          $animate.enter(clone, elem);
        });
        currentScope = newScope;
        currentElement = clone;
        currentScope.$emit('$includeContentLoaded', src);
        scope.$emit('$includeContentRequested', src);
      }

      scope.$watch($sce.parseAsResourceUrl(attrs.uixTooltipTemplateTransclude), function (src) {
        thisChangeId = ++changeCounter;

        if (src) {
          // ng1.2没有templateRequestProvider,用$templateCache+$http代替
          // 先判断$templateCache中有没有,因为templateCache可以拿到ng-template脚本中的代码片段
          // 如果没有的话,则使用$http获取,并把获取到的内容存放到templateCache中
          var template = $templateCache.get(src);

          if (angular.isDefined(template)) {
            compileTemplate(template, src);
          } else {
            $http.get(src).then(function (response) {
              template = response.data;
              $templateCache.put(src, template);
              compileTemplate(template, src);
            }, function () {
              if (thisChangeId === changeCounter) {
                cleanupLastIncludeContent();
                scope.$emit('$includeContentError', src);
              }
            });
          }
        } else {
          cleanupLastIncludeContent();
        }
      });
      scope.$on('$destroy', cleanupLastIncludeContent);
    }
  };
}])
/**
 * Note that it's intentional that these classes are *not* applied through $animate.
 * They must not be animated as they're expected to be present on the tooltip on
 * initialization.
 */
.directive('uixTooltipClasses', ['$uixPosition', function ($uixPosition) {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      // need to set the primary position so the
      // arrow has space during position measure.
      // tooltip.positionTooltip()
      if (scope.placement) {
        // // There are no top-left etc... classes
        // // in TWBS, so we need the primary position.
        var position = $uixPosition.parsePlacement(scope.placement);
        element.addClass(position[0]);
      } else {
        element.addClass('top');
      }

      if (scope.popupClass) {
        element.addClass(scope.popupClass);
      }

      if (scope.animation()) {
        element.addClass(attrs.tooltipAnimationClass);
      }
    }
  };
}]).directive('uixTooltipPopup', function () {
  return {
    replace: true,
    scope: {
      content: '@',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'templates/tooltip-popup.html'
  };
}).directive('uixTooltip', ['$uixTooltip', function ($uixTooltip) {
  return $uixTooltip('uixTooltip', 'tooltip', 'mouseenter');
}]).directive('uixTooltipHtmlPopup', function () {
  return {
    replace: true,
    scope: {
      contentExp: '&',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'templates/tooltip-html-popup.html'
  };
}).directive('uixTooltipHtml', ['$uixTooltip', function ($uixTooltip) {
  return $uixTooltip('uixTooltipHtml', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}]).directive('uixTooltipTemplatePopup', function () {
  return {
    replace: true,
    scope: {
      contentExp: '&',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&',
      originScope: '&'
    },
    templateUrl: 'templates/tooltip-template-popup.html'
  };
}).directive('uixTooltipTemplate', ['$uixTooltip', function ($uixTooltip) {
  return $uixTooltip('uixTooltipTemplate', 'tooltip', 'mouseenter', {
    useContentExp: true
  });
}]);
"use strict";

/**
 * popover
 * 提示指令
 * Author:heqingyang@meituan.com
 * Update:yjy972080142@gmail.com
 * Date:2016-02-18
 */
angular.module('ui.xg.popover', ['ui.xg.tooltip']).directive('uixPopoverTemplatePopup', function () {
  return {
    replace: true,
    scope: {
      title: '@',
      contentExp: '&',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&',
      originScope: '&'
    },
    templateUrl: 'templates/popover-template-popup.html'
  };
}).directive('uixPopoverTemplate', ['$uixTooltip', function ($uixTooltip) {
  return $uixTooltip('uixPopoverTemplate', 'popover', 'click', {
    useContentExp: true
  });
}]).directive('uixPopoverHtmlPopup', function () {
  return {
    replace: true,
    scope: {
      contentExp: '&',
      title: '@',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'templates/popover-html-popup.html'
  };
}).directive('uixPopoverHtml', ['$uixTooltip', function ($uixTooltip) {
  return $uixTooltip('uixPopoverHtml', 'popover', 'click', {
    useContentExp: true
  });
}]).directive('uixPopoverPopup', function () {
  return {
    replace: true,
    scope: {
      title: '@',
      content: '@',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&'
    },
    templateUrl: 'templates/popover-popup.html'
  };
}).directive('uixPopover', ['$uixTooltip', function ($uixTooltip) {
  return $uixTooltip('uixPopover', 'popover', 'click');
}]);
"use strict";

/**
 * dropdown
 * 多列下拉按钮组指令
 * Author:yangjiyuan@meituan.com
 * Date:2015-12-28
 */
angular.module('ui.xg.dropdown', []).constant('uixDropdownConfig', {
  openClass: 'open',
  eachItemWidth: 120,
  multiColClass: 'dropdown-multi'
}).provider('uixDropdown', function () {
  var _colsNum = 3;

  this.setColsNum = function (num) {
    _colsNum = angular.isNumber(num) ? num : 3;
  };

  this.$get = function () {
    return {
      getColsNum: function getColsNum() {
        return _colsNum;
      }
    };
  };
}).service('uixDropdownService', ['$document', function ($document) {
  var openScope = null;

  this.open = function (dropdownScope) {
    if (!openScope) {
      $document.on('click', closeDropdown);
      $document.on('keydown', escapeKeyBind);
    }

    if (openScope && openScope !== dropdownScope) {
      openScope.isOpen = false;
    }

    openScope = dropdownScope;
    openScope.$on('$destroy', function () {
      $document.off('click', closeDropdown);
      $document.off('keydown', escapeKeyBind);
    });
  };

  this.close = function (dropdownScope) {
    if (openScope === dropdownScope) {
      openScope = null;
      $document.off('click', closeDropdown);
      $document.off('keydown', escapeKeyBind);
    }
  };

  function closeDropdown(evt) {
    // This method may still be called during the same mouse event that
    // unbound this event handler. So check openScope before proceeding.
    if (!openScope) {
      return;
    }

    var toggleElement = openScope.getToggleElement();

    if (evt && toggleElement && toggleElement[0] && toggleElement[0].contains(evt.target)) {
      return;
    }

    openScope.$apply(function () {
      openScope.isOpen = false;
    });
  }

  function escapeKeyBind(evt) {
    if (evt.which === 27) {
      openScope.focusToggleElement();
      closeDropdown();
    }
  }
}]).controller('DropdownController', ['$scope', '$attrs', '$parse', 'uixDropdown', 'uixDropdownConfig', 'uixDropdownService', '$animate', function ($scope, $attrs, $parse, uixDropdown, uixDropdownConfig, uixDropdownService, $animate) {
  var self = this,
      scope = $scope.$new(),
      // create a child scope so we are not polluting original one
  openClass = uixDropdownConfig.openClass,
      getIsOpen,
      setIsOpen = angular.noop,
      toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

  this.init = function (element) {
    self.$element = element;
    self.colsNum = angular.isDefined($attrs.colsNum) ? angular.copy($scope.$parent.$eval($attrs.colsNum)) : uixDropdown.getColsNum();

    if ($attrs.isOpen) {
      getIsOpen = $parse($attrs.isOpen);
      setIsOpen = getIsOpen.assign;
      $scope.$watch(getIsOpen, function (value) {
        scope.isOpen = !!value;
      });
    }
  };

  this.toggle = function (open) {
    scope.isOpen = arguments.length ? !!open : !scope.isOpen;
    return scope.isOpen;
  }; // Allow other directives to watch status


  this.isOpen = function () {
    return scope.isOpen;
  };

  scope.getToggleElement = function () {
    return self.toggleElement;
  };

  scope.focusToggleElement = function () {
    if (self.toggleElement) {
      self.toggleElement[0].focus();
    }
  };

  scope.$watch('isOpen', function (isOpen, wasOpen) {
    if (isOpen) {
      setMultiCols();
    }

    $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

    if (isOpen) {
      scope.focusToggleElement();
      uixDropdownService.open(scope);
    } else {
      uixDropdownService.close(scope);
    }

    setIsOpen($scope, isOpen);

    if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
      toggleInvoker($scope, {
        open: !!isOpen
      });
    }
  }); // set multi column

  function setMultiCols() {
    var eachItemWidth = uixDropdownConfig.eachItemWidth;
    var colsNum = self.colsNum;
    var dropdownMenu = angular.element(self.$element[0].querySelector('.dropdown-menu'));
    var dropdownList = angular.element(self.$element[0].querySelectorAll('.dropdown-menu > li:not(.divider)'));

    if (dropdownList.length <= colsNum || colsNum === 1) {
      return;
    }

    self.$element.addClass(uixDropdownConfig.multiColClass);
    dropdownMenu.css('width', eachItemWidth * colsNum + 'px');
    dropdownList.css('width', 100 / colsNum + '%');
  }

  $scope.$on('$locationChangeSuccess', function () {
    scope.isOpen = false;
  });
  $scope.$on('$destroy', function () {
    scope.$destroy();
  });
}]).directive('uixDropdown', function () {
  return {
    controller: 'DropdownController',
    link: function link(scope, element, attrs, dropdownCtrl) {
      dropdownCtrl.init(element);
    }
  };
}).directive('uixDropdownToggle', function () {
  return {
    require: '?^uixDropdown',
    link: function link(scope, element, attrs, dropdownCtrl) {
      if (!dropdownCtrl) {
        return;
      }

      dropdownCtrl.toggleElement = element;

      function toggleDropdown(event) {
        event.preventDefault();

        if (!element.hasClass('disabled') && !attrs.disabled) {
          scope.$apply(function () {
            dropdownCtrl.toggle();
          });
        }
      }

      element.bind('click', toggleDropdown); // WAI-ARIA

      element.attr({
        'aria-haspopup': true,
        'aria-expanded': false
      });
      scope.$watch(dropdownCtrl.isOpen, function (isOpen) {
        element.attr('aria-expanded', !!isOpen);
      });
      scope.$on('$destroy', function () {
        element.unbind('click', toggleDropdown);
      });
    }
  };
});
"use strict";

/**
 * cityselect
 * cityselect directive
 * Author: your_email@gmail.com
 * Date:2016-08-02
 */
var cityselectModule = angular.module('ui.xg.cityselect', ['ui.xg.popover', 'ui.xg.dropdown']);
/**
 * 组件默认值
 * @param {string} placement [城市选择浮层出现位置]
 * @param {string} class [css修改]
 * @param {initPage} number [tab页的初始状态]
 * @param {isShowHot} bool [是否现实热门城市]
 * @param {isShowSelected} bool [是否显示已选城市]
 * @param {supportChoseAll} bool [是否支持全选]
 * @param {supportChoseReverse} bool [是否支持反选]
 * @param {supportSearch} bool [是否支持搜索]
 * @param {animation} bool [城市选择浮层出现动画]
 * @param {requestGetData} bool [是否通过后台请求获得数据]
 * @param {requestUrl} string [后台请求路径]
 * @param {requestData} string [后台请求参数]
 * @param {chosedCityDisable} bool [是否支持初始选择值不被修改]
 * @param {[supportGroup} bool [是否支持城市分组，此值不同则传进来的allCity的数据结构不同]
 *
 * 除上面外允许传入的参数
 * @param {hotCity} [{cityId: xx, cityName: xx}}] [当isShowHot为true时需传入此参数]
 * @param {chosedCity} [{cityId: xx, cityName: xx}}] [初始选中的城市]
 * @param {allCity} [{cityId: xx, cityName: xx}}] [所有的城市，当supportGroup为false时]
 *                  {'AA': [{name: xx, data: [{cityId: xx, cityName: xx}}]}]} [所有的城市，当supportGroup为true时]
 * @type {String}
 */

cityselectModule.constant('uixCityselectConfig', {
  placement: 'bottom',
  "class": '',
  initPage: 0,
  isShowHot: true,
  isShowSelected: false,
  supportChoseAll: true,
  supportChoseReverse: true,
  supportChoseClear: true,
  supportSearch: true,
  animation: true,
  requestGetData: false,
  requestUrl: '',
  requestData: '',
  chosedCityDisable: false,
  supportGroup: true
});
cityselectModule.controller('uixCityselectCtrl', uixCityselectCtrl);
uixCityselectCtrl.$inject = ['$scope', '$http', 'uixCityselectConfig'];
/**
 * 组件本身
 * @param  {[type]} $parse        [description]
 * @param  {[type]} transclude:   true                [description]
 * @param  {[type]} controller:   'uixCityselectCtrl' [description]
 * @param  {[type]} controllerAs: 'vm'                [description]
 * @param  {[type]} link:         function            (scope,       el, attrs, ctrls, transclude) {                                 var   controller [description]
 * @param  {[type]} true          [description]
 * @return {[type]}               [description]
 */

cityselectModule.directive('uixCityselect', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    require: ['uixCityselect', 'ngModel'],
    scope: {},
    transclude: true,
    controller: 'uixCityselectCtrl',
    controllerAs: 'vm',
    link: function link(scope, el, attrs, ctrls, transclude) {
      var controller = ctrls[0];
      var ngModelController = ctrls[1];
      var initialValue;
      controller.setNgModelController(ngModelController);

      ngModelController.$render = function () {
        initialValue = ngModelController.$modelValue;

        if (initialValue) {
          controller.dom = angular.element(el[0].outerHTML);
          var temp = controller.valueInit(initialValue);
          transclude(scope, function (clone) {
            temp.append(clone);
          });
          el.replaceWith($compile(temp)(scope));
        }
      };

      scope.$watch('vm.cityInfo.allCity', function () {
        if (scope.vm.initFlag) {
          controller.init();
        }
      }, true);
      scope.$watch('vm.cityInfo.initPage', function () {
        if (scope.vm.initFlag) {
          controller.init();
        }
      }, true);
      scope.$watch('vm.cityInfo.initChosedCity', function () {
        if (scope.vm.initFlag) {
          controller.init();
        }
      }, true);
    }
  };
}]);
/**
 * 组件controller
 * @param  {[type]} $scope              [description]
 * @param  {[type]} uixCityselectConfig [description]
 * @return {[type]}                     [description]
 */

function uixCityselectCtrl($scope, $http, uixCityselectConfig) {
  var vm = this;
  vm.$http = $http;
  vm.$scope = $scope;
  vm.uixCityselectConfig = uixCityselectConfig;
  vm.ngModelController = null;
}
/**
 * dom值初始化
 * @param  {[type]} initialValue [description]
 * @return {[type]}              [description]
 */


uixCityselectCtrl.prototype.valueInit = function (initialValue) {
  var vm = this;
  vm.initFlag = false;
  vm.cityInfo = angular.extend({}, vm.uixCityselectConfig, initialValue);

  if (!vm.cityInfo.chosedCity) {
    vm.cityInfo.chosedCity = [];
  }

  vm.ngModelController.$setViewValue(vm.cityInfo);
  vm.dom.removeAttr('uix-cityselect');
  vm.dom.attr({
    'uix-popover-template': '"templates/citypanel.html"',
    'popover-placement': vm.cityInfo.placement,
    'popover-class': 'uix-cityselect-popoverwidth' + vm.cityInfo["class"],
    'popover-trigger': 'click',
    'popover-animation': vm.cityInfo.animation,
    'ng-click': 'vm.exportCallback()'
  });
  return vm.dom;
};
/**
 * 暴露的方法
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.exportCallback = function () {
  var vm = this;

  if (!vm.initFlag) {
    vm.init();
    return;
  }

  vm.initFlag = !vm.initFlag;

  if (angular.isFunction(vm.cityInfo.callBack)) {
    vm.cityInfo.callBack(vm.cityInfo.chosedCity);
  } else {
    vm.cityInfo.initChosedCity = angular.copy(vm.cityInfo.chosedCity);
    vm.init();
  }
};
/**
 * 如果启用内部url获取数据
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.getUrlData = function () {
  var vm = this;
  return vm.$http({
    method: 'GET',
    url: vm.cityInfo.requestUrl,
    params: vm.cityInfo.requestData
  });
};
/**
 * cityPanel值初始化
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.init = function () {
  var vm = this;
  vm.cityInfo.chosedCity = angular.copy(vm.cityInfo.initChosedCity) || [];
  vm.initSee = vm.cityInfo.isShowSelected;

  if (vm.cityInfo.requestGetData) {
    vm.cityInfo.allCity = vm.getUrlData();
  }

  for (var i = 0; i < vm.cityInfo.chosedCity.length; i++) {
    vm.cityInfo.chosedCity[i].initChose = vm.cityInfo.chosedCityDisable;
  }

  vm.initChosedCity = angular.copy(vm.cityInfo.chosedCity);
  vm.checkAllCityType();
  vm.searchList = angular.copy(vm.cityMap);
  vm.initFlag = true;
};
/**
 * 初始化判断支不支持城市分组
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.checkAllCityType = function () {
  var vm = this;
  var allCity = vm.cityInfo.allCity;
  vm.cityMap = [];
  vm.tabName = [];

  if (vm.cityInfo.supportGroup) {
    // for (var category in allCity) {
    //     for (var city of allCity[category]){
    //       for (var cityInfo of city.data) {
    //         vm.cityMap.push(cityInfo);
    //       }
    //     }
    // };
    for (var category in allCity) {
      for (var i = 0; i < allCity[category].length; i++) {
        for (var j = 0; j < allCity[category][i].data.length; j++) {
          vm.cityMap.push(allCity[category][i].data[j]);
        }
      }
    }

    vm.tabName = Object.keys(vm.cityInfo.allCity);

    if (vm.tabName.length <= vm.cityInfo.initPage) {
      vm.cityInfo.initPage = 0;
    }

    vm.cityInfo.innerTab = vm.cityInfo.initPage;
  } else {
    vm.cityMap = allCity;
  }
};
/**
 * 看已选城市
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.showSelected = function () {
  var vm = this;
  vm.initSee = true;
  vm.cityInfo.isShowSelected = !vm.cityInfo.isShowSelected;

  if (!vm.cityInfo.isShowSelected) {
    vm.searchedCity = '';
  }

  vm.ngModelController.$setViewValue(vm.cityInfo);
};
/**
 * 设定ngModel的controller
 * @param {[type]} newNgmodelController [description]
 */


uixCityselectCtrl.prototype.setNgModelController = function (newNgmodelController) {
  var vm = this;
  vm.ngModelController = newNgmodelController;
};
/**
 * 看是非已选
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */


uixCityselectCtrl.prototype.checkChosed = function (city) {
  var vm = this;
  var chosedCity = vm.cityInfo.chosedCity;
  var chosedCityId = [];
  chosedCity.map(function (item) {
    chosedCityId.push(item.cityId);
  });
  return chosedCityId.indexOf(city.cityId) > -1;
};
/**
 * 选择城市
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */


uixCityselectCtrl.prototype.toggleChose = function (city) {
  var vm = this; // for (var [index, item] of vm.cityInfo.chosedCity.entries()) {
  //     if (city.cityId === item.cityId) {
  //         if (vm.cityInfo.chosedCityDisable) {
  //             if (item.initChose) {
  //                 return;
  //             }
  //         }
  //         vm.cityInfo.chosedCity.splice(index, 1);
  //         return;
  //     }
  // }

  for (var i = 0; i < vm.cityInfo.chosedCity.length; i++) {
    if (city.cityId === vm.cityInfo.chosedCity[i].cityId) {
      if (vm.cityInfo.chosedCityDisable) {
        if (vm.cityInfo.chosedCity[i].initChose) {
          return;
        }
      }

      vm.cityInfo.chosedCity.splice(i, 1);
      return;
    }
  }

  vm.cityInfo.chosedCity.push(city);
  vm.ngModelController.$setViewValue(vm.cityInfo);
};
/**
 * 全选功能
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.choseAll = function () {
  var vm = this;

  if (vm.cityInfo.chosedCityDisable) {
    var temp = [];
    var cityMap = angular.copy(vm.cityMap);

    for (var i = 0; i < cityMap.length; i++) {
      for (var j = 0; j < vm.initChosedCity.length; j++) {
        if (cityMap[i].cityId === vm.initChosedCity[j].cityId) {
          temp.push(i);
        }
      }
    }

    temp.sort(vm.sortNumber).reverse();

    for (var x = 0; x < temp.length; x++) {
      cityMap.splice(temp[x], 1);
    }

    cityMap = vm.initChosedCity.concat(cityMap);
    vm.cityInfo.chosedCity = cityMap;
  } else {
    vm.cityInfo.chosedCity = angular.copy(vm.cityMap);
  }

  vm.ngModelController.$setViewValue(vm.cityInfo);
};
/**
 * 清空功能
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.resetAll = function () {
  var vm = this;

  if (vm.cityInfo.chosedCityDisable) {
    vm.cityInfo.chosedCity = angular.copy(vm.initChosedCity);
  } else {
    vm.cityInfo.chosedCity = [];
  }

  vm.ngModelController.$setViewValue(vm.cityInfo);
};
/**
 * 排序
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */


uixCityselectCtrl.prototype.sortNumber = function (aa, bb) {
  return aa - bb;
};
/**
 * 反选操作
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.reverseAll = function () {
  var vm = this;
  var deleteIndex = []; // for (var [index, item] of vm.cityMap.entries()) {
  //     for (var [index1, item1] of vm.cityInfo.chosedCity.entries()) {
  //         if (item.cityId === item1.cityId) {
  //             deleteIndex.push(index);
  //             break;
  //         }
  //     }
  // }

  for (var i = 0; i < vm.cityMap.length; i++) {
    for (var j = 0; j < vm.cityInfo.chosedCity.length; j++) {
      if (vm.cityMap[i].cityId === vm.cityInfo.chosedCity[j].cityId) {
        deleteIndex.push(i);
        break;
      }
    }
  }

  deleteIndex.sort(vm.sortNumber).reverse();
  var newChosedCity = angular.copy(vm.cityMap); // for (var delectCity of deleteIndex) {
  //     newChosedCity.splice(delectCity, 1);
  // }

  for (var x = 0; x < deleteIndex.length; x++) {
    newChosedCity.splice(deleteIndex[x], 1);
  }

  if (vm.cityInfo.chosedCityDisable) {
    newChosedCity = vm.initChosedCity.concat(newChosedCity);
  }

  vm.cityInfo.chosedCity = newChosedCity;
  vm.ngModelController.$setViewValue(vm.cityInfo);
};
/**
 * tab页切换
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */


uixCityselectCtrl.prototype.changeTab = function (index) {
  var vm = this;
  vm.cityInfo.innerTab = index; // if (vm.cityInfo.isShowSelected) {
  //     vm.cityInfo.isShowSelected = !vm.cityInfo.isShowSelected;
  // }

  vm.ngModelController.$setViewValue(vm.cityInfo);
};
/**
 * 看初始值的hotCity和chosedCity是否属于allCity
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */


uixCityselectCtrl.prototype.checkCityBelong = function (city) {
  var vm = this;

  for (var i = 0; i < vm.cityMap.length; i++) {
    if (vm.cityMap[i].cityId === city.cityId) {
      return true;
    }
  }

  for (var j = 0; j < vm.cityInfo.chosedCity.length; j++) {
    if (vm.cityInfo.chosedCity[j].cityId === city.cityId) {
      vm.cityInfo.chosedCity.splice(j, 1);
      vm.ngModelController.$setViewValue(vm.cityInfo);
      break;
    }
  }

  return false;
};
/**
 * 城市搜索的搜索功能
 * @return {[type]} [description]
 */


uixCityselectCtrl.prototype.changeSearchCity = function () {
  var vm = this;
  var tempCity = vm.searchedCity;
  var newSearchList = [];

  for (var i = 0; i < vm.cityMap.length; i++) {
    var tempSearchWords = vm.cityMap[i].cityName;

    if (tempSearchWords.indexOf(tempCity) > -1) {
      newSearchList.push(vm.cityMap[i]);
    }
  }

  vm.searchList = newSearchList;
};
/**
 * 城市搜索功能的列表重置
 * @param {[type]} open [description]
 */


uixCityselectCtrl.prototype.setCityList = function (open) {
  var vm = this;

  if (open && !vm.searchedCity) {
    vm.searchList = angular.copy(vm.cityMap);
    return;
  }

  if (open && vm.searchedCity) {
    this.changeSearchCity();
  }
};
/**
 * 城市搜索列表点击具体搜索结果
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */


uixCityselectCtrl.prototype.searchCityChose = function (city) {
  var vm = this;
  vm.searchedCity = city.cityName;

  if (!vm.checkChosed(city)) {
    vm.cityInfo.chosedCity.push(city);
    vm.ngModelController.$setViewValue(vm.cityInfo);
  }
};
"use strict";

/* eslint-disable wrap-iife */

/* eslint-disable angular/di-unused */

/**
 * 数据表格 - datatable
 * 数据表格指令
 * 主要用于展示大量结构化数据。
 * 支持排序、固定列、固定表头、分页、自定义操作、单选多选等复杂功能。
 *
 * Author: yjy972080142@gmail.com
 * Date:2019-08-13
 */
(function () {
  (function (global, factory) {
    global.ResizeObserver = factory();
  })(window, function () {
    'use strict';
    /**
     * A collection of shims that provide minimal functionality of the ES6 collections.
     *
     * These implementations are not meant to be used outside of the ResizeObserver
     * modules as they cover only a limited range of use cases.
     */

    /* eslint-disable require-jsdoc, valid-jsdoc */

    var MapShim = function () {
      if (typeof Map !== 'undefined') {
        return Map;
      }
      /**
       * Returns index in provided array that matches the specified key.
       *
       * @param {Array<Array>} arr
       * @param {*} key
       * @returns {number}
       */


      function getIndex(arr, key) {
        var result = -1;
        arr.some(function (entry, index) {
          if (entry[0] === key) {
            result = index;
            return true;
          }

          return false;
        });
        return result;
      }

      return function () {
        function anonymous() {
          this.__entries__ = [];
        }

        var prototypeAccessors = {
          size: {
            configurable: true
          }
        };
        /**
         * @returns {boolean}
         */

        prototypeAccessors.size.get = function () {
          return this.__entries__.length;
        };
        /**
         * @param {*} key
         * @returns {*}
         */


        anonymous.prototype.get = function (key) {
          var index = getIndex(this.__entries__, key);
          var entry = this.__entries__[index];
          return entry && entry[1];
        };
        /**
         * @param {*} key
         * @param {*} value
         * @returns {void}
         */


        anonymous.prototype.set = function (key, value) {
          var index = getIndex(this.__entries__, key);

          if (~index) {
            this.__entries__[index][1] = value;
          } else {
            this.__entries__.push([key, value]);
          }
        };
        /**
         * @param {*} key
         * @returns {void}
         */


        anonymous.prototype["delete"] = function (key) {
          var entries = this.__entries__;
          var index = getIndex(entries, key);

          if (~index) {
            entries.splice(index, 1);
          }
        };
        /**
         * @param {*} key
         * @returns {void}
         */


        anonymous.prototype.has = function (key) {
          return !!~getIndex(this.__entries__, key);
        };
        /**
         * @returns {void}
         */


        anonymous.prototype.clear = function () {
          this.__entries__.splice(0);
        };
        /**
         * @param {Function} callback
         * @param {*} [ctx=null]
         * @returns {void}
         */


        anonymous.prototype.forEach = function (callback, ctx) {
          var this$1 = this;
          if (ctx === void 0) ctx = null;

          for (var i = 0, list = this$1.__entries__; i < list.length; i += 1) {
            var entry = list[i];
            callback.call(ctx, entry[1], entry[0]);
          }
        };

        Object.defineProperties(anonymous.prototype, prototypeAccessors);
        return anonymous;
      }();
    }();
    /**
     * Detects whether window and document objects are available in current environment.
     */


    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document; // Returns global object of a current environment.

    var global$1 = function () {
      if (typeof global !== 'undefined' && global.Math === Math) {
        return global;
      }

      if (typeof self !== 'undefined' && self.Math === Math) {
        return self;
      }

      if (typeof window !== 'undefined' && window.Math === Math) {
        return window;
      } // eslint-disable-next-line no-new-func


      return Function('return this')();
    }();
    /**
     * A shim for the requestAnimationFrame which falls back to the setTimeout if
     * first one is not supported.
     *
     * @returns {number} Requests' identifier.
     */


    var requestAnimationFrame$1 = function () {
      if (typeof requestAnimationFrame === 'function') {
        // It's required to use a bounded function because IE sometimes throws
        // an "Invalid calling object" error if rAF is invoked without the global
        // object on the left hand side.
        return requestAnimationFrame.bind(global$1);
      }

      return function (callback) {
        return setTimeout(function () {
          return callback(Date.now());
        }, 1000 / 60);
      };
    }(); // Defines minimum timeout before adding a trailing call.


    var trailingTimeout = 2;
    /**
     * Creates a wrapper function which ensures that provided callback will be
     * invoked only once during the specified delay period.
     *
     * @param {Function} callback - Function to be invoked after the delay period.
     * @param {number} delay - Delay after which to invoke callback.
     * @returns {Function}
     */

    var throttle = function throttle(callback, delay) {
      var leadingCall = false,
          trailingCall = false,
          lastCallTime = 0;
      /**
       * Invokes the original callback function and schedules new invocation if
       * the "proxy" was called during current request.
       *
       * @returns {void}
       */

      function resolvePending() {
        if (leadingCall) {
          leadingCall = false;
          callback();
        }

        if (trailingCall) {
          proxy();
        }
      }
      /**
       * Callback invoked after the specified delay. It will further postpone
       * invocation of the original function delegating it to the
       * requestAnimationFrame.
       *
       * @returns {void}
       */


      function timeoutCallback() {
        requestAnimationFrame$1(resolvePending);
      }
      /**
       * Schedules invocation of the original function.
       *
       * @returns {void}
       */


      function proxy() {
        var timeStamp = Date.now();

        if (leadingCall) {
          // Reject immediately following calls.
          if (timeStamp - lastCallTime < trailingTimeout) {
            return;
          } // Schedule new call to be in invoked when the pending one is resolved.
          // This is important for "transitions" which never actually start
          // immediately so there is a chance that we might miss one if change
          // happens amids the pending invocation.


          trailingCall = true;
        } else {
          leadingCall = true;
          trailingCall = false;
          setTimeout(timeoutCallback, delay);
        }

        lastCallTime = timeStamp;
      }

      return proxy;
    }; // Minimum delay before invoking the update of observers.


    var REFRESH_DELAY = 20; // A list of substrings of CSS properties used to find transition events that
    // might affect dimensions of observed elements.

    var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight']; // Check if MutationObserver is available.

    var mutationObserverSupported = typeof MutationObserver !== 'undefined';
    /**
     * Singleton controller class which handles updates of ResizeObserver instances.
     */

    var ResizeObserverController = function ResizeObserverController() {
      this.connected_ = false;
      this.mutationEventsAdded_ = false;
      this.mutationsObserver_ = null;
      this.observers_ = [];
      this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
      this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
    };
    /**
     * Adds observer to observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be added.
     * @returns {void}
     */

    /**
     * Holds reference to the controller's instance.
     *
     * @private {ResizeObserverController}
     */

    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */

    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */


    ResizeObserverController.prototype.addObserver = function (observer) {
      if (!~this.observers_.indexOf(observer)) {
        this.observers_.push(observer);
      } // Add listeners if they haven't been added yet.


      if (!this.connected_) {
        this.connect_();
      }
    };
    /**
     * Removes observer from observers list.
     *
     * @param {ResizeObserverSPI} observer - Observer to be removed.
     * @returns {void}
     */


    ResizeObserverController.prototype.removeObserver = function (observer) {
      var observers = this.observers_;
      var index = observers.indexOf(observer); // Remove observer if it's present in registry.

      if (~index) {
        observers.splice(index, 1);
      } // Remove listeners if controller has no connected observers.


      if (!observers.length && this.connected_) {
        this.disconnect_();
      }
    };
    /**
     * Invokes the update of observers. It will continue running updates insofar
     * it detects changes.
     *
     * @returns {void}
     */


    ResizeObserverController.prototype.refresh = function () {
      var changesDetected = this.updateObservers_(); // Continue running updates if changes have been detected as there might
      // be future ones caused by CSS transitions.

      if (changesDetected) {
        this.refresh();
      }
    };
    /**
     * Updates every observer from observers list and notifies them of queued
     * entries.
     *
     * @private
     * @returns {boolean} Returns "true" if any observer has detected changes in
     *  dimensions of it's elements.
     */


    ResizeObserverController.prototype.updateObservers_ = function () {
      // Collect observers that have active observations.
      var activeObservers = this.observers_.filter(function (observer) {
        return observer.gatherActive(), observer.hasActive();
      }); // Deliver notifications in a separate cycle in order to avoid any
      // collisions between observers, e.g. when multiple instances of
      // ResizeObserver are tracking the same element and the callback of one
      // of them changes content dimensions of the observed target. Sometimes
      // this may result in notifications being blocked for the rest of observers.

      activeObservers.forEach(function (observer) {
        return observer.broadcastActive();
      });
      return activeObservers.length > 0;
    };
    /**
     * Initializes DOM listeners.
     *
     * @private
     * @returns {void}
     */


    ResizeObserverController.prototype.connect_ = function () {
      // Do nothing if running in a non-browser environment or if listeners
      // have been already added.
      if (!isBrowser || this.connected_) {
        return;
      } // Subscription to the "Transitionend" event is used as a workaround for
      // delayed transitions. This way it's possible to capture at least the
      // final state of an element.


      document.addEventListener('transitionend', this.onTransitionEnd_);
      window.addEventListener('resize', this.refresh);

      if (mutationObserverSupported) {
        this.mutationsObserver_ = new MutationObserver(this.refresh);
        this.mutationsObserver_.observe(document, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        });
      } else {
        document.addEventListener('DOMSubtreeModified', this.refresh);
        this.mutationEventsAdded_ = true;
      }

      this.connected_ = true;
    };
    /**
     * Removes DOM listeners.
     *
     * @private
     * @returns {void}
     */


    ResizeObserverController.prototype.disconnect_ = function () {
      // Do nothing if running in a non-browser environment or if listeners
      // have been already removed.
      if (!isBrowser || !this.connected_) {
        return;
      }

      document.removeEventListener('transitionend', this.onTransitionEnd_);
      window.removeEventListener('resize', this.refresh);

      if (this.mutationsObserver_) {
        this.mutationsObserver_.disconnect();
      }

      if (this.mutationEventsAdded_) {
        document.removeEventListener('DOMSubtreeModified', this.refresh);
      }

      this.mutationsObserver_ = null;
      this.mutationEventsAdded_ = false;
      this.connected_ = false;
    };
    /**
     * "Transitionend" event handler.
     *
     * @private
     * @param {TransitionEvent} event
     * @returns {void}
     */


    ResizeObserverController.prototype.onTransitionEnd_ = function (ref) {
      var propertyName = ref.propertyName;
      if (propertyName === void 0) propertyName = ''; // Detect whether transition may affect dimensions of an element.

      var isReflowProperty = transitionKeys.some(function (key) {
        return !!~propertyName.indexOf(key);
      });

      if (isReflowProperty) {
        this.refresh();
      }
    };
    /**
     * Returns instance of the ResizeObserverController.
     *
     * @returns {ResizeObserverController}
     */


    ResizeObserverController.getInstance = function () {
      if (!this.instance_) {
        this.instance_ = new ResizeObserverController();
      }

      return this.instance_;
    };

    ResizeObserverController.instance_ = null;
    /**
     * Defines non-writable/enumerable properties of the provided target object.
     *
     * @param {Object} target - Object for which to define properties.
     * @param {Object} props - Properties to be defined.
     * @returns {Object} Target object.
     */

    var defineConfigurable = function defineConfigurable(target, props) {
      for (var i = 0, list = Object.keys(props); i < list.length; i += 1) {
        var key = list[i];
        Object.defineProperty(target, key, {
          value: props[key],
          enumerable: false,
          writable: false,
          configurable: true
        });
      }

      return target;
    };
    /**
     * Returns the global object associated with provided element.
     *
     * @param {Object} target
     * @returns {Object}
     */


    var getWindowOf = function getWindowOf(target) {
      // Assume that the element is an instance of Node, which means that it
      // has the "ownerDocument" property from which we can retrieve a
      // corresponding global object.
      var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView; // Return the local global object if it's not possible extract one from
      // provided element.

      return ownerGlobal || global$1;
    }; // Placeholder of an empty content rectangle.


    var emptyRect = createRectInit(0, 0, 0, 0);
    /**
     * Converts provided string to a number.
     *
     * @param {number|string} value
     * @returns {number}
     */

    function toFloat(value) {
      return parseFloat(value) || 0;
    }
    /**
     * Extracts borders size from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @param {...string} positions - Borders positions (top, right, ...)
     * @returns {number}
     */


    function getBordersSize(styles) {
      var positions = [],
          len = arguments.length - 1;

      while (len-- > 0) {
        positions[len] = arguments[len + 1];
      }

      return positions.reduce(function (size, position) {
        var value = styles['border-' + position + '-width'];
        return size + toFloat(value);
      }, 0);
    }
    /**
     * Extracts paddings sizes from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @returns {Object} Paddings box.
     */


    function getPaddings(styles) {
      var positions = ['top', 'right', 'bottom', 'left'];
      var paddings = {};

      for (var i = 0, list = positions; i < list.length; i += 1) {
        var position = list[i];
        var value = styles['padding-' + position];
        paddings[position] = toFloat(value);
      }

      return paddings;
    }
    /**
     * Calculates content rectangle of provided SVG element.
     *
     * @param {SVGGraphicsElement} target - Element content rectangle of which needs
     *      to be calculated.
     * @returns {DOMRectInit}
     */


    function getSVGContentRect(target) {
      var bbox = target.getBBox();
      return createRectInit(0, 0, bbox.width, bbox.height);
    }
    /**
     * Calculates content rectangle of provided HTMLElement.
     *
     * @param {HTMLElement} target - Element for which to calculate the content rectangle.
     * @returns {DOMRectInit}
     */


    function getHTMLElementContentRect(target) {
      // Client width & height properties can't be
      // used exclusively as they provide rounded values.
      var clientWidth = target.clientWidth;
      var clientHeight = target.clientHeight; // By this condition we can catch all non-replaced inline, hidden and
      // detached elements. Though elements with width & height properties less
      // than 0.5 will be discarded as well.
      //
      // Without it we would need to implement separate methods for each of
      // those cases and it's not possible to perform a precise and performance
      // effective test for hidden elements. E.g. even jQuery's ':visible' filter
      // gives wrong results for elements with width & height less than 0.5.

      if (!clientWidth && !clientHeight) {
        return emptyRect;
      }

      var styles = getWindowOf(target).getComputedStyle(target);
      var paddings = getPaddings(styles);
      var horizPad = paddings.left + paddings.right;
      var vertPad = paddings.top + paddings.bottom; // Computed styles of width & height are being used because they are the
      // only dimensions available to JS that contain non-rounded values. It could
      // be possible to utilize the getBoundingClientRect if only it's data wasn't
      // affected by CSS transformations let alone paddings, borders and scroll bars.

      var width = toFloat(styles.width),
          height = toFloat(styles.height); // Width & height include paddings and borders when the 'border-box' box
      // model is applied (except for IE).

      if (styles.boxSizing === 'border-box') {
        // Following conditions are required to handle Internet Explorer which
        // doesn't include paddings and borders to computed CSS dimensions.
        //
        // We can say that if CSS dimensions + paddings are equal to the "client"
        // properties then it's either IE, and thus we don't need to subtract
        // anything, or an element merely doesn't have paddings/borders styles.
        if (Math.round(width + horizPad) !== clientWidth) {
          width -= getBordersSize(styles, 'left', 'right') + horizPad;
        }

        if (Math.round(height + vertPad) !== clientHeight) {
          height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
        }
      } // Following steps can't be applied to the document's root element as its
      // client[Width/Height] properties represent viewport area of the window.
      // Besides, it's as well not necessary as the <html> itself neither has
      // rendered scroll bars nor it can be clipped.


      if (!isDocumentElement(target)) {
        // In some browsers (only in Firefox, actually) CSS width & height
        // include scroll bars size which can be removed at this step as scroll
        // bars are the only difference between rounded dimensions + paddings
        // and "client" properties, though that is not always true in Chrome.
        var vertScrollbar = Math.round(width + horizPad) - clientWidth;
        var horizScrollbar = Math.round(height + vertPad) - clientHeight; // Chrome has a rather weird rounding of "client" properties.
        // E.g. for an element with content width of 314.2px it sometimes gives
        // the client width of 315px and for the width of 314.7px it may give
        // 314px. And it doesn't happen all the time. So just ignore this delta
        // as a non-relevant.

        if (Math.abs(vertScrollbar) !== 1) {
          width -= vertScrollbar;
        }

        if (Math.abs(horizScrollbar) !== 1) {
          height -= horizScrollbar;
        }
      }

      return createRectInit(paddings.left, paddings.top, width, height);
    }
    /**
     * Checks whether provided element is an instance of the SVGGraphicsElement.
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */


    var isSVGGraphicsElement = function () {
      // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
      // interface.
      if (typeof SVGGraphicsElement !== 'undefined') {
        return function (target) {
          return target instanceof getWindowOf(target).SVGGraphicsElement;
        };
      } // If it's so, then check that element is at least an instance of the
      // SVGElement and that it has the "getBBox" method.
      // eslint-disable-next-line no-extra-parens


      return function (target) {
        return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function';
      };
    }();
    /**
     * Checks whether provided element is a document element (<html>).
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */


    function isDocumentElement(target) {
      return target === getWindowOf(target).document.documentElement;
    }
    /**
     * Calculates an appropriate content rectangle for provided html or svg element.
     *
     * @param {Element} target - Element content rectangle of which needs to be calculated.
     * @returns {DOMRectInit}
     */


    function getContentRect(target) {
      if (!isBrowser) {
        return emptyRect;
      }

      if (isSVGGraphicsElement(target)) {
        return getSVGContentRect(target);
      }

      return getHTMLElementContentRect(target);
    }
    /**
     * Creates rectangle with an interface of the DOMRectReadOnly.
     * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
     *
     * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
     * @returns {DOMRectReadOnly}
     */


    function createReadOnlyRect(ref) {
      var x = ref.x;
      var y = ref.y;
      var width = ref.width;
      var height = ref.height; // If DOMRectReadOnly is available use it as a prototype for the rectangle.

      var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
      var rect = Object.create(Constr.prototype); // Rectangle's properties are not writable and non-enumerable.

      defineConfigurable(rect, {
        x: x,
        y: y,
        width: width,
        height: height,
        top: y,
        right: x + width,
        bottom: height + y,
        left: x
      });
      return rect;
    }
    /**
     * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
     * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
     *
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} width - Rectangle's width.
     * @param {number} height - Rectangle's height.
     * @returns {DOMRectInit}
     */


    function createRectInit(x, y, width, height) {
      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
    /**
     * Class that is responsible for computations of the content rectangle of
     * provided DOM element and for keeping track of it's changes.
     */


    var ResizeObservation = function ResizeObservation(target) {
      this.broadcastWidth = 0;
      this.broadcastHeight = 0;
      this.contentRect_ = createRectInit(0, 0, 0, 0);
      this.target = target;
    };
    /**
     * Updates content rectangle and tells whether it's width or height properties
     * have changed since the last broadcast.
     *
     * @returns {boolean}
     */

    /**
     * Reference to the last observed content rectangle.
     *
     * @private {DOMRectInit}
     */

    /**
     * Broadcasted width of content rectangle.
     *
     * @type {number}
     */


    ResizeObservation.prototype.isActive = function () {
      var rect = getContentRect(this.target);
      this.contentRect_ = rect;
      return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
    };
    /**
     * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
     * from the corresponding properties of the last observed content rectangle.
     *
     * @returns {DOMRectInit} Last observed content rectangle.
     */


    ResizeObservation.prototype.broadcastRect = function () {
      var rect = this.contentRect_;
      this.broadcastWidth = rect.width;
      this.broadcastHeight = rect.height;
      return rect;
    };

    var ResizeObserverEntry = function ResizeObserverEntry(target, rectInit) {
      var contentRect = createReadOnlyRect(rectInit); // According to the specification following properties are not writable
      // and are also not enumerable in the native implementation.
      //
      // Property accessors are not being used as they'd require to define a
      // private WeakMap storage which may cause memory leaks in browsers that
      // don't support this type of collections.

      defineConfigurable(this, {
        target: target,
        contentRect: contentRect
      });
    };

    var ResizeObserverSPI = function ResizeObserverSPI(callback, controller, callbackCtx) {
      this.activeObservations_ = [];
      this.observations_ = new MapShim();

      if (typeof callback !== 'function') {
        throw new TypeError('The callback provided as parameter 1 is not a function.');
      }

      this.callback_ = callback;
      this.controller_ = controller;
      this.callbackCtx_ = callbackCtx;
    };
    /**
     * Starts observing provided element.
     *
     * @param {Element} target - Element to be observed.
     * @returns {void}
     */

    /**
     * Registry of the ResizeObservation instances.
     *
     * @private {Map<Element, ResizeObservation>}
     */

    /**
     * Public ResizeObserver instance which will be passed to the callback
     * function and used as a value of it's "this" binding.
     *
     * @private {ResizeObserver}
     */

    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * @private {Array<ResizeObservation>}
     */


    ResizeObserverSPI.prototype.observe = function (target) {
      if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
      } // Do nothing if current environment doesn't have the Element interface.


      if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
      }

      if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
      }

      var observations = this.observations_; // Do nothing if element is already being observed.

      if (observations.has(target)) {
        return;
      }

      observations.set(target, new ResizeObservation(target));
      this.controller_.addObserver(this); // Force the update of observations.

      this.controller_.refresh();
    };
    /**
     * Stops observing provided element.
     *
     * @param {Element} target - Element to stop observing.
     * @returns {void}
     */


    ResizeObserverSPI.prototype.unobserve = function (target) {
      if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
      } // Do nothing if current environment doesn't have the Element interface.


      if (typeof Element === 'undefined' || !(Element instanceof Object)) {
        return;
      }

      if (!(target instanceof getWindowOf(target).Element)) {
        throw new TypeError('parameter 1 is not of type "Element".');
      }

      var observations = this.observations_; // Do nothing if element is not being observed.

      if (!observations.has(target)) {
        return;
      }

      observations["delete"](target);

      if (!observations.size) {
        this.controller_.removeObserver(this);
      }
    };
    /**
     * Stops observing all elements.
     *
     * @returns {void}
     */


    ResizeObserverSPI.prototype.disconnect = function () {
      this.clearActive();
      this.observations_.clear();
      this.controller_.removeObserver(this);
    };
    /**
     * Collects observation instances the associated element of which has changed
     * it's content rectangle.
     *
     * @returns {void}
     */


    ResizeObserverSPI.prototype.gatherActive = function () {
      var this$1 = this;
      this.clearActive();
      this.observations_.forEach(function (observation) {
        if (observation.isActive()) {
          this$1.activeObservations_.push(observation);
        }
      });
    };
    /**
     * Invokes initial callback function with a list of ResizeObserverEntry
     * instances collected from active resize observations.
     *
     * @returns {void}
     */


    ResizeObserverSPI.prototype.broadcastActive = function () {
      // Do nothing if observer doesn't have active observations.
      if (!this.hasActive()) {
        return;
      }

      var ctx = this.callbackCtx_; // Create ResizeObserverEntry instance for every active observation.

      var entries = this.activeObservations_.map(function (observation) {
        return new ResizeObserverEntry(observation.target, observation.broadcastRect());
      });
      this.callback_.call(ctx, entries, ctx);
      this.clearActive();
    };
    /**
     * Clears the collection of active observations.
     *
     * @returns {void}
     */


    ResizeObserverSPI.prototype.clearActive = function () {
      this.activeObservations_.splice(0);
    };
    /**
     * Tells whether observer has active observations.
     *
     * @returns {boolean}
     */


    ResizeObserverSPI.prototype.hasActive = function () {
      return this.activeObservations_.length > 0;
    }; // Registry of internal observers. If WeakMap is not available use current shim
    // for the Map collection as it has all required methods and because WeakMap
    // can't be fully polyfilled anyway.


    var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
    /**
     * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
     * exposing only those methods and properties that are defined in the spec.
     */

    var ResizeObserver = function ResizeObserver(callback) {
      if (!(this instanceof ResizeObserver)) {
        throw new TypeError('Cannot call a class as a function.');
      }

      if (!arguments.length) {
        throw new TypeError('1 argument required, but only 0 present.');
      }

      var controller = ResizeObserverController.getInstance();
      var observer = new ResizeObserverSPI(callback, controller, this);
      observers.set(this, observer);
    }; // Expose public methods of ResizeObserver.


    ['observe', 'unobserve', 'disconnect'].forEach(function (method) {
      ResizeObserver.prototype[method] = function () {
        return (ref = observers.get(this))[method].apply(ref, arguments);
        var ref;
      };
    });

    var index = function () {
      // Export existing implementation if available.
      if (typeof global$1.ResizeObserver !== 'undefined') {
        return global$1.ResizeObserver;
      }

      global$1.ResizeObserver = ResizeObserver;
      return ResizeObserver;
    }();

    return index;
  });
})();

(function () {
  // set forTableHead to true when convertToRows, false in normal cases like table.vue
  var getDataColumns = function getDataColumns(cols) {
    var forTableHead = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var columns = cols;
    var result = [];
    columns.forEach(function (column) {
      if (column.children) {
        if (forTableHead) {
          result.push(column);
        }

        result.push.apply(result, getDataColumns(column.children, forTableHead));
      } else {
        result.push(column);
      }
    });
    return result;
  };

  var getRandomStr = function getRandomStr() {
    var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 32;
    var $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var maxPos = $chars.length;
    var str = '';

    for (var i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos));
    }

    return str;
  };

  var convertColumnOrder = function convertColumnOrder(columns, fixedType) {
    var list = [];
    columns.forEach(function (col) {
      if (fixedType) {
        if (col.fixed && col.fixed === fixedType) {
          list.push(col);
        }
      } else {
        list.push(col);
      }
    });
    return list;
  };

  function getScrollBarSize() {
    // eslint-disable-next-line angular/document-service
    var inner = document.createElement('div');
    inner.style.width = '100%';
    inner.style.height = '200px'; // eslint-disable-next-line angular/document-service

    var outer = document.createElement('div');
    var outerStyle = outer.style;
    outerStyle.position = 'absolute';
    outerStyle.top = 0;
    outerStyle.left = 0;
    outerStyle.pointerEvents = 'none';
    outerStyle.visibility = 'hidden';
    outerStyle.width = '200px';
    outerStyle.height = '150px';
    outerStyle.overflow = 'hidden';
    outer.appendChild(inner); // eslint-disable-next-line angular/document-service

    document.body.appendChild(outer);
    var widthContained = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var widthScroll = inner.offsetWidth;

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth;
    } // eslint-disable-next-line angular/document-service


    document.body.removeChild(outer);
    return widthContained - widthScroll;
  }

  angular.module('ui.xg.datatable', []).constant('uixDatatableConfig', {
    loadingText: '数据加载中',
    emptyText: '数据为空',
    errorText: '加载失败',
    emptyDataHeight: 350 // 没有数据时，提示文案占据高度

  }).provider('uixDatatable', ['uixDatatableConfig', function (uixDatatableConfig) {
    var statusText = {
      loading: uixDatatableConfig.loadingText,
      empty: uixDatatableConfig.emptyText,
      error: uixDatatableConfig.errorText
    };

    this.setStatusText = function (options) {
      statusText = angular.extend(statusText, options);
    };

    this.$get = function () {
      return {
        getStatusText: function getStatusText(type) {
          if (angular.isDefined(type)) {
            return statusText[type];
          }

          return statusText;
        }
      };
    };
  }]).controller('uixDatatableCtrl', ['$scope', '$timeout', '$element', 'uixDatatableConfig', '$templateCache', '$compile', function ($scope, $timeout, $element, uixDatatableConfig, $templateCache, $compile) {
    var $table = this;
    $table.columnsWidth = {}; // 列宽

    $table.bodyStyle = {};
    $table.currentChecked = null;
    $table.selections = {};
    $table.isSelectedAll = false;
    $table.scrollBarWidth = getScrollBarSize();
    $table.showVerticalScrollBar = false;
    $table.showHorizontalScrollBar = false;
    $table.headerHeight = 0; // initial header height

    $table.containerHeight = null;
    $table.scrollX = null; // 滚动宽度

    $table.dataObj = {};
    var compileScope = $scope.$parent.$new();
    compileScope.$table = $table;

    function findEl(selector) {
      return angular.element($element[0].querySelector(selector));
    }

    function makeDataObj() {
      var dataObj = {};
      $scope.data.forEach(function (row, index) {
        var obj = {};
        obj._index = index;
        obj._isHover = false;
        obj._isExpand = false;
        obj.disabled = !!row.disabled;

        if ($scope.rowClassName && angular.isFunction($scope.rowClassName)) {
          obj._rowClassName = $scope.rowClassName({
            $row: row,
            $rowIndex: index
          });
        }

        if (row.checked) {
          $table.currentChecked = index;
          $table.selections[index] = true;
        }

        dataObj[index] = obj;
      });
      return dataObj;
    }

    $scope.$watch('$table.currentChecked', function (newIndex, oldIndex) {
      if (newIndex !== null && $scope.onCurrentChange) {
        var newRow = $table.data[newIndex];
        var oldRow = $table.data[oldIndex];
        $scope.onCurrentChange({
          $newRow: newRow,
          $oldRow: oldRow,
          $newIndex: newIndex,
          $oldIndex: oldIndex
        });
      }
    });
    $scope.$watch('$table.selections', function (newVal, oldVal) {
      var currentSelect = [];
      var oldSelect = [];

      for (var index in newVal) {
        if (newVal[index]) {
          currentSelect.push($table.data[index]);
        }
      }

      for (var _index in oldVal) {
        if (oldVal[_index]) {
          oldSelect.push($table.data[_index]);
        }
      }

      if ($scope.onSelectionChange && $table.data && $table.data.length) {
        $table.isSelectedAll = currentSelect.length >= $table.data.length;
        $scope.onSelectionChange({
          $newRows: currentSelect,
          $oldRows: oldSelect
        });
      }
    }, true);

    $table.handleSelectAll = function () {
      $table.data.forEach(function (row, index) {
        if (row.disabled) {
          return;
        }

        $table.selections[index] = $table.isSelectedAll;
      });
    };

    $table.handleMouseIn = function (event, rowIndex) {
      event.stopPropagation();

      if ($table.disabledHover) {
        return;
      }

      if ($table.dataObj[rowIndex]._isHover) {
        return;
      }

      $table.dataObj[rowIndex]._isHover = true;
    };

    $table.handleMouseOut = function (event, rowIndex) {
      event.stopPropagation();

      if ($table.disabledHover) {
        return;
      }

      $table.dataObj[rowIndex]._isHover = false;
    };

    $table.handleClickRow = function (event, row, rowIndex) {
      event.stopPropagation();

      if ($scope.onRowClick) {
        $scope.onRowClick({
          $row: row,
          $rowIndex: rowIndex
        });
      } // 禁用通过点击行选择


      if ($table.disabledRowClickSelect) {
        return;
      }

      if (row.disabled) {
        return;
      } // 单选


      $table.currentChecked = rowIndex; // 多选

      $table.selections[rowIndex] = !$table.selections[rowIndex];
    };

    $table.handleSelect = function ($event) {
      $event.stopPropagation();
    };

    $table.handleSortByHead = function (column) {
      if (column.sortable) {
        var type = column._sortType;

        if (type === 'normal') {
          $table.handleSort(column, 'asc');
        } else if (type === 'asc') {
          $table.handleSort(column, 'desc');
        } else {
          $table.handleSort(column, 'normal');
        }
      }
    };

    $table.handleSort = function (column, type, event) {
      if (event) {
        event.stopPropagation();
      }

      if (column._sortType === type) {
        type = 'normal';
      }

      if ($table.multiSort) {
        column._sortType = type;

        if (angular.isFunction($scope.onColumnsSort)) {
          var sorts = $table.allDataColumns.filter(function (col) {
            return col.sortable;
          }).map(function (column) {
            return {
              column: column,
              key: column.key,
              order: column._sortType
            };
          });
          $scope.onColumnsSort({
            $sorts: sorts
          });
        }
      } else {
        $table.allDataColumns.forEach(function (col) {
          col._sortType = 'normal';
        });
        column._sortType = type;
        var key = column.key;

        if (angular.isFunction($scope.onSortChange)) {
          $scope.onSortChange({
            $column: column,
            $key: key,
            $order: type
          });
        }
      }
    }; // 清空排序效果


    $table.clearSort = function () {
      $table.allDataColumns.forEach(function (col) {
        col._sortType = 'normal';
      });
    }; // 展开行响应事件，对外可调用


    $table.handleRowExpand = function (rowIndex) {
      if (angular.isUndefined(rowIndex) || rowIndex < 0) {
        return;
      }

      $table.dataObj[rowIndex]._isExpand = !$table.dataObj[rowIndex]._isExpand;
      $timeout(function () {
        var currentRow = findEl('.uix-datatable-main-body table').find('.uix-datatable-expand-row').get(rowIndex);

        if (currentRow) {
          var expandHeight = currentRow.offsetHeight;

          if ($table.isLeftFixed) {
            findEl('.uix-datatable-left-body table').find('.uix-datatable-expand-row').eq(rowIndex).css({
              height: expandHeight + 'px'
            });
          }

          if ($table.isRightFixed) {
            findEl('.uix-datatable-right-body table').find('.uix-datatable-expand-row').eq(rowIndex).css({
              height: expandHeight + 'px'
            });
          }
        }
      }, 0);
    };

    $table.handlePageChange = function () {
      if ($scope.onPageChange) {
        var pageNo = parseInt($table.pagination.pageNo, 10);
        var pageSize = parseInt($table.pagination.pageSize, 10);
        $scope.onPageChange({
          $pageNo: pageNo,
          $pageSize: pageSize
        });
      }
    };

    function handleMainBodyScroll(event) {
      var scrollTop = event.target.scrollTop;
      var scrollLeft = event.target.scrollLeft;
      findEl('.uix-datatable-main-header')[0].scrollLeft = scrollLeft;

      if ($table.isLeftFixed) {
        findEl('.uix-datatable-left-body')[0].scrollTop = scrollTop;
      }

      if ($table.isRightFixed) {
        findEl('.uix-datatable-right-body')[0].scrollTop = scrollTop;
      }

      updateFixedTableShadow();
    }

    function handleMainHeaderScroll(event) {
      var scrollLeft = event.target.scrollLeft;
      findEl('.uix-datatable-main-body')[0].scrollLeft = scrollLeft;
    }

    function handleFixedBodyScroll(event) {
      var scrollTop = event.target.scrollTop;
      findEl('.uix-datatable-main-body')[0].scrollTop = scrollTop;

      if ($table.isLeftFixed) {
        findEl('.uix-datatable-left-body')[0].scrollTop = scrollTop;
      }

      if ($table.isRightFixed) {
        findEl('.uix-datatable-right-body')[0].scrollTop = scrollTop;
      }
    }

    $table.updateContainerByStatus = function () {
      // 数据为空
      if ($table.isEmpty || $table.isError || $table.isLoading) {
        $table.containerHeight = "".concat(uixDatatableConfig.emptyDataHeight, "px");
      } else {
        $table.containerHeight = null;
      }
    };

    function handleResize() {
      calcColumnsWidth();
      updateFixedTableShadow();
      $scope.$digest();
      $timeout(function () {
        $table.updateHorizontalScroll();
        $table.updateVerticalScroll();
        updateFixedRowHeight();
        updateFixedHeadHeight();
      }, 0);
    }

    function bindScrollEvents() {
      findEl('.uix-datatable-main-header').on('scroll', handleMainHeaderScroll);
      findEl('.uix-datatable-main-body').on('scroll', handleMainBodyScroll);
      findEl('.uix-datatable-left-body').on('scroll', handleFixedBodyScroll);
      findEl('.uix-datatable-right-body').on('scroll', handleFixedBodyScroll);
    }

    function unBindScrollEvents() {
      findEl('.uix-datatable-main-header').off('scroll', handleMainHeaderScroll);
      findEl('.uix-datatable-main-body').off('scroll', handleMainBodyScroll);
      findEl('.uix-datatable-left-body').on('scroll', handleFixedBodyScroll);
      findEl('.uix-datatable-right-body').on('scroll', handleFixedBodyScroll);
    }

    function bindResizeEvents() {
      angular.element(window).on('resize', handleResize); // 处理外部容器发生变化时的回调

      $table.resizeObserver = new ResizeObserver(function () {
        handleResize();
      });
      $table.resizeObserver.observe($element.get(0));
    }

    function unbindResizeEvents() {
      angular.element(window).off('resize', handleResize);
      $table.resizeObserver.disconnect();
    } // 更新阴影


    function updateFixedTableShadow() {
      var scrollLeft = findEl('.uix-datatable-main-body')[0].scrollLeft;
      var leftClass = 'uix-datatable-scroll-left';
      var rightClass = 'uix-datatable-scroll-right';

      if (scrollLeft === 0) {
        $element.addClass(leftClass);

        if ($element[0].offsetWidth >= $table.tableWidth) {
          // 无滚动条
          $element.addClass(rightClass);
        } else {
          $element.removeClass(rightClass);
        }
      } else if (scrollLeft >= $table.tableWidth - $element[0].offsetWidth) {
        $element.addClass(rightClass).removeClass(leftClass);
      } else {
        $element.removeClass(leftClass).removeClass(rightClass);
      }
    }

    function calcColumnsWidth() {
      var tableWidth = $element[0].offsetWidth - 1;

      if ($table.scrollX && tableWidth < $table.scrollX) {
        tableWidth = $table.scrollX;
      }

      var columnsWidth = {};
      var sumMinWidth = 0;
      var hasWidthColumns = [];
      var noWidthColumns = [];
      var maxWidthColumns = [];
      var noMaxWidthColumns = [];
      $table.allDataColumns.forEach(function (col) {
        if (col.width) {
          hasWidthColumns.push(col);
        } else {
          noWidthColumns.push(col);

          if (col.minWidth) {
            sumMinWidth += col.minWidth;
          }

          if (col.maxWidth) {
            maxWidthColumns.push(col);
          } else {
            noMaxWidthColumns.push(col);
          }
        }

        col._width = null;
      });
      var unUsableWidth = hasWidthColumns.map(function (cell) {
        return cell.width;
      }).reduce(function (prev, next) {
        return prev + next;
      }, 0);
      var usableWidth = tableWidth - unUsableWidth - sumMinWidth - ($table.showVerticalScrollBar ? $table.scrollBarWidth : 0) - 1;
      var usableLength = noWidthColumns.length;
      var columnWidth = 0;

      if (usableWidth > 0 && usableLength > 0) {
        columnWidth = parseInt(usableWidth / usableLength, 10);
      }

      for (var i = 0; i < $table.allDataColumns.length; i++) {
        var column = $table.allDataColumns[i];
        var width = columnWidth + (column.minWidth ? column.minWidth : 0);

        if (column.width) {
          width = column.width;
        } else {
          if (column._width) {
            width = column._width;
          } else {
            if (column.minWidth > width) {
              width = column.minWidth;
            } else if (column.maxWidth < width) {
              width = column.maxWidth;
            }

            if (usableWidth > 0) {
              usableWidth -= width - (column.minWidth ? column.minWidth : 0);
              usableLength--;

              if (usableLength > 0) {
                columnWidth = parseInt(usableWidth / usableLength, 10);
              } else {
                columnWidth = 0;
              }
            } else {
              columnWidth = 0;
            }
          }
        }

        column._width = width;
        columnsWidth[column._index] = {
          width: width
        };
      }

      if (usableWidth > 0) {
        usableLength = noMaxWidthColumns.length;
        columnWidth = parseInt(usableWidth / usableLength, 10);

        for (var _i = 0; _i < noMaxWidthColumns.length; _i++) {
          var _column = noMaxWidthColumns[_i];

          var _width = _column._width + columnWidth;

          if (usableLength > 1) {
            usableLength--;
            usableWidth -= columnWidth;
            columnWidth = parseInt(usableWidth / usableLength, 10);
          } else {
            columnWidth = 0;
          }

          _column._width = _width;
          columnsWidth[_column._index] = {
            width: _width
          };
        }
      }

      $table.tableWidth = $table.allDataColumns.map(function (cell) {
        return cell._width;
      }).reduce(function (item, prev) {
        return item + prev;
      }, 0) + 1;
      $table.columnsWidth = columnsWidth;
    }

    function prepareColumns(columns) {
      return columns.filter(function (column) {
        return !column.hidden;
      }).map(function (column) {
        if ('children' in column) {
          prepareColumns(column.children);
        }

        column.__id = getRandomStr(6);
        column.width = parseFloat(column.width, 10);
        column._width = column.width ? column.width : '';
        column._sortType = 'normal';

        if ('sortType' in column) {
          column._sortType = column.sortType;
        }

        if (angular.isDefined(column.headerTemplate) || angular.isDefined(column.headerTemplateUrl)) {
          column.__renderHeadType = 'template';
          column.__headTemplate = column.headerTemplate || $templateCache.get(column.headerTemplateUrl) || '';
        } else if (angular.isFunction(column.headerFormat)) {
          column.__renderHeadType = 'format';
        } else if (column.type === 'expand') {
          column.__renderHeadType = 'expand';
        } else if (column.type === 'selection') {
          column.__renderHeadType = 'selection';
        } else {
          column.__renderHeadType = 'normal';
        }

        return column;
      });
    }

    function makeColumnRows(colsWithId) {
      var originColumns = colsWithId;
      var maxLevel = 1;

      var traverse = function traverse(column, parent) {
        if (parent) {
          column.level = parent.level + 1;

          if (maxLevel < column.level) {
            maxLevel = column.level;
          }
        }

        if (column.children) {
          var colSpan = 0;
          column.children.forEach(function (subColumn) {
            traverse(subColumn, column);
            colSpan += subColumn.colSpan;
          });
          column.colSpan = colSpan;
        } else {
          column.colSpan = 1;
        }
      };

      originColumns.forEach(function (column) {
        column.level = 1;
        traverse(column);
      });
      var rows = [];

      for (var i = 0; i < maxLevel; i++) {
        rows.push([]);
      }

      var allColumns = getDataColumns(originColumns, true);
      allColumns.forEach(function (column) {
        if (!column.children) {
          column.rowSpan = maxLevel - column.level + 1;
        } else {
          column.rowSpan = 1;
        }

        rows[column.level - 1].push(column);
      });
      var left = [];
      var right = []; // 从所有的表头行中找到固定表头
      // 需要要求固定列的表头不管是否有多级，必须设置fixed

      var _loop = function _loop(rowIndex) {
        if (rows[rowIndex].length) {
          rows[rowIndex].forEach(function (item) {
            if (item.fixed) {
              if (item.fixed === 'left') {
                left[rowIndex] = left[rowIndex] || [];
                left[rowIndex].push(item);
              }

              if (item.fixed === 'right') {
                right[rowIndex] = right[rowIndex] || [];
                right[rowIndex].push(item);
              }
            }
          });
        }
      };

      for (var rowIndex in rows) {
        _loop(rowIndex);
      }

      return {
        left: left,
        center: rows,
        right: right
      };
    }

    $table.updateVerticalScroll = function () {
      var mainTableHeight = $element.find('.uix-datatable-main-body > table').get(0).offsetHeight;

      if ($table.height) {
        $table.showVerticalScrollBar = mainTableHeight > $table.height;
      } else if ($table.maxHeight) {
        $table.showVerticalScrollBar = mainTableHeight > $table.maxHeight;
      }
    };

    $table.updateHorizontalScroll = function () {
      var mainTableWidth = $element.find('.uix-datatable-main-body').get(0).offsetWidth;
      $table.showHorizontalScrollBar = $table.tableWidth > mainTableWidth;
    }; // 获取固定列的宽度


    function getFixedColumnsWidth(fixedType) {
      var width = 0;
      ($table.allDataColumns || []).forEach(function (col) {
        if (col.fixed && col.fixed === fixedType) {
          width += col._width;
        }
      });
      return width;
    }

    $table.alignCls = function (column) {
      var row = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cellClassName = '';

      if (row.cellClassName && column.key && row.cellClassName[column.key]) {
        cellClassName = row.cellClassName[column.key];
      }

      return [cellClassName, column.className, column.align ? "uix-datatable-align-".concat(column.align) : ''];
    };

    function hasFixedColumns(fixedType) {
      return $table.allDataColumns.some(function (col) {
        return col.fixed && col.fixed === fixedType;
      });
    }

    function getHeadTpls() {
      var tpls = '';
      $table.allColumnRows.forEach(function (rows) {
        rows.forEach(function (column, colIndex) {
          if (column.__renderHeadType === 'template') {
            tpls += "\n                                    <div ng-if=\"colIndex===".concat(colIndex, "\">\n                                        ").concat(column.__headTemplate, "\n                                    </div>\n                                ");
          }
        });
      });
      return tpls;
    }

    function getBodyRowsTemplate(position) {
      var columnsKey = '';

      if (position === 'left') {
        columnsKey = 'leftColumns';
      } else if (position === 'right') {
        columnsKey = 'rightColumns';
      } else {
        columnsKey = 'allDataColumns';
      }

      return $table[columnsKey].map(function (column, colIndex) {
        var classes = [column.className, column.align ? "uix-datatable-align-".concat(column.align) : ''].join(' ');
        var ngClass = ["row.cellClassName['".concat(column.key, "']")];
        var content = '';
        var enableTooltip = false;

        if (column.type === 'index') {
          if (column.indexMethod) {
            content = '{{::$table[\'' + columnsKey + '\'][' + colIndex + '].indexMethod(row, rowIndex)}}';
          } else {
            content = '{{rowIndex+1}}';
          }
        } else if (column.type === 'selection') {
          content = column.singleSelect ? '<input type="radio" ng-disabled="row.disabled" ng-value="rowIndex" ng-model="$table.currentChecked">' : '<input type="checkbox" ng-click="$table.handleSelect($event)" ng-disabled="row.disabled" ng-model="$table.selections[rowIndex]">';
        } else if (column.type === 'expand') {
          content = "\n                            <div class=\"uix-datatable-expand-trigger\" ng-click=\"$table.handleRowExpand(rowIndex)\">\n                                <i ng-show=\"!$table.dataObj[rowIndex]._isExpand\" class=\"glyphicon glyphicon-chevron-right\"></i>\n                                <i ng-show=\"$table.dataObj[rowIndex]._isExpand\" class=\"glyphicon glyphicon-chevron-down\"></i>\n                            </div>\n                            ";
        } else if (angular.isFunction(column.format)) {
          content = '{{::$table[\'' + columnsKey + '\'][' + colIndex + '].format(row, rowIndex)}}';
        } else if (angular.isDefined(column.template) || angular.isDefined(column.templateUrl)) {
          content = column.template || $templateCache.get(column.templateUrl) || '';
        } else {
          content = '{{';
          content += "row['".concat(column.key, "']");

          if (column.filter) {
            content += " | ".concat(column.filter);
          }

          content += '}}';
          enableTooltip = column.ellipsis;

          if (enableTooltip) {
            content = content.replace(/"/g, '\'');
          }
        }

        if (enableTooltip) {
          content = "<span tooltip-append-to-body=\"true\" uix-tooltip=\"".concat(content, "\">").concat(content, "</span>");
        }

        return "\n                            <td class=\"".concat(classes, "\" ng-class=\"").concat(ngClass, "\">\n                                <div class=\"").concat(column.fixed ? 'uix-datatable-cell-fixed' : '', " uix-datatable-cell ").concat(enableTooltip ? 'uix-datatable-cell-ellipsis' : '', "\">\n                                    ").concat(content, "\n                                </div>\n                            </td>\n                        ");
      }).join('');
    }

    var columnsKeyMap = {
      main: 'allDataColumns',
      left: 'leftColumns',
      right: 'rightColumns'
    };

    function hasExpandTemplate() {
      var expandTemplate = $templateCache.get($table.expandTemplate) || '';
      return !!expandTemplate;
    } // 获取展开行模板
    // 当具有左右固定列时，只展开中间表格


    function getExpandTemplate() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'main';

      if (!hasExpandTemplate()) {
        return '';
      }

      var expandTemplate = $templateCache.get($table.expandTemplate) || '';

      if (position === 'left' || position === 'right') {
        return "\n                            <tr ng-repeat-end ng-show=\"$table.dataObj[rowIndex]._isExpand\" class=\"uix-datatable-expand-row\">\n                                <td colspan=\"".concat($table[columnsKeyMap[position]].length, "\"></td>\n                            </tr>\n                        ");
      }

      var leftTd = '';
      var rightTd = '';

      if ($table.isLeftFixed) {
        leftTd = "<td colspan=\"".concat($table[columnsKeyMap.left].length, "\"></td>");
      }

      if ($table.isRightFixed) {
        rightTd = "<td colspan=\"".concat($table[columnsKeyMap.right].length, "\"></td>");
      }

      return "\n                        <tr ng-repeat-end ng-show=\"$table.dataObj[rowIndex]._isExpand\" class=\"uix-datatable-expand-row\">\n                            ".concat(leftTd, "\n                            <td colspan=\"").concat($table.centerColumns.length, "\">\n                                <div class=\"uix-datatable-expand-cell\">\n                                    ").concat(expandTemplate, "\n                                </div>\n                            </td>\n                            ").concat(rightTd, "\n                        </tr>\n                    ");
    }

    function getTemplate() {
      var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'main';
      var template = $templateCache.get("templates/datatable-table-".concat(position, ".html"));
      return template.replace('<%head%>', getHeadTemplate(position)).replace('<%body%>', getBodyTemplate(position));
    }

    function getBodyTemplate(position) {
      var template = $templateCache.get('templates/datatable-body-tpl.html') || '';
      var columnsKey = columnsKeyMap[position];
      var widthKey = '';

      if (position === 'left') {
        widthKey = 'leftTableWidth';
      } else if (position === 'right') {
        widthKey = 'rightTableWidth';
      } else {
        widthKey = 'tableWidth';
      }

      var hasExpand = hasExpandTemplate();
      return template.replace('<%repeatExp%>', hasExpand ? 'ng-repeat-start' : 'ng-repeat').replace('<%widthKey%>', widthKey).replace('<%columnsKey%>', columnsKey).replace('<%columnsLength%>', $table[columnsKey].length).replace('<%expand%>', getExpandTemplate(position)).replace('<%rowHeightExp%>', position === 'left' || position === 'right' ? 'ng-style="{height:$table.dataObj[rowIndex]._height+\'px\'}"' : '').replace('<%template%>', getBodyRowsTemplate(position));
    }

    function getHeadTemplate(position) {
      var template = $templateCache.get('templates/datatable-head-tpl.html') || '';
      var widthKey = '';
      var columnsKey = columnsKeyMap[position];
      var columnRowsKey = '';

      if (position === 'left') {
        columnRowsKey = 'leftColumnRows';
        widthKey = 'leftTableWidth';
      } else if (position === 'right') {
        columnRowsKey = 'rightColumnRows';
        widthKey = 'rightTableWidth';
      } else {
        columnRowsKey = 'allColumnRows';
        widthKey = 'tableWidth';
      }

      return template.replace('<%columnsKey%>', columnsKey).replace('<%columnRowsKey%>', columnRowsKey).replace('<%widthKey%>', widthKey).replace('<%template%>', getHeadTpls());
    }

    function updateFixedRowHeight() {
      var allRows = $element.find('.uix-datatable-main-body > table .uix-datatable-normal-row');

      if (allRows.length) {
        $table.data.forEach(function (row, index) {
          var tr = allRows.get(index);

          if (tr) {
            $table.dataObj[index]._height = tr.offsetHeight;
          }
        });
      }
    } // 当固定列与主表格行相同时，直接匹配
    // 当固定列行少于主表格时，由上往下进行匹配，多余的行高补充到最下一行
    // 当固定列行多于主表格时，不用处理


    function fitDiffColumnsRows(mainRows, fixedRows) {
      var mainLength = mainRows.length;
      var fixedLength = fixedRows.length;
      var headerHeight = $table.headerHeight;

      if (mainLength === fixedLength) {
        // 表头行相同
        mainRows.each(function (index, row) {
          fixedRows.eq(index).css({
            height: row.offsetHeight
          });
        });
      } else if (mainLength > fixedLength) {
        var restHeight = headerHeight;
        fixedRows.each(function (index, row) {
          var height = mainRows.get(index).offsetHeight;
          restHeight -= height;
          angular.element(row).css({
            height: height
          });
        });

        if (restHeight > 0) {
          fixedRows.eq(fixedLength - 1).css({
            height: restHeight + fixedRows.get(fixedLength - 1).offsetHeight
          });
        }
      }
    } // 计算固定列的表头高度


    function updateFixedHeadHeight() {
      var allRows = $element.find('.uix-datatable-main-header > table tr');

      if (!allRows.length) {
        return;
      } // 当窗口大小改变时，重新设置左右固定表格的top值


      var headerHeight = findEl('.uix-datatable-main-header')[0].offsetHeight;
      $table.headerHeight = headerHeight;

      if ($table.isLeftFixed) {
        var leftHeadRows = $element.find('.uix-datatable-left-header > table tr');
        fitDiffColumnsRows(allRows, leftHeadRows);
      }

      if ($table.isRightFixed) {
        var rightHeadRows = $element.find('.uix-datatable-right-header > table tr');
        fitDiffColumnsRows(allRows, rightHeadRows);
      }
    }

    $scope.$watch('$table.showVerticalScrollBar', function (val, oldVal) {
      if (val !== oldVal) {
        calcColumnsWidth();
      }
    });
    $scope.$watch('$table.tableWidth', function (val, oldVal) {
      if (val !== oldVal) {
        $table.updateHorizontalScroll();
      }
    });

    function renderTableBody() {
      var template = getTemplate('main');

      if ($table.isLeftFixed) {
        template += getTemplate('left');
      }

      if ($table.isRightFixed) {
        template += getTemplate('right');
      }

      $compile(template)(compileScope, function (clonedElement) {
        var tableWrap = angular.element($element[0].querySelector('.uix-datatable-content')); // 在empty之前把绑定的滚动事件清除重新绑定

        unBindScrollEvents();
        tableWrap.empty().append(clonedElement);
        bindScrollEvents();
        $timeout(function () {
          var headerHeight = findEl('.uix-datatable-main-header')[0].offsetHeight;
          $table.headerHeight = headerHeight;
          $table.updateHorizontalScroll();
          $table.updateVerticalScroll();
          updateFixedTableShadow();
          updateFixedRowHeight();
          updateFixedHeadHeight();
        }, 0);
      });
    }

    function splitColumns() {
      var columns = $table.allDataColumns;
      var left = [];
      var right = [];
      var center = [];
      columns.forEach(function (column, index) {
        column._index = index;

        if (column.fixed && column.fixed === 'left') {
          left.push(column);
        } else if (column.fixed && column.fixed === 'right') {
          right.push(column);
        } else {
          center.push(column);
        }
      });
      return {
        left: left,
        center: center,
        right: right
      };
    }

    $table.initColums = function () {
      var colsWithId = prepareColumns($scope.columns);
      $table.allDataColumns = getDataColumns(colsWithId);
      var columsObj = splitColumns(colsWithId);
      $table.leftColumns = columsObj.left;
      $table.rightColumns = columsObj.right;
      $table.centerColumns = columsObj.center;
      var columnRowsObj = makeColumnRows(colsWithId);
      $table.allColumnRows = columnRowsObj.center;
      $table.leftColumnRows = columnRowsObj.left;
      $table.rightColumnRows = columnRowsObj.right;
      $table.leftTableWidth = getFixedColumnsWidth('left');
      $table.rightTableWidth = getFixedColumnsWidth('right');
      $table.isLeftFixed = hasFixedColumns('left');
      $table.isRightFixed = hasFixedColumns('right');
    };

    $table.initData = function () {
      $table.data = $scope.data;
      $table.dataObj = makeDataObj();
      $timeout(function () {
        updateFixedRowHeight();
      }, 0);
    };

    $table.render = function () {
      calcColumnsWidth();
      renderTableBody();
    }; // 初始化


    $table.init = function () {
      $table.initColums();
      $table.initData();
      $table.render();
      bindResizeEvents();
    };

    $scope.$on('$destroy', function () {
      unbindResizeEvents();
      unBindScrollEvents();
      compileScope.$destroy();
    });
    $scope.$on('uix-datatable-clear-sort', function (evt, id) {
      if (id !== $scope.id) {
        return;
      }

      $table.clearSort();
    });
  }]).directive('uixDatatable', ['uixDatatable', 'uixDatatableConfig', '$timeout', function (uixDatatable, uixDatatableConfig, $timeout) {
    return {
      restrict: 'E',
      templateUrl: 'templates/datatable.html',
      replace: true,
      require: ['uixDatatable'],
      scope: {
        columns: '=',
        data: '=',
        status: '=',
        disabledHover: '=',
        rowClassName: '&',
        onSortChange: '&',
        onColumnsSort: '&',
        onRowClick: '&',
        onSelectionChange: '&',
        onCurrentChange: '&',
        onPageChange: '&',
        height: '=',
        maxHeight: '=',
        expandTemplate: '@',
        disabledRowClickSelect: '=',
        scrollX: '=',
        pageSizes: '=',
        pagination: '=',
        id: '@'
      },
      controllerAs: '$table',
      controller: 'uixDatatableCtrl',
      link: function link(scope, el, $attrs, ctrls) {
        var $table = ctrls[0];
        $table.columns = scope.columns;
        $table.data = scope.data;
        $table.isStriped = 'striped' in $attrs;
        $table.isBordered = 'bordered' in $attrs;
        $table.showPagination = 'pagination' in $attrs;

        if ($table.showPagination) {
          $table.pagination = scope.pagination;
          scope.$watch('pagination', function (val) {
            $table.pagination = {
              pageNo: val && val.pageNo ? val.pageNo : $table.pagination.pageNo || 1,
              pageSize: val && val.pageSize ? val.pageSize : $table.pagination.pageSize || 20,
              totalCount: val && val.totalCount ? val.totalCount : $table.pagination.totalCount || 0
            };
          }, true);
        }

        $table.showSizer = 'pageSizes' in $attrs;

        if ($table.showSizer) {
          $table.pageSizes = scope.pageSizes;
        }

        $table.multiSort = 'multiSort' in $attrs;
        $table.isLoading = false;
        $table.isEmpty = false;
        $table.isError = false;
        $table.expandTemplate = scope.expandTemplate || '';
        ['loading', 'empty', 'error'].forEach(function (type) {
          scope["".concat(type, "Text")] = $attrs["".concat(type, "Text")] || uixDatatable.getStatusText(type) || uixDatatableConfig["".concat(type, "Text")];
        });
        scope.$watch('height', function (val) {
          val = parseFloat(val, 10);

          if (!isNaN(val)) {
            $table.height = val;
            $table.bodyStyle = {
              height: $table.height + 'px'
            };
          }
        });
        scope.$watch('maxHeight', function (val) {
          val = parseFloat(val, 10);

          if (!isNaN(val)) {
            $table.maxHeight = val;

            if (!$table.height) {
              $table.bodyStyle = {
                maxHeight: val + 'px'
              };
            }
          }
        });
        scope.$watch('disabledHover', function (val) {
          $table.disabledHover = val;
        });
        scope.$watch('disabledRowClickSelect', function (val) {
          $table.disabledRowClickSelect = val;
        });
        scope.$watch('scrollX', function (val) {
          val = parseFloat(val, 10);

          if (isNaN(val)) {
            $table.scrollX = 0;
          } else {
            $table.scrollX = val;
          }
        });
        scope.$watch('data', function (val, old) {
          if (val !== old && angular.isDefined(val)) {
            $table.data = val;
            $table.initData(); // 当内容发生变化时，重新计算是否有纵向滚动

            $timeout(function () {
              $table.updateVerticalScroll();
            }, 0);
          }
        });
        scope.$watch('columns', function (val, old) {
          if (val !== old && angular.isDefined(val)) {
            $table.columns = val;
            $table.initColums();
            $table.render();
          }
        });
        scope.$watch('status', function (val) {
          $table.isLoading = val === 1 || val === 'loading';
          $table.isEmpty = val === 2 || val === 'empty';
          $table.isError = val === -1 || val === 'error';
          $table.updateContainerByStatus();
        });
        $table.init();
      }
    };
  }]).directive('uixDatatableFoot', ['$timeout', function ($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'templates/datatable-foot.html',
      replace: true,
      require: '^uixDatatable',
      scope: {},
      link: function link(scope, el, attrs, $table) {
        scope.$table = $table;
        var pageSizes = $table.pageSizes || [20, 40, 50, 100, 200];

        if ($table.pagination.pageSize && pageSizes.indexOf($table.pagination.pageSize) === -1) {
          pageSizes.push($table.pagination.pageSize);
        }

        scope.pageSizes = pageSizes.sort(function (prev, next) {
          return prev - next;
        });

        scope.handlePageChange = function () {
          $table.handlePageChange();
        };

        scope.handleSizerChange = function () {
          var cachePageNo = $table.pagination.pageNo;
          $timeout(function () {
            if ($table.pagination.pageNo === cachePageNo) {
              scope.handlePageChange();
            }
          }, 0);
        };
      }
    };
  }]);
})();
"use strict";

/**
 * datepicker
 * datepicker directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.xg.datepicker', ['ui.xg.calendar', 'ui.xg.popover']).constant('uixDatepickerConfig', {
  minDate: null,
  // 最小可选日期
  maxDate: null,
  // 最大可选日期
  exceptions: [],
  // 不可选日期中的例外,比如3月份的日期都不可选,但是3月15日却是可选择的
  format: 'yyyy-MM-dd HH:mm:ss',
  // 日期格式化
  autoClose: true,
  // 是否自动关闭面板,
  clearBtn: false,
  showTime: true,
  showSeconds: true,
  size: 'md',
  appendToBody: false,
  placement: 'auto bottom-left'
}).service('uixDatepickerService', ['$document', function ($document) {
  var openScope = null;

  this.open = function (datepickerScope) {
    if (!openScope) {
      $document.on('click', closeDatepicker);
    }

    if (openScope && openScope !== datepickerScope) {
      openScope.showCalendar = false;
    }

    openScope = datepickerScope;
    openScope.$on('$destroy', function () {
      $document.off('click', closeDatepicker);
    });
  };

  this.close = function (datepickerScope) {
    if (openScope === datepickerScope) {
      openScope = null;
      $document.off('click', closeDatepicker);
    }
  };

  function closeDatepicker(evt) {
    if (!openScope) {
      return;
    }

    var panelElement = openScope.getCanledarElement();
    var toggleElement = openScope.getToggleElement();

    if (panelElement && panelElement.contains(evt.target) || toggleElement && toggleElement.contains(evt.target) || angular.element(evt.target).hasClass('uix-cal-day-inner') || // 选择下一个月的时候,会重新绘制日历面板,contains方法无效
    angular.element(evt.target).hasClass('uix-cal-day')) {
      return;
    }

    openScope.showCalendar = false;
    openScope.$apply();
  }
}]).controller('uixDatepickerCtrl', ['$scope', '$element', '$attrs', '$log', 'dateFilter', 'uixDatepickerService', 'uixDatepickerConfig', '$parse', '$document', function ($scope, $element, $attrs, $log, dateFilter, uixDatepickerService, uixDatepickerConfig, $parse, $document) {
  var ngModelCtrl = {
    $setViewValue: angular.noop
  };
  var self = this;

  this.init = function (_ngModelCtrl) {
    ngModelCtrl = _ngModelCtrl;
    ngModelCtrl.$render = this.render;
    ngModelCtrl.$formatters.unshift(function (modelValue) {
      return modelValue ? new Date(modelValue) : null;
    });
  };

  $scope.showCalendar = false;

  this.toggle = function (open) {
    $scope.showCalendar = arguments.length ? !!open : !$scope.showCalendar;
  };

  angular.forEach(['exceptions', 'clearBtn', 'showTime', 'appendToBody', 'placement', 'showSeconds'], function (key) {
    $scope[key] = angular.isDefined($attrs[key]) ? angular.copy($scope.$parent.$eval($attrs[key])) : uixDatepickerConfig[key];
  });
  $scope.dateFilterProp = angular.isDefined($attrs.dateFilter) ? function ($date) {
    return $scope.dateFilter({
      $date: $date
    });
  } : function () {
    return true;
  }; // format

  var format = uixDatepickerConfig.format;

  if ($attrs.format) {
    $scope.$parent.$watch($parse($attrs.format), function (value) {
      format = value;
      $scope.inputValue = dateFilter($scope.selectDate, format);
    });
  }

  this.render = function () {
    var date = ngModelCtrl.$modelValue;

    if (isNaN(date)) {
      $log.warn('Datepicker directive: "ng-model" value must be a Date object, ' + 'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
    }

    $scope.selectDate = date;
    $scope.inputValue = dateFilter(date, format);
  }; // 显示隐藏日历


  $scope.toggleCalendarHandler = function (evt) {
    $element.find('input')[0].blur();

    if (evt) {
      evt.preventDefault();
    }

    if (!$scope.isDisabled) {
      self.toggle();
    }
  }; // 获取日历面板和被点击的元素
  // 如果是appendToBody的话，需要特殊判断


  $scope.getCanledarElement = function () {
    return $scope.appendToBody ? $document[0].querySelector('body > .uix-datepicker-popover') : $element[0].querySelector('.uix-datepicker-popover');
  };

  $scope.getToggleElement = function () {
    return $element[0].querySelector('.input-group');
  }; // 清除日期


  $scope.clearDateHandler = function () {
    $scope.inputValue = null;
    $scope.selectDate = null;
    ngModelCtrl.$setViewValue(null);
    ngModelCtrl.$render();
  };

  $scope.$watch('showCalendar', function (showCalendar) {
    if (showCalendar) {
      uixDatepickerService.open($scope);
    } else {
      uixDatepickerService.close($scope);
    }
  });
  var autoClose = angular.isDefined($attrs.autoClose) ? $scope.$parent.$eval($attrs.autoClose) : uixDatepickerConfig.autoClose; // 选择日期

  $scope.changeDateHandler = function (date) {
    $scope.inputValue = dateFilter(date, format);
    $scope.selectDate = date;

    if (autoClose) {
      self.toggle();
    }

    ngModelCtrl.$setViewValue(date);
    ngModelCtrl.$render();
    var fn = $scope.onChange ? $scope.onChange() : angular.noop();

    if (angular.isDefined(fn)) {
      fn();
    }
  };

  $scope.$on('$locationChangeSuccess', function () {
    $scope.showCalendar = false;
  });
}]).directive('uixDatepicker', function () {
  return {
    restrict: 'AE',
    templateUrl: 'templates/datepicker.html',
    replace: true,
    require: ['uixDatepicker', 'ngModel'],
    scope: {
      minDate: '=?',
      maxDate: '=?',
      placeholder: '@',
      size: '@',
      placement: '@',
      isDisabled: '=?ngDisabled',
      onChange: '&?',
      dateFilter: '&?'
    },
    controller: 'uixDatepickerCtrl',
    link: function link(scope, el, attrs, ctrls) {
      var datepickerCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];
      datepickerCtrl.init(ngModelCtrl);
    }
  };
});
"use strict";

/**
 * form
 * form directive
 * Author: your_email@gmail.com
 * Date:2019-09-02
 */
(function () {
  var commonRegUtil = {
    // url的正则表达式
    // urlObj: new RegExp(urlStr),
    // 邮箱
    emailReg: /^\w+([\-_\.]\w+)*@\w+([\-\.]\w+)*\.\w+([\-\.]\w+)*$/,
    // 字母数字下划线,中横线等合法字符
    validCharacterReg: /[A-Za-z0-9-_]+/,
    // 字母数字
    letterNumberReg: /^[A-Za-z\d]+$/,
    // 手机号,1-12位的数字即可
    mobileRegTwelveNum: /^\d{1,12}$/,
    // 手机号,首位为1,后面十位为数字
    mobileRegFirstOneTenNum: /^1[0-9]{10}$/,
    // 手机号,首位为1,第二位为3,4,5,7,8即可
    mobileRegFirstOneSecondLimit: /^1[3|4|5|7|8]\d{9}$/,
    // 固定电话,带区号010-12345678
    telReg: /^((0\d{2,3})-)(\d{7,8})$/,
    // http或者https开头
    httpFrontReg: /^http:([\s\S]*)|^https:([\s\S]*)/,
    // 首位可以为0的整数数字
    firstCanBeZeroIntReg: /^[0-9]\d*$/,
    // 首位不能为0的整数数字
    firstNotZeroIntReg: /^[1-9]\d*$/,
    // 八位整数,一般用于发票信息验证
    eightIntNumReg: /^\d{8}$/,
    // 单个数字
    singleIntNumReg: /^\d$/,
    // 多个整数数字
    multiIntNumReg: /^\d+$/,
    // 两个数字的整数,首位不能为0
    twoIntNumReg: /^[1-9]\d$/,
    // 1-99之间任意整数
    oneToNinetyNineNumReg: /[1-9][0-9]?$/,
    // 0-99之间任意整数
    zeroToNinetyNineNumReg: /^[1-9]\d$|^\d$/,
    // 数字,可以是整数,也可以是最多保留两位小数的浮点数
    intOrFloatMaxTwoDecimalReg: /^\d+(\.\d{1,2})?$/,
    // 数字,可以是整数,也可以是负数，也可以是最多保留两位小数的浮点数
    intOrFloatMaxTwocanNegativeDecimalReg: /^(-)?\d+(\.\d{1,2})?$/,
    // 数字,可以是整数,也可以是只保留一位小数的浮点数
    intOrFloatOneDecimalReg: /^\d+(\.\d{1})?$/,
    // 数字,可以是整数,也可以是最多保留四位小数的浮点数
    intOrFloatMaxFourDecimalReg: /^\d+(\.\d{1,4})?$/,
    // 数字,可以是整数,也可以是最多保留六位小数的浮点数,一般用于经纬度判断
    longitudeLatitudeReg: /^\d+(\.\d{1,6})?$/,
    // 正浮点型数字
    positiveFloatReg: /^\d+\.\d+$/,
    // 两位小数的浮点数
    twoDecimalsNumReg: /^\d+\.\d{2}$/,
    // 5-20位字母数字下划线,一般用户账号校验
    validCharacterFiveToTwenty: /^[0-9a-zA-Z_]{5,20}$/,
    // 整数或者浮点型数字
    floatNumReg: /^\d+(\.\d+)?$/,
    // 汉字数字和字母
    chineseNumberCharacterReg: /^[\u4e00-\u9fa5|a-zA-Z|0-9]+$/,
    // 非零的两位小数浮点数，可为负数
    nonZeroTwoDecimalsCanNegativeNumReg: /^-?([1-9]\d*\.\d{2}$|0\.\d[1-9]$|0\.[1-9]\d$)/,
    // 两位小数浮点数，可为负数
    twoDecimalsCanNegativeNumReg: /^-?([1-9]\d*|0)\.\d{2}$/
  };
  angular.module('ui.xg.form', []).controller('uixFormCtrl', ['$scope', '$compile', '$templateCache', '$element', '$q', '$timeout', function ($scope, $compile, $templateCache, $element, $q, $timeout) {
    var INPUTLIMIT = {
      number: /\D/g,
      letter: /[^a-zA-Z]/g,
      letterNumber: /[^A-Za-z\d]/g
    };
    var timer = null;
    var compileScope = $scope.$parent.$new();
    $scope.finalValue = $scope.finalValue || {};
    $scope.showBtn = angular.isUndefined($scope.showBtn) ? true : $scope.showBtn;

    if ($scope.data) {
      $scope.data.map(function (item) {
        if (item.key) {
          $scope.finalValue[item.key] = item.value;
        }

        if (item.tipInfo) {
          item.promptInformation = item.tipInfo;
        }

        item.passCheck = true;
      });
    }

    var $form = this;
    $form.layout = $scope.layout || 'horizontal';
    $form.copyData = angular.copy($scope.data);
    $form.html = '';
    $form.tplObj = {}; // 渲染模板dom

    $form.renderTpl = function (item) {
      if ($form.tplObj[item.templateName]) {
        return;
      }

      $form.tplObj[item.templateName] = 1;
      var tpl = item.template || $templateCache.get(item.templateUrl);
      $compile(tpl)(compileScope, function (clonedElement) {
        var tableWrap = angular.element($element[0].querySelector(".tplHtml".concat(item.templateName)));
        tableWrap.empty().append(clonedElement);
      });
    }; // 提交时校验


    $form.confirm = function () {
      if ($scope.checkAll) {
        var arr = [];
        $scope.data.map(function (item) {
          arr.push($form.validor(item));
        });
        $q.all(arr).then(function () {
          $form.updateConfirmState();
        });
      }

      if ($scope.onConfirm) {
        $scope.onConfirm({
          AllPassCheck: !$scope.disabled
        });
      }
    };

    $form.cancle = function () {
      if ($scope.resetData) {
        $form.tplObj = {};
        $scope.data = $form.copyData;
      }

      if ($scope.onCancel) {
        $scope.onCancel();
      }
    }; // change事件


    $form.onChange = function (item) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'front';

      // input限制输入（包括提示信息，数字字母，长度限制）
      if (item.type === 'input' && item.inputLimit) {
        var _item$inputLimit = item.inputLimit,
            limit = _item$inputLimit.limit,
            limitReg = _item$inputLimit.limitReg,
            maxlength = _item$inputLimit.maxlength; // 输入限制

        var reg = limit ? INPUTLIMIT[limit] : limitReg ? limitReg : '';

        if (reg) {
          item.value = item.value.replace(reg, '').trim();
        } // 长度校验


        var len = charLengthTrim(item.value);

        if (maxlength && len > maxlength) {
          item.value = item.value.slice(0, maxlength);
        }
      }

      if (item.key) {
        $scope.finalValue[item.key] = item.value;
      }

      if (item.onChange) {
        item.onChange(item.value);
      } // 校验


      if (item.checkTiming && item.checkTiming.includes('change') || from === 'relatedCheck' || $scope.checkAll) {
        $form.validor(item).then(function () {
          $form.updateConfirmState();
        });
      } // 关联校验项


      $form.relatedCheck(item, 'onChange');
    }; // Focus


    $form.onFocus = function (item) {
      // 获取焦点展示输入提示信息
      if (item.type === 'input' && item.inputLimit) {
        var limitInfo = item.inputLimit.limitInfo;

        if (limitInfo && limitInfo.message) {
          item.promptInformation = limitInfo;
        }
      }

      if (item.onFocus) {
        item.onFocus(item.value);
      }

      if (item.checkTiming && item.checkTiming.includes('focus')) {
        $form.validor(item).then(function () {
          $form.updateConfirmState();
        });
      } // 关联校验项


      $form.relatedCheck(item, 'onFocus');
    }; // blur


    $form.onBlur = function (item) {
      // 失焦去掉limitinfo
      item.promptInformation = item.tipInfo;

      if (item.onBlur) {
        item.onBlur(item.value);
      }

      if (item.checkTiming && item.checkTiming.includes('blur')) {
        $form.validor(item).then(function () {
          $form.updateConfirmState();
        });
      } // 关联校验项


      $form.relatedCheck(item, 'onBlur');
    }; // 校验


    $form.validor = function (item) {
      return $q(function (resolve) {
        // 自定义校验覆盖默认的必填和publicCheck校验
        if (item.validor) {
          clearTimeout(timer);
          timer = $timeout(function () {
            var checkResult = item.validor(item.value);

            if (checkResult.then) {
              checkResult.then(function (res) {
                item.errorInfo = res;
                item.passCheck = res.isPassed || false;
                resolve(item);
              });
            } else {
              item.errorInfo = checkResult;
              item.passCheck = checkResult.isPassed || false;
              resolve(item);
            }
          }, 300);
        } else {
          if (item.value) {
            item.errorInfo = {
              isPassed: true
            };
          }

          if (item.necessary && !item.value) {
            item.errorInfo = {
              isPassed: false,
              message: "".concat(item.text, "\u5FC5\u586B"),
              type: 'error'
            };
          } else {
            item.errorInfo = {
              isPassed: true
            };
          }

          if (item.publicCheck && item.publicCheck.length) {
            item.publicCheck.some(function (list) {
              if (!commonRegUtil[list].test(item.value)) {
                item.errorInfo = {
                  isPassed: false,
                  message: "".concat(item.text, "\u8F93\u5165\u4E0D\u6B63\u786E"),
                  type: 'error'
                };
                return true;
              } else {
                item.errorInfo = {
                  isPassed: true
                };
                return false;
              }
            });
          }

          item.passCheck = item.errorInfo.isPassed || false;
          resolve(item);
        }
      });
    };

    $form.updateConfirmState = function () {
      var result = $scope.data.filter(function (item) {
        return !item.passCheck;
      });

      if (result && result.length) {
        $scope.disabled = true;
      } else {
        $scope.disabled = false;
      }
    }; // a item校验调用b item的校验方法（关联校验）


    $form.relatedCheck = function (item, eventType) {
      if (item.relatedCheckKeys && item.relatedCheckKeys.length) {
        item.relatedCheckItems = item.relatedCheckKeys.reduce(function (res, relatedKey) {
          var relatedItem = $scope.data.find(function (_ref) {
            var key = _ref.key;
            return key === relatedKey;
          });

          if (relatedItem && relatedItem.key) {
            res.push(relatedItem);
          }

          return res;
        }, []);
        item.relatedCheckItems.forEach(function (relatedItem) {
          $form[eventType](relatedItem, 'relatedCheck');
        });
      }
    };

    function charLengthTrim(input) {
      return input.toString().replace(/(^\s*)|(\s*$)/g, '').replace(/[^\x00-\xff]/g, 'aa').length;
    }
  }]).directive('uixForm', function () {
    return {
      restrict: 'AE',
      templateUrl: 'templates/form.html',
      replace: true,
      require: ['uixForm'],
      scope: {
        data: '=',
        layout: '@?',
        textalign: '@?',
        buttonInline: '@?',
        confirmText: '@?',
        onConfirm: '&?',
        showBtn: '=?',
        cancelText: '@?',
        onCancel: '&?',
        resetData: '@?',
        checkAll: '@?',
        finalValue: '=?',
        colon: '@?',
        cancelButton: '@?',
        disabled: '@?'
      },
      controller: 'uixFormCtrl',
      controllerAs: '$form',
      link: function link() {}
    };
  });
})();
"use strict";

/**
 * grid
 * 布局指令
 * Author: clunt@foxmail.com
 * Date:2018-06-21
 */
(function () {
  var GRID_COLUMN = 24;
  var GRID_BREAKPOINTS = {
    xs: [],
    sm: [],
    md: [],
    lg: [],
    xl: [],
    xxl: []
  };
  var GRID_ATTR_PREFIX = 'uix-grid';
  var ITEM_ATTR_PREFIX = 'uix-grid-item';
  var GRID_CLASS_PREFIX = 'uix-grid';
  var ITEM_CLASS_PREFIX = 'uix-grid-item'; // Allowed attributes

  var GRID_ATTRS = getAttrClassFn(GRID_CLASS_PREFIX, {
    align: ['top', 'middle', 'bottom'],
    justify: ['start', 'end', 'center', 'around', 'between'],
    gutter: Boolean,
    reverse: Boolean
  }, GRID_BREAKPOINTS);
  var ITEM_ATTRS = getAttrClassFn(ITEM_CLASS_PREFIX, {
    span: {
      type: Number,
      valid: [0, GRID_COLUMN],
      "default": true
    },
    offset: {
      type: Number,
      valid: [0, GRID_COLUMN]
    },
    order: {
      type: Number,
      valid: [0, GRID_COLUMN]
    }
  }, GRID_BREAKPOINTS, 'span');
  angular.module('ui.xg.grid', []).directive('uixGrid', createDirective('A', GRID_ATTR_PREFIX, GRID_ATTRS, GRID_CLASS_PREFIX)).directive('uixGrid', createDirective('E', GRID_ATTR_PREFIX, GRID_ATTRS, GRID_CLASS_PREFIX)).directive('uixGridItem', createDirective('E', ITEM_ATTR_PREFIX, ITEM_ATTRS)).directive('uixGridItem', createDirective('A', ITEM_ATTR_PREFIX, ITEM_ATTRS));

  function createDirective(restrict, prefix, attrs, defaultClass) {
    return ['$parse', function ($parse) {
      var directive = {
        restrict: restrict,
        compile: function compile(tElement) {
          if (defaultClass) {
            tElement.addClass(defaultClass);
          }

          return function ($scope, $element, $attrs, controller, $transclude) {
            if (defaultClass) {
              $element.addClass(defaultClass);
            }

            angular.forEach(attrs, function (getClass, attr) {
              var attrName = getAttrName($attrs, prefix, attr);
              var updateClassFn = updateClassWithValue(getClass, $element, $parse);
              updateClassFn($attrs[attrName]);
              var unwatch = $attrs.$observe(attrName, updateClassFn);
              $scope.$on('$destroy', function () {
                unwatch();
              });
            });

            if ($transclude) {
              $transclude($scope, function (clone) {
                $element.append(clone);
              });
            }
          };
        }
      };

      if (restrict === 'E') {
        directive.replace = true;
        directive.template = '<div></div>';
        directive.transclude = true;
      }

      return directive;
    }];
  }

  function getAttrClassFn(prefix, attrs, breakpoints, defaultProp) {
    // generate class for attr
    var attrFns = {}; // attr value validate fns
    // valid and return attr value

    var validate = {};
    angular.forEach(attrs, function (validation, attr) {
      validate[attr] = getValueValid(validation);
      attrFns[attr] = getClass([prefix], function (value) {
        // attr(not media attr) only support basic type value
        var props = {};
        props[attr] = value;
        return props;
      });
    });
    angular.forEach(breakpoints, function (validation, attr) {
      // media attr value support object
      attrFns[attr] = getClass([prefix, attr], parseProps);
    });

    function getClass(prefixs, parse) {
      // prefix / prefix-${media}
      var classPrefix = prefixs.join('-');
      return function (value, $parse) {
        var className = [];
        angular.forEach(parse(value, $parse), function (value, prop) {
          var validateFn = validate[prop];

          if (angular.isFunction(validateFn)) {
            var validValue = validateFn(value);

            if (angular.isDefined(validValue)) {
              var propClass = classPrefix; // omit default prop in class

              if (prop !== defaultProp) {
                propClass += '-' + prop;
              } // class exist / not exist, when attr only support boolean


              if (validValue !== '') {
                propClass += '--' + validValue;
              }

              className.push(propClass);
            }
          }
        });

        if (className.length > 0) {
          return className.join(' ');
        }
      };
    }

    function getValueValid(validation) {
      if (angular.isArray(validation)) {
        return function (value) {
          if (validation.indexOf(value) > -1) {
            return value;
          }
        };
      }

      if (validation === Boolean) {
        return function (value) {
          if (value === '' || value === 'true') {
            return '';
          }
        };
      }

      if (angular.isObject(validation)) {
        if (validation.type === Number) {
          return function (value) {
            if (value === '') {
              if (validation["default"]) {
                return '';
              }
            }

            if (/^\d+$/.test(value) && value >= validation.valid[0] && value <= validation.valid[1]) {
              return parseInt(value, 10);
            }
          };
        }
      }

      if (angular.isFunction(validation)) {
        return validation;
      }

      return function () {};
    }

    function parseProps(value, $parse) {
      var props = {}; // structuring props
      // only support object value in media attr

      value = value ? $parse(value)() : value;

      if (angular.isObject(value)) {
        props = value;
      } else {
        if (defaultProp) {
          props[defaultProp] = value;
        }
      }

      return props;
    }

    return attrFns;
  }

  function getAttrName($attrs, prefix, name) {
    return $attrs.$normalize(prefix + '-' + name);
  }

  function updateClassWithValue(getClass, $element, $parse) {
    var lastClass;
    return function updateClassFn(newValue) {
      if (lastClass) {
        $element.removeClass(lastClass);
      }

      lastClass = getClass(newValue, $parse);

      if (lastClass) {
        $element.addClass(lastClass);
      }
    };
  }
})();
"use strict";

/**
 * loader
 * 加载Loading指令
 * Author:heqingyang@meituan.com
 * Date:2016-07-29
 */
angular.module('ui.xg.loader', []).provider('uixLoader', function () {
  var loadingTime = 300;

  this.setLoadingTime = function (num) {
    loadingTime = angular.isNumber(num) ? num : 300;
  };

  this.$get = function () {
    return {
      getLoadingTime: function getLoadingTime() {
        return loadingTime;
      }
    };
  };
}).controller('uixLoaderCtrl', ['$scope', '$timeout', '$element', '$window', 'uixLoader', '$document', function ($scope, $timeout, $element, $window, uixLoader, $document) {
  var $ = angular.element;
  var windowHeight = $window.clientHeight;
  var footerHeight = parseInt($document.find('#app-footer').css('height'), 10) || 0;
  var tempHeight = windowHeight - footerHeight - $element[0].offsetTop;
  var height = parseInt($scope.loaderHeight, 10) || tempHeight > 300 ? 300 : tempHeight;
  var width = $scope.loaderWidth;
  var loadingTime = parseInt($scope.loadingTime, 10) || uixLoader.getLoadingTime();
  var displayType = $element.css('display');
  var loadingTpl = $('<div class="loading">' + '<i class="fa fa-spin fa-spinner loading-icon"></i>' + '</div>');
  var errorTipTpl = $('<div class="error-tip">' + '<span class="error-text">数据加载失败! </span>' + '</div>');
  var emptyTipTpl = $('<div class="error-tip">' + '<span class="error-text empty-text">数据为空！</span>' + '</div>');
  var startTimer, endTimer;
  $element.parent().addClass('uix-loader');
  $scope.$watch('uixLoader', function (newValue) {
    if (newValue === 1) {
      startTimer = new Date().getTime();
      errorTipTpl.css('display', 'none');
      emptyTipTpl.css('display', 'none');
      $element.css('display', 'none').after(loadingTpl);
      loadingTpl.css('height', height);

      if (width) {
        loadingTpl.css('width', width);
      }
    } else if (newValue === 0) {
      endTimer = new Date().getTime();

      if (startTimer) {
        timeoutHandle(startTimer, endTimer, function () {
          errorTipTpl.remove();
          emptyTipTpl.remove();
          loadingTpl.remove();
          $element.css('display', displayType);
        });
      }
    } else if (newValue === 2) {
      endTimer = new Date().getTime();

      if (startTimer) {
        timeoutHandle(startTimer, endTimer, function () {
          loadingTpl.remove();
          errorTipTpl.remove();
          $element.css('display', 'none').after(emptyTipTpl);
          emptyTipTpl.css('display', displayType);
          emptyTipTpl.css('height', height);

          if (width) {
            emptyTipTpl.css('width', width);
          }
        });
      }
    } else if (newValue === -1) {
      endTimer = new Date().getTime();

      if (startTimer) {
        timeoutHandle(startTimer, endTimer, function () {
          loadingTpl.remove();
          emptyTipTpl.remove();
          $element.css('display', 'none').after(errorTipTpl);
          errorTipTpl.css('display', displayType);
          errorTipTpl.css('height', height);

          if (width) {
            loadingTpl.css('width', width);
          }
        });
      }
    }
  });

  function timeoutHandle(startTimer, endTimer, callback) {
    var timer;

    if (endTimer - startTimer < loadingTime) {
      timer = loadingTime;
    } else {
      timer = 0;
    }

    $timeout(callback, timer);
  }
}]).directive('uixLoader', function () {
  return {
    restrict: 'A',
    scope: {
      uixLoader: '=',
      loaderHeight: '@',
      loaderWidth: '@',
      loadingTime: '@'
    },
    controller: 'uixLoaderCtrl',
    controllerAs: 'loader'
  };
});
"use strict";

/**
 * modal
 * modal directive
 * 不太会写,基本是照搬的 ui-bootstrap v0.12.1 https://github.com/angular-ui/bootstrap/blob/0.12.1/src/modal/modal.js
 * 先抄着,后面再写吧,心好累
 *
 * Author: yjy972080142@gmail.com
 * Date:2016-03-23
 */
angular.module('ui.xg.modal', ['ui.xg.stackedMap', 'ui.xg.transition', 'ui.xg.button'])
/**
 * A helper directive for the $uixModal service. It creates a backdrop element.
 */
.directive('uixModalBackdrop', ['$timeout', function ($timeout) {
  return {
    restrict: 'EA',
    replace: true,
    templateUrl: 'templates/backdrop.html',
    link: function link(scope, element, attrs) {
      scope.backdropClass = attrs.backdropClass || '';
      scope.animate = false; //trigger CSS transitions

      $timeout(function () {
        scope.animate = true;
      });
    }
  };
}]).directive('uixModalWindow', ['$uixModalStack', '$timeout', function ($uixModalStack, $timeout) {
  return {
    restrict: 'EA',
    scope: {
      index: '@',
      animate: '='
    },
    replace: true,
    transclude: true,
    templateUrl: 'templates/window.html',
    link: function link(scope, element, attrs) {
      element.addClass(attrs.windowClass || '');
      scope.size = attrs.size;
      $timeout(function () {
        // trigger CSS transitions
        scope.animate = true;
        /**
         * Auto-focusing of a freshly-opened modal element causes any child elements
         * with the autofocus attribute to lose focus. This is an issue on touch
         * based devices which will show and then hide the onscreen keyboard.
         * Attempts to refocus the autofocus element via JavaScript will not reopen
         * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
         * the modal element if the modal does not contain an autofocus element.
         */

        if (!element[0].querySelectorAll('[autofocus]').length) {
          element[0].focus();
        }
      });

      scope.close = function (evt) {
        var modal = $uixModalStack.getTop();

        if (modal && modal.value.backdrop && modal.value.backdrop !== 'static' && evt.target === evt.currentTarget) {
          evt.preventDefault();
          evt.stopPropagation();
          $uixModalStack.dismiss(modal.key, 'backdrop click');
        }
      };
    }
  };
}]) /// TODO 修改变量
.directive('uixModalTransclude', function () {
  return {
    link: function link($scope, $element, $attrs, controller, $transclude) {
      // TODO 这个$transclude是自动注入的吗?
      $transclude($scope.$parent, function (clone) {
        $element.empty();
        $element.append(clone);
      });
    }
  };
}).factory('$uixModalStack', ['$uixTransition', '$timeout', '$document', '$compile', '$rootScope', '$uixStackedMap', function ($transition, $timeout, $document, $compile, $rootScope, $$stackedMap) {
  var OPENED_MODAL_CLASS = 'modal-open';
  var backdropDomEl, backdropScope;
  var openedWindows = $$stackedMap.createNew();
  var $uixModalStack = {};

  function backdropIndex() {
    var topBackdropIndex = -1;
    var opened = openedWindows.keys();

    for (var i = 0; i < opened.length; i++) {
      if (openedWindows.get(opened[i]).value.backdrop) {
        topBackdropIndex = i;
      }
    }

    return topBackdropIndex;
  }

  $rootScope.$watch(backdropIndex, function (newBackdropIndex) {
    if (backdropScope) {
      backdropScope.index = newBackdropIndex;
    }
  });

  function removeModalWindow(modalInstance) {
    var body = $document.find('body').eq(0);
    var modalWindow = openedWindows.get(modalInstance).value; //clean up the stack

    openedWindows.remove(modalInstance); //remove window DOM element

    removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, 300, function () {
      modalWindow.modalScope.$destroy();
      body.toggleClass(OPENED_MODAL_CLASS, openedWindows.length() > 0);
      checkRemoveBackdrop();
    });
  }

  function checkRemoveBackdrop() {
    //remove backdrop if no longer needed
    if (backdropDomEl && backdropIndex() === -1) {
      var backdropScopeRef = backdropScope;
      removeAfterAnimate(backdropDomEl, backdropScope, 150, function () {
        backdropScopeRef.$destroy();
        backdropScopeRef = null;
      });
      backdropDomEl = null;
      backdropScope = null;
    }
  }

  function removeAfterAnimate(domEl, scope, emulateTime, done) {
    // Closing animation
    scope.animate = false;
    var transitionEndEventName = $transition.transitionEndEventName;

    if (transitionEndEventName) {
      // transition out
      var timeout = $timeout(afterAnimating, emulateTime);
      domEl.bind(transitionEndEventName, function () {
        $timeout.cancel(timeout);
        afterAnimating();
        scope.$apply();
      });
    } else {
      // Ensure this call is async
      $timeout(afterAnimating);
    }

    function afterAnimating() {
      if (afterAnimating.done) {
        return;
      }

      afterAnimating.done = true;
      domEl.remove();

      if (done) {
        done();
      }
    }
  }

  $document.bind('keydown', function (evt) {
    var modal; // 点击ESC关闭

    if (evt.which === 27) {
      modal = openedWindows.top();

      if (modal && modal.value.keyboard) {
        evt.preventDefault();
        $rootScope.$apply(function () {
          $uixModalStack.dismiss(modal.key, 'escape key press');
        });
      }
    }
  });

  $uixModalStack.open = function (modalInstance, modal) {
    openedWindows.add(modalInstance, {
      deferred: modal.deferred,
      modalScope: modal.scope,
      backdrop: modal.backdrop,
      keyboard: modal.keyboard
    });
    var body = $document.find('body').eq(0),
        currBackdropIndex = backdropIndex(); // 保证只会插入一次蒙版

    if (currBackdropIndex >= 0 && !backdropDomEl) {
      backdropScope = $rootScope.$new(true);
      backdropScope.index = currBackdropIndex;
      var angularBackgroundDomEl = angular.element('<div uix-modal-backdrop></div>');
      angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
      backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
      body.append(backdropDomEl);
    }

    var angularDomEl = angular.element('<div uix-modal-window></div>');
    angularDomEl.attr({
      'window-class': modal.windowClass,
      'size': modal.size,
      'index': openedWindows.length() - 1,
      'animate': 'animate'
    }).html(modal.content);
    var modalDomEl = $compile(angularDomEl)(modal.scope);
    openedWindows.top().value.modalDomEl = modalDomEl;
    body.append(modalDomEl);
    body.addClass(OPENED_MODAL_CLASS);
  };

  $uixModalStack.close = function (modalInstance, result) {
    var modalWindow = openedWindows.get(modalInstance);

    if (modalWindow) {
      modalWindow.value.deferred.resolve(result);
      removeModalWindow(modalInstance);
    }
  };

  $uixModalStack.dismiss = function (modalInstance, reason) {
    var modalWindow = openedWindows.get(modalInstance);

    if (modalWindow) {
      modalWindow.value.deferred.reject(reason);
      removeModalWindow(modalInstance);
    }
  };

  $uixModalStack.dismissAll = function (reason) {
    var topModal = this.getTop();

    while (topModal) {
      this.dismiss(topModal.key, reason);
      topModal = this.getTop();
    }
  };

  $uixModalStack.getTop = function () {
    return openedWindows.top();
  };

  return $uixModalStack;
}]).provider('$uixModal', function () {
  var self = this;
  this.options = {
    backdrop: true,
    //can be also false or 'static'
    keyboard: true
  };
  this.$get = ['$injector', '$rootScope', '$q', '$http', '$templateCache', '$controller', '$uixModalStack', function ($injector, $rootScope, $q, $http, $templateCache, $controller, $uixModalStack) {
    /**
     * 获取模板
     * @param options - 配置信息
     * @returns {*|Promise}
     */
    function getTemplatePromise(options) {
      return options.template ? $q.when(options.template) : $http.get(angular.isFunction(options.templateUrl) ? options.templateUrl() : options.templateUrl, {
        cache: $templateCache
      }).then(function (result) {
        return result.data;
      });
    }
    /**
     * TODO 不明白是干啥的,好像是获取modalInstance依赖的
     * @param resolves
     * @returns {Array}
     */


    function getResolvePromises(resolves) {
      var promisesArr = [];
      angular.forEach(resolves, function (value) {
        if (angular.isFunction(value) || angular.isArray(value)) {
          promisesArr.push($q.when($injector.invoke(value)));
        }
      });
      return promisesArr;
    }

    return {
      open: function open(modalOptions) {
        var modalResultDeferred = $q.defer();
        var modalOpenedDeferred = $q.defer(); //prepare an instance of a modal to be injected into controllers and returned to a caller

        var modalInstance = {
          result: modalResultDeferred.promise,
          opened: modalOpenedDeferred.promise,
          close: function close(result) {
            $uixModalStack.close(modalInstance, result);
          },
          dismiss: function dismiss(reason) {
            $uixModalStack.dismiss(modalInstance, reason);
          }
        }; //merge and clean up options

        modalOptions = angular.extend({}, self.options, modalOptions);
        modalOptions.resolve = modalOptions.resolve || {}; //verify options

        if (!modalOptions.template && !modalOptions.templateUrl) {
          throw new Error('One of template or templateUrl options is required.');
        }

        var templateAndResolvePromise = $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));
        templateAndResolvePromise.then(function resolveSuccess(tplAndVars) {
          var modalScope = (modalOptions.scope || $rootScope).$new();
          modalScope.$close = modalInstance.close;
          modalScope.$dismiss = modalInstance.dismiss;
          var ctrlInstance,
              ctrlLocals = {};
          var resolveIter = 1; //controllers

          if (modalOptions.controller) {
            // 使用$controller创建controller并注入$scope,$uixModalInstance和resolve
            ctrlLocals.$scope = modalScope;
            ctrlLocals.$uixModalInstance = modalInstance;
            angular.forEach(modalOptions.resolve, function (value, key) {
              ctrlLocals[key] = tplAndVars[resolveIter++];
            });
            ctrlInstance = $controller(modalOptions.controller, ctrlLocals);

            if (modalOptions.controllerAs) {
              modalScope[modalOptions.controllerAs] = ctrlInstance;
            }
          }

          $uixModalStack.open(modalInstance, {
            scope: modalScope,
            deferred: modalResultDeferred,
            content: tplAndVars[0],
            backdrop: modalOptions.backdrop,
            keyboard: modalOptions.keyboard,
            backdropClass: modalOptions.backdropClass,
            windowClass: modalOptions.windowClass,
            size: modalOptions.size
          }); // close all modal when location changed

          var locationChanged = $rootScope.$on('$locationChangeSuccess', function () {
            $uixModalStack.dismissAll();
          });
          modalScope.$on('$destroy', locationChanged);
        }, function resolveError(reason) {
          modalResultDeferred.reject(reason);
        });
        templateAndResolvePromise.then(function () {
          modalOpenedDeferred.resolve(true);
        }, function () {
          modalOpenedDeferred.reject(false);
        });
        return modalInstance;
      }
    };
  }];
}).factory('$uixConfirm', ['$uixModal', '$q', function ($uixModal, $q) {
  return function (opt) {
    opt = opt || {};
    return $uixModal.open({
      templateUrl: 'templates/confirm.html',
      size: 'sm',
      controller: ['$scope', '$uixModalInstance', function ($scope, $uixModalInstance) {
        $scope.modalBodyText = opt.content || '';
        $scope.confirmBtnText = opt.confirmBtnText || '确定';
        $scope.cancelBtnText = opt.cancelBtnText || '取消';

        var okCallback = opt.confirm || function () {
          return true;
        };

        $scope.ok = function () {
          if ($scope.loading) {
            return;
          }

          var handler = okCallback();
          $scope.loading = true;
          $q.when(handler).then(function (success) {
            if (success) {
              $uixModalInstance.close();
            } else {
              $scope.loading = false;
            }
          }, function () {
            $scope.loading = false;
          });
        };

        $scope.cancel = opt.cancel || function () {
          $uixModalInstance.dismiss();
        };
      }]
    });
  };
}]).directive('uixConfirm', ['$uixConfirm', function ($uixConfirm) {
  return {
    restrict: 'EA',
    scope: {
      content: '@uixConfirm',
      confirm: '&',
      cancel: '&',
      confirmBtnText: '@',
      cancelBtnText: '@'
    },
    replace: true,
    link: function link(scope, element, attrs) {
      var content = scope.content || '';
      element.on('click', function () {
        var modalInstance = $uixConfirm({
          content: content,
          confirmBtnText: scope.confirmBtnText,
          cancelBtnText: scope.cancelBtnText,
          confirm: function confirm() {
            return attrs.confirm ? scope.confirm({
              $modal: modalInstance
            }) : true;
          },
          cancel: function cancel() {
            if (attrs.cancel) {
              scope.cancel({
                $modal: modalInstance
              });
            } else {
              modalInstance.dismiss('cancel');
            }
          }
        });
      });
    }
  };
}]);
"use strict";

/**
 * notify
 * 通知指令
 * Author:penglu02@meituan.com
 * Date:2016-03-22
 */
angular.module('ui.xg.notify', []).service('notifyServices', ['$sce', '$interval', function ($sce, $interval) {
  var self = this;
  this.directives = {};
  var preloadDirectives = {};

  function preLoad(referenceId) {
    var directive;

    if (preloadDirectives[referenceId]) {
      directive = preloadDirectives[referenceId];
    } else {
      directive = preloadDirectives[referenceId] = {
        messages: []
      };
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
      var _currentMsgText;

      angular.forEach(messages, function (msg) {
        msgText = $sce.getTrustedHtml(msg.text);
        _currentMsgText = $sce.getTrustedHtml(message.text);

        if (_currentMsgText === msgText && message.severity === msg.severity && message.title === msg.title) {
          found = true;
        }
      });

      if (found) {
        return;
      }
    } //message.text = $sce.trustAsHtml(String(message.text));


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
    var messages = this.getAllMessages(message.referenceId),
        index = messages.indexOf(message);

    if (index > -1) {
      messages[index].close = true;
      messages.splice(index, 1);
    }

    if (angular.isFunction(message.onclose)) {
      message.onclose();
    }
  };
}]).controller('notifyController', ['$scope', '$interval', '$uixNotify', 'notifyServices', function ($scope, $interval, $uixNotify, notifyServices) {
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
}]).provider('$uixNotify', function () {
  var _ttl = {
    success: null,
    error: null,
    warning: null,
    info: null
  },
      _messagesKey = 'messages',
      _messageTextKey = 'text',
      _messageTitleKey = 'title',
      _messageSeverityKey = 'severity',
      _onlyUniqueMessages = true,
      _messageVariableKey = 'variables',
      _referenceId = 0,
      _inline = false,
      _position = 'top-right',
      _disableCloseButton = false,
      _disableIcons = false,
      _reverseOrder = false,
      _disableCountDown = false,
      _translateMessages = true;

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

  this.serverMessagesInterceptor = ['$q', '$uixNotify', function ($q, notify) {
    function checkResponse(response) {
      if (angular.isDefined(response) && response.data && response.data[_messagesKey] && response.data[_messagesKey].length > 0) {
        notify.addServerMessages(response.data[_messagesKey]);
      }
    }

    return {
      'response': function response(_response) {
        checkResponse(_response);
        return _response;
      },
      'responseError': function responseError(rejection) {
        checkResponse(rejection);
        return $q.reject(rejection);
      }
    };
  }];
  this.$get = ['$rootScope', '$interpolate', '$filter', '$interval', 'notifyServices', function ($rootScope, $interpolate, $filter, $interval, notifyServices) {
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
      $interval(function () {}, 0, 1);
      return addedMessage;
    }

    function sendMessage(text, config, severity) {
      var _config = config || {},
          message;

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
        destroy: function destroy() {
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
  }];
}).directive('uixNotify', [function () {
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
"use strict";

angular.module('ui.xg.pager', []).constant('uixPagerConfig', {
  itemsPerPage: 20,
  maxSize: 5,
  showTotal: true,
  boundaryLinks: true,
  directionLinks: true,
  firstText: '首页',
  previousText: '上一页',
  nextText: '下一页',
  lastText: '尾页',
  rotate: true
}).controller('uixPagerCtrl', ['$scope', '$attrs', '$parse', function ($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = {
    $setViewValue: angular.noop
  }; // nullModelCtrl

  this.init = function (ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function () {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function (value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    } // show total or not


    if ($attrs.showTotal) {
      $scope.$parent.$watch($parse($attrs.showTotal), function (value) {
        $scope.showTotal = !!value;
      });
    } else {
      $scope.showTotal = config.showTotal;
    }
  };

  this.calculateTotalPages = function () {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function () {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function (page) {
    if ($scope.page !== page && page > 0 && page <= $scope.totalPages) {
      $scope.$emit('uixPager:pageChanged', page);
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function (key) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };

  $scope.isFirst = function () {
    return $scope.page === 1;
  };

  $scope.isLast = function () {
    return $scope.page === $scope.totalPages;
  };

  $scope.$watch('totalItems', function () {
    $scope.totalPages = self.calculateTotalPages();
  });
  $scope.$watch('totalPages', function (value) {
    if ($scope.page > value) {
      $scope.selectPage(value);
    } else {
      ngModelCtrl.$render();
    }
  });
}]).directive('uixPager', ['$parse', 'uixPagerConfig', function ($parse, uixPagerConfig) {
  return {
    restrict: 'E',
    templateUrl: 'templates/pager.html',
    replace: true,
    require: ['uixPager', '?ngModel'],
    scope: {
      pageNo: '=',
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@'
    },
    controller: 'uixPagerCtrl',
    link: function link(scope, el, attrs, ctrls) {
      var paginationCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
        return; // do nothing if no ng-model
      } // Setup configuration parameters


      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : uixPagerConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : uixPagerConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : uixPagerConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : uixPagerConfig.directionLinks;
      paginationCtrl.init(ngModelCtrl, uixPagerConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function (value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      } // Create page object used in template


      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = []; // Default page limits

        var startPage = 1,
            endPage = totalPages;
        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages; // recompute if maxSize

        if (isMaxSized) {
          if (rotate) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize / 2), 1);
            endPage = startPage + maxSize - 1; // Adjust if limit is exceeded

            if (endPage > totalPages) {
              endPage = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = (Math.ceil(currentPage / maxSize) - 1) * maxSize + 1; // Adjust last page if limit is exceeded

            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        } // Add page number links


        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        } // Add links to move between page sets


        if (isMaxSized && !rotate) {
          if (startPage > 1) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if (endPage < totalPages) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;

      paginationCtrl.render = function () {
        originalRender();

        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}]);
"use strict";

/**
 * progressbar
 * 进度条指令
 * Author: zhouxiong03@meituan.com
 * Date:2016-08-05
 */
angular.module('ui.xg.progressbar', []).constant('uixProgressConfig', {
  animate: false,
  max: 100
}).controller('UixProgressController', ['$scope', '$attrs', 'uixProgressConfig', function ($scope, $attrs, progressConfig) {
  var self = this,
      animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;
  this.bars = [];
  $scope.max = getMaxOrDefault();

  this.addBar = function (bar, element, attrs) {
    if (!animate) {
      element.css({
        'transition': 'none'
      });
    } else {
      element.parent().addClass('progress-striped active');
    }

    this.bars.push(bar);
    bar.max = getMaxOrDefault();
    bar.title = attrs && angular.isDefined(attrs.title) && attrs.title ? attrs.title : 'progressbar';
    bar.$watch('value', function () {
      bar.recalculatePercentage();
    });

    bar.recalculatePercentage = function () {
      var totalPercentage = self.bars.reduce(function (total, bar) {
        bar.percent = +(100 * bar.value / bar.max).toFixed(2);
        return total + bar.percent;
      }, 0);

      if (totalPercentage > 100) {
        bar.percent -= totalPercentage - 100;
      }
    };

    bar.$on('$destroy', function () {
      element = null;
      self.removeBar(bar);
    });
  };

  this.removeBar = function (bar) {
    this.bars.splice(this.bars.indexOf(bar), 1);
    this.bars.forEach(function (bar) {
      bar.recalculatePercentage();
    });
  };

  $scope.$watch('maxParam', function () {
    self.bars.forEach(function (bar) {
      bar.max = getMaxOrDefault();
      bar.recalculatePercentage();
    });
  });

  function getMaxOrDefault() {
    return angular.isDefined($scope.maxParam) ? $scope.maxParam : progressConfig.max;
  }
}]).directive('uixProgress', function () {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    require: 'uixProgress',
    scope: {
      maxParam: '=?max'
    },
    templateUrl: 'templates/progress.html',
    controller: 'UixProgressController'
  };
}).directive('uixBar', function () {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    require: '^uixProgress',
    scope: {
      value: '=',
      type: '@'
    },
    templateUrl: 'templates/bar.html',
    link: function link(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, element, attrs);
    }
  };
}).directive('uixProgressbar', function () {
  return {
    restrict: 'AE',
    replace: true,
    transclude: true,
    controller: 'UixProgressController',
    scope: {
      value: '=',
      maxParam: '=?max',
      type: '@'
    },
    templateUrl: 'templates/progressbar.html',
    link: function link(scope, element, attrs, progressCtrl) {
      progressCtrl.addBar(scope, angular.element(element.children()[0]), {
        title: attrs.title
      });
    }
  };
});
"use strict";

angular.module('ui.xg.rate', []).directive('uixRate', function () {
  return {
    restrict: 'E',
    require: '?ngModel',
    scope: {
      readOnly: '=?',
      onChange: '&?'
    },
    templateUrl: 'templates/rate.html',
    transclude: true,
    replace: true,
    link: function link(scope, element, attrs, ngModelCtrl) {
      scope.rates = []; // 初始化icon个数.默认5个

      scope.count = getRealAttr(scope.$parent, attrs.count, 5);
      scope.count = scope.count <= 0 ? 5 : scope.count; // 不能为0个

      scope.ngModel = formatVal(getRealAttr(scope.$parent, attrs.ngModel)); // 获取绑定model

      scope.ngModel = scope.ngModel > scope.count ? scope.count : scope.ngModel; //如果超出指定值,则取最大值

      scope.ngModel = scope.ngModel < 0 ? 0 : scope.ngModel; //如果低于指定值,则取最小值

      scope.$watch('ngModel', function (val) {
        ngModelCtrl.$setViewValue(val);
        ngModelCtrl.$render();
      }); // 设置icon样式,可以理解为'fa fa-icon'即class='fa fa-icon'等

      scope.ratingIcon = getRealAttr(scope.$parent, attrs.ratingIcon, 'glyphicon glyphicon-star'); // 暂时只考虑遮盖色

      scope.ratingSelectColor = getRealAttr(scope.$parent, attrs.ratingSelectColor, '#f5a623'); // 点击选中是否可取消,默认不行

      scope.enableReaset = getRealAttr(scope.$parent, attrs.enableReaset, false); // 默认
      // 是否只读,双向数据绑定,默认为false

      scope.readOnly = angular.isDefined(scope.readOnly) ? scope.readOnly : false;
      scope.$watch('ngModel', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          // 评分发生改变
          scope.onChange({
            $oldVal: oldVal,
            $newVal: newVal
          });
        }
      }); // 动态生成icon数组对象

      for (var i = 0; i < scope.count; i++) {
        var rate = {};
        rate.ratingIcon = scope.ratingIcon; // 图标

        rate.clickNum = 0; // icon点击次数,默认0次

        rate.selectFlag = 0; // 默认不选中,控制是否选中

        scope.rates.push(rate);
      }

      scope.enterLiFn = function (idx) {
        if (scope.readOnly) {
          return;
        }

        scope.changeFlag = false;
        var i;
        var ele = element.find('li'); // 选中所有

        for (i = 0; i <= idx; i++) {
          ele.eq(i).css('color', scope.ratingSelectColor);
          ele.eq(i).addClass('full-score');
        }

        for (i = idx + 1; i < scope.count; i++) {
          ele.eq(i).removeClass('full-score');
          ele.eq(i).css('color', '#e9e9e9');
        }

        element.find('li').eq(idx).addClass('max-icon');
      };

      scope.leaveFn = function () {
        if (scope.readOnly) {
          return;
        }

        if (scope.changeFlag) {
          // 选择过
          return; //不做任何操作
        }

        var i;
        var ele = element.find('li');

        for (i = 0; i < scope.ngModel; i++) {
          ele.eq(i).addClass('full-score');
          ele.eq(i).css('color', scope.ratingSelectColor);
        }

        for (i = scope.ngModel; i < scope.count; i++) {
          ele.eq(i).removeClass('full-score');
          ele.eq(i).css('color', '#e9e9e9');
        }
      };
      /**
       * 鼠标离开,移除放大效果
       * @param idx
       */


      scope.leaveLiFn = function (idx) {
        if (scope.readOnly) {
          return;
        }

        var ele = element.find('li');
        ele.eq(idx).removeClass('max-icon');
      };

      scope.clickLiFn = function (idx) {
        if (scope.readOnly) {
          return;
        }

        scope.changeFlag = true; // 改变选择

        scope.ngModel = idx + 1; //重新赋值
      };
      /**
       * 在父作用scope解析属性值
       * @param {object} scope 变量所在scope域
       * @param {string} val 从标签上获取的属性值
       * @param {string} defaultVal 属性默认值
       * @returns {*}
       */


      function getRealAttr(scope, val, defaultVal) {
        if (angular.isDefined(val)) {
          return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
        } else {
          return defaultVal;
        }
      } // 所有格式都转换为整数,如果为字符串,则转换为0,小于0的值会转换为0


      function formatVal(val) {
        if (!angular.isNumber(val)) {
          val = isNaN(parseFloat(val)) ? 0 : parseFloat(val);
        }

        return Math.round(val);
      }
    }
  };
});
"use strict";

/**
 * searchBox
 * 搜索框
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-25
 */
angular.module('ui.xg.searchBox', []).constant('uixSearchBoxConfig', {
  btnText: '搜索',
  // 默认搜索按钮文本
  showBtn: true // 默认显示按钮

}).controller('uixSearchBoxCtrl', ['$scope', '$attrs', 'uixSearchBoxConfig', function ($scope, $attrs, uixSearchBoxConfig) {
  var ngModelCtrl = {
    $setViewValue: angular.noop
  };
  $scope.searchBox = {};

  this.init = function (_ngModelCtrl) {
    ngModelCtrl = _ngModelCtrl;
    ngModelCtrl.$render = this.render;
    $scope.showBtn = angular.isDefined($attrs.showBtn) ? $scope.$parent.$eval($attrs.showBtn) : uixSearchBoxConfig.showBtn;
  };

  var btnText;

  $scope.getText = function () {
    if (btnText) {
      return btnText;
    }

    btnText = angular.isDefined($attrs.btnText) ? $attrs.btnText : uixSearchBoxConfig.btnText;
    return btnText;
  };

  $scope.$watch('searchBox.query', function (val) {
    ngModelCtrl.$setViewValue(val);
    ngModelCtrl.$render();
  });

  $scope.keyUpToSearch = function (evt) {
    if (evt && evt.keyCode === 13) {
      evt.preventDefault();
      evt.stopPropagation();
      $scope.doSearch();
    }
  };

  $scope.doSearch = function () {
    if (angular.isDefined($scope.search) && angular.isFunction($scope.search)) {
      $scope.search();
    }
  };

  this.render = function () {
    $scope.searchBox.query = ngModelCtrl.$modelValue;
  };
}]).directive('uixSearchBox', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/searchBox.html',
    replace: true,
    require: ['uixSearchBox', '?ngModel'],
    scope: {
      btnText: '@?',
      showBtn: '=?',
      placeholder: '@?',
      search: '&?'
    },
    controller: 'uixSearchBoxCtrl',
    link: function link(scope, el, attrs, ctrls) {
      var searchBoxCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];
      searchBoxCtrl.init(ngModelCtrl);
    }
  };
});
"use strict";

/**
 * select
 * select directive fork from ui-select[https://github.com/angular-ui/ui-select]
 * Author: yjy972080142@gmail.com
 * Date:2016-03-29
 */
angular.module('ui.xg.select', []).constant('uixSelectConfig', {
  KEY: {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    HOME: 36,
    END: 35,
    BACKSPACE: 8,
    DELETE: 46,
    COMMAND: 91,
    MAP: {
      91: 'COMMAND',
      8: 'BACKSPACE',
      9: 'TAB',
      13: 'ENTER',
      16: 'SHIFT',
      17: 'CTRL',
      18: 'ALT',
      19: 'PAUSEBREAK',
      20: 'CAPSLOCK',
      27: 'ESC',
      32: 'SPACE',
      33: 'PAGE_UP',
      34: 'PAGE_DOWN',
      35: 'END',
      36: 'HOME',
      37: 'LEFT',
      38: 'UP',
      39: 'RIGHT',
      40: 'DOWN',
      43: '+',
      44: 'PRINTSCREEN',
      45: 'INSERT',
      46: 'DELETE',
      48: '0',
      49: '1',
      50: '2',
      51: '3',
      52: '4',
      53: '5',
      54: '6',
      55: '7',
      56: '8',
      57: '9',
      59: ';',
      61: '=',
      65: 'A',
      66: 'B',
      67: 'C',
      68: 'D',
      69: 'E',
      70: 'F',
      71: 'G',
      72: 'H',
      73: 'I',
      74: 'J',
      75: 'K',
      76: 'L',
      77: 'M',
      78: 'N',
      79: 'O',
      80: 'P',
      81: 'Q',
      82: 'R',
      83: 'S',
      84: 'T',
      85: 'U',
      86: 'V',
      87: 'W',
      88: 'X',
      89: 'Y',
      90: 'Z',
      96: '0',
      97: '1',
      98: '2',
      99: '3',
      100: '4',
      101: '5',
      102: '6',
      103: '7',
      104: '8',
      105: '9',
      106: '*',
      107: '+',
      109: '-',
      110: '.',
      111: '/',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NUMLOCK',
      145: 'SCROLLLOCK',
      186: ';',
      187: '=',
      188: ',',
      189: '-',
      190: '.',
      191: '/',
      192: '`',
      219: '[',
      220: '\\',
      221: ']',
      222: '\''
    },
    isControl: function isControl(evt) {
      var k = evt.which;

      switch (k) {
        case this.COMMAND:
        case this.SHIFT:
        case this.CTRL:
        case this.ALT:
          return true;
      }

      return evt.metaKey;
    },
    isFunctionKey: function isFunctionKey(k) {
      k = k.which ? k.which : k;
      return k >= 112 && k <= 123;
    },
    isVerticalMovement: function isVerticalMovement(k) {
      return [this.UP, this.DOWN].indexOf(k) !== -1;
    },
    isHorizontalMovement: function isHorizontalMovement(k) {
      return [this.LEFT, this.RIGHT, this.BACKSPACE, this.DELETE].indexOf(k) !== -1;
    }
  },
  searchEnabled: true,
  sortable: false,
  placeholder: '',
  // Empty by default, like HTML tag <select>
  refreshDelay: 1000,
  // In milliseconds
  closeOnSelect: true,
  appendToBody: false
}) // 当指令传递参数等发生错误时抛出异常
.service('uixSelectMinErr', function () {
  var minErr = angular.$$minErr('ui.xg.select');
  return function () {
    var error = minErr.apply(this, arguments);
    var str = '\n?http://errors.angularjs.org/.*';
    var message = error.message.replace(new RegExp(str), '').trim();
    return new Error(message);
  };
}) // 添加DOM节点到指定内
.directive('uixTranscludeAppend', function () {
  return {
    link: function link(scope, element, attrs, ctrl, transclude) {
      transclude(scope, function (clone) {
        element.append(clone);
      });
    }
  };
}) // 高亮文本过滤器
.filter('highlight', function () {
  function escapeRegexp(queryToEscape) {
    return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
  }

  return function (matchItem, query) {
    return query && matchItem ? matchItem.replace(new RegExp(escapeRegexp(query), 'gi'), '<span class="uix-select-highlight">$&</span>') : matchItem;
  };
}) // 位置偏移
.factory('uixSelectOffset', ['$document', '$window', function ($document, $window) {
  return function (element) {
    var elem = element[0] || element;
    var elemBCR = elem.getBoundingClientRect();
    return {
      width: Math.round(angular.isNumber(elemBCR.width) ? elemBCR.width : elem.offsetWidth),
      height: Math.round(angular.isNumber(elemBCR.height) ? elemBCR.height : elem.offsetHeight),
      top: Math.round(elemBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)),
      left: Math.round(elemBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft))
    };
  };
}]).controller('uixSelectCtrl', ['$scope', '$element', '$timeout', '$filter', 'uixSelectRepeatParser', 'uixSelectMinErr', 'uixSelectConfig', function ($scope, $element, $timeout, $filter, RepeatParser, uixSelectMinErr, uixSelectConfig) {
  var KEY = uixSelectConfig.KEY;
  var ctrl = this;
  var EMPTY_SEARCH = '';
  ctrl.placeholder = uixSelectConfig.placeholder;
  ctrl.searchEnabled = uixSelectConfig.searchEnabled;
  ctrl.sortable = uixSelectConfig.sortable;
  ctrl.refreshDelay = uixSelectConfig.refreshDelay;
  ctrl.removeSelected = false; //If selected item(s) should be removed from dropdown list

  ctrl.closeOnSelect = true; //Initialized inside uixSelect directive link function

  ctrl.search = EMPTY_SEARCH;
  ctrl.activeIndex = 0; //Dropdown of choices

  ctrl.items = []; //All available choices

  ctrl.open = false;
  ctrl.focus = false;
  ctrl.disabled = false;
  ctrl.selected = null;
  ctrl.focusser = null; //Reference to input element used to handle focus events

  ctrl.resetSearchInput = true;
  ctrl.multiple = null; // Initialized inside uixSelect directive link function

  ctrl.disableChoiceExpression = null; // Initialized inside uixSelectChoices directive link function

  ctrl.tagging = {
    isActivated: false,
    fct: null
  };
  ctrl.taggingTokens = {
    isActivated: false,
    tokens: null
  };
  ctrl.lockChoiceExpression = null; // Initialized inside uixSelectMatch directive link function

  ctrl.clickTriggeredSelect = false;
  ctrl.$filter = $filter;
  ctrl.searchInput = angular.element($element[0].querySelectorAll('input.uix-select-search'));

  if (ctrl.searchInput.length !== 1) {
    throw uixSelectMinErr('searchInput', 'Expected 1 input.uix-select-search but got \'{0}\'.', ctrl.searchInput.length);
  }

  ctrl.isEmpty = function () {
    return angular.isUndefined(ctrl.selected) || ctrl.selected === null || ctrl.selected === '';
  }; // Most of the time the user does not want to empty the search input when in typeahead mode


  function _resetSearchInput() {
    if (ctrl.resetSearchInput || angular.isUndefined(ctrl.resetSearchInput) && uixSelectConfig.resetSearchInput) {
      ctrl.search = EMPTY_SEARCH; //reset activeIndex

      if (ctrl.selected && ctrl.items.length && !ctrl.multiple) {
        ctrl.activeIndex = ctrl.items.indexOf(ctrl.selected);
      }
    }
  }

  function _groupsFilter(groups, groupNames) {
    var i,
        j,
        result = [];

    for (i = 0; i < groupNames.length; i++) {
      for (j = 0; j < groups.length; j++) {
        if (groups[j].name === groupNames[i]) {
          result.push(groups[j]);
        }
      }
    }

    return result;
  } // When the user clicks on uix-select, displays the dropdown list


  ctrl.activate = function (initSearchValue, avoidReset) {
    if (!ctrl.disabled && !ctrl.open) {
      if (!avoidReset) {
        _resetSearchInput();
      }

      $scope.$broadcast('uixSelect:activate');
      ctrl.open = true;
      ctrl.activeIndex = ctrl.activeIndex >= ctrl.items.length ? 0 : ctrl.activeIndex; // ensure that the index is set to zero for tagging variants
      // that where first option is auto-selected

      if (ctrl.activeIndex === -1 && ctrl.taggingLabel !== false) {
        ctrl.activeIndex = 0;
      } // Give it time to appear before focus


      $timeout(function () {
        ctrl.search = initSearchValue || ctrl.search;
        ctrl.searchInput[0].focus();
      });
    }
  };

  ctrl.findGroupByName = function (name) {
    return ctrl.groups && ctrl.groups.filter(function (group) {
      return group.name === name;
    })[0];
  };

  ctrl.parseRepeatAttr = function (repeatAttr, groupByExp, groupFilterExp) {
    function updateGroups(items) {
      var groupFn = $scope.$eval(groupByExp);
      ctrl.groups = [];
      angular.forEach(items, function (item) {
        var groupName = angular.isFunction(groupFn) ? groupFn(item) : item[groupFn];
        var group = ctrl.findGroupByName(groupName);

        if (group) {
          group.items.push(item);
        } else {
          ctrl.groups.push({
            name: groupName,
            items: [item]
          });
        }
      });

      if (groupFilterExp) {
        var groupFilterFn = $scope.$eval(groupFilterExp);

        if (angular.isFunction(groupFilterFn)) {
          ctrl.groups = groupFilterFn(ctrl.groups);
        } else if (angular.isArray(groupFilterFn)) {
          ctrl.groups = _groupsFilter(ctrl.groups, groupFilterFn);
        }
      }

      ctrl.items = [];
      ctrl.groups.forEach(function (group) {
        ctrl.items = ctrl.items.concat(group.items);
      });
    }

    function setPlainItems(items) {
      ctrl.items = items;
    }

    ctrl.setItemsFn = groupByExp ? updateGroups : setPlainItems;
    ctrl.parserResult = RepeatParser.parse(repeatAttr);
    ctrl.isGrouped = !!groupByExp;
    ctrl.itemProperty = ctrl.parserResult.itemName;

    ctrl.refreshItems = function (data) {
      $scope.calculateDropdownPos();
      data = data || ctrl.parserResult.source($scope);
      var selectedItems = ctrl.selected; //TODO should implement for single mode removeSelected

      if (angular.isArray(selectedItems) && !selectedItems.length || !ctrl.removeSelected) {
        ctrl.setItemsFn(data);
      } else {
        if (angular.isDefined(data) && data !== null) {
          var filteredItems = data.filter(function (i) {
            return selectedItems.indexOf(i) < 0;
          });
          ctrl.setItemsFn(filteredItems);
        }
      }
    }; // See https://github.com/angular/angular.js/blob/v1.2.15/src/ng/directive/ngRepeat.js#L259


    $scope.$watchCollection(ctrl.parserResult.source, function (items) {
      if (angular.isUndefined(items) || items === null) {
        // If the user specifies undefined or null => reset the collection
        // Special case: items can be undefined if the user did not initialized
        // i.e $scope.addresses = [] is missing
        ctrl.items = [];
      } else {
        if (!angular.isArray(items)) {
          throw uixSelectMinErr('items', 'Expected an array but got \'{0}\'.', items);
        } else {
          //Remove already selected items (ex: while searching)
          //TODO Should add a test
          ctrl.refreshItems(items); //Force scope model value and ngModel value to be out of sync to re-run formatters

          ctrl.ngModel.$modelValue = null;
        }
      }
    });
  };

  var _refreshDelayPromise;
  /**
   * Typeahead mode: lets the user refresh the collection using his own function.
   *
   * See Expose $select.search for external / remote filtering
   * https://github.com/angular-ui/ui-select/pull/31
   */


  ctrl.refresh = function (refreshAttr) {
    if (angular.isDefined(refreshAttr)) {
      // Debounce
      // See https://github.com/angular-ui/bootstrap/blob/0.10.0/src/typeahead/typeahead.js#L155
      // FYI AngularStrap typeahead does not have debouncing:
      // https://github.com/mgcrea/angular-strap/blob/v2.0.0-rc.4/src/typeahead/typeahead.js#L177
      if (_refreshDelayPromise) {
        $timeout.cancel(_refreshDelayPromise);
      }

      _refreshDelayPromise = $timeout(function () {
        $scope.$eval(refreshAttr);
      }, ctrl.refreshDelay);
    }
  };

  ctrl.setActiveItem = function (item) {
    ctrl.activeIndex = ctrl.items.indexOf(item);
  };

  ctrl.isActive = function (itemScope) {
    if (!ctrl.open) {
      return false;
    }

    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isActive = itemIndex === ctrl.activeIndex;

    if (!isActive || itemIndex < 0 && ctrl.taggingLabel !== false || itemIndex < 0 && ctrl.taggingLabel === false) {
      return false;
    }

    if (isActive && angular.isDefined(ctrl.onHighlightCallback)) {
      itemScope.$eval(ctrl.onHighlightCallback);
    }

    return isActive;
  };

  ctrl.isDisabled = function (itemScope) {
    if (!ctrl.open) {
      return;
    }

    var itemIndex = ctrl.items.indexOf(itemScope[ctrl.itemProperty]);
    var isDisabled = false;
    var item;

    if (itemIndex >= 0 && angular.isDefined(ctrl.disableChoiceExpression)) {
      item = ctrl.items[itemIndex];
      isDisabled = !!itemScope.$eval(ctrl.disableChoiceExpression); // force the boolean value

      item._uixSelectChoiceDisabled = isDisabled; // store this for later reference
    }

    return isDisabled;
  }; // When the user selects an item with ENTER or clicks the dropdown


  ctrl.select = function (item, skipFocusser, $event) {
    if (angular.isUndefined(item) || !item._uixSelectChoiceDisabled) {
      if (!ctrl.items && !ctrl.search) {
        return;
      }

      if (!item || !item._uixSelectChoiceDisabled) {
        if (ctrl.tagging.isActivated) {
          // if taggingLabel is disabled, we pull from ctrl.search val
          if (ctrl.taggingLabel === false) {
            if (ctrl.activeIndex < 0) {
              item = ctrl.tagging.fct === null ? ctrl.search : ctrl.tagging.fct(ctrl.search);

              if (!item || angular.equals(ctrl.items[0], item)) {
                return;
              }
            } else {
              // keyboard nav happened first, user selected from dropdown
              item = ctrl.items[ctrl.activeIndex];
            }
          } else {
            // tagging always operates at index zero, taggingLabel === false pushes
            // the ctrl.search value without having it injected
            if (ctrl.activeIndex === 0) {
              // ctrl.tagging pushes items to ctrl.items, so we only have empty val
              // for `item` if it is a detected duplicate
              if (angular.isUndefined(item)) {
                return;
              } // create new item on the fly if we don't already have one;
              // use tagging function if we have one


              if (angular.isDefined(ctrl.tagging.fct) && ctrl.tagging.fct !== null && angular.isString(item)) {
                item = ctrl.tagging.fct(ctrl.search);

                if (!item) {
                  return;
                } // if item type is 'string', apply the tagging label

              } else if (angular.isString(item)) {
                // trim the trailing space
                item = item.replace(ctrl.taggingLabel, '').trim();
              }
            }
          } // search ctrl.selected for dupes potentially caused by tagging and return early if found


          if (ctrl.selected && angular.isArray(ctrl.selected)) {
            var len = ctrl.selected.filter(function (selection) {
              return angular.equals(selection, item);
            }).length;

            if (len > 0) {
              ctrl.close(skipFocusser);
              return;
            }
          }
        }

        $scope.$broadcast('uixSelect:select', item);
        var locals = {};
        locals[ctrl.parserResult.itemName] = item;
        $timeout(function () {
          ctrl.onSelectCallback($scope, {
            $item: item,
            $model: ctrl.parserResult.modelMapper($scope, locals)
          });
        });

        if (ctrl.closeOnSelect) {
          ctrl.close(skipFocusser);
        }

        if ($event && $event.type === 'click') {
          ctrl.clickTriggeredSelect = true;
        }
      }
    }
  }; // Closes the dropdown


  ctrl.close = function (skipFocusser) {
    if (!ctrl.open) {
      return;
    }

    if (ctrl.ngModel && ctrl.ngModel.$setTouched) {
      ctrl.ngModel.$setTouched();
    }

    _resetSearchInput();

    ctrl.open = false;
    $scope.$broadcast('uixSelect:close', skipFocusser);
  };

  ctrl.setFocus = function () {
    if (!ctrl.focus) {
      ctrl.focusInput[0].focus();
    }
  };

  ctrl.clear = function ($event) {
    ctrl.select();
    $event.stopPropagation();
    $timeout(function () {
      ctrl.focusser[0].focus();
    }, 0, false);
  }; // Toggle dropdown


  ctrl.toggle = function (evt) {
    if (ctrl.open) {
      ctrl.close();
      evt.preventDefault();
      evt.stopPropagation();
    } else {
      ctrl.activate();
    }
  };

  ctrl.isLocked = function (itemScope, itemIndex) {
    var isLocked,
        item = ctrl.selected[itemIndex];

    if (item && angular.isDefined(ctrl.lockChoiceExpression)) {
      isLocked = !!itemScope.$eval(ctrl.lockChoiceExpression); // force the boolean value

      item._uixSelectChoiceLocked = isLocked; // store this for later reference
    }

    return isLocked;
  };

  var sizeWatch = null;

  ctrl.sizeSearchInput = function () {
    var input = ctrl.searchInput[0],
        container = ctrl.searchInput.parent().parent()[0],
        calculateContainerWidth = function calculateContainerWidth() {
      // Return the container width only if the search input is visible
      return container.clientWidth * !!input.offsetParent;
    },
        updateIfVisible = function updateIfVisible(containerWidth) {
      if (containerWidth === 0) {
        return false;
      }

      var inputWidth = containerWidth - input.offsetLeft - 10;

      if (inputWidth < 50) {
        inputWidth = containerWidth;
      }

      ctrl.searchInput.css('width', inputWidth + 'px');
      return true;
    };

    ctrl.searchInput.css('width', '10px');
    $timeout(function () {
      //Give tags time to render correctly
      if (sizeWatch === null && !updateIfVisible(calculateContainerWidth())) {
        sizeWatch = $scope.$watch(calculateContainerWidth, function (containerWidth) {
          if (updateIfVisible(containerWidth)) {
            sizeWatch();
            sizeWatch = null;
          }
        });
      }
    });
  };

  function _handleDropDownSelection(key) {
    var processed = true;

    switch (key) {
      case KEY.DOWN:
        if (!ctrl.open && ctrl.multiple) {
          ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        } else if (ctrl.activeIndex < ctrl.items.length - 1) {
          ctrl.activeIndex++;
        }

        break;

      case KEY.UP:
        if (!ctrl.open && ctrl.multiple) {
          ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        } else if (ctrl.activeIndex > 0 || ctrl.search.length === 0 && ctrl.tagging.isActivated && ctrl.activeIndex > -1) {
          ctrl.activeIndex--;
        }

        break;

      case KEY.TAB:
        if (!ctrl.multiple || ctrl.open) {
          ctrl.select(ctrl.items[ctrl.activeIndex], true);
        }

        break;

      case KEY.ENTER:
        if (ctrl.open && (ctrl.tagging.isActivated || ctrl.activeIndex >= 0)) {
          // Make sure at least one dropdown item is highlighted before adding if not in tagging mode
          ctrl.select(ctrl.items[ctrl.activeIndex]);
        } else {
          ctrl.activate(false, true); //In case its the search input in 'multiple' mode
        }

        break;

      case KEY.ESC:
        ctrl.close();
        break;

      default:
        processed = false;
    }

    return processed;
  } // Bind to keyboard shortcuts


  ctrl.searchInput.on('keydown', function (evt) {
    var key = evt.which; // if(~[KEY.ESC,KEY.TAB].indexOf(key)){
    //   //TODO: SEGURO?
    //   ctrl.close();
    // }

    $scope.$apply(function () {
      var tagged = false;

      if (ctrl.items.length > 0 || ctrl.tagging.isActivated) {
        _handleDropDownSelection(key);

        if (ctrl.taggingTokens.isActivated) {
          for (var i = 0; i < ctrl.taggingTokens.tokens.length; i++) {
            if (ctrl.taggingTokens.tokens[i] === KEY.MAP[evt.keyCode]) {
              // make sure there is a new value to push via tagging
              if (ctrl.search.length > 0) {
                tagged = true;
              }
            }
          }

          if (tagged) {
            $timeout(function () {
              ctrl.searchInput.triggerHandler('tagged');
              var newItem = ctrl.search.replace(KEY.MAP[evt.keyCode], '').trim();

              if (ctrl.tagging.fct) {
                newItem = ctrl.tagging.fct(newItem);
              }

              if (newItem) {
                ctrl.select(newItem, true);
              }
            });
          }
        }
      }
    });

    if (KEY.isVerticalMovement(key) && ctrl.items.length > 0) {
      _ensureHighlightVisible();
    }

    if (key === KEY.ENTER || key === KEY.ESC) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  }); // If tagging try to split by tokens and add items

  ctrl.searchInput.on('paste', function (evt) {
    var data = evt.originalEvent.clipboardData.getData('text/plain');

    if (data && data.length > 0 && ctrl.taggingTokens.isActivated && ctrl.tagging.fct) {
      var items = data.split(ctrl.taggingTokens.tokens[0]); // split by first token only

      if (items && items.length > 0) {
        angular.forEach(items, function (item) {
          var newItem = ctrl.tagging.fct(item);

          if (newItem) {
            ctrl.select(newItem, true);
          }
        });
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
  });
  ctrl.searchInput.on('tagged', function () {
    $timeout(function () {
      _resetSearchInput();
    });
  }); // See https://github.com/ivaynberg/select2/blob/3.4.6/select2.js#L1431

  function _ensureHighlightVisible() {
    var container = angular.element($element[0].querySelectorAll('.uix-select-choices-content'));
    var choices = angular.element(container[0].querySelectorAll('.uix-select-choices-row'));

    if (choices.length < 1) {
      throw uixSelectMinErr('choices', 'Expected multiple .uix-select-choices-row but got \'{0}\'.', choices.length);
    }

    if (ctrl.activeIndex < 0) {
      return;
    }

    var highlighted = choices[ctrl.activeIndex];
    var posY = highlighted.offsetTop + highlighted.clientHeight - container[0].scrollTop;
    var height = container[0].offsetHeight;

    if (posY > height) {
      container[0].scrollTop += posY - height;
    } else if (posY < highlighted.clientHeight) {
      if (ctrl.isGrouped && ctrl.activeIndex === 0) {
        container[0].scrollTop = 0; //To make group header visible when going all the way up
      } else {
        container[0].scrollTop -= highlighted.clientHeight - posY;
      }
    }
  }

  $scope.$on('$destroy', function () {
    ctrl.searchInput.off('keyup keydown tagged blur paste');
  });
}]).directive('uixSelect', ['$document', 'uixSelectConfig', 'uixSelectMinErr', 'uixSelectOffset', '$parse', '$timeout', function ($document, uixSelectConfig, uixSelectMinErr, uixSelectOffset, $parse, $timeout) {
  return {
    restrict: 'EA',
    templateUrl: function templateUrl(tElement, tAttrs) {
      return angular.isDefined(tAttrs.multiple) ? 'templates/select-multiple.html' : 'templates/select.html';
    },
    replace: true,
    transclude: true,
    require: ['uixSelect', '^ngModel'],
    scope: true,
    controller: 'uixSelectCtrl',
    controllerAs: '$select',
    compile: function compile(tElement, tAttrs) {
      //Multiple or Single depending if multiple attribute presence
      if (angular.isDefined(tAttrs.multiple)) {
        tElement.append('<uix-select-multiple/>').removeAttr('multiple');
      } else {
        tElement.append('<uix-select-single/>');
      }

      return function (scope, element, attrs, ctrls, transcludeFn) {
        var $select = ctrls[0];
        var ngModel = ctrls[1];
        $select.baseTitle = attrs.title || 'Select box';
        $select.focusserTitle = $select.baseTitle + ' focus';

        $select.closeOnSelect = function () {
          if (angular.isDefined(attrs.closeOnSelect)) {
            return $parse(attrs.closeOnSelect)();
          } else {
            return uixSelectConfig.closeOnSelect;
          }
        }();

        $select.onSelectCallback = $parse(attrs.onSelect);
        $select.onRemoveCallback = $parse(attrs.onRemove); //Set reference to ngModel from uixSelectCtrl

        $select.ngModel = ngModel;

        $select.choiceGrouped = function (group) {
          return $select.isGrouped && group && group.name;
        };

        if (attrs.tabindex) {
          attrs.$observe('tabindex', function (value) {
            $select.focusInput.attr('tabindex', value);
            element.removeAttr('tabindex');
          });
        }

        scope.$watch('searchEnabled', function () {
          var searchEnabled = scope.$eval(attrs.searchEnabled);
          $select.searchEnabled = angular.isDefined(searchEnabled) ? searchEnabled : uixSelectConfig.searchEnabled;
        });
        scope.$watch('sortable', function () {
          var sortable = scope.$eval(attrs.sortable);
          $select.sortable = angular.isDefined(sortable) ? sortable : uixSelectConfig.sortable;
        });
        attrs.$observe('disabled', function () {
          // No need to use $eval() (thanks to ng-disabled) since we already get a boolean instead of a string
          $select.disabled = angular.isDefined(attrs.disabled) ? attrs.disabled : false;
        });
        attrs.$observe('resetSearchInput', function () {
          // $eval() is needed otherwise we get a string instead of a boolean
          var resetSearchInput = scope.$eval(attrs.resetSearchInput);
          $select.resetSearchInput = angular.isDefined(resetSearchInput) ? resetSearchInput : true;
        });
        attrs.$observe('tagging', function () {
          if (angular.isDefined(attrs.tagging)) {
            // $eval() is needed otherwise we get a string instead of a boolean
            var taggingEval = scope.$eval(attrs.tagging);
            $select.tagging = {
              isActivated: true,
              fct: taggingEval !== true ? taggingEval : null
            };
          } else {
            $select.tagging = {
              isActivated: false
            };
          }
        });
        attrs.$observe('taggingLabel', function () {
          if (angular.isDefined(attrs.tagging)) {
            // check eval for FALSE, in this case, we disable the labels
            // associated with tagging
            if (attrs.taggingLabel === 'false') {
              $select.taggingLabel = false;
            } else {
              $select.taggingLabel = angular.isDefined(attrs.taggingLabel) ? attrs.taggingLabel : '(new)';
            }
          }
        });
        attrs.$observe('taggingTokens', function () {
          if (angular.isDefined(attrs.tagging)) {
            var tokens = angular.isDefined(attrs.taggingTokens) ? attrs.taggingTokens.split('|') : [',', 'ENTER'];
            $select.taggingTokens = {
              isActivated: true,
              tokens: tokens
            };
          }
        }); //Automatically gets focus when loaded

        if (angular.isDefined(attrs.autofocus)) {
          $timeout(function () {
            $select.setFocus();
          });
        } //Gets focus based on scope event name (e.g. focus-on='SomeEventName')


        if (angular.isDefined(attrs.focusOn)) {
          scope.$on(attrs.focusOn, function () {
            $timeout(function () {
              $select.setFocus();
            });
          });
        }

        function onDocumentClick(evt) {
          if (!$select.open) {
            return; //Skip it if dropdown is close
          }

          var contains = false;

          if (angular.element.contains) {
            // Firefox 3.6 does not support element.contains()
            // See Node.contains https://developer.mozilla.org/en-US/docs/Web/API/Node.contains
            contains = angular.element.contains(element[0], evt.target);
          } else {
            contains = element[0].contains(evt.target);
          }

          if (!contains && !$select.clickTriggeredSelect) {
            //Will lose focus only with certain targets
            var focusableControls = ['input', 'button', 'textarea']; //To check if target is other uix-select

            var targetScope = angular.element(evt.target).scope(); //To check if target is other uix-select

            var skipFocusser = targetScope && targetScope.$select && targetScope.$select !== $select;

            if (!skipFocusser) {
              //Check if target is input, button or textarea
              var tagName = evt.target.tagName ? evt.target.tagName.toLowerCase() : '';
              skipFocusser = focusableControls.indexOf(tagName) !== -1;
            }

            $select.close(skipFocusser);
            scope.$digest();
          }

          $select.clickTriggeredSelect = false;
        } // See Click everywhere but here event http://stackoverflow.com/questions/12931369


        $document.on('click', onDocumentClick);
        scope.$on('$destroy', function () {
          $document.off('click', onDocumentClick);
        }); // Move transcluded elements to their correct position in main template

        transcludeFn(scope, function (clone) {
          // One day jqLite will be replaced by jQuery and we will be able to write:
          // var transcludedElement = clone.filter('.my-class')
          // instead of creating a hackish DOM element:
          var transcluded = angular.element('<div>').append(clone);
          var transcludedMatch = angular.element(transcluded[0].querySelectorAll('.uix-select-match'));
          transcludedMatch.removeAttr('uix-select-match'); //To avoid loop in case directive as attr

          transcludedMatch.removeAttr('data-uix-select-match'); // Properly handle HTML5 data-attributes

          if (transcludedMatch.length !== 1) {
            throw uixSelectMinErr('transcluded', 'Expected 1 .uix-select-match but got \'{0}\'.', transcludedMatch.length);
          }

          angular.element(element[0].querySelectorAll('.uix-select-match')).replaceWith(transcludedMatch);
          var transcludedChoices = angular.element(transcluded[0].querySelectorAll('.uix-select-choices'));
          transcludedChoices.removeAttr('uix-select-choices'); //To avoid loop in case directive as attr

          transcludedChoices.removeAttr('data-uix-select-choices'); // Properly handle HTML5 data-attributes

          if (transcludedChoices.length !== 1) {
            throw uixSelectMinErr('transcluded', 'Expected 1 .uix-select-choices but got \'{0}\'.', transcludedChoices.length);
          }

          angular.element(element[0].querySelectorAll('.uix-select-choices')).replaceWith(transcludedChoices);
        }); // Support for appending the select field to the body when its open

        var appendToBody = scope.$eval(attrs.appendToBody);

        if (angular.isDefined(appendToBody) ? appendToBody : uixSelectConfig.appendToBody) {
          scope.$watch('$select.open', function (isOpen) {
            if (isOpen) {
              positionDropdown();
            } else {
              resetDropdown();
            }
          }); // Move the dropdown back to its original location when the scope is destroyed. Otherwise
          // it might stick around when the user routes away or the select field is otherwise removed

          scope.$on('$destroy', function () {
            resetDropdown();
          });
        } // Hold on to a reference to the .uix-select-container element for appendToBody support


        var placeholder = null,
            originalWidth = '';

        function positionDropdown() {
          // Remember the absolute position of the element
          var offset = uixSelectOffset(element); // Clone the element into a placeholder element to take its original place in the DOM

          placeholder = angular.element('<div class="uix-select-placeholder"></div>');
          placeholder[0].style.width = offset.width + 'px';
          placeholder[0].style.height = offset.height + 'px';
          element.after(placeholder); // Remember the original value of the element width inline style, so it can be restored
          // when the dropdown is closed

          originalWidth = element[0].style.width; // Now move the actual dropdown element to the end of the body

          $document.find('body').append(element);
          element[0].style.position = 'absolute';
          element[0].style.left = offset.left + 'px';
          element[0].style.top = offset.top + 'px';
          element[0].style.width = offset.width + 'px';
        }

        function resetDropdown() {
          if (placeholder === null) {
            // The dropdown has not actually been display yet, so there's nothing to reset
            return;
          } // Move the dropdown element back to its original location in the DOM


          placeholder.replaceWith(element);
          placeholder = null;
          element[0].style.position = '';
          element[0].style.left = '';
          element[0].style.top = '';
          element[0].style.width = originalWidth;
        } // Hold on to a reference to the .uix-select-dropdown element for direction support.


        var dropdown = null,
            directionUpClassName = 'direction-up'; // Support changing the direction of the dropdown if there isn't enough space to render it.

        scope.$watch('$select.open', function () {
          scope.calculateDropdownPos();
        });

        scope.calculateDropdownPos = function () {
          if ($select.open) {
            dropdown = angular.element(element[0].querySelectorAll('.uix-select-dropdown'));

            if (dropdown === null) {
              return;
            } // Hide the dropdown so there is no flicker until $timeout is done executing.


            dropdown[0].style.opacity = 0; // Delay positioning the dropdown until all choices have been added so its height is correct.

            $timeout(function () {
              element.removeClass(directionUpClassName);
              var offset = uixSelectOffset(element);
              var offsetDropdown = uixSelectOffset(dropdown);
              var scrollTop = $document[0].documentElement.scrollTop || $document[0].body.scrollTop; // Determine if the direction of the dropdown needs to be changed.

              if (offset.top + offset.height + offsetDropdown.height > scrollTop + $document[0].documentElement.clientHeight) {
                dropdown[0].style.position = 'absolute';
                dropdown[0].style.top = offsetDropdown.height * -1 + 'px';
                element.addClass(directionUpClassName);
              } else {
                //Go DOWN
                dropdown[0].style.position = '';
                dropdown[0].style.top = '';
              } // Display the dropdown once it has been positioned.


              dropdown[0].style.opacity = 1;
            });
          } else {
            if (dropdown === null) {
              return;
            } // Reset the position of the dropdown.


            dropdown[0].style.position = '';
            dropdown[0].style.top = '';
            element.removeClass(directionUpClassName);
          }
        };
      };
    }
  };
}]).directive('uixSelectChoices', ['uixSelectConfig', 'uixSelectRepeatParser', 'uixSelectMinErr', '$compile', function (uixSelectConfig, RepeatParser, uixSelectMinErr, $compile) {
  return {
    restrict: 'EA',
    require: '^uixSelect',
    replace: true,
    transclude: true,
    templateUrl: 'templates/choices.html',
    compile: function compile(tElement, tAttrs) {
      if (!tAttrs.repeat) {
        throw uixSelectMinErr('repeat', 'Expected \'repeat\' expression.');
      }

      return function link(scope, element, attrs, $select, transcludeFn) {
        // var repeat = RepeatParser.parse(attrs.repeat);
        var groupByExp = attrs.groupBy;
        var groupFilterExp = attrs.groupFilter;
        $select.parseRepeatAttr(attrs.repeat, groupByExp, groupFilterExp); //Result ready at $select.parserResult

        $select.disableChoiceExpression = attrs.disableChoice;
        $select.onHighlightCallback = attrs.onHighlight;

        if (groupByExp) {
          var groups = angular.element(element[0].querySelectorAll('.uix-select-choices-group'));

          if (groups.length !== 1) {
            throw uixSelectMinErr('rows', 'Expected 1 .uix-select-choices-group but got \'{0}\'.', groups.length);
          }

          groups.attr('ng-repeat', RepeatParser.getGroupNgRepeatExpression());
        }

        var choices = angular.element(element[0].querySelectorAll('.uix-select-choices-row'));

        if (choices.length !== 1) {
          throw uixSelectMinErr('rows', 'Expected 1 .uix-select-choices-row but got \'{0}\'.', choices.length);
        }

        choices.attr('ng-repeat', RepeatParser.getNgRepeatExpression($select.parserResult.itemName, '$select.items', $select.parserResult.trackByExp, groupByExp)).attr('ng-if', '$select.open') //Prevent unnecessary watches when dropdown is closed
        .attr('ng-mouseenter', '$select.setActiveItem(' + $select.parserResult.itemName + ')').attr('ng-click', '$select.select(' + $select.parserResult.itemName + ',false,$event)');
        var rowsInner = angular.element(element[0].querySelectorAll('.uix-select-choices-row-inner'));

        if (rowsInner.length !== 1) {
          throw uixSelectMinErr('rows', 'Expected 1 .uix-select-choices-row-inner but got \'{0}\'.', rowsInner.length);
        }

        rowsInner.attr('uix-transclude-append', ''); //Adding uixTranscludeAppend directive to row element after choices element has ngRepeat

        $compile(element, transcludeFn)(scope); //Passing current transcludeFn to be able to append elements correctly from uixTranscludeAppend

        scope.$watch('$select.search', function (newValue) {
          if (newValue && !$select.open && $select.multiple) {
            $select.activate(false, true);
          }

          $select.activeIndex = $select.tagging.isActivated ? -1 : 0;
          $select.refresh(attrs.refresh);
        });
        attrs.$observe('refreshDelay', function () {
          // $eval() is needed otherwise we get a string instead of a number
          var refreshDelay = scope.$eval(attrs.refreshDelay);
          $select.refreshDelay = angular.isDefined(refreshDelay) ? refreshDelay : uixSelectConfig.refreshDelay;
        });
      };
    }
  };
}]).directive('uixSelectMatch', ['uixSelectConfig', function (uixSelectConfig) {
  return {
    restrict: 'EA',
    require: '^uixSelect',
    replace: true,
    transclude: true,
    templateUrl: function templateUrl(tElement) {
      var multi = tElement.parent().attr('multiple');
      return multi ? 'templates/match-multiple.html' : 'templates/match.html';
    },
    link: function link(scope, element, attrs, $select) {
      $select.lockChoiceExpression = attrs.lockChoice;
      attrs.$observe('placeholder', function (placeholder) {
        $select.placeholder = angular.isDefined(placeholder) ? placeholder : uixSelectConfig.placeholder;
      });

      function setAllowClear(allow) {
        $select.allowClear = angular.isDefined(allow) ? allow === '' ? true : allow.toLowerCase() === 'true' : false;
      }

      attrs.$observe('allowClear', setAllowClear);
      setAllowClear(attrs.allowClear);

      if ($select.multiple) {
        $select.sizeSearchInput();
      }
    }
  };
}]).directive('uixSelectMultiple', ['uixSelectConfig', 'uixSelectMinErr', '$timeout', function (uixSelectConfig, uixSelectMinErr, $timeout) {
  return {
    restrict: 'EA',
    require: ['^uixSelect', '^ngModel'],
    controller: ['$scope', '$timeout', function ($scope, $timeout) {
      var ctrl = this,
          $select = $scope.$select,
          ngModel; //Wait for link fn to inject it

      $scope.$evalAsync(function () {
        ngModel = $scope.ngModel;
      });
      ctrl.activeMatchIndex = -1;

      ctrl.updateModel = function () {
        ngModel.$setViewValue(Date.now()); //Set timestamp as a unique string to force changes

        ctrl.refreshComponent();
      };

      ctrl.refreshComponent = function () {
        //Remove already selected items
        //e.g. When user clicks on a selection, the selected array changes and
        //the dropdown should remove that item
        $select.refreshItems();
        $select.sizeSearchInput();
      }; // Remove item from multiple select


      ctrl.removeChoice = function (index) {
        var removedChoice = $select.selected[index]; // if the choice is locked, can't remove it

        if (removedChoice._uixSelectChoiceLocked) {
          return;
        }

        var locals = {};
        locals[$select.parserResult.itemName] = removedChoice;
        $select.selected.splice(index, 1);
        ctrl.activeMatchIndex = -1;
        $select.sizeSearchInput(); // Give some time for scope propagation.

        $timeout(function () {
          $select.onRemoveCallback($scope, {
            $item: removedChoice,
            $model: $select.parserResult.modelMapper($scope, locals)
          });
        });
        ctrl.updateModel();
      };

      ctrl.getPlaceholder = function () {
        //Refactor single?
        if ($select.selected.length) {
          return;
        }

        return $select.placeholder;
      };
    }],
    controllerAs: '$selectMultiple',
    link: function link(scope, element, attrs, ctrls) {
      var $select = ctrls[0];
      var ngModel = scope.ngModel = ctrls[1];
      var $selectMultiple = scope.$selectMultiple;
      var KEY = uixSelectConfig.KEY; //$select.selected = raw selected objects (ignoring any property binding)

      $select.multiple = true;
      $select.removeSelected = true; //Input that will handle focus

      $select.focusInput = $select.searchInput; //From view --> model

      ngModel.$parsers.unshift(function () {
        var locals = {},
            result,
            resultMultiple = [];

        for (var j = $select.selected.length - 1; j >= 0; j--) {
          locals = {};
          locals[$select.parserResult.itemName] = $select.selected[j];
          result = $select.parserResult.modelMapper(scope, locals);
          resultMultiple.unshift(result);
        }

        return resultMultiple;
      }); // From model --> view

      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source(scope, {
          $select: {
            search: ''
          }
        }),
            //Overwrite $search
        locals = {},
            result;

        if (!data) {
          return inputValue;
        }

        var resultMultiple = [];

        function checkFnMultiple(list, value) {
          if (!list || !list.length) {
            return;
          }

          for (var index = list.length - 1; index >= 0; index--) {
            locals[$select.parserResult.itemName] = list[index];
            result = $select.parserResult.modelMapper(scope, locals);

            if ($select.parserResult.trackByExp) {
              var propsItemNameMatches = /(\w*)\./.exec($select.parserResult.trackByExp);
              var matches = /\.([^\s]+)/.exec($select.parserResult.trackByExp);

              if (propsItemNameMatches && propsItemNameMatches.length > 0 && propsItemNameMatches[1] === $select.parserResult.itemName) {
                if (matches && matches.length > 0 && result[matches[1]] === value[matches[1]]) {
                  resultMultiple.unshift(list[index]);
                  return true;
                }
              }
            }

            if (angular.equals(result, value)) {
              resultMultiple.unshift(list[index]);
              return true;
            }
          }

          return false;
        }

        if (!inputValue) {
          return resultMultiple; //If ngModel was undefined
        }

        for (var k = inputValue.length - 1; k >= 0; k--) {
          //Check model array of currently selected items
          if (!checkFnMultiple($select.selected, inputValue[k])) {
            //Check model array of all items available
            if (!checkFnMultiple(data, inputValue[k])) {
              //If not found on previous lists, just add it directly to resultMultiple
              resultMultiple.unshift(inputValue[k]);
            }
          }
        }

        return resultMultiple;
      }); //Watch for external model changes

      scope.$watchCollection(function () {
        return ngModel.$modelValue;
      }, function (newValue, oldValue) {
        if (oldValue !== newValue) {
          ngModel.$modelValue = null; //Force scope model value and ngModel value to be out of sync to re-run formatters

          $selectMultiple.refreshComponent();
        }
      });

      ngModel.$render = function () {
        // Make sure that model value is array
        if (!angular.isArray(ngModel.$viewValue)) {
          // Have tolerance for null or undefined values
          if (angular.isUndefined(ngModel.$viewValue) || ngModel.$viewValue === null) {
            $select.selected = [];
          } else {
            throw uixSelectMinErr('multiarr', 'Expected model value to be array but got \'{0}\'', ngModel.$viewValue);
          }
        }

        $select.selected = ngModel.$viewValue;
        scope.$evalAsync(); //To force $digest
      };

      scope.$on('uixSelect:select', function (event, item) {
        $select.selected.push(item);
        $selectMultiple.updateModel();
      });
      scope.$on('uixSelect:activate', function () {
        $selectMultiple.activeMatchIndex = -1;
      });
      scope.$watch('$select.disabled', function (newValue, oldValue) {
        // As the search input field may now become visible, it may be necessary to recompute its size
        if (oldValue && !newValue) {
          $select.sizeSearchInput();
        }
      });
      $select.searchInput.on('keydown', function (evt) {
        var key = evt.which;
        scope.$apply(function () {
          var processed = false; // var tagged = false; //Checkme

          if (KEY.isHorizontalMovement(key)) {
            processed = _handleMatchSelection(key);
          }

          if (processed && key !== KEY.TAB) {
            //TODO Check si el tab selecciona aun correctamente
            //Crear test
            evt.preventDefault();
            evt.stopPropagation();
          }
        });
      });

      function _getCaretPosition(el) {
        if (angular.isNumber(el.selectionStart)) {
          return el.selectionStart; // selectionStart is not supported in IE8 and we don't want hacky workarounds so we compromise
        } else {
          return el.value.length;
        }
      } // Handles selected options in "multiple" mode


      function _handleMatchSelection(key) {
        var caretPosition = _getCaretPosition($select.searchInput[0]),
            length = $select.selected.length,
            // none  = -1,
        first = 0,
            last = length - 1,
            curr = $selectMultiple.activeMatchIndex,
            next = $selectMultiple.activeMatchIndex + 1,
            prev = $selectMultiple.activeMatchIndex - 1,
            newIndex = curr;

        if (caretPosition > 0 || $select.search.length && key === KEY.RIGHT) {
          return false;
        }

        $select.close();

        function getNewActiveMatchIndex() {
          var res;

          switch (key) {
            case KEY.LEFT:
              // Select previous/first item
              if ($selectMultiple.activeMatchIndex !== -1) {
                res = prev;
              } else {
                // Select last item
                res = last;
              }

              break;

            case KEY.RIGHT:
              // Open drop-down
              if ($selectMultiple.activeMatchIndex === -1 || curr === last) {
                $select.activate();
                res = false;
              } else {
                // Select next/last item
                res = next;
              }

              break;

            case KEY.BACKSPACE:
              // Remove selected item and select previous/first
              if ($selectMultiple.activeMatchIndex !== -1) {
                $selectMultiple.removeChoice(curr);
                res = prev;
              } else {
                res = last; // Select last item
              }

              break;

            case KEY.DELETE:
              // Remove selected item and select next item
              if ($selectMultiple.activeMatchIndex !== -1) {
                $selectMultiple.removeChoice($selectMultiple.activeMatchIndex);
                res = curr;
              } else {
                res = false;
              }

          }

          return res;
        }

        newIndex = getNewActiveMatchIndex();

        if (!$select.selected.length || newIndex === false) {
          $selectMultiple.activeMatchIndex = -1;
        } else {
          $selectMultiple.activeMatchIndex = Math.min(last, Math.max(first, newIndex));
        }

        return true;
      }

      $select.searchInput.on('keyup', function (evt) {
        if (!KEY.isVerticalMovement(evt.which)) {
          scope.$evalAsync(function () {
            $select.activeIndex = $select.taggingLabel === false ? -1 : 0;
          });
        } // Push a "create new" item into array if there is a search string


        if ($select.tagging.isActivated && $select.search.length > 0) {
          // return early with these keys
          if (evt.which === KEY.TAB || KEY.isControl(evt) || KEY.isFunctionKey(evt) || evt.which === KEY.ESC || KEY.isVerticalMovement(evt.which)) {
            return;
          } // always reset the activeIndex to the first item when tagging


          $select.activeIndex = $select.taggingLabel === false ? -1 : 0; // taggingLabel === false bypasses all of this

          if ($select.taggingLabel === false) {
            return;
          }

          var items = angular.copy($select.items);
          var stashArr = angular.copy($select.items);
          var newItem;
          var item;
          var hasTag = false;
          var dupeIndex = -1;
          var tagItems;
          var tagItem; // case for object tagging via transform `$select.tagging.fct` function

          if ($select.tagging.fct !== null || angular.isDefined($select.tagging.fct)) {
            tagItems = $select.$filter('filter')(items, {
              'isTag': true
            });

            if (tagItems.length > 0) {
              tagItem = tagItems[0];
            } // remove the first element, if it has the `isTag` prop we generate a new one with each keyup, shaving the previous


            if (items.length > 0 && tagItem) {
              hasTag = true;
              items = items.slice(1, items.length);
              stashArr = stashArr.slice(1, stashArr.length);
            }

            newItem = $select.tagging.fct($select.search);
            newItem.isTag = true; // verify the the tag doesn't match the value of an existing item

            var len = stashArr.filter(function (origItem) {
              return angular.equals(origItem, $select.tagging.fct($select.search));
            }).length;

            if (len > 0) {
              return;
            }

            newItem.isTag = true; // handle newItem string and stripping dupes in tagging string context
          } else {
            // find any tagging items already in the $select.items array and store them
            tagItems = $select.$filter('filter')(items, function (item) {
              return item.match($select.taggingLabel);
            });

            if (tagItems.length > 0) {
              tagItem = tagItems[0];
            }

            item = items[0]; // remove existing tag item if found (should only ever be one tag item)

            if (item && items.length > 0 && tagItem) {
              hasTag = true;
              items = items.slice(1, items.length);
              stashArr = stashArr.slice(1, stashArr.length);
            }

            newItem = $select.search + ' ' + $select.taggingLabel;

            if (_findApproxDupe($select.selected, $select.search) > -1) {
              return;
            } // verify the the tag doesn't match the value of an existing item from
            // the searched data set or the items already selected


            if (_findCaseInsensitiveDupe(stashArr.concat($select.selected))) {
              // if there is a tag from prev iteration, strip it / queue the change
              // and return early
              if (hasTag) {
                items = stashArr;
                scope.$evalAsync(function () {
                  $select.activeIndex = 0;
                  $select.items = items;
                });
              }

              return;
            }

            if (_findCaseInsensitiveDupe(stashArr)) {
              // if there is a tag from prev iteration, strip it
              if (hasTag) {
                $select.items = stashArr.slice(1, stashArr.length);
              }

              return;
            }
          }

          if (hasTag) {
            dupeIndex = _findApproxDupe($select.selected, newItem);
          } // dupe found, shave the first item


          if (dupeIndex > -1) {
            items = items.slice(dupeIndex + 1, items.length - 1);
          } else {
            items = [];
            items.push(newItem);
            items = items.concat(stashArr);
          }

          scope.$evalAsync(function () {
            $select.activeIndex = 0;
            $select.items = items;
          });
        }
      });

      function _findCaseInsensitiveDupe(arr) {
        if (angular.isUndefined(arr) || arr === null || angular.isUndefined($select.search) || $select.search === null) {
          return false;
        }

        return arr.filter(function (origItem) {
          if (angular.isUndefined($select.search.toUpperCase()) || angular.isUndefined(origItem)) {
            return false;
          }

          return origItem.toUpperCase() === $select.search.toUpperCase();
        }).length > 0;
      }

      function _findApproxDupe(haystack, needle) {
        var dupeIndex = -1;

        if (angular.isArray(haystack)) {
          var tempArr = angular.copy(haystack);

          for (var i = 0; i < tempArr.length; i++) {
            // handle the simple string version of tagging
            // search the array for the match
            if (($select.tagging.fct === null || angular.isUndefined($select.tagging.fct)) && tempArr[i] + ' ' + $select.taggingLabel === needle) {
              dupeIndex = i; // handle the object tagging implementation
            } else {
              var mockObj = tempArr[i];
              mockObj.isTag = true;

              if (angular.equals(mockObj, needle)) {
                dupeIndex = i;
              }
            }
          }
        }

        return dupeIndex;
      }

      $select.searchInput.on('blur', function () {
        $timeout(function () {
          $selectMultiple.activeMatchIndex = -1;
        });
      });
    }
  };
}]).directive('uixSelectSingle', ['uixSelectConfig', '$timeout', '$compile', function (uixSelectConfig, $timeout, $compile) {
  return {
    restrict: 'EA',
    require: ['^uixSelect', '^ngModel'],
    link: function link(scope, element, attrs, ctrls) {
      var KEY = uixSelectConfig.KEY;
      var $select = ctrls[0];
      var ngModel = ctrls[1]; //From view --> model

      ngModel.$parsers.unshift(function (inputValue) {
        var locals = {},
            result;
        locals[$select.parserResult.itemName] = inputValue;
        result = $select.parserResult.modelMapper(scope, locals);
        return result;
      }); //From model --> view

      ngModel.$formatters.unshift(function (inputValue) {
        var data = $select.parserResult.source(scope, {
          $select: {
            search: ''
          }
        }),
            //Overwrite $search
        locals = {},
            result;

        if (data) {
          var checkFnSingle = function checkFnSingle(d) {
            locals[$select.parserResult.itemName] = d;
            result = $select.parserResult.modelMapper(scope, locals);
            return result === inputValue;
          }; //If possible pass same object stored in $select.selected


          if ($select.selected && checkFnSingle($select.selected)) {
            return $select.selected;
          }

          for (var i = data.length - 1; i >= 0; i--) {
            if (checkFnSingle(data[i])) {
              return data[i];
            }
          }
        }

        return inputValue;
      }); //Update viewValue if model change

      scope.$watch('$select.selected', function (newValue) {
        if (ngModel.$viewValue !== newValue) {
          ngModel.$setViewValue(newValue);
        }
      });

      ngModel.$render = function () {
        $select.selected = ngModel.$viewValue;
      };

      scope.$on('uixSelect:select', function (event, item) {
        $select.selected = item;
      });
      scope.$on('uixSelect:close', function (event, skipFocusser) {
        $timeout(function () {
          $select.focusser.prop('disabled', false);

          if (!skipFocusser) {
            $select.focusser[0].focus();
          }
        }, 0, false);
      });
      var focusser = angular.element('<input ng-disabled=\'$select.disabled\' class=\'uix-select-focusser uix-select-offscreen\' ' + 'type=\'text\' aria-label=\'{{ $select.focusserTitle }}\' aria-haspopup=\'true\' ' + 'role=\'button\' />');
      scope.$on('uixSelect:activate', function () {
        focusser.prop('disabled', true); //Will reactivate it on .close()
      });
      $compile(focusser)(scope);
      $select.focusser = focusser; //Input that will handle focus

      $select.focusInput = focusser;
      element.parent().append(focusser);
      focusser.bind('focus', function () {
        scope.$evalAsync(function () {
          $select.focus = true;
        });
      });
      focusser.bind('blur', function () {
        scope.$evalAsync(function () {
          $select.focus = false;
        });
      });
      focusser.bind('keydown', function (evt) {
        if (evt.which === KEY.BACKSPACE) {
          evt.preventDefault();
          evt.stopPropagation();
          $select.select();
          scope.$apply();
          return;
        }

        if (evt.which === KEY.TAB || KEY.isControl(evt) || KEY.isFunctionKey(evt) || evt.which === KEY.ESC) {
          return;
        }

        if (evt.which === KEY.DOWN || evt.which === KEY.UP || evt.which === KEY.ENTER || evt.which === KEY.SPACE) {
          evt.preventDefault();
          evt.stopPropagation();
          $select.activate();
        }

        scope.$digest();
      });
      focusser.bind('keyup input', function (evt) {
        if (evt.which === KEY.TAB || KEY.isControl(evt) || KEY.isFunctionKey(evt) || evt.which === KEY.ESC || evt.which === KEY.ENTER || evt.which === KEY.BACKSPACE) {
          return;
        }

        $select.activate(focusser.val()); //User pressed some regular key, so we pass it to the search input

        focusser.val('');
        scope.$digest();
      });
    }
  };
}]).directive('uixSelectSort', ['$timeout', 'uixSelectMinErr', function ($timeout, uixSelectMinErr) {
  return {
    require: '^uixSelect',
    link: function link(scope, element, attrs, $select) {
      if (scope[attrs.uixSelectSort] === null) {
        throw uixSelectMinErr('sort', 'Expected a list to sort');
      }

      var options = angular.extend({
        axis: 'horizontal'
      }, scope.$eval(attrs.uixSelectSortOptions));
      var axis = options.axis,
          draggingClassName = 'dragging',
          droppingClassName = 'dropping',
          droppingBeforeClassName = 'dropping-before',
          droppingAfterClassName = 'dropping-after';
      scope.$watch(function () {
        return $select.sortable;
      }, function (val) {
        if (val) {
          element.attr('draggable', true);
        } else {
          element.removeAttr('draggable');
        }
      });
      element.on('dragstart', function (evt) {
        element.addClass(draggingClassName);
        (evt.dataTransfer || evt.originalEvent.dataTransfer).setData('text/plain', scope.$index);
      });
      element.on('dragend', function () {
        element.removeClass(draggingClassName);
      });

      var move = function move(from, to) {
        /*jshint validthis: true */
        this.splice(to, 0, this.splice(from, 1)[0]);
      };

      var dragOverHandler = function dragOverHandler(evt) {
        evt.preventDefault();
        var offset = axis === 'vertical' ? evt.offsetY || evt.layerY || (evt.originalEvent ? evt.originalEvent.offsetY : 0) : evt.offsetX || evt.layerX || (evt.originalEvent ? evt.originalEvent.offsetX : 0);

        if (offset < this[axis === 'vertical' ? 'offsetHeight' : 'offsetWidth'] / 2) {
          element.removeClass(droppingAfterClassName);
          element.addClass(droppingBeforeClassName);
        } else {
          element.removeClass(droppingBeforeClassName);
          element.addClass(droppingAfterClassName);
        }
      };

      var dropTimeout;

      var dropHandler = function dropHandler(evt) {
        evt.preventDefault();
        var droppedItemIndex = parseInt((evt.dataTransfer || evt.originalEvent.dataTransfer).getData('text/plain'), 10); // prevent event firing multiple times in firefox

        $timeout.cancel(dropTimeout);
        dropTimeout = $timeout(function () {
          _dropHandler(droppedItemIndex);
        }, 20);
      };

      function _dropHandler(droppedItemIndex) {
        var theList = scope.$eval(attrs.uixSelectSort),
            itemToMove = theList[droppedItemIndex],
            newIndex = null;

        if (element.hasClass(droppingBeforeClassName)) {
          if (droppedItemIndex < scope.$index) {
            newIndex = scope.$index - 1;
          } else {
            newIndex = scope.$index;
          }
        } else if (droppedItemIndex < scope.$index) {
          newIndex = scope.$index;
        } else {
          newIndex = scope.$index + 1;
        }

        move.apply(theList, [droppedItemIndex, newIndex]);
        scope.$apply(function () {
          scope.$emit('uixSelectSort:change', {
            array: theList,
            item: itemToMove,
            from: droppedItemIndex,
            to: newIndex
          });
        });
        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);
        element.off('drop', dropHandler);
      }

      element.on('dragenter', function () {
        if (element.hasClass(draggingClassName)) {
          return;
        }

        element.addClass(droppingClassName);
        element.on('dragover', dragOverHandler);
        element.on('drop', dropHandler);
      });
      element.on('dragleave', function (evt) {
        if (evt.target !== element) {
          return;
        }

        element.removeClass(droppingClassName);
        element.removeClass(droppingBeforeClassName);
        element.removeClass(droppingAfterClassName);
        element.off('dragover', dragOverHandler);
        element.off('drop', dropHandler);
      });
    }
  };
}]).service('uixSelectRepeatParser', ['uixSelectMinErr', '$parse', function (uixSelectMinErr, $parse) {
  var self = this;
  /**
   * Example:
   * expression = "address in addresses | filter: {street: $select.search} track by $index"
   * itemName = "address",
   * source = "addresses | filter: {street: $select.search}",
   * trackByExp = "$index",
   */

  self.parse = function (expression) {
    var match = expression.match(/^\s*(?:([\s\S]+?)\s+as\s+)?([\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/);

    if (!match) {
      throw uixSelectMinErr('iexp', 'Expected expression in form of \'_item_ in _collection_[ track by _id_]\' but got \'{0}\'.', expression);
    }

    return {
      itemName: match[2],
      // (lhs) Left-hand side,
      source: $parse(match[3]),
      trackByExp: match[4],
      modelMapper: $parse(match[1] || match[2])
    };
  };

  self.getGroupNgRepeatExpression = function () {
    return '$group in $select.groups';
  };

  self.getNgRepeatExpression = function (itemName, source, trackByExp, grouped) {
    var expression = itemName + ' in ' + (grouped ? '$group.items' : source);

    if (trackByExp) {
      expression += ' track by ' + trackByExp;
    }

    return expression;
  };
}]);
"use strict";

/**
 * sortable
 * sortable directive
 * Author: yjy972080142@gmail.com
 * Date:2016-03-21
 */
angular.module('ui.xg.sortable', []).service('uixSortableService', function () {
  return {};
}).directive('uixSortable', ['$timeout', 'uixSortableService', function ($timeout, uixSortableService) {
  return {
    restrict: 'AE',
    scope: {
      uixSortable: '=',
      onChange: '&'
    },
    link: function link($scope, ele) {
      var self = this;

      if ($scope.uixSortable) {
        $scope.$watch('uixSortable', function () {
          // Timeout to let ng-repeat modify the DOM
          $timeout(function () {
            self.refresh(ele, $scope);
          }, 0, false);
        });
        $scope.$watch('uixSortable.length', function () {
          $timeout(function () {
            self.refresh(ele, $scope);
          }, 0, false);
        });
      }

      self.refresh = function (element, scope) {
        var children = element.children();
        children.off('dragstart dragend');
        element.off('dragenter dragover drop dragleave');
        angular.forEach(children, function (item, i) {
          var child = angular.element(item);
          child.attr('draggable', 'true').css({
            cursor: 'move'
          }).on('dragstart', function (event) {
            event = event.originalEvent || event;

            if (element.attr('draggable') === 'false') {
              return;
            }

            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(item, 10, 10);
            $timeout(function () {
              //child.hide();
              item.originDisplay = item.style.display;
              item.style.display = 'none';
            }, 0);
            uixSortableService.element = element;
            uixSortableService.isDragging = true;
            uixSortableService.dragIndex = i;
            uixSortableService.placeholder = getPlaceholder(child);
            uixSortableService.sortScope = null;
            event.stopPropagation();
          }).on('dragend', function (event) {
            event = event.originalEvent || event;
            $timeout(function () {
              //child.show();
              item.style.display = item.originDisplay;
            }, 0);
            uixSortableService.isDragging = false;
            uixSortableService.dragIndex = null;
            uixSortableService.placeholder = null;
            uixSortableService.element = null;
            event.stopPropagation();
            event.preventDefault();
          });
        }); //父元素绑定drop事件

        var listNode = element[0],
            placeholder,
            placeholderNode;
        element.on('dragenter', function (event) {
          event = event.originalEvent || event;

          if (!uixSortableService.isDragging || uixSortableService.element !== element) {
            return false;
          }

          placeholder = uixSortableService.placeholder;
          placeholderNode = placeholder[0];
          event.preventDefault();
        }).on('dragover', function (event) {
          event = event.originalEvent || event;

          if (!uixSortableService.isDragging || uixSortableService.element !== element) {
            return false;
          }

          if (placeholderNode.parentNode !== listNode) {
            element.append(placeholder);
          }

          if (event.target !== listNode) {
            var listItemNode = event.target;

            while (listItemNode.parentNode !== listNode && listItemNode.parentNode) {
              listItemNode = listItemNode.parentNode;
            }

            if (listItemNode.parentNode === listNode && listItemNode !== placeholderNode) {
              if (isMouseInFirstHalf(event, listItemNode)) {
                listNode.insertBefore(placeholderNode, listItemNode);
              } else {
                listNode.insertBefore(placeholderNode, listItemNode.nextSibling);
              }
            }
          } else {
            if (isMouseInFirstHalf(event, placeholderNode, true)) {
              while (placeholderNode.previousElementSibling && (isMouseInFirstHalf(event, placeholderNode.previousElementSibling, true) || placeholderNode.previousElementSibling.offsetHeight === 0)) {
                listNode.insertBefore(placeholderNode, placeholderNode.previousElementSibling);
              }
            } else {
              while (placeholderNode.nextElementSibling && !isMouseInFirstHalf(event, placeholderNode.nextElementSibling, true)) {
                listNode.insertBefore(placeholderNode, placeholderNode.nextElementSibling.nextElementSibling);
              }
            }
          }

          element.addClass('uix-sortable-dragover');
          event.preventDefault();
          event.stopPropagation();
          return false;
        }).on('drop', function (event) {
          event = event.originalEvent || event;

          if (!uixSortableService.isDragging || uixSortableService.element !== element) {
            return true;
          }

          var dragIndex = uixSortableService.dragIndex;
          var placeholderIndex = getPlaceholderIndex(placeholderNode, listNode, dragIndex);
          scope.$apply(function () {
            // 改变数据,由angular进行DOM修改
            var dragObj = scope.uixSortable[dragIndex];
            scope.uixSortable.splice(dragIndex, 1);
            scope.uixSortable.splice(placeholderIndex, 0, dragObj);

            if (scope.onChange && angular.isFunction(scope.onChange)) {
              scope.onChange();
            }
          });
          placeholder.remove();
          element.removeClass('uix-sortable-dragover');
          event.stopPropagation();
          return false;
        }).on('dragleave', function () {
          element.removeClass('uix-sortable-dragover');
          $timeout(function () {
            if (!element.hasClass('uix-sortable-dragover') && placeholder) {
              placeholder.remove();
            }
          }, 0);
        });
      };
      /**
       * 获取placeholder的索引
       * @param placeholderNode - placeholder的节点
       * @param listNode - 列表节点
       * @param dragIndex - 被拖拽的节点索引
       * @returns {number}
       */


      function getPlaceholderIndex(placeholderNode, listNode, dragIndex) {
        var index = Array.prototype.indexOf.call(listNode.children, placeholderNode);
        return index > dragIndex ? --index : index;
      }
      /**
       * 判断鼠标位置是否在targetNode上一半
       */


      function isMouseInFirstHalf(event, targetNode, relativeToParent) {
        var mousePointer = event.offsetY || event.layerY;
        var targetSize = targetNode.offsetHeight;
        var targetPosition = targetNode.offsetTop;
        targetPosition = relativeToParent ? targetPosition : 0;
        return mousePointer < targetPosition + targetSize / 2;
      }
      /**
       * 获取placeholder元素
       * @param el
       * @returns {*}
       */


      function getPlaceholder(el) {
        var placeholder = el.clone();
        placeholder.html('');
        placeholder.css({
          listStyle: 'none',
          border: '1px dashed #CCC',
          minHeight: '10px',
          height: el[0].offsetHeight + 'px',
          width: el[0].offsetWidth + 'px',
          background: 'rgba(0, 0, 0, 0)'
        });
        return placeholder;
      }
    }
  };
}]);
"use strict";

/**
 * step
 * step directive
 * Author: your_email@gmail.com
 * Date:2017-01-19
 */
angular.module('ui.xg.step', []).directive('uixStep', function () {
  return {
    restrict: 'AE',
    templateUrl: 'templates/step.html',
    require: '^?uixSteps',
    scope: {},
    link: function link($scope, $element, $attr, stepsCtrl) {
      $scope.title = $attr.title || '';
      $scope.status = $attr.status || 'wait';
      $scope.desc = $attr.desc || '';
      $scope.size = stepsCtrl.size || 'lg';
      $scope.direction = stepsCtrl.direction;
      $scope.icon = $attr.icon || '';
      $scope.num = stepsCtrl.num || 0;
      $scope.iconColor = '#DDDDDD';
      $('uix-step').addClass('uixstep');

      switch ($scope.status) {
        case 'process':
          $scope.iconColor = '#20A0FF';
          break;

        case 'finish':
          $scope.iconColor = '#13CE66';
          break;

        case 'error':
          $scope.iconColor = 'red';
          break;
      }

      stepsCtrl.num++;

      if (stepsCtrl.direction === 'horizontal') {
        $element.css('display', 'block');
      }
    }
  };
});
"use strict";

/**
 * steps
 * steps directive
 * Author: lihaijie02@meituan.com
 * Date:2017-01-17
 */
angular.module('ui.xg.steps', []).directive('uixSteps', function () {
  return {
    restrict: 'AE',
    scope: {
      'size': '@',
      'direction': '@'
    },
    controller: ['$scope', function ($scope) {
      $scope.size = $scope.size || 'md';
      $scope.direction = $scope.direction || 'vertical';
      this.size = $scope.size;
      this.direction = $scope.direction;
      this.num = 0;
      $('uix-steps').addClass('uix-steps');
    }]
  };
});
"use strict";

/**
 * switch
 * 开关
 * Author:yangjiyuan@meituan.com
 * Date:2016-1-31
 */
angular.module('ui.xg.switch', []).constant('uixSwitchConfig', {
  type: 'default',
  size: 'md',
  isDisabled: false,
  trueValue: true,
  falseValue: false
}).controller('uixSwitchCtrl', ['$scope', '$attrs', 'uixSwitchConfig', function ($scope, $attrs, uixSwitchConfig) {
  var ngModelCtrl = {
    $setViewValue: angular.noop
  };
  $scope.switchObj = {};

  this.init = function (_ngModelCtrl) {
    ngModelCtrl = _ngModelCtrl;
    ngModelCtrl.$render = this.render;
    $scope.switchObj.isDisabled = getAttrValue('ngDisabled', 'isDisabled');
    $scope.switchObj.type = $scope.type || uixSwitchConfig.type;
    $scope.switchObj.size = $scope.size || uixSwitchConfig.size;
    $scope.switchObj.trueValue = getAttrValue('trueValue');
    $scope.switchObj.falseValue = getAttrValue('falseValue');
  };

  $scope.$watch('switchObj.query', function (val) {
    ngModelCtrl.$setViewValue(val ? $scope.switchObj.trueValue : $scope.switchObj.falseValue);
    ngModelCtrl.$render();
  });

  $scope.changeSwitchHandler = function () {
    if ($scope.onChange) {
      $scope.onChange();
    }
  };

  this.render = function () {
    $scope.switchObj.query = ngModelCtrl.$viewValue === $scope.switchObj.trueValue;
  };

  function getAttrValue(attributeValue, defaultValue) {
    var val = $scope.$parent.$eval($attrs[attributeValue]); //变量解析

    return angular.isDefined(val) ? val : uixSwitchConfig[defaultValue || attributeValue];
  }
}]).directive('uixSwitch', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/switch.html',
    replace: true,
    require: ['uixSwitch', 'ngModel'],
    scope: {
      type: '@?',
      size: '@?',
      onChange: '&?'
    },
    controller: 'uixSwitchCtrl',
    link: function link(scope, el, attrs, ctrls) {
      var switchCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];
      switchCtrl.init(ngModelCtrl);
    }
  };
});
"use strict";

/**
 * tableLoader
 * 表格Loading指令
 * Author:heqingyang@meituan.com
 * Date:2016-08-02
 */
angular.module('ui.xg.tableLoader', []).provider('uixTableLoader', function () {
  var loadingTime = 300;

  this.setLoadingTime = function (num) {
    loadingTime = angular.isNumber(num) ? num : 300;
  };

  this.$get = function () {
    return {
      getLoadingTime: function getLoadingTime() {
        return loadingTime;
      }
    };
  };
}).controller('uixTableLoaderCtrl', ['$scope', '$timeout', '$element', '$window', 'uixTableLoader', '$document', function ($scope, $timeout, $element, $window, uixTableLoader, $document) {
  var $ = angular.element;
  var thead = $element.children('thead');
  var tbody = $element.children('tbody');
  var loadingTime = parseInt($scope.loadingTime, 10) || uixTableLoader.getLoadingTime();
  var noThead = $scope.noThead;
  var tableDisplayType = tbody.css('display');
  var theadDisplayType = thead.css('display');
  var windowHeight = $window.clientHeight;
  var footerHeight = parseInt($document.find('app-footer').css('height'), 10) || 0;
  var tempHeight = windowHeight - footerHeight - $element.offsetTop;
  var height = parseInt($scope.loaderHeight, 10) || tempHeight > 300 ? 300 : tempHeight;
  var loadingTpl = $('<tbody><tr><td colspan="100%">' + '<div class="loading" style="height:' + height + 'px">' + '<i class="fa fa-spin fa-spinner loading-icon"></i>' + '</div>' + '</td></tr></tbody>');
  var errorTipTpl = $('<tbody><tr><td colspan="100%">' + '<div class="error-tip" style="height:' + height + 'px">' + '<span class="error-text">数据加载失败! </span>' + '</div>' + '</td></tr></tbody>');
  var emptyTipTpl = $('<tbody><tr><td colspan="100%">' + '<div class="error-tip" style="height:' + height + 'px">' + '<span class="error-text">数据列表为空! </span>' + '</div>' + '</td></tr></tbody>');
  var startTimer, endTimer;
  $element.addClass('uix-table-loader');
  $scope.$watch('uixTableLoader', function (newValue) {
    if (newValue === 1) {
      startTimer = new Date().getTime();

      if (noThead) {
        thead.css('display', 'none');
      }

      errorTipTpl.remove();
      emptyTipTpl.remove();
      loadingTpl.css('display', tableDisplayType);
      tbody.css('display', 'none').after(loadingTpl);
    } else if (newValue === 0) {
      endTimer = new Date().getTime();

      if (startTimer) {
        timeoutHandle(startTimer, endTimer, function () {
          if (noThead) {
            thead.css('display', theadDisplayType);
          } // fix #31


          loadingTpl.remove();
          errorTipTpl.remove();
          emptyTipTpl.remove();
          tbody.css('display', tableDisplayType);
        });
      }
    } else if (newValue === -1) {
      endTimer = new Date().getTime();

      if (startTimer) {
        timeoutHandle(startTimer, endTimer, function () {
          if (noThead) {
            thead.css('display', theadDisplayType);
          } // fix #31


          errorTipTpl.remove();
          loadingTpl.remove();
          emptyTipTpl.remove();
          tbody.css('display', 'none').after(errorTipTpl);
        });
      }
    } else if (newValue === 2) {
      endTimer = new Date().getTime();

      if (startTimer) {
        timeoutHandle(startTimer, endTimer, function () {
          if (noThead) {
            thead.css('display', theadDisplayType);
          } // fix #31


          emptyTipTpl.remove();
          loadingTpl.remove();
          errorTipTpl.remove();
          tbody.css('display', 'none').after(emptyTipTpl);
        });
      }
    }
  });

  function timeoutHandle(startTimer, endTimer, callback) {
    var timer;

    if (endTimer - startTimer < loadingTime) {
      timer = loadingTime;
    } else {
      timer = 0;
    }

    $timeout(callback, timer);
  }
}]).directive('uixTableLoader', function () {
  return {
    restrict: 'A',
    scope: {
      uixTableLoader: '=',
      noThead: '=',
      loaderHeight: '@',
      loadingTime: '@'
    },
    controller: 'uixTableLoaderCtrl',
    controllerAs: 'tableLoader'
  };
});
"use strict";

angular.module('ui.xg.tabs', []).controller('tabsController', ['$scope', function ($scope) {
  var ctrl = this;
  var oldIndex;
  ctrl.subTabNum = 1; //tabs子tab的个数

  ctrl.tabs = [];
  ctrl.onChange = null;
  ctrl.active = $scope.active;

  ctrl.select = function (index) {
    var prevIndex = ctrl.findTabIndex(oldIndex);
    var prevSelected = ctrl.tabs[prevIndex];

    if (prevSelected) {
      // 取消之前选中
      prevSelected.active = false; // scope域上的active属性
    }

    var oldVal = oldIndex;
    var newVal = oldIndex;
    var selected = ctrl.tabs[index]; // 当前选中tab(scope)

    if (selected) {
      selected.active = true; // 选中

      ctrl.active = selected.index; // 设置当前选择index

      oldIndex = selected.index;
      newVal = selected.index;

      if ($scope.active !== selected.index) {
        $scope.active = selected.index;

        if (angular.isDefined($scope.onChange && oldVal)) {
          $scope.onChange({
            $oldVal: oldVal,
            $newVal: newVal
          });
        }
      }
    }
  };

  ctrl.addTab = function (tab) {
    ctrl.subTabNum++; // tab加入

    ctrl.tabs.push(tab); // 插入整个scope域
    // 设置新增标签为激活标签或者新增标签为第一个,默认选中第一个

    if (tab.index === ctrl.active || angular.isUndefined(ctrl.active) && ctrl.tabs.length === 1) {
      var newActiveIndex = ctrl.findTabIndex(tab.index);
      ctrl.select(newActiveIndex);
    }
  }; //
  //         ctrl.removeTab = function (tab) {
  //             var index = ctrl.findTabIndex(tab);
  //             // TODO 如果删除的是当前激活状态的tab
  // //                if(ctrl.tabs[index].index === ctrl.active){
  // //                    var newActiveTabIndex = index === ctrl.tas
  // //                }
  //             ctrl.tabs.splice(index, 1); //删除tab
  //         };


  ctrl.findTabIndex = function (index) {
    for (var i = 0; i < ctrl.tabs.length; i++) {
      if (ctrl.tabs[i].index === index) {
        return i;
      }
    }
  };

  $scope.$watch('active', function (val) {
    if (val && val !== oldIndex) {
      // 重新选择
      var newActiveIndex = ctrl.findTabIndex(val);

      if (angular.isUndefined(newActiveIndex)) {
        newActiveIndex = 0; // 如果设置的值找不到,则默认选中第一个
      }

      ctrl.select(newActiveIndex); // tab切换
    }
  });
}]).directive('uixTabPanel', ['$interpolate', function () {
  return {
    restrict: 'E',
    require: '^uixTabs',
    scope: {},
    link: function link(scope, element, attrs) {
      var tabScope = scope.$parent.$eval(attrs.tab); // console.log(tabScope.tab);
      // console.log(element[0]);

      element.append(tabScope.tab);
    }
  };
}]).directive('uixTab', ['$sce', function ($sce) {
  return {
    restrict: 'E',
    scope: {},
    require: '^uixTabs',
    templateUrl: 'templates/tab.html',
    replace: true,
    transclude: true,
    link: function link(scope, element, attrs, tabsCtrl, transclude) {
      scope.heading = $sce.trustAsHtml(getRealAttr(scope.$parent.$parent, attrs.heading, 'Tab')); // 获取元素标题

      scope.index = getRealAttr(scope.$parent.$parent, attrs.index, tabsCtrl.subTabNum); // 获取元素index

      scope.disabled = getRealAttr(scope.$parent.$parent, attrs.disabled, false);
      transclude(scope.$parent.$parent, function (clone) {
        angular.forEach(clone, function (ele) {
          if (angular.isDefined(ele.outerHTML)) {
            scope.tab = ele;
            tabsCtrl.addTab(scope);
          }
        });
      });

      scope.changeTab = function () {
        if (scope.disabled) {
          return;
        }

        tabsCtrl.select(tabsCtrl.findTabIndex(scope.index));
      };
      /**
       * 在父作用scope解析属性值
       * @param {object} scope 变量所在scope域
       * @param {string} val 从标签上获取的属性值
       * @param {string} defaultVal 属性默认值
       * @returns {*}
       */


      function getRealAttr(scope, val, defaultVal) {
        if (angular.isDefined(val)) {
          return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
        } else {
          return defaultVal;
        }
      }
    }
  };
}]).directive('uixTabs', function () {
  return {
    restrict: 'E',
    scope: {
      active: '=?',
      onChange: '&?'
    },
    templateUrl: 'templates/tabs.html',
    transclude: true,
    replace: true,
    controller: 'tabsController',
    controllerAs: 'tabsCtrl',
    link: function link(scope, element, attrs, tabCtrl) {
      tabCtrl.index = scope.active;

      if (angular.isDefined(attrs.type)) {
        scope.type = getRealAttr(scope.$parent, attrs.type);
      } else {
        scope.type = 'tabs'; //默认类型
      } //                    if(angular.isDefined(attrs.tabPosition)){
      //                        scope.tabPosition = getRealAttr(scope.$parent, attrs.tabPosition);
      //                    } else {
      //                        scope.tabPosition = 'top'; //默认位置
      //                    }

      /**
       * 在父作用scope解析属性值
       * @param {object} scope 变量所在scope域
       * @param {string} val 从标签上获取的属性值
       * @returns {*}
       */


      function getRealAttr(scope, val) {
        return angular.isDefined(scope.$eval(val)) ? scope.$eval(val) : val;
      }
    }
  };
});
"use strict";

/**
 * timeline
 * timeline directive
 * Author: zhangjihu@meituan.com
 * Date:2018-09-03
 */
angular.module('ui.xg.timeline', []).controller('UixTimelineController', ['$scope', '$attrs', function ($scope, $attrs) {
  $scope.mode = $attrs.mode || 'left';
  $scope.nodeData = $scope.nodeData || [];

  if ($scope.pending) {
    var lastDot = $scope.nodeData.pop();
    $scope.nodeData.push({
      title: lastDot.title || 'Recording...',
      color: lastDot.color || 'blue',
      icon: lastDot.icon || 'glyphicon glyphicon-refresh'
    });
  }

  if ($scope.reverse) {
    $scope.nodeData = $scope.nodeData.slice().reverse();
  }
}]).directive('uixTimeline', function () {
  return {
    restrict: 'E',
    templateUrl: 'templates/timeline.html',
    replace: true,
    scope: {
      nodeData: '=',
      mode: '=?',
      // 通过设置 mode 可以改变时间轴和内容的相对位置 left | alternate | right
      reverse: '=?',
      // 用于控制节点排序，为 false 时按正序排列，为 true 时按倒序排列
      pending: '=?' // 当任务状态正在发生，还在记录过程中，可用幽灵节点来表示当前的时间节点，当 pending 为真值时展示幽灵节点

    },
    controller: 'UixTimelineController'
  };
}).directive('uixTimelineItem', ['$sce', function ($sce) {
  return {
    restrict: 'E',
    templateUrl: 'templates/timelineItem.html',
    replace: true,
    scope: {
      dot: '=',
      mode: '=',
      showTail: '=',
      pending: '=?',
      reverse: '=?',
      first: '=?',
      last: '=?'
    },
    link: function link($scope) {
      $scope.$sce = $sce;
    }
  };
}]);
"use strict";

/**
 * timepicker
 * timepicker directive
 * Author: yangjiyuan@meituan.com
 * Date:2016-02-15
 */
angular.module('ui.xg.timepicker', ['ui.xg.timepanel', 'ui.xg.popover']).constant('uixTimepickerConfig', {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
  readonlyInput: false,
  format: 'HH:mm:ss',
  size: 'md',
  showSeconds: false,
  appendToBody: false
}).service('uixTimepickerService', ['$document', function ($document) {
  var openScope = null;

  this.open = function (timepickerScope) {
    if (!openScope) {
      $document.on('click', closeTimepicker);
    }

    if (openScope && openScope !== timepickerScope) {
      openScope.showTimepanel = false;
    }

    openScope = timepickerScope;
    openScope.$on('$destroy', function () {
      $document.off('click', closeTimepicker);
    });
  };

  this.close = function (timepickerScope) {
    if (openScope === timepickerScope) {
      openScope = null;
      $document.off('click', closeTimepicker);
    }
  };

  function closeTimepicker(evt) {
    if (!openScope) {
      return;
    }

    var panelElement = openScope.getTimepanelElement();
    var toggleElement = openScope.getToggleElement();

    if (panelElement && panelElement.contains(evt.target) || toggleElement && toggleElement.contains(evt.target)) {
      return;
    }

    openScope.showTimepanel = false;
    openScope.$apply();
  }
}]).controller('uixTimepickerCtrl', ['$scope', '$element', '$attrs', '$parse', '$log', 'uixTimepickerService', 'uixTimepickerConfig', 'dateFilter', '$document', function ($scope, $element, $attrs, $parse, $log, uixTimepickerService, timepickerConfig, dateFilter, $document) {
  var ngModelCtrl = {
    $setViewValue: angular.noop
  };

  this.init = function (_ngModelCtrl) {
    ngModelCtrl = _ngModelCtrl;
    ngModelCtrl.$render = this.render;
    ngModelCtrl.$formatters.unshift(function (modelValue) {
      return modelValue ? new Date(modelValue) : null;
    });
  };

  var _this = this;
  /*
   fix 父组件的controller优先于子组件初始化,hourStep三个属性需要在子组件初始化的时候就传递进去
   不能在父组件执行link(link函数一般都是postLink函数)函数的时候执行
   http://xgfe.github.io/2015/12/22/penglu/link-controller/
   */


  angular.forEach(['hourStep', 'minuteStep', 'secondStep', 'appendToBody'], function (key) {
    $scope[key] = angular.isDefined($attrs[key]) ? $scope.$parent.$eval($attrs[key]) : timepickerConfig[key];
  }); // readonly input

  $scope.readonlyInput = timepickerConfig.readonlyInput;

  if ($attrs.readonlyInput) {
    $scope.$parent.$watch($parse($attrs.readonlyInput), function (value) {
      $scope.readonlyInput = !!value;
    });
  } // show-seconds


  $scope.showSeconds = timepickerConfig.showSeconds;

  if ($attrs.showSeconds) {
    $scope.$parent.$watch($parse($attrs.showSeconds), function (value) {
      $scope.showSeconds = !!value;
    });
  } // format


  var format = timepickerConfig.format;

  if ($attrs.format) {
    $scope.$parent.$watch($parse($attrs.format), function (value) {
      format = value;
      $scope.inputValue = dateFilter($scope.selectedTime, format);
    });
  }

  $scope.showTimepanel = false;

  this.toggle = function (open) {
    $scope.showTimepanel = arguments.length ? !!open : !$scope.showTimepanel;
  };

  this.showTimepanel = function () {
    return $scope.showTimepanel;
  };

  this.render = function () {
    var date = ngModelCtrl.$viewValue;

    if (isNaN(date)) {
      $log.error('Timepicker directive: "ng-model" value must be a Date object, ' + 'a number of milliseconds since 01.01.1970 or a string representing an RFC2822 ' + 'or ISO 8601 date.');
    } else if (date) {
      $scope.selectedTime = date;
      $scope.inputValue = dateFilter(date, format);
    }
  }; // 这里使用onChange，而不是watch selectedTime属性，因为watch的话，会出现循环赋值，待解决


  $scope.changeTime = function (time) {
    ngModelCtrl.$setViewValue(time);
    ngModelCtrl.$render();
    var fn = $scope.onChange ? $scope.onChange() : angular.noop();

    if (angular.isDefined(fn)) {
      fn();
    }
  };

  $scope.toggleTimepanel = function (evt) {
    $element.find('input')[0].blur();
    evt.preventDefault();

    if (!$scope.isDisabled) {
      _this.toggle();
    }
  }; //如果是appendToBody的话，需要特殊判断


  $scope.getTimepanelElement = function () {
    return $scope.appendToBody ? $document[0].querySelector('body > .uix-timepicker-popover') : $element[0].querySelector('.uix-timepicker-popover');
  };

  $scope.getToggleElement = function () {
    return $element[0].querySelector('.input-group');
  };

  $scope.$watch('showTimepanel', function (showTimepanel) {
    if (showTimepanel) {
      uixTimepickerService.open($scope);
    } else {
      uixTimepickerService.close($scope);
    }
  });
  $scope.$on('$locationChangeSuccess', function () {
    $scope.showTimepanel = false;
  });
}]).directive('uixTimepicker', function () {
  return {
    restrict: 'AE',
    templateUrl: 'templates/timepicker.html',
    replace: true,
    require: ['uixTimepicker', 'ngModel'],
    scope: {
      isDisabled: '=?ngDisabled',
      minTime: '=?',
      maxTime: '=?',
      size: '@',
      placeholder: '@',
      onChange: '&?'
    },
    controller: 'uixTimepickerCtrl',
    link: function link(scope, el, attrs, ctrls) {
      var timepickerCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];
      timepickerCtrl.init(ngModelCtrl);
    }
  };
});
"use strict";

/**
 * typeahead
 * 搜索提示指令
 * Author:heqingyang@meituan.com
 * Date:2016-08-17
 */
angular.module('ui.xg.typeahead', []).filter('html', ['$sce', function ($sce) {
  return function (input, type) {
    if (angular.isString(input)) {
      return $sce.trustAs(type || 'html', input);
    } else {
      return '';
    }
  };
}]).controller('uixTypeaheadCtrl', ['$scope', '$attrs', '$element', '$document', '$q', '$log', function ($scope, $attrs, $element, $document, $q, $log) {
  var listElm = $document.find('[uix-typeahead-popup]');
  var ngModelCtrl = {
    $setViewValue: angular.noop
  };
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

  $element.addClass('uix-typeahead');
  $element.find('input').attr('placeholder', placeholder);
  listElm.bind('click', function (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }); // 监听typeahead.query变量,对matchList进行处理

  $scope.$watch('typeahead.query', function (newValue) {
    var Reg = new RegExp(newValue, 'gim');
    ngModelCtrl.$setViewValue(newValue);
    ngModelCtrl.$render();

    if (isResult) {
      isResult = false;
      return;
    }

    if (newValue === '') {
      $scope.isShow = false;
      return;
    }

    $scope.matchList = []; // 如果有异步处理函数,直接执行,否则使用本地数据

    if (asyncFunc) {
      $scope.typeaheadLoading = true;
      $scope.$q.when(asyncFunc(newValue)).then(function (matches) {
        $scope.typeaheadLoading = false;
        $scope.matchList = matches.map(function (item) {
          return {
            'text': item,
            'html': item
          };
        });

        if ($scope.matchList.length === 0) {
          $scope.typeaheadNoResults = true;
        } else {
          $scope.typeaheadNoResults = false;
        }

        $scope.listLength = $scope.matchList.length;
        $scope.activeIndex = 0;
        $scope.isShow = $scope.listLength > 0 ? true : false;
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

        if (match) {
          $scope.matchList.push({
            'text': item,
            'html': parseNode(item, newValue)
          });
        }
      });

      if ($scope.matchList.length === 0) {
        $scope.typeaheadNoResults = true;
      } else {
        $scope.typeaheadNoResults = false;
      }

      $scope.listLength = $scope.matchList.length;
      $scope.activeIndex = 0;
      $scope.isShow = $scope.listLength > 0 ? true : false;
    }
  }); // 监听isShow变量,进行事件绑定控制

  $scope.$watch('isShow', function (newValue) {
    if (newValue) {
      if (!openScope) {
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
    return index === $scope.activeIndex;
  }; // document绑定点击事件


  function closeTypeahead() {
    if (!openScope) {
      return;
    }

    $scope.$apply(function () {
      $scope.isShow = false;
    });
  } // document绑定键盘事件


  function arrowKeyBind(evt) {
    if (evt.which === 9 || evt.which === 13) {
      $scope.$apply(function () {
        $scope.selectItem($scope.matchList[$scope.activeIndex]);
      });
      evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.which === 40) {
      if ($scope.activeIndex + 1 < $scope.listLength) {
        $scope.$apply(function () {
          $scope.activeIndex++;
        });
      }

      evt.preventDefault();
      evt.stopPropagation();
    } else if (evt.which === 38) {
      if ($scope.activeIndex > 0) {
        $scope.$apply(function () {
          $scope.activeIndex--;
        });
      }

      evt.preventDefault();
      evt.stopPropagation();
    }
  } // 代码高亮处理


  function parseNode(item, str) {
    var Reg = new RegExp(str, 'gim');
    return item.replace(Reg, function (message) {
      return '<strong>' + message + '</strong>';
    });
  }
}]).directive('uixTypeahead', function () {
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
    link: function link(scope, el, attrs, ctrls) {
      var typeaheadCtrl = ctrls[0],
          ngModelCtrl = ctrls[1];
      typeaheadCtrl.init(ngModelCtrl, el);
    }
  };
});
"use strict";

angular.module("accordion/templates/accordion.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/accordion.html", "<div class=\"panel-group\" ng-transclude></div>");
}]);
"use strict";

angular.module("accordion/templates/group.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/group.html", "<div class=\"panel panel-default\">" + "    <div class=\"panel-heading\">" + "        <h4 class=\"panel-title\">" + "            <a href ng-click=\"isOpen = !isOpen\">" + "                <span ng-class=\"{'text-muted': isDisabled}\">" + "                    {{heading}}" + "                </span>" + "            </a>" + "        </h4>" + "    </div>" + "    <div class=\"panel-collapse collapse\" uix-collapse=\"!isOpen\">" + "        <div class=\"panel-body\" ng-transclude></div>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("alert/templates/alert.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/alert.html", "<div ng-show=\"!defaultclose\" class=\"alert uix-alert\" ng-class=\"['alert-' + (type || 'warning'), closeable ? 'alert-dismissible' : null]\" role=\"alert\">" + "    <div ng-show=\"hasIcon\" class=\"alert-icon\">" + "        <span class=\"alert-icon-span glyphicon\" ng-class=\"'glyphicon-'+iconClass\"></span>" + "    </div>" + "    <button ng-show=\"closeable\" type=\"button\" class=\"close\" ng-click=\"closeFunc({$event: $event})\">" + "        <span ng-if=\"!closeText\">&times;</span>" + "        <span class=\"cancel-text\" ng-if=\"closeText\">{{closeText}}</span>" + "    </button>" + "    <!--<div ng-class=\"[hasIcon?'show-icon' : null]\" ng-transclude></div>-->" + "    <div ng-class=\"{true:'show-icon' ,false: null}[hasIcon]\" ng-transclude></div>" + "" + "</div>");
}]);
"use strict";

angular.module("avatar/templates/avatar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/avatar.html", "<div class=\"uix-avatar {{'uix-avatar-'+size}} {{'uix-avatar-'+shape}}\" ng-class=\"{'uix-avatar-image':src}\">" + "" + "</div>");
}]);
"use strict";

angular.module("button/templates/button.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/button.html", "<button type=\"{{type}}\" class=\"uix-button-wrapper\">" + "    <div ng-transclude class=\"inline-b\"></div>" + "    <span ng-if=\"loading\">" + "        <i class=\"glyphicon glyphicon-refresh glyphicon-refresh-animate\"></i>" + "    </span>" + "</button>");
}]);
"use strict";

angular.module("buttonGroup/templates/buttonGroup.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/buttonGroup.html", "<div class=\"btn-group\" type=\"{{type}}\"></div>");
}]);
"use strict";

angular.module("timepanel/templates/timepanel.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/timepanel.html", "<div class=\"uix-timepanel\">" + "    <div class=\"uix-timepanel-col uix-timepanel-hour\" ng-style=\"panelStyles\">" + "        <div class=\"uix-timepanel-top\" ng-click=\"increase('hour')\">{{largerHour}}</div>" + "        <div class=\"uix-timepanel-middle clearfix\">" + "            <input class=\"uix-timepanel-input\" ng-readonly=\"readonlyInput\" type=\"text\" ng-change=\"changeInputValue('hour',23)\" ng-model=\"hour\" placeholder=\"HH\"/>" + "            <span class=\"uix-timepanel-label\">时</span>" + "        </div>" + "        <div class=\"uix-timepanel-bottom\" ng-click=\"decrease('hour')\">{{smallerHour}}</div>" + "    </div>" + "    <div class=\"uix-timepanel-col uix-timepanel-minute\" ng-style=\"panelStyles\">" + "        <div class=\"uix-timepanel-top\" ng-click=\"increase('minute')\">{{largerMinute}}</div>" + "        <div class=\"uix-timepanel-middle clearfix\">" + "            <input class=\"uix-timepanel-input\" ng-readonly=\"readonlyInput\" type=\"text\" ng-change=\"changeInputValue('minute',59)\" ng-model=\"minute\" placeholder=\"MM\"/>" + "            <span class=\"uix-timepanel-label\">分</span>" + "        </div>" + "        <div class=\"uix-timepanel-bottom\" ng-click=\"decrease('minute')\">{{smallerMinute}}</div>" + "    </div>" + "    <div class=\"uix-timepanel-col uix-timepanel-seconds\" ng-style=\"panelStyles\" ng-show=\"showSeconds\">" + "        <div class=\"uix-timepanel-top\" ng-click=\"increase('second')\">{{largerSecond}}</div>" + "        <div class=\"uix-timepanel-middle clearfix\">" + "            <input class=\"uix-timepanel-input\" ng-readonly=\"readonlyInput\" type=\"text\" ng-change=\"changeInputValue('second',59)\" ng-model=\"second\" placeholder=\"SS\"/>" + "            <span class=\"uix-timepanel-label\">秒</span>" + "        </div>" + "        <div class=\"uix-timepanel-bottom\" ng-click=\"decrease('second')\">{{smallerSecond}}</div>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("calendar/templates/calendar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/calendar.html", "<div class=\"uix-calendar\">" + "    <div class=\"uix-cal-panel-day\" ng-show=\"panels.day\">" + "        <div class=\"uix-cal-month\">" + "            <i class=\"uix-cal-pre-button glyphicon glyphicon-chevron-left\" ng-click=\"prevMonth()\"></i>" + "            <span class=\"uix-cal-month-name\">" + "                <a href=\"javascript:;\" ng-click=\"selectPanel('month')\">{{FORMATS.SHORTMONTH[currentMonth]}}</a>" + "                <a href=\"javascript:;\" ng-click=\"selectYearPanelHandler()\">{{currentYear}}</a>" + "            </span>" + "            <i class=\"uix-cal-next-button glyphicon glyphicon-chevron-right\" ng-click=\"nextMonth()\"></i>" + "        </div>" + "        <div class=\"uix-cal-header clearfix\">" + "            <div ng-repeat=\"day in dayNames track by $index\">{{day}}</div>" + "        </div>" + "        <div class=\"uix-cal-body\">" + "            <div class=\"uix-cal-row\" ng-repeat=\"row in allDays\">" + "                <div ng-class=\"{'uix-cal-select':day.index===currentDay,'uix-cal-outside':!day.inMonth,'uix-cal-weekday':day.isWeekend,'uix-cal-day-today':day.isToday,'uix-cal-day-disabled':day.isDisabled}\"" + "                     class=\"uix-cal-day\" ng-repeat=\"day in row\" ng-click=\"selectDayHandler(day)\">" + "                    <span class=\"uix-cal-day-inner\">{{day.day}}</span>" + "                </div>" + "            </div>" + "        </div>" + "        <div class=\"uix-cal-footer\">" + "            <div class=\"uix-cal-time\" ng-click=\"selectTimePanelHandler()\" ng-if=\"showTime\">" + "                <span class=\"glyphicon glyphicon-time\"></span>" + "                {{selectDate | date:'shortTime'}}" + "            </div>" + "            <div class=\"uix-cal-today-btn\" ng-click=\"chooseToday()\" ng-bind=\"FORMATS.TODAY\" ng-disabled=\"disableToday\"></div>" + "        </div>" + "    </div>" + "    <div class=\"uix-cal-panel-time\" ng-show=\"panels.time\"> <!--这里要用ng-show,不能用ng-if-->" + "        <uix-timepanel min-time=\"minTime\" max-time=\"maxTime\" ng-model=\"selectDate\" show-seconds=\"showSeconds\"></uix-timepanel>" + "        <div class=\"btn-group clearfix\">" + "            <button class=\"btn btn-sm btn-default uix-cal-time-cancal\" ng-click=\"timePanelBack()\">返回</button>" + "            <button class=\"btn btn-sm btn-default uix-cal-time-now\" ng-click=\"timePanelSelectNow()\">此刻</button>" + "            <button class=\"btn btn-sm btn-default uix-cal-time-ok\" ng-click=\"timePanelOk()\">确定 </button>" + "        </div>" + "    </div>" + "    <div class=\"uix-cal-panel-month\" ng-show=\"panels.month\">" + "        <div class=\"uix-cal-month\">" + "            <span class=\"uix-cal-month-name\">" + "                <a href=\"javascript:;\" ng-click=\"selectYearPanelHandler()\">{{currentYear}}</a>" + "            </span>" + "        </div>" + "        <div class=\"uix-cal-body\">" + "            <table class=\"uix-cal-month-table\">" + "                <tr ng-repeat=\"monthRow in allMonths\">" + "                    <td class=\"uix-cal-month-item\"" + "                        ng-repeat=\"month in monthRow\"" + "                        ng-click=\"chooseMonthHandler(month.index)\"" + "                        ng-class=\"{'uix-cal-month-select':month.index === currentMonth}\">" + "                        <span class=\"uix-cal-month-inner\">{{month.name}}</span>" + "                    </td>" + "                </tr>" + "            </table>" + "        </div>" + "    </div>" + "    <div class=\"uix-cal-panel-year\" ng-show=\"panels.year\">" + "        <div class=\"uix-cal-month\">" + "            <i class=\"uix-cal-pre-button glyphicon glyphicon-chevron-left\" ng-click=\"prev12Years()\"></i>" + "            <span class=\"uix-cal-month-name\">" + "                <a href=\"javascript:;\">{{allYears[0][0]}}-{{allYears[3][2]}}</a>" + "            </span>" + "            <i class=\"uix-cal-next-button glyphicon glyphicon-chevron-right\" ng-click=\"next12Years()\"></i>" + "        </div>" + "        <div class=\"uix-cal-body\">" + "            <table class=\"uix-cal-month-table\">" + "                <tr ng-repeat=\"yearRow in allYears track by $index\">" + "                    <td class=\"uix-cal-month-item uix-cal-year-item\"" + "                        ng-repeat=\"year in yearRow track by $index\"" + "                        ng-click=\"chooseYearHandler(year)\"" + "                        ng-class=\"{'uix-cal-month-select':year === currentYear}\">" + "                        <span class=\"uix-cal-month-inner\">{{year}}</span>" + "                    </td>" + "                </tr>" + "            </table>" + "        </div>" + "    </div>" + "</div>");
}]);
"use strict";

angular.module("carousel/templates/carousel-item.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/carousel-item.html", "<div class=\"uix-carousel-item\" ng-transclude></div>");
}]);
"use strict";

angular.module("carousel/templates/carousel.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/carousel.html", "<div class=\"uix-carousel\">" + "    <ol class=\"carousel-indicators\" ng-if=\"itemList.length > 1\">" + "        <li ng-repeat=\"item in itemList\" data-slide-to=\"{{$index}}\" ng-click=\"change(indexNumber,$index)\" class=\"\" ng-class=\"{active:indexNumber === $index}\"></li>" + "    </ol>" + "    <div class=\"carousel-inner\" role=\"listbox\" ng-transclude></div>" + "" + "    <a class=\"carousel-control left\" role=\"button\" ng-click=\"prev()\" ng-if=\"itemList.length > 1\">" + "        <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-left\"></span>" + "        <span class=\"sr-only\">previous</span>" + "    </a>" + "    <a class=\"carousel-control right\" role=\"button\" ng-click=\"next()\" ng-if=\"itemList.length > 1\">" + "        <span aria-hidden=\"true\" class=\"glyphicon glyphicon-chevron-right\"></span>" + "        <span class=\"sr-only\">next</span>" + "    </a>" + "</div>");
}]);
"use strict";

angular.module("tooltip/templates/tooltip-html-popup.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/tooltip-html-popup.html", "<div class=\"tooltip\"" + "     tooltip-animation-class=\"fade\"" + "     uix-tooltip-classes" + "     ng-class=\"{ in: isOpen() }\">" + "    <div class=\"tooltip-arrow\"></div>" + "    <div class=\"tooltip-inner\" ng-bind-html=\"contentExp()\"></div>" + "</div>" + "");
}]);
"use strict";

angular.module("tooltip/templates/tooltip-popup.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/tooltip-popup.html", "<div class=\"tooltip\"" + "     tooltip-animation-class=\"fade\"" + "     uix-tooltip-classes" + "     ng-class=\"{ in: isOpen() }\">" + "    <div class=\"tooltip-arrow\"></div>" + "    <div class=\"tooltip-inner\" ng-bind=\"content\"></div>" + "</div>" + "");
}]);
"use strict";

angular.module("tooltip/templates/tooltip-template-popup.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/tooltip-template-popup.html", "<div class=\"tooltip\"" + "     tooltip-animation-class=\"fade\"" + "     uix-tooltip-classes" + "     ng-class=\"{ in: isOpen() }\">" + "    <div class=\"tooltip-arrow\"></div>" + "    <div class=\"tooltip-inner\"" + "         uix-tooltip-template-transclude=\"contentExp()\"" + "         tooltip-template-transclude-scope=\"originScope()\"></div>" + "</div>" + "");
}]);
"use strict";

angular.module("popover/templates/popover-html-popup.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/popover-html-popup.html", "<div class=\"popover\"" + "     tooltip-animation-class=\"fade\"" + "     uix-tooltip-classes" + "     ng-class=\"{ in: isOpen() }\">" + "    <div class=\"arrow\"></div>" + "" + "    <div class=\"popover-inner\">" + "        <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>" + "        <div class=\"popover-content\" ng-bind-html=\"contentExp()\"></div>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("popover/templates/popover-popup.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/popover-popup.html", "<div class=\"popover\"" + "     tooltip-animation-class=\"fade\"" + "     uix-tooltip-classes" + "     ng-class=\"{ in: isOpen() }\">" + "    <div class=\"arrow\"></div>" + "" + "    <div class=\"popover-inner\">" + "        <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>" + "        <div class=\"popover-content\" ng-bind=\"content\"></div>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("popover/templates/popover-template-popup.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/popover-template-popup.html", "<div class=\"popover\"" + "     tooltip-animation-class=\"fade\"" + "     uix-tooltip-classes" + "     ng-class=\"{ in: isOpen() }\">" + "    <div class=\"arrow\"></div>" + "" + "    <div class=\"popover-inner\">" + "        <h3 class=\"popover-title\" ng-bind=\"title\" ng-if=\"title\"></h3>" + "        <div class=\"popover-content\"" + "             uix-tooltip-template-transclude=\"contentExp()\"" + "             tooltip-template-transclude-scope=\"originScope()\"></div>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("cityselect/templates/citypanel.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/citypanel.html", "<div >" + "  <div class=\"uix-cityselect-border1 uix-cityselect-padding5 bg-white\">" + "    <div class=>" + "      <div class=\"modal-header uix-cityselect-padding5\">" + "        <h5 class=\"modal-title\">已选中{{vm.cityInfo.chosedCity.length}}个城市<span class=\"modal-title pull-right uix-cityselect-seeChosedCity\" ng-click=\"vm.showSelected()\">{{vm.cityInfo.isShowSelected?\"收起 \":\"查看已选城市\"}}<i class=\"glyphicon\" ng-class=\"{'glyphicon-chevron-down':(!vm.cityInfo.isShowSelected), 'glyphicon-chevron-up':(vm.cityInfo.isShowSelected&&vm.initSee)}\"></i></span></h5>" + "      </div>" + "      <div class=\"modal-body uix-cityselect-initheight uix-cityselect-haveChosed\"  ng-class=\"{uixCityselectCityBarOpen: (vm.cityInfo.isShowSelected&&vm.initSee), uixCityselectCityBarClose: (!vm.cityInfo.isShowSelected&&vm.initSee)}\">" + "        <div class=\"col-sm-8\">" + "          <button class=\"btn m-b-xs w-xs btn-default btn-sm chose-all\" ng-click=\"vm.choseAll()\" ng-if=\"vm.cityInfo.supportChoseAll\">全选</button>" + "          <button class=\"btn m-b-xs w-xs btn-default btn-sm chose-clean\" ng-click=\"vm.resetAll()\" ng-if=\"vm.cityInfo.supportChoseClear\">清空</button>" + "          <button class=\"btn m-b-xs w-xs btn-default btn-sm chose-reverse\" ng-click=\"vm.reverseAll()\" ng-if=\"vm.cityInfo.supportChoseReverse\">反选</button>" + "        </div>" + "        <div class=\"input-group  col-sm-4\">" + "          <form action=\"#\" class=\"m-b-md ng-pristine ng-valid\" ng-if=\"vm.cityInfo.supportSearch\">" + "            <div class=\"input-group\" uix-dropdown cols-num=\"1\" on-toggle=\"vm.setCityList(open)\">" + "              <input type=\"text\" class=\"form-control input-sm city-search\" uix-dropdown-toggle placeholder=\"城市搜索\" ng-model=\"vm.searchedCity\" ng-change=\"vm.changeSearchCity()\">" + "              <span class=\"input-group-btn\"><button class=\"btn btn-sm btn-default bootstrap-touchspin-up\" type=\"button\"><i class=\"glyphicon glyphicon-search\"></i></button></span>" + "              <ul class=\"dropdown-menu uix-cityselect-dropdown-menu\" role=\"menu\" class=\"uix-cityselect-searchList\">" + "                <li ng-repeat=\"item in vm.searchList\" ng-click=\"vm.searchCityChose(item)\" ng-class=\"{'uix-cityselect-chosecity': vm.checkChosed(item)}\"><a title=\"{{item.cityName}}\">{{item.cityName}}</a></li>" + "              </ul>" + "            </div>" + "          </form>" + "        </div>" + "        <div class=\"col-sm-12 uix-cityselect-container\">" + "          <ul>" + "            <li class=\"uix-cityselect-cityselected\" ng-repeat=\"city in vm.cityInfo.chosedCity track by $index\" ng-if=\"vm.checkCityBelong(city)\">{{city.cityName}} <i class=\"glyphicon glyphicon-remove\" ng-click=\"vm.toggleChose(city)\" ng-if=\"!city.initChose\"></i></li>" + "          </ul>" + "        </div>" + "      </div>" + "    </div>" + "    <div>" + "      <div class=\"modal-header uix-cityselect-padding5\" ng-if=\"vm.cityInfo.isShowHot\">" + "        <h5 class=\"modal-title\">热门城市</h5>" + "      </div>" + "      <div  ng-if=\"vm.cityInfo.isShowHot\" class=\"modal-body\">" + "        <div class=\"uix-cityselect-showHot\">" + "          <button class=\"btn m-b-xs btn-sm  btn-addon hot-city\" style=\" \" ng-repeat=\"city in vm.cityInfo.hotCity track by $index\" ng-class=\"{'btn-success': vm.checkChosed(city), 'btn-default': !(vm.checkChosed(city))}\" ng-click=\"vm.toggleChose(city)\" ng-if=\"vm.checkCityBelong(city)\"><i class=\" pull-right glyphicon\"  ng-class=\"{'glyphicon-minus': vm.checkChosed(city), 'glyphicon-plus': !(vm.checkChosed(city))}\"></i>{{city.cityName}}</button>" + "        </div>" + "      </div>" + "      <div class=\"uix-cityselect-tab-container ng-isolate-scope\" ng-if=\"vm.cityInfo.supportGroup\">" + "        <ul class=\"nav nav-tabs\">" + "          <li class=\"city-tab\" role=\"presentation\" ng-repeat=\"item in vm.tabName track by $index\" ng-class=\"{active: $index===vm.cityInfo.innerTab}\" ng-click=\"vm.changeTab($index)\"><a>{{item}}</a></li>" + "        </ul>" + "        <div class=\"uix-cityselect-tab-content\">" + "          <div class=\"tab-pane col-sm-12 \" ng-repeat=\"item in vm.tabName track by $index\" ng-class=\"{active: $index===vm.cityInfo.innerTab}\">" + "            <div ng-repeat=\"word in vm.cityInfo.allCity[item] track by $index\">" + "              <h4>{{word.name}}</h4>" + "              <div>" + "                <button class=\"btn btn-sm m-b-xs w-xs btn-default uix-cityselect-cityButton\" ng-repeat=\"city in word.data track by $index\" city-id=\"city.cityId\" ng-class=\"{'btn-success': vm.checkChosed(city)}\" ng-disable=\"city.initChose\" ng-click=\"vm.toggleChose(city)\">{{city.cityName}}</button>" + "              </div>" + "            </div>" + "          </div>" + "        </div>" + "      </div>" + "      <div ng-if=\"!vm.cityInfo.supportGroup\">" + "        <div class=\"modal-header uix-cityselect-padding5\" >" + "          <h5 class=\"modal-title\">全部城市</h5>" + "        </div>" + "        <div class=\"modal-body\">" + "          <button class=\"btn btn-sm m-b-xs w-xs btn-default uix-cityselect-cityButton\" ng-repeat=\"city in vm.cityInfo.allCity track by $index\" city-id=\"city.cityId\" ng-class=\"{'btn-success': vm.checkChosed(city)}\" ng-disable=\"city.initChose\" ng-click=\"vm.toggleChose(city)\">{{city.cityName}}</button>" + "        </div>" + "      </div>" + "    </div>" + "  </div>" + "</div>" + "");
}]);
"use strict";

angular.module("datatable/templates/datatable-body-tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datatable-body-tpl.html", "<table" + "  ng-style=\"{width:$table.<%widthKey%>+'px'}\"" + "  class=\"uix-datatable-tbody\"" + "  cellspacing=\"0\"" + "  cellpadding=\"0\"" + "  border=\"0\"" + ">" + "  <colgroup>" + "    <col" + "      ng-repeat=\"col in $table.<%columnsKey%> track by col.__id\"" + "      width=\"{{col._width}}\"" + "    />" + "  </colgroup>" + "  <tbody>" + "    <tr" + "      <%repeatExp%>=\"(rowIndex, row) in $table.data\"" + "      class=\"uix-datatable-normal-row\"" + "      ng-mouseenter=\"$table.handleMouseIn($event,rowIndex)\"" + "      ng-mouseleave=\"$table.handleMouseOut($event,rowIndex)\"" + "      ng-class=\"[$table.dataObj[rowIndex]._rowClassName,$table.dataObj[rowIndex]._isHover?'uix-datatable-row-hover':'']\"" + "      ng-click=\"$table.handleClickRow($event,row, rowIndex)\"" + "      <%rowHeightExp%>" + "    >" + "     <%template%>" + "    </tr>" + "    <%expand%>" + "  </tbody>" + "</table>" + "");
}]);
"use strict";

angular.module("datatable/templates/datatable-foot.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datatable-foot.html", "<div class=\"uix-datatable-foot\">" + "  <select" + "    class=\"form-control input-sm uix-datatable-page-sizer\"" + "    ng-change=\"handleSizerChange()\"" + "    ng-model=\"$table.pagination.pageSize\"" + "    ng-if=\"$table.showSizer\"" + "  >" + "    <option value=\"{{pagesize}}\" ng-repeat=\"pagesize in pageSizes track by $index\">" + "        {{pagesize}}条/页" + "    </option>" + "  </select>" + "  <uix-pager" + "    total-items=\"$table.pagination.totalCount\"" + "    ng-model=\"$table.pagination.pageNo\"" + "    items-per-page=\"$table.pagination.pageSize\"" + "    class=\"pagination-sm uix-datatable-pagination\"" + "    ng-change=\"handlePageChange()\"" + "  ></uix-pager>" + "</div>" + "");
}]);
"use strict";

angular.module("datatable/templates/datatable-head-tpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datatable-head-tpl.html", "<table" + "  class=\"uix-datatable-thead\"" + "  ng-style=\"{width:$table.<%widthKey%>+'px'}\"" + "  cellspacing=\"0\"" + "  cellpadding=\"0\"" + "  border=\"0\"" + ">" + "  <colgroup>" + "    <col" + "      ng-repeat=\"col in $table.<%columnsKey%> track by col.__id\"" + "      width=\"{{ col._width }}\"" + "    />" + "  </colgroup>" + "  <thead>" + "    <tr" + "      ng-repeat=\"(rowIndex, cols) in $table.<%columnRowsKey%> track by rowIndex\"" + "    >" + "      <th" + "        ng-repeat=\"(colIndex, column) in cols track by colIndex\"" + "        colspan=\"{{:: column.colSpan }}\"" + "        rowspan=\"{{:: column.rowSpan }}\"" + "        ng-class=\"$table.alignCls(column)\"" + "      >" + "        <div ng-class=\"{'uix-datatable-sort-cell':column.sortable}\" class=\"uix-datatable-cell\"  ng-click=\"$table.handleSortByHead(column)\">" + "          <div ng-if=\"column.__renderHeadType==='normal'\">" + "            <span>{{:: column.title || '#' }}</span>" + "            <i ng-class=\"column.hintIcon||'glyphicon glyphicon-question-sign'\" ng-if=\"column.hint\"" + "            tooltip-append-to-body=\"true\" tooltip-placement=\"bottom\" uix-tooltip=\"{{column.hint}}\"></i> " + "          </div>" + "          <div ng-if=\"column.__renderHeadType==='expand'\">" + "          </div>" + "          <div ng-if=\"column.__renderHeadType==='selection'\">" + "              <input type=\"checkbox\" ng-change=\"$table.handleSelectAll()\" ng-if=\"!column.singleSelect\" ng-model=\"$table.isSelectedAll\">" + "          </div>" + "          <div ng-if=\"column.__renderHeadType === 'template'\">" + "            <%template%>" + "          </div>" + "          <div ng-if=\"column.__renderHeadType==='format'\">" + "            {{ ::column.headerFormat(column) }}" + "            <i ng-class=\"column.hintIcon||'glyphicon glyphicon-question-sign'\" ng-if=\"column.hint\"" + "            tooltip-append-to-body=\"true\" tooltip-placement=\"bottom\" uix-tooltip=\"{{column.hint}}\"></i> " + "          </div>" + "          <span class=\"uix-datatable-sort\" ng-if=\"column.sortable\">" + "            <i" + "              class=\"uix-datatable-sort-up\"" + "              ng-class=\"{on: column._sortType === 'asc'}\"" + "              ng-click=\"$table.handleSort(column, 'asc', $event)\"" + "            ></i>" + "            <i" + "              class=\"uix-datatable-sort-down\"" + "              ng-class=\"{on: column._sortType === 'desc'}\"" + "              ng-click=\"$table.handleSort(column, 'desc', $event)\"" + "            ></i>" + "          </span>" + "        </div>" + "      </th>" + "    </tr>" + "  </thead>" + "</table>" + "");
}]);
"use strict";

angular.module("datatable/templates/datatable-table-left.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datatable-table-left.html", "<div" + "  class=\"uix-datatable-fixed uix-datatable-fixed-left\"" + "  ng-style=\"{width:$table.leftTableWidth}\"" + ">" + "  <div class=\"uix-datatable-left-header\"><%head%></div>" + "  <div" + "    class=\"uix-datatable-left-body\"" + "    ng-style=\"{top:$table.headerHeight+'px',bottom:$table.showHorizontalScrollBar?$table.scrollBarWidth+'px':0}\"" + "  >" + "  <%body%>" + "  </div>" + "</div>" + "");
}]);
"use strict";

angular.module("datatable/templates/datatable-table-main.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datatable-table-main.html", "<div class=\"uix-datatable-main-table\">" + "  <div class=\"uix-datatable-main-header\"><%head%></div>" + "  <div class=\"uix-datatable-main-body\" ng-style=\"$table.bodyStyle\">" + "    <%body%>" + "  </div>" + "</div>" + "");
}]);
"use strict";

angular.module("datatable/templates/datatable-table-right.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datatable-table-right.html", "<div" + "  class=\"uix-datatable-fixed uix-datatable-fixed-right\"" + "  ng-style=\"{width:$table.rightTableWidth,right:$table.showVerticalScrollBar?$table.scrollBarWidth+'px':0}\"" + ">" + "  <div" + "    class=\"uix-datatable-right-header\"" + "  ><%head%></div>" + "  <div" + "    class=\"uix-datatable-right-body\"" + "    ng-style=\"{top:$table.headerHeight+'px',bottom:$table.showHorizontalScrollBar?$table.scrollBarWidth+'px':0}\"" + "  >" + "  <%body%>" + "  </div>" + "</div>" + "");
}]);
"use strict";

angular.module("datatable/templates/datatable.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datatable.html", "<div" + "  class=\"uix-datatable\"" + "  ng-class=\"{" + "    'uix-datatable-bordered':$table.isBordered," + "    'uix-datatable-striped':$table.isStriped," + "    'uix-datatable-has-status':$table.isEmpty||$table.isLoading||$table.isError," + "  }\"" + ">" + "  <div class=\"uix-datatable-wrap\" ng-style=\"{height:$table.containerHeight}\">" + "      <div class=\"uix-datatable-content\"></div>" + "      <div class=\"uix-datatable-empty\" ng-style=\"{top:$table.headerHeight+'px'}\" ng-if=\"$table.isEmpty\">" + "        <span class=\"inner-text\">{{ emptyText }}</span>" + "      </div>" + "      <div class=\"uix-datatable-loading\" ng-style=\"{top:$table.headerHeight+'px'}\" ng-show=\"$table.isLoading\">" + "        <span class=\"inner-text\">" + "          <i class=\"loading-icon glyphicon glyphicon-refresh\"></i>" + "          <span>{{ loadingText }}</span>" + "        </span>" + "      </div>" + "      <div class=\"uix-datatable-error\" ng-style=\"{top:$table.headerHeight+'px'}\" ng-show=\"$table.isError\">" + "        <span class=\"inner-text\">" + "          <span>{{ errorText }}</span>" + "        </span>" + "      </div>" + "  </div>" + "  <div class=\"uix-datatable-footer\" ng-if=\"$table.showPagination\">" + "    <uix-datatable-foot></uix-datatable-foot>" + "  </div>" + "  <!-- 横纵向同时滚动时填充右上角 -->" + "  <div" + "    class=\"uix-datatable-right-header-block\"" + "    ng-if=\"$table.showVerticalScrollBar\"" + "    ng-style=\"{width:$table.scrollBarWidth+'px',height:$table.headerHeight+'px'}\"" + "  ></div>" + "</div>" + "");
}]);
"use strict";

angular.module("datepicker/templates/datepicker-calendar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datepicker-calendar.html", "<uix-calendar ng-model=\"selectDate\"" + "              on-change=\"changeDateHandler\"" + "              exceptions=\"exceptions\"" + "              min-date=\"minDate\"" + "              max-date=\"maxDate\"" + "              show-time=\"showTime\"" + "              show-seconds=\"showSeconds\"" + "              date-filter=\"dateFilterProp($date)\">" + "</uix-calendar>");
}]);
"use strict";

angular.module("datepicker/templates/datepicker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/datepicker.html", "<div class=\"uix-datepicker\">" + "    <div class=\"input-group\" popover-class=\"uix-datepicker-popover\" popover-trigger=\"none\" popover-is-open=\"showCalendar\"" + "         popover-placement=\"{{placement}}\" uix-popover-template=\"'templates/datepicker-calendar.html'\" popover-append-to-body=\"appendToBody\">" + "        <input type=\"text\" ng-class=\"{'input-sm':size==='sm','input-lg':size==='lg'}\"" + "               ng-disabled=\"isDisabled\" class=\"form-control uix-datepicker-input\"" + "               ng-click=\"toggleCalendarHandler($event)\" placeholder=\"{{placeholder}}\"" + "               ng-model=\"inputValue\" readonly>" + "        <span class=\"input-group-btn\" ng-if=\"clearBtn\">" + "            <button ng-class=\"{'btn-sm':size==='sm','btn-lg':size==='lg'}\" ng-disabled=\"isDisabled\" class=\"btn btn-default uix-datepicker-remove\" type=\"button\" ng-click=\"clearDateHandler($event)\">" + "                <i class=\"glyphicon glyphicon-remove\"></i>" + "            </button>" + "        </span>" + "        <span class=\"input-group-btn\">" + "            <button ng-class=\"{'btn-sm':size==='sm','btn-lg':size==='lg'}\" ng-disabled=\"isDisabled\" class=\"btn btn-default uix-datepicker-toggle\" type=\"button\" ng-click=\"toggleCalendarHandler($event)\">" + "                <i class=\"glyphicon glyphicon-calendar\"></i>" + "            </button>" + "        </span>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("form/templates/form.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/form.html", "<div class=\"panel-body\" >" + "    <div class=\"uix-form\" ng-class=\"{'form-horizontal':$form.layout==='horizontal','row':$form.layout==='vertical'&&!buttonInline,'uix-form-flex': $form.layout==='inline'}\">" + "        <div ng-class=\"{" + "            'col-md-{{item.colWidth?item.colWidth:3}}': $form.layout==='inline'," + "            'form-group row uix-form-m-b-md uix-form-l-h': $form.layout==='horizontal'," + "            'col-md-{{item.rowWidth?item.rowWidth:6}} uix-form-m-b-md uix-form-l-h': $form.layout==='vertical'" + "        }\" ng-repeat=\"item in data\">" + "        <labe ng-class=\"{" + "                'uix-form-necessary':item.necessary," + "                'text-right':textalign==='right'," + "                'col-md-{{item.labelWidth?item.labelWidth:2}}': $form.layout==='horizontal'," + "                'col-md-{{item.labelWidth?item.labelWidth:4}}': $form.layout==='vertical'" + "            }\" ng-if=\"item.type!=='tpl'\">" + "            {{item.text}}{{colon?':':''}}" + "            <i ng-class=\"item.tooltip.icon?item.tooltip.icon:'glyphicon glyphicon-question-sign'\" ng-style=\"{'color':'{{item.tooltip.color?item.tooltip.color:red}}','cursor':'pointer'}\" uix-tooltip=\"{{item.tooltip.message}}\" tooltip-placement=\"top\" ng-if=\"item.tooltip\"></i>" + "        </labe>" + "        <div ng-class=\"{" + "            'uix-form-pos-rlt uix-form-m-b-md': $form.layout==='inline'," + "            'col-md-{{item.colWidth?item.colWidth:4}} uix-form-pos-rlt': $form.layout==='horizontal'," + "            'col-md-{{item.colWidth?item.colWidth:8}} uix-form-pos-rlt': $form.layout==='vertical'" + "        }\" ng-if=\"!item.template&&!item.templateUrl&&item.type!=='tpl'\">" + "            <input type=\"text\" class=\"form-control input-sm\" ng-if=\"item.type==='input'\" ng-model=\"item.value\" placeholder=\"{{item.placeholder}}\"" + "            ng-change=\"$form.onChange(item)\" ng-blur=\"$form.onBlur(item)\" ng-focus=\"$form.onFocus(item)\">" + "            <div class=\"row\" ng-if=\"item.type==='dateRange'\">" + "                <div class=\"col-md-6\">" + "                    <uix-datepicker size=\"sm\" max-date=\"item.value.endTime\" format=\"item.dateFormat\" ng-model=\"item.value.startTime\"" + "                    ng-change=\"$form.onChange(item)\" clear-btn=\"item.clearBtn\" show-time=\"item.showTime\"></uix-datepicker>" + "                </div>" + "                <div class=\"row pull-left text-center uix-form-m-l\">至</div>" + "                <div class=\"col-md-6\">" + "                    <uix-datepicker size=\"sm\" min-date=\"item.value.startTime\" format=\"item.dateFormat\" ng-model=\"item.value.endTime\"" + "                    ng-change=\"$form.onChange(item)\" clear-btn=\"item.clearBtn\" show-time=\"item.showTime\"></uix-datepicker>" + "                </div>" + "            </div>" + "            <uix-datepicker size=\"sm\" ng-model=\"item.value\" ng-if=\"item.type==='datepicker'\"  placeholder=\"{{item.placeholder}}\" format=\"item.dateFormat\"" + "            ng-change=\"$form.onChange(item)\" clear-btn=\"item.clearBtn\" show-time=\"item.showTime\"></uix-datepicker>" + "            <uix-select ng-model=\"item.value\" ng-if=\"item.type==='select'\" ng-change=\"$form.onChange(item)\">" + "                <uix-select-match placeholder=\"{{item.placeholder}}\">{{item.optionKey?$select.selected[item.optionKey]:$select.selected.desc}}</uix-select-match>" + "                <uix-select-choices repeat=\"option in item.options | filter:$select.search\">" + "                    <span>{{item.optionKey?option[item.optionKey]:option.desc}}</span>" + "                </uix-select-choices>" + "            </uix-select>" + "            <uix-select ng-model=\"item.value\" ng-if=\"item.type==='multipleSelect'\" ng-change=\"$form.onChange(item)\" multiple>" + "                <uix-select-match placeholder=\"{{item.placeholder}}\">{{$item.desc}}</uix-select-match>" + "                <uix-select-choices repeat=\"option in item.options | filter:$select.search\">" + "                    <span>{{option.desc}}</span>" + "                </uix-select-choices>" + "            </uix-select>" + "            <label class=\"uix-form-checks uix-form-m-r\" ng-repeat=\"option in item.options\" ng-if=\"item.type==='checkbox'\">" + "                <input type=\"checkbox\" ng-model=\"item.value[option]\" ng-change=\"$form.onChange(item)\">" + "                <i></i>{{option}}" + "            </label>" + "            <label class=\"uix-form-checks uix-form-m-r\" ng-repeat=\"option in item.options\" ng-if=\"item.type==='radio'\" ng-disabled=\"item.disabled\">" + "                <input type=\"radio\" ng-model=\"item.value\" ng-value=\"option.value\" ng-change=\"$form.onChange(item)\"><i></i>{{option.label}}" + "            </label>" + "            <!-- 校验提示文案 -->" + "            <div ng-show=\"!item.passCheck\" class=\"uix-form-tipinfo uix-form-pos-abt uix-form-text-xs uix-form-text-{{item.errorInfo.type}}\">{{item.errorInfo.message}}</div>" + "            <!-- 提示文案 -->" + "            <div ng-show=\"item.passCheck&&item.promptInformation\" class=\"uix-form-tipinfo uix-form-pos-abt uix-form-text-xs uix-form-text-{{item.promptInformation.type}}\">{{item.promptInformation.message}}</div>" + "        </div>" + "        <!-- 自定义模板 -->" + "        <div ng-class=\"{" + "            'uix-form-pos-rlt uix-form-m-b-md': $form.layout==='inline'," + "            'col-md-{{item.colWidth?item.colWidth:8}} uix-form-pos-rlt tplHtml': item.type!=='tpl' && $form.layout!=='inline'," + "            'tplHtml': item.type==='tpl'" + "        }\" ng-if=\"item.templateUrl||item.template\">" + "            <div class=\"tplHtml{{item.templateName}}\"></div>" + "            {{$form.renderTpl(item)}}" + "        </div>" + "    </div>" + "    </div>" + "    <div ng-class=\"{row: !buttonInline}\" class=\"text-center\" ng-if=\"showBtn\">" + "        <button type=\"button\" ng-class=\"{'uix-form-m-t-md':buttonInline}\" class=\"uix-form-btn btn-sm uix-form-w-sm uix-form-btn-default uix-form-btn-primary\" ng-click=\"$form.confirm()\" ng-disabled=\"disabled\">" + "            {{confirmText?confirmText:'提交'}}" + "        </button>" + "        <button type=\"button\" ng-class=\"{'uix-form-m-t-md':buttonInline}\" class=\"uix-form-m-l-md uix-form-btn btn-sm uix-form-w-sm uix-form-btn-default\" ng-click=\"$form.cancle()\" ng-if=\"cancelButton\">" + "            {{cancelText?cancelText:'取消'}}" + "        </button>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("modal/templates/backdrop.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/backdrop.html", "<div class=\"modal-backdrop fade {{ backdropClass }}\"" + "     ng-class=\"{in: animate}\"" + "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"" + "></div>" + "");
}]);
"use strict";

angular.module("modal/templates/confirm.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/confirm.html", "<!-- 公共的confirmModal -->" + "<div class=\"modal-body\" ng-bind=\"modalBodyText\"></div>" + "<div class=\"modal-footer\">" + "    <uix-button class=\"btn btn-primary btn-sm\" b-type=\"button\" ng-click=\"ok()\" loading=\"loading\" ng-disabled=\"loading\">{{confirmBtnText}}</uix-button>" + "    <button class=\"btn btn-default btn-sm\" ng-click=\"cancel()\">{{cancelBtnText}}</button>" + "</div>" + "");
}]);
"use strict";

angular.module("modal/templates/window.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/window.html", "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\" ng-click=\"close($event)\">" + "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg', 'modal-xl': size == 'xl'}\">" + "        <div class=\"modal-content\" uix-modal-transclude></div>" + "    </div>" + "</div>");
}]);
"use strict";

angular.module("notify/templates/notify.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/notify.html", "<div class=\"uix-notify-container\" ng-class=\"wrapperClasses()\">" + "    <div class=\"uix-notify-item alert\" ng-repeat=\"message in notifyServices.directives[referenceId].messages\"" + "         ng-class=\"alertClasses(message)\" ng-click=\"stopTimeoutClose(message)\">" + "        <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\"" + "                ng-click=\"notifyServices.deleteMessage(message)\" ng-show=\"!message.disableCloseButton\">&times;</button>" + "        <button type=\"button\" class=\"close\" aria-hidden=\"true\" ng-show=\"showCountDown(message)\">{{message.countdown}}" + "        </button>" + "        <h4 class=\"uix-notify-title\" ng-show=\"message.title\" ng-bind=\"message.title\"></h4>" + "        <div ng-if=\"message.allowTag\" class=\"uix-notify-message\" ng-bind-html=\"message.text\"></div>" + "        <div ng-if=\"!message.allowTag\" class=\"uix-notify-message\" ng-bind=\"message.text\"></div>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("pager/templates/pager.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/pager.html", "<ul class=\"pagination\">" + "    <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: isFirst()}\">" + "        <a href=\"javascript:;\" ng-click=\"selectPage(1)\">{{getText('first')}}</a>" + "    </li>" + "    <li ng-if=\"directionLinks\" ng-class=\"{disabled: isFirst()}\">" + "        <a href=\"javascript:;\" ng-click=\"selectPage(page - 1)\">{{getText('previous')}}</a>" + "    </li>" + "    <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active}\">" + "        <a href=\"javascript:;\" ng-click=\"selectPage(page.number)\">{{page.text}}</a>" + "    </li>" + "    <li ng-if=\"directionLinks\" ng-class=\"{disabled: isLast()}\">" + "        <a href=\"javascript:;\" ng-click=\"selectPage(page + 1)\">{{getText('next')}}</a>" + "    </li>" + "    <li ng-if=\"boundaryLinks\" ng-class=\"{disabled: isLast()}\">" + "        <a href=\"javascript:;\" ng-click=\"selectPage(totalPages)\">{{getText('last')}}</a>" + "    </li>" + "    <li ng-if=\"showTotal\" class=\"disabled\">" + "        <a href=\"javascript:;\">共{{totalPages}}页/{{totalItems}}条</a>" + "    </li>" + "</ul>");
}]);
"use strict";

angular.module("progressbar/templates/bar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/bar.html", "<div class=\"progress-bar\"" + "     ng-class=\"type && 'progress-bar-' + type\"" + "     role=\"progressbar\"" + "     aria-valuenow=\"{{value}}\"" + "     aria-valuemin=\"0\"" + "     aria-valuemax=\"{{max}}\"" + "     ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\"" + "     aria-valuetext=\"{{percent | number:0}}%\"" + "     title=\"{{title}}\" ng-transclude>" + "</div>");
}]);
"use strict";

angular.module("progressbar/templates/progress.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/progress.html", "<div class=\"progress\" title=\"{{title}}\" ng-transclude></div>");
}]);
"use strict";

angular.module("progressbar/templates/progressbar.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/progressbar.html", "<div class=\"progress\">" + "    <div class=\"progress-bar\"" + "         ng-class=\"type && 'progress-bar-' + type\"" + "         role=\"progressbar\"" + "         aria-valuenow=\"{{value}}\"" + "         aria-valuemin=\"0\"" + "         aria-valuemax=\"{{max}}\"" + "         ng-style=\"{width: (percent < 100 ? percent : 100) + '%'}\"" + "         aria-valuetext=\"{{percent | number:0}}%\"" + "         title=\"{{title}}\" ng-transclude></div>" + "</div>");
}]);
"use strict";

angular.module("rate/templates/rate.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/rate.html", "<ul class=\"uix-rates\" ng-class=\"{'uix-rates-disabled': readOnly}\" ng-mouseleave=\"leaveFn()\">" + "    <li ng-repeat=\"rate in rates track by $index\" class=\"uix-rate {{rate.ratingIcon}}\"" + "        ng-mouseenter=\"enterLiFn($index, $event)\" ng-class=\"{'half-score': allowHalf, 'full-score': $index < ngModel}\"" + "        ng-mouseleave=\"leaveLiFn($index)\" ng-click=\"clickLiFn($index)\"  ng-style=\"{'color': $index < ngModel && ratingSelectColor }\">" + "        <!--实现half的时候,需要考虑内层div的cursor属性,好像不继承-->" + "        <!--<div class=\"half-modal  {{rate.ratingIcon}}\" ng-mouseenter=\"enterDivFn($index, $event)\"></div>-->" + "    </li>" + "</ul>");
}]);
"use strict";

angular.module("searchBox/templates/searchBox.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/searchBox.html", "<div ng-class=\"{'input-group':showBtn}\">" + "    <input type=\"text\" class=\"input-sm form-control\" ng-keyup=\"keyUpToSearch($event)\" placeholder=\"{{placeholder}}\" ng-model=\"searchBox.query\">" + "    <span class=\"input-group-btn\" ng-if=\"showBtn\">" + "        <button class=\"btn btn-sm btn-default\" type=\"button\" ng-click=\"doSearch()\">{{getText()}}</button>" + "    </span>" + "</div>" + "");
}]);
"use strict";

angular.module("select/templates/choices.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/choices.html", "<ul class=\"uix-select-choices uix-select-choices-content uix-select-dropdown dropdown-menu\"" + "    role=\"listbox\"" + "    ng-show=\"$select.items.length > 0\">" + "  <li class=\"uix-select-choices-group\">" + "    <div class=\"divider\" ng-show=\"$select.isGrouped && $index > 0\"></div>" + "    <div ng-show=\"$select.isGrouped\" class=\"uix-select-choices-group-label dropdown-header\" ng-bind=\"$group.name\"></div>" + "    <div class=\"uix-select-choices-row\"" + "    ng-class=\"{active: $select.isActive(this), disabled: $select.isDisabled(this)}\" role=\"option\">" + "      <a href=\"javascript:void(0)\" class=\"uix-select-choices-row-inner\"></a>" + "    </div>" + "  </li>" + "</ul>" + "");
}]);
"use strict";

angular.module("select/templates/match-multiple.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/match-multiple.html", "<span class=\"uix-select-match\">" + "  <span ng-repeat=\"$item in $select.selected track by $index\">" + "    <span" + "      class=\"uix-select-match-item btn btn-default btn-sm\"" + "      tabindex=\"-1\"" + "      type=\"button\"" + "      ng-disabled=\"$select.disabled\"" + "      ng-click=\"$selectMultiple.activeMatchIndex = $index;\"" + "      ng-class=\"{'btn-primary':$selectMultiple.activeMatchIndex === $index, 'select-locked':$select.isLocked(this, $index)}\"" + "      uix-select-sort=\"$select.selected\">" + "        <span class=\"close uix-select-match-close\" ng-hide=\"$select.disabled\" ng-click=\"$selectMultiple.removeChoice($index)\">&nbsp;&times;</span>" + "        <span uix-transclude-append></span>" + "    </span>" + "  </span>" + "</span>" + "");
}]);
"use strict";

angular.module("select/templates/match.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/match.html", "<div class=\"uix-select-match\" ng-hide=\"$select.open\" ng-disabled=\"$select.disabled\" ng-class=\"{'uix-select-focus':$select.focus}\">" + "  <span tabindex=\"-1\"" + "      class=\"btn btn-default btn-sm btn-block uix-select-toggle\"" + "      aria-label=\"{{ $select.baseTitle }} activate\"" + "      ng-disabled=\"$select.disabled\"" + "      ng-click=\"$select.activate()\">" + "    <span ng-show=\"$select.isEmpty()\" class=\"uix-select-placeholder text-muted\">{{$select.placeholder}}</span>" + "    <span ng-hide=\"$select.isEmpty()\" class=\"uix-select-match-text pull-left\" ng-class=\"{'uix-select-allow-clear': $select.allowClear && !$select.isEmpty()}\" ng-transclude=\"\"></span>" + "    <i class=\"caret pull-right\" ng-click=\"$select.toggle($event)\"></i>" + "    <a ng-if=\"$select.allowClear && !$select.isEmpty()\" aria-label=\"{{ $select.baseTitle }} clear\"" + "      ng-click=\"$select.clear($event)\" class=\"uix-select-allowclear btn btn-xs btn-link pull-right\">" + "      <i class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></i>" + "    </a>" + "  </span>" + "</div>" + "");
}]);
"use strict";

angular.module("select/templates/select-multiple.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/select-multiple.html", "<div class=\"uix-select-container uix-select-multiple uix-select dropdown form-control\" ng-class=\"{open: $select.open}\">" + "  <div>" + "    <div class=\"uix-select-match\"></div>" + "    <input type=\"text\"" + "           autocomplete=\"off\"" + "           autocorrect=\"off\"" + "           autocapitalize=\"off\"" + "           spellcheck=\"false\"" + "           class=\"uix-select-search input-sm\"" + "           placeholder=\"{{$selectMultiple.getPlaceholder()}}\"" + "           ng-disabled=\"$select.disabled\"" + "           ng-hide=\"$select.disabled\"" + "           ng-click=\"$select.activate()\"" + "           ng-model=\"$select.search\"" + "           role=\"combobox\"" + "           aria-label=\"{{ $select.baseTitle }}\"" + "           ondrop=\"return false;\">" + "  </div>" + "  <div class=\"uix-select-choices\"></div>" + "</div>" + "");
}]);
"use strict";

angular.module("select/templates/select.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/select.html", "<div class=\"uix-select-container uix-select dropdown\" ng-class=\"{open: $select.open}\">" + "  <div class=\"uix-select-match\"></div>" + "  <input type=\"text\" autocomplete=\"off\" tabindex=\"-1\"" + "         aria-expanded=\"true\"" + "         aria-label=\"{{ $select.baseTitle }}\"" + "         class=\"form-control uix-select-search input-sm\"" + "         placeholder=\"{{$select.placeholder}}\"" + "         ng-model=\"$select.search\"" + "         ng-show=\"$select.searchEnabled && $select.open\">" + "  <div class=\"uix-select-choices\"></div>" + "</div>" + "");
}]);
"use strict";

angular.module("step/templates/step.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/step.html", "<div class=\"uix-step\">" + "    <div class=\"step-head-{{direction}} step-head step-{{size}}-{{direction}}\">" + "        <span ng-if=\"!!icon\" class=\"step-icon step-icon-icon\" ng-style=\"{'color':iconColor}\">" + "            <i class=\"fa {{icon}}\" aria-hidden=\"true\"></i>" + "        </span>" + "" + "        <span ng-if=\"!icon\" class=\"step-icon step-{{status}}\">" + "            <span ng-if=\"(status=='wait')||(status=='process')\">{{num+1}}</span>" + "            <i ng-if=\"status!=('wait'||'process')\" class=\"fa\"" + "               ng-class=\"{'fa-check':status=='finish','fa-times':status=='error'}\"></i>" + "        </span>" + "        <span class=\"step-line step-line-{{size}} step-{{status}}\">&nbsp;</span>" + "    </div>" + "" + "    <div class=\"step-content-{{direction}}\">" + "        <span class=\"step-title step-{{status}}-color\">{{title}}</span>" + "        <br>" + "        <span class=\"step-desc step-{{status}}-color\">{{desc}}</span>" + "    </div>" + "</div>" + "" + "" + "" + "");
}]);
"use strict";

angular.module("switch/templates/switch.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/switch.html", "<label class=\"uix-switch\" ng-class=\"['uix-switch-'+switchObj.type,'uix-switch-'+switchObj.size]\">" + "    <input type=\"checkbox\" ng-change=\"changeSwitchHandler()\" ng-disabled=\"switchObj.isDisabled\" ng-model=\"switchObj.query\"/>" + "    <i></i>" + "</label>");
}]);
"use strict";

angular.module("tabs/templates/tab.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/tab.html", "<li ng-class=\"{'active': active, 'disabled': disabled}\" ng-click=\"changeTab()\">" + "    <a href ng-bind-html=\"heading\"></a>" + "</li>");
}]);
"use strict";

angular.module("tabs/templates/tabs.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/tabs.html", "<div>" + "    <!--<ul ng-transclude class=\"nav nav-{{type}}\" ng-class=\"{'nav-stacked': tabPosition === 'left'}\"></ul>-->" + "    <ul ng-transclude class=\"nav nav-{{type}}\"></ul>" + "    <div class=\"tab-content\">" + "        <div ng-repeat=\"tab in tabsCtrl.tabs\" ng-class=\"{'tab-panel-hidden': tabsCtrl.active !== tab.index}\">" + "            <uix-tab-panel tab=\"tab\"></uix-tab-panel>" + "        </div>" + "    </div>" + "</div>");
}]);
"use strict";

angular.module("timeline/templates/timeline.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/timeline.html", "<div class=\"timeline\" ng-class=\"{'timeline-alternate': mode === 'alternate', 'timeline-pending': pending, 'timeline-reverse': reverse}\">" + "    <uix-timeline-item" + "            ng-repeat=\"dot in nodeData track by $index\"" + "            dot=\"dot\"" + "            first=\"$first\"" + "            last=\"$last\"" + "            mode=\"$parent.mode==='alternate'?($index%2?'left':'right'):$parent.mode\"" + "            reverse=\"$parent.reverse\"" + "            show-tail=\"!$last\"" + "            pending=\"(!$parent.reverse&&$last&&$parent.pending)||($parent.reverse&&$first&&$parent.pending)\">" + "    </uix-timeline-item>" + "</div>");
}]);
"use strict";

angular.module("timeline/templates/timelineItem.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/timelineItem.html", "<div class=\"timeline-item timeline-item-{{mode}}\"" + "     ng-class=\"{'timeline-item-last': last, 'timeline-item-first': first, 'timeline-item-pending': pending}\">" + "    <div class=\"timeline-item-dot timeline-item-dot-{{dot.color}}\"" + "         ng-class=\"{'timeline-item-dot-custom': dot.icon ,'timeline-item-dot-reverse': reverse}\">" + "        <span class=\"icon-wrap\" ng-if=\"dot.icon\">" + "            <i class=\"{{dot.icon}}\" aria-hidden=\"true\"></i>" + "        </span>" + "    </div>" + "    <div class=\"timeline-item-tail\" ng-if=\"showTail\"></div>" + "    <div class=\"timeline-item-content\" ng-class=\"{'timeline-item-content-custom': dot.icon}\">" + "        <div class=\"timeline-item-content-title\">{{dot.title||''}}</div>" + "        <div class=\"timeline-item-content-desc\" ng-bind-html=\"$sce.trustAsHtml(dot.desc)\"></div>" + "        <div class=\"timeline-item-content-other\">{{dot.other||''}}</div>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("timepicker/templates/timepicker-timepanel.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/timepicker-timepanel.html", "<uix-timepanel readonly-input=\"readonlyInput\" hour-step=\"hourStep\" minute-step=\"minuteStep\"" + "second-step=\"secondStep\" ng-model=\"selectedTime\"" + "on-change=\"changeTime\" min-time=\"minTime\" max-time=\"maxTime\" show-seconds=\"showSeconds\">" + "</uix-timepanel>");
}]);
"use strict";

angular.module("timepicker/templates/timepicker.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/timepicker.html", "<div class=\"uix-timepicker\">" + "    <div class=\"input-group\" popover-class=\"uix-timepicker-popover\" popover-trigger=\"none\" popover-is-open=\"showTimepanel\"" + "         popover-placement=\"auto bottom-left\" uix-popover-template=\"'templates/timepicker-timepanel.html'\" popover-append-to-body=\"appendToBody\">" + "        <input type=\"text\" ng-disabled=\"isDisabled\" ng-class=\"{'input-sm':size==='sm','input-lg':size==='lg'}\"" + "               class=\"form-control uix-timepicker-input\" ng-click=\"toggleTimepanel($event)\"" + "               placeholder=\"{{placeholder}}\" ng-model=\"inputValue\" readonly>" + "        <span class=\"input-group-btn\">" + "            <button ng-disabled=\"isDisabled\" ng-class=\"{'btn-sm':size==='sm','btn-lg':size==='lg'}\" class=\"btn btn-default\" type=\"button\" ng-click=\"toggleTimepanel($event)\">" + "                <i class=\"glyphicon glyphicon-time\"></i>" + "            </button>" + "        </span>" + "    </div>" + "</div>" + "");
}]);
"use strict";

angular.module("typeahead/templates/typeaheadTpl.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("templates/typeaheadTpl.html", "<div class=\"btn-group\">" + "    <input type=\"text\" ng-model=\"typeahead.query\" class=\"input-sm form-control\">" + "    <ul uix-typeahead-popup class=\"dropdown-menu typeahead-menu\" ng-show=\"isShow\">" + "        <li ng-repeat=\"item in matchList track by $index\" ng-click=\"selectItem(item)\" ng-class=\"{active: isActive($index)}\">" + "            <a ng-bind-html=\"item.html|html\"></a>" + "        </li>" + "    </ul>" + "</div>" + "");
}]);