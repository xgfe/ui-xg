describe("notifyProvider Spec", function() {
    var notifyProvider,
        notifyServices;

    beforeEach(module('ui.fugu.notify'));
    beforeEach(module('notify/templates/notify.html'));

    describe('Default Configuration', function() {

        beforeEach(inject(['notify', function (np) {
            notifyProvider = np;
        }]));

        // TESTS
        it('Should be defined', function () {
            expect(notifyProvider).toBeDefined();
        });

        it('Should get the default value', function(){
            expect(notifyProvider.position()).toEqual('top-right');
            expect(notifyProvider.onlyUnique()).toEqual(true);
            expect(notifyProvider.reverseOrder()).toEqual(false);
            expect(notifyProvider.inlineMessages()).toEqual(false);
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
                expect(msg.disableCloseButton).toEqual(false);
                expect(msg.disableIcons).toEqual(false);
                expect(msg.disableCountDown).toEqual(false);
            }
        });

        it('Should get default message type when call according function', function(){
            var text = 'notify info message';
            var warningMsg = notifyProvider.warning(text, null);
            var errorMsg = notifyProvider.error(text, null);
            var infoMsg = notifyProvider.info(text, null);
            var successMsg = notifyProvider.success(text, null);
            expect(warningMsg).toBeDefined();
            expect(errorMsg).toBeDefined();
            expect(infoMsg).toBeDefined();
            expect(successMsg).toBeDefined();
            expect(warningMsg.severity).toEqual('warning');
            expect(errorMsg.severity).toEqual('error');
            expect(infoMsg.severity).toEqual('info');
            expect(successMsg.severity).toEqual('success');
        });


    });
    describe('Provider Configuration', function() {

        beforeEach(function(){
            module(function(notifyProvider){
                notifyProvider.onlyUniqueMessages(false);
                notifyProvider.globalPosition('bottom-center');
                notifyProvider.globalReversedOrder(true);
                notifyProvider.globalInlineMessages(true);
                notifyProvider.globalTimeToLive(5000);
                notifyProvider.globalDisableCloseButton(true);
                notifyProvider.globalDisableIcons(true);
                notifyProvider.globalDisableCountDown(true);
            })
        });

        beforeEach(inject(['notify', function (np) {
            notifyProvider = np;
        }]));

        it('Should get the configured value', function() {
            expect(notifyProvider.position()).toEqual('bottom-center');
            expect(notifyProvider.onlyUnique()).toEqual(false);
            expect(notifyProvider.reverseOrder()).toEqual(true);
            expect(notifyProvider.inlineMessages()).toEqual(true);

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
                expect(msg.position).toEqual('bottom-center');
                expect(msg.severity).toEqual(severity);
                expect(msg.disableCloseButton).toEqual(true);
                expect(msg.disableIcons).toEqual(true);
                expect(msg.disableCountDown).toEqual(true);
            }
        });
    });


    describe('Services', function() {

        beforeEach(inject(['notify', 'notifyServices', function (nf, ns) {
            notifyProvider = nf;
            notifyServices = ns;
        }]));

        it('Should be defined', function () {
            expect(notifyProvider).toBeDefined();
            expect(notifyServices).toBeDefined();
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
});