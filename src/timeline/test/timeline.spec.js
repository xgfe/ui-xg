describe('ui.xg.timeline', function () {
    let compile, $scope, element;
    const createElement = opt => {
        const tpl = `<uix-timeline 
                        mode="${opt.mode || 'left'}" 
                        reverse="${opt.reverse || false}" 
                        pending="${opt.pending || false}" 
                        node-data="nodeData">
                    </uix-timeline>`;
        $scope.nodeData = opt.nodeData || [
            {
                'title': '标题一',
                'desc': '我是描述一',
                'other': '2018-09-06 12:39:39',
                'color': 'blue'
            }, {
                'title': '标题二',
                'desc': '我是描述二',
                'other': '2018-09-06 13:00:00',
                'color': 'red'
            }, {
                'title': '标题三',
                'desc': '我是描述三我是描述三<br>我是描述换行<p>我是描述换行我是描述换行</p>',
                'other': '2018-09-06 14:39:00',
                'color': 'green'
            }, {
                'title': 'Network problems being ',
                'other': '2015-09-01 14:39:00',
                'color': 'blue'
            }, {
                'title': 'Create a services site ',
                'desc': 'Solve initial network problems',
                'other': '2018-11-06 14:39:00',
                'color': 'green'
            }, {
                'title': 'loading...',
                'color': 'blue'
            }];
        element = compile(tpl)($scope);
        $scope.$digest();
    };

    beforeEach(function () {
        module('ui.xg.timeline');
        module('timeline/templates/timeline.html');
        module('timeline/templates/timelineItem.html');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            $scope = $rootScope.$new();
        });
    });

    afterEach(function () {});

    it('should create element', function () {
        createElement({});
        expect(element.attr('mode')).toEqual('left');
        expect(element.attr('reverse')).toEqual('false');
        expect(element.attr('pending')).toEqual('false');
        expect(element.hasClass('timeline')).toBe(true);
        expect(element.hasClass('timeline-pending')).toBe(false);
        expect(element.hasClass('timeline-reverse')).toBe(false);
        expect(element.hasClass('timeline-alternate')).toBe(false);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    it('has a "timeline" css class', function () {
        createElement({});
        expect(element).toHaveClass('timeline');
    });

    /* mode */

    it('run without mode=left and result should be mode=left', function () {
        createElement({mode: 'left'});
        expect(element.attr('mode')).toEqual('left');
        expect(element.hasClass('timeline-pending')).toBe(false);
        expect(element.hasClass('timeline-reverse')).toBe(false);
        expect(element.children().hasClass('timeline-item-left')).toBe(true);
        expect(element.find('.timeline-item-left').length).toEqual($scope.nodeData.length);
    });

    it('run with mode=right and result should be mode=right', function () {
        createElement({mode: 'right'});
        expect(element.attr('mode')).toEqual('right');
        expect(element.hasClass('timeline-pending')).toBe(false);
        expect(element.hasClass('timeline-reverse')).toBe(false);
        expect(element.children().hasClass('timeline-item-right')).toBe(true);
        expect(element.find('.timeline-item-right').length).toEqual($scope.nodeData.length);
    });

    it('run with mode=alternate and result should be mode=alternate', function () {
        createElement({mode: 'alternate'});
        expect(element.hasClass('timeline-pending')).toBe(false);
        expect(element.hasClass('timeline-reverse')).toBe(false);
        expect(element.hasClass('timeline-alternate')).toBe(true);
        expect(element.find('.timeline-item:even').hasClass('timeline-item-right')).toBe(true);
        expect(element.find('.timeline-item:odd').hasClass('timeline-item-left')).toBe(true);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    it('run without mode and result should be mode=left', function () {
        createElement({});
        expect(element.attr('mode')).toEqual('left');
        expect(element.hasClass('timeline-pending')).toBe(false);
        expect(element.hasClass('timeline-reverse')).toBe(false);
        expect(element.hasClass('timeline-alternate')).toBe(false);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    /* reverse */

    it('run with reverse=true and result should be reverse=true', function () {
        createElement({reverse: true});
        expect(element.hasClass('timeline-reverse')).toBe(true);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    it('run with reverse=false and result should be reverse=false', function () {
        createElement({reverse: false});
        expect(element.hasClass('timeline-reverse')).toBe(false);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    it('run without reverse and result should be reverse=false', function () {
        createElement({});
        expect(element.attr('reverse')).toEqual('false');
        expect(element.hasClass('timeline-reverse')).toBe(false);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    /* pending */

    it('run with pending=true and result should be pending=true', function () {
        createElement({pending: true});
        expect(element.hasClass('timeline-pending')).toBe(true);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    it('run with pending=false and result should be pending=false', function () {
        createElement({pending: false});
        expect(element.hasClass('timeline-pending')).toBe(false);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });

    it('run without pending and result should be pending=false', function () {
        createElement({});
        expect(element.attr('pending')).toEqual('false');
        expect(element.hasClass('timeline-pending')).toBe(false);
        expect(element.children().length).toEqual($scope.nodeData.length);
    });
});
