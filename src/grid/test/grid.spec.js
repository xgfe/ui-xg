describe('ui.xg.grid', function () {
    var compile,
        scope,
        element;

    beforeEach(function () {
        module('ui.xg.grid');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });

    function createElement(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    it('should create element', function () {
        createElement('<div uix-grid><div uix-grid-item></div></div>');
        expect(element.hasClass('uix-grid')).toBe(true);
        expect(element.children().length).toEqual(1);
    });

    it('should create same DOM when use restrict E', function () {
        createElement('<uix-grid><uix-grid-item></uix-grid-item></uix-grid>');
        expect(element.hasClass('uix-grid')).toBe(true);
        expect(element.children().length).toEqual(1);
    });

    it('should support grid valid value', function () {
        var attrs = {
            align: ['top', 'middle', 'bottom'],
            justify: ['start', 'end', 'center', 'around', 'between'],
            gutter: ['', 'true'],
            reverse: ['', 'true']
        };

        Object.keys(attrs).forEach(function (attr) {
            attrs[attr].forEach(function (value) {
                scope.media = {};
                scope.media[attr] = value;
                scope.value = value;

                createElement([
                    ' <uix-grid                             ',
                    '     uix-grid-' + attr + '="{{value}}" ',
                    '     uix-grid-xs="{{media}}"           ',
                    '     uix-grid-sm="{{media}}"           ',
                    '     uix-grid-md="{{media}}"           ',
                    '     uix-grid-lg="{{media}}"           ',
                    '     uix-grid-xl="{{media}}"           ',
                    '     uix-grid-xxl="{{media}}"          ',
                    ' ></uix-grid>                          '
                ].join(''));
                scope.$digest();
                var suffix = attr;
                if (['gutter', 'reverse'].indexOf(attr) < 0) {
                    suffix += '--' + value;
                }
                expect(element.hasClass('uix-grid-' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-xs-' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-sm-' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-md-' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-lg-' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-xl-' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-xxl-' + suffix)).toBe(true);
            });
        });
    });

    it('should support grid item valid value', function () {
        var attrs = {
            span: [0, 24],
            offset: [0, 24],
            order: [0, 24]
        };

        Object.keys(attrs).forEach(function (attr) {
            attrs[attr].forEach(function (value) {
                scope.media = {};
                scope.media[attr] = value;
                scope.value = value;

                createElement([
                    ' <uix-grid-item                             ',
                    '     uix-grid-item-' + attr + '="{{value}}" ',
                    '     uix-grid-item-xs="{{media}}"           ',
                    '     uix-grid-item-sm="{{media}}"           ',
                    '     uix-grid-item-md="{{media}}"           ',
                    '     uix-grid-item-lg="{{media}}"           ',
                    '     uix-grid-item-xl="{{media}}"           ',
                    '     uix-grid-item-xxl="{{media}}"          ',
                    ' ></uix-grid-item>'
                ].join(''));
                scope.$digest();
                var suffix = ['span'].indexOf(attr) < 0 ? '-' + attr : '';
                suffix += '--' + value;
                expect(element.hasClass('uix-grid-item' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-item-xs' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-item-sm' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-item-md' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-item-lg' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-item-xl' + suffix)).toBe(true);
                expect(element.hasClass('uix-grid-item-xxl' + suffix)).toBe(true);
            });
        });
    });

    it('should support unset value attr', function () {
        createElement([
            ' <uix-grid                  ',
            '     uix-grid-gutter        ',
            '     uix-grid-reverse       ',
            ' >                          ',
            '     <uix-grid-item         ',
            '         uix-grid-item-span ',
            '         uix-grid-item-xs   ',
            '         uix-grid-item-sm   ',
            '         uix-grid-item-md   ',
            '         uix-grid-item-lg   ',
            '         uix-grid-item-xl   ',
            '         uix-grid-item-xxl  ',
            '     ></uix-grid-item>      ',
            ' </uix-grid>                '
        ].join(''));

        expect(element.hasClass('uix-grid-gutter')).toBe(true);
        expect(element.hasClass('uix-grid-reverse')).toBe(true);
        expect(element.children().hasClass('uix-grid-item')).toBe(true);
        expect(element.children().hasClass('uix-grid-item-xs')).toBe(true);
        expect(element.children().hasClass('uix-grid-item-sm')).toBe(true);
        expect(element.children().hasClass('uix-grid-item-md')).toBe(true);
        expect(element.children().hasClass('uix-grid-item-lg')).toBe(true);
        expect(element.children().hasClass('uix-grid-item-xl')).toBe(true);
        expect(element.children().hasClass('uix-grid-item-xxl')).toBe(true);
    });
});
