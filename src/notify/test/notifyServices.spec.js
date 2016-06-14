describe("notifyServices Spec", function() {

    var notifyServices;

    beforeEach(module('ui.fugu.notify'));
    beforeEach(module('notify/templates/notify.html'));
    beforeEach(inject(['notifyServices', function (ns) {
        notifyServices = ns;
    }]));

    /// TESTS
    it('Should be defined', function () {
        expect(notifyServices).toBeDefined();
    });
});