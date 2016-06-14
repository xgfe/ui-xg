describe("fugu-notify", function() {

    var $compile,
        $rootScope;

    beforeEach(module('ui.fugu.notify'));
    beforeEach(module('notify/templates/notify.html'));
    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Replaces the element with the appropriate content', function () {

        var notifyElement = $compile('<div fugu-notify></div>')($rootScope);

        $rootScope.$digest();

        expect(notifyElement.html()).toContain('<div class="fugu-notify-container fugu-notify-fixed top-right"');
    });
});