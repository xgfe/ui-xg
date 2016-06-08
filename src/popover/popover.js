/**
 * popover
 * 提示指令
 * Author:heqingyang@meituan.com
 * Update:yjy972080142@gmail.com
 * Date:2016-02-18
 */
angular.module('ui.fugu.popover',['ui.fugu.tooltip'])

    .directive('fuguPopoverTemplatePopup', function() {
        return {
            replace: true,
            scope: { title: '@', contentExp: '&', placement: '@', popupClass: '@', animation: '&', isOpen: '&',
                originScope: '&' },
            templateUrl: 'templates/fugu-popover-template-popup.html'
        };
    })

    .directive('fuguPopoverTemplate', ['$fuguTooltip', function($fuguTooltip) {
        return $fuguTooltip('fuguPopoverTemplate', 'popover', 'click', {
            useContentExp: true
        });
    }])
    .directive('fuguPopoverHtmlPopup', function() {
        return {
            replace: true,
            scope: { contentExp: '&', title: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
            templateUrl: 'templates/fugu-popover-html-popup.html'
        };
    })

    .directive('fuguPopoverHtml', ['$fuguTooltip', function($fuguTooltip) {
        return $fuguTooltip('fuguPopoverHtml', 'popover', 'click', {
            useContentExp: true
        });
    }])

    .directive('fuguPopoverPopup', function() {
        return {
            replace: true,
            scope: { title: '@', content: '@', placement: '@', popupClass: '@', animation: '&', isOpen: '&' },
            templateUrl: 'templates/fugu-popover-popup.html'
        };
    })

    .directive('fuguPopover', ['$fuguTooltip', function($fuguTooltip) {
        return $fuguTooltip('fuguPopover', 'popover', 'click');
    }]);