describe('uix-notify', function () {

    var $compile,
        $rootScope;

    beforeEach(module('ui.xg.notify'));
    beforeEach(module('notify/templates/notify.html'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Replaces the element with the appropriate content', function () {

        var notifyElement = $compile('<div uix-notify></div>')($rootScope);

        $rootScope.$digest();

        expect(notifyElement.html()).toContain('<div class="uix-notify-container uix-notify-fixed top-right"');
    });
});
