/**
 * popover
 * 提示指令
 * Author:heqingyang@meituan.com
 * Update:yjy972080142@gmail.com
 * Date:2016-02-18
 */
angular.module('ui.xg.popover', ['ui.xg.tooltip'])

    .directive('uixPopoverTemplatePopup', function () {
        return {
            replace: true,
            scope: {
                title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
                originScope: '&'
            },
            templateUrl: 'templates/popover-template-popup.html'
        };
    })

    .directive('uixPopoverTemplate', ['$uixTooltip', function ($uixTooltip) {
        return $uixTooltip('uixPopoverTemplate', 'popover', 'click', {
            useContentExp: true
        });
    }])
    .directive('uixPopoverHtmlPopup', function () {
        return {
            replace: true,
            scope: {contentExp: '&', title: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&'},
            templateUrl: 'templates/popover-html-popup.html'
        };
    })

    .directive('uixPopoverHtml', ['$uixTooltip', function ($uixTooltip) {
        return $uixTooltip('uixPopoverHtml', 'popover', 'click', {
            useContentExp: true
        });
    }])

    .directive('uixPopoverPopup', function () {
        return {
            replace: true,
            scope: {title: '@', content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&'},
            templateUrl: 'templates/popover-popup.html'
        };
    })

    .directive('uixPopover', ['$uixTooltip', function ($uixTooltip) {
        return $uixTooltip('uixPopover', 'popover', 'click');
    }]);
