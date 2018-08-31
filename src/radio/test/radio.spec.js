describe('ui.xg.radio', function () {
    var compile,
        scope,
        element;

    beforeEach(function () {
        module('ui.xg.radio');
        module('radio/templates/radio.html');
        module('radio/templates/radioBtn.html');
        module('radio/templates/radioGroup.html');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
            scope.value = '';
            scope.state = {
                plainOptions: ['Apple1', 'Pear', 'Orange'],
                options: [
                    {label: 'Apple233', value: 'Apple'},
                    {label: 'Pear', value: 'Pear'},
                    {label: 'Orange', value: 'Orange'}
                ],
                optionsWithDisabled: [
                    {label: 'Apple3', value: 'AppleValue'},
                    {label: 'Pear', value: 'PearValue', disabled: true},
                    {label: 'Orange', value: 'OrangeValue', disabled: false}
                ],
                value1: 'Pear',
                value2: 'Pear',
                value3: 'PearValue'
            };
            scope.demoFn = function (val) {
                scope.value = val;
            };

        });
    });

    function createRadio(template) {
        element = compile(angular.element(template))(scope);
        console.log(angular.element(template), '---', element);
        scope.$digest();
        return element;
    }

    function clickItem(el, index) {
        var ele = $(el).find('.uix-radio-input')[index];
        ele.click();
        scope.$digest();
        return ele;
    }

    it('A simple radio should output a label element', function () {
        var ele = createRadio('<uix-radio>Radio</uix-radio>');
        expect($(ele)[0].nodeName.toLocaleLowerCase()).toEqual('label');
        expect($(ele).find('.uix-radio-input')[0].value).toEqual('');
    });

    it('A set of mutually exclusive radio group should no err', function () {
        var ele = createRadio('<uix-radio-group name="demoName" value="2">' +
            '<uix-radio value="1">A</uix-radio>' +
            '<uix-radio value="2">B</uix-radio>' +
            '<uix-radio value="3">C</uix-radio>' +
            '<uix-radio value="4">D</uix-radio>' +
            '</uix-radio-group>');
        expect($(ele).find('.uix-radio-input').length).toEqual(0);

    });

    it('Configure options and click should no error', function () {
        var ele = createRadio('<uix-radio-group options="state.options" change-fn="demoFn(value)" value="state.value2"></uix-radio-group>');
        expect($(ele).find('label').length).toEqual(3);
        expect(scope.value).toEqual('');
        clickItem(ele, 0);
        expect(scope.value).toEqual('Apple');
    });



});
