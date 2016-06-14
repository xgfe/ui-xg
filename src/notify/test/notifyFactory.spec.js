describe("notifyFactory Spec", function() {

    var notifyProvider,
        notifyServices;

    beforeEach(module('ui.fugu.notify'));
    beforeEach(module('notify/templates/notify.html'));
    beforeEach(inject(['notify', 'notifyServices', function (nf, ns) {
        notifyProvider = nf;
        notifyServices = ns;
    }]));

    /// TESTS
    it('Should be defined', function () {
        expect(notifyProvider).toBeDefined();
        expect(notifyServices).toBeDefined();
    });

    it('Should set proper values on default message types', function () {
        var builtinTypes = [
            'info',
            'error',
            'warning',
            'success'
        ];

        var severity;
        var sampleText = 'text';
        for (var i = 0; i < builtinTypes.length; i++) {

            severity = builtinTypes[i];
            expect(notifyProvider[severity]).toBeDefined();
            var msg = notifyProvider.general(sampleText, null, severity);

            expect(msg).toBeDefined();
            expect(msg.text.toString()).toEqual(sampleText);
            expect(msg.referenceId).toEqual(0);
            expect(msg.position).toEqual('top-right');
            expect(msg.severity).toEqual(severity);
        }
    });

    it('Should add and remove 1 message', function () {
        var msg = notifyProvider.info('text');

        expect(notifyServices.getAllMessages().length).toEqual(1);
        msg.destroy();
        expect(notifyServices.getAllMessages().length).toEqual(0);
    });

    it('Should be able to destroy all messages', function () {
        var messageCount = 10;
        for (var i = 0; i < messageCount; i++) {
            notifyProvider.info('Test ' + i);
        }

        expect(notifyServices.getAllMessages().length).toEqual(messageCount);

        notifyServices.destroyAllMessages();
        expect(notifyServices.getAllMessages().length).toEqual(0);

    });
});