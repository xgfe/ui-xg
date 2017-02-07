describe('ui.xg.step', function () {
    var compile;
    var scope;
    var element;
    beforeEach(function () {
        module('ui.xg.steps');
        module('ui.xg.step');
        module('step/templates/step.html');
        inject(function ($compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
        });
    });

    function createElement(el) {
        element = compile(el)(scope);
        scope.$digest();
    }

    function initScope(size, direction, title, desc, icon, status, num) {
        scope.size = size;
        scope.direction = direction;
        scope.title = title;
        scope.desc = desc || '';
        scope.icon = icon || '';
        scope.status = status || '';
        scope.num = num || 0;
    }

    it('run with title=未开始 and the result should be title=未开始', function () {
        initScope('lg', 'vertical', '未开始');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').attr('title')).toEqual('未开始');
    });

    it('run with desc=我是未开始的描述 and the result should be desc=我是未开始的描述', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}" desc="{{desc}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').attr('desc')).toEqual('我是未开始的描述');
    });

    it('run without desc and the desc should be a empty string', function () {
        initScope('lg', 'vertical', '未开始', '');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}"></uix-step></uix-steps>');
        expect(element.scope().desc).toEqual('');
    });

    it('run with icon=fa-user and the result should be icon=fa-user', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', 'fa-user');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}" icon="{{icon}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').attr('icon')).toEqual('fa-user');
    });

    it('run without icon and the icon should be a empty string', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', '');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}"></uix-step></uix-steps>');
        expect(element.scope().icon).toEqual('');
    });

    it('run with status=finish and the result should be status=finish', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', 'fa-user', 'finish');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}" status="{{status}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').attr('status')).toEqual('finish');
    });

    it('run with status=error and the result should be status=error', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', 'fa-user', 'error');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}" status="{{status}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').attr('status')).toEqual('error');
    });

    it('run with status=wait and the result should be status=wait', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', 'fa-user', 'wait');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}" status="{{status}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').attr('status')).toEqual('wait');
    });

    it('run with status=process and the result should be status=process', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', 'fa-user', 'process');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step title="{{title}}" status="{{status}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').attr('status')).toEqual('process');
    });

    it('run without status and the status should be a empty string', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', 'fa-user', '');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step status="{{status}}"></uix-step></uix-steps>');
        expect(element.scope().status).toEqual('');
    });

    it('run without status and the status should be a empty string', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', '', 'error');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step status="{{status}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').children('.step-head').children().eq(0).find('i').hasClass('fa-times')).toBeTruthy();
    });

    it('run without status and the status should be a empty string', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', '', 'finish');
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step status="{{status}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').children('.step-head').children().eq(0).find('i').hasClass('fa-check')).toBeTruthy();
    });

    it('run with a num', function () {
        initScope('lg', 'vertical', '未开始', '我是未开始的描述', '', 'wait', 0);
        createElement('<uix-steps size="{{size}}" direction="{{direction}}"><uix-step status="{{status}}"></uix-step></uix-steps>');
        expect(element.find('uix-step').children('.step-head').children().eq(0).children().eq(0).scope().num).toEqual(0);
    });

    it('run with many steps', function () {
        scope.objs = [{
            'title': '未开始',
            'desc': '我是描述',
            'icon': 'fa-user',
            'status': 'wait'
        }, {
            'title': '进行中',
            'desc': '我是描述',
            'icon': 'fa-user',
            'status': 'process'
        }, {
            'title': '已完成',
            'desc': '我是描述',
            'icon': 'fa-user',
            'status': 'finish'
        }, {
            'title': '出错了',
            'desc': '我是描述',
            'icon': 'fa-user',
            'status': 'error'
        }];
        createElement('<uix-steps size="{{size}}" direction="{{direction}}">' +
            '<uix-step ng-repeat="obj in objs" status="{{obj.status}}" title="{{obj.title}}" desc="{{obj.desc}}" icon="{{obj.icon}}"></uix-step>' +
            '</uix-steps>');
        expect(element.find('uix-step').length).toEqual(4);
    });
});
