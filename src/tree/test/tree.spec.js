describe('fugu-tree', function () {

    var compile, // 编译模板
        scope, // 新创建的scope，编译的html所在的scope
        rootScope,
        element;    //指令DOM结点
    beforeEach(function () {
        module('ui.fugu.tree');
        module('tree/templates/tree-node.html');
        module('tree/templates/tree.html');
        inject(function( $compile, $rootScope) {
            compile = $compile;
            scope = $rootScope.$new();
            rootScope = $rootScope;
            rootScope.nodes = [{label: '省份', children: [
                {label: '陕西', children:[
                    {label: '汉中'},
                    {label: '勉县'},
                    {label: '咸阳'}
                ]},
                {label: '北京', children:[
                    {label: '朝阳'},
                    {label: '昌平'},
                    {label: '顺义'}
                ]},
                {label: '浙江', children:[
                    {label: '宁波'},
                    {label: '杭州'},
                    {label: '嘉兴'}
                ]}
            ]}];
        })
    });
    afterEach(function() {
        element.remove();
    });

    describe('tree', function () {

        it('should throw an error set when not set ngModel', function() {
            function errorFunctionWrapper(){
                element = compile('<fugu-tree></fugu-tree>')(scope);
                scope.$apply();
            }
            expect(errorFunctionWrapper).toThrow();
        });

        it('should show nothing  when not set ngModel according to given style', function() {
            var ele = null;
            element = compile('<fugu-tree ng-model="nodes"></fugu-tree>')(scope);
            scope.nodes = {label: '陕西', children:[
                {label: '汉中'},
                {label: '勉县'},
                {label: '咸阳'}
            ]};
            scope.$apply();
            ele = element.children('ol')[0];  // 判断是否含有ng-hide类名
            expect(angular.element(ele)).toHaveClass('ng-hide');
        });


        it('should show icon,can checkable and expand all node when just set ngModel', function() {
            var ele = null,
                i = 0,
                angularEle = null;
            element = compile('<fugu-tree ng-model="nodes"></fugu-tree>')(scope);
            scope.nodes =  rootScope.nodes;
            scope.$apply();
            ele = element.find('div').find('.cur');
            // 显示图标
            for(i=0; i<ele.length; i++) {
                angularEle = angular.element(ele[i].children[1]).find('i');
                if(angular.isDefined(angularEle.scope().node.children)){
                    expect(angularEle).toHaveClass('glyphicon-folder-open');  // 默认展开
                }else{
                    expect(angularEle).toHaveClass('glyphicon-file');  // 叶子节点
                }
            }
            // 显示勾选框
            ele = element.find('input:checkbox');  // 获取所有选择框
            for(i=0; i<ele.length; i++) {
                angularEle = angular.element(ele[i]);
                expect(angularEle).not.toHaveClass('ng-hide');
            }
        });


        it('should not show icon when set show-icon=false', function() {
            var ele = null,
                i = 0,
                angularEle = null;
            element = compile('<fugu-tree ng-model="nodes" show-icon="showIcon"></fugu-tree>')(scope);
            scope.nodes =  rootScope.nodes;
            scope.showIcon = false;
            scope.$apply();
            ele = element.find('div').find('.cur');
            // 有图标
            for(i=0; i<ele.length; i++) {
                angularEle = angular.element(ele[i].children[1]).find('i');
                if(angular.isDefined(angularEle.scope().node.children)){
                    expect(angularEle).not.toHaveClass('glyphicon-folder-open');  // 默认展开
                    expect(angularEle).not.toHaveClass('glyphicon-folder-close');  // 默认展开
                }else{
                    expect(angularEle).toHaveClass('glyphicon-file');  // 叶子节点
                    expect(angularEle).toHaveClass('ng-hide');  // 叶子节点
                }
            }
        });


        it('should not show checkable when set checkable=false', function() {
            var ele = null,
                i = 0,
                angularEle = null;
            element = compile('<fugu-tree ng-model="nodes" checkable="checkable"></fugu-tree>')(scope);
            scope.nodes =  rootScope.nodes;
            scope.checkable =  false;
            scope.$apply();

            //  不显示勾选框
            ele = element.find('input:checkbox');  // 获取所有选择框
            for(i=0; i<ele.length; i++) {
                angularEle = angular.element(ele[i]);
                expect(angularEle).toHaveClass('ng-hide');
            }
        });

        it('should not show close folder icon when set expandAll=false and show-icon=true', function() {
            var ele = null,
                i = 0,
                angularEle = null;
            element = compile('<fugu-tree ng-model="nodes" show-icon="showIcon" expand-all="expandAll"></fugu-tree>')(scope);
            scope.nodes =  rootScope.nodes;
            scope.showIcon = true;
            scope.expandAll = false;
            scope.$apply();
            ele = element.find('div').find('.cur');
            // 有图标
            for(i=0; i<ele.length; i++) {
                angularEle = angular.element(ele[i].children[1]).find('i');
                if(angular.isDefined(angularEle.scope().node.children)){
                    expect(angularEle).toHaveClass('glyphicon-folder-close');  // 默认展开
                }
            }
        });

        it('should not show close folder icon when set expandAll=false and show-icon=true', function() {
            var ele = null,
                i = 0,
                angularEle = null;
            element = compile('<fugu-tree ng-model="nodes" show-icon="showIcon" expand-all="expandAll"></fugu-tree>')(scope);
            scope.nodes =  rootScope.nodes;
            scope.showIcon = true;
            scope.expandAll = false;
            scope.$apply();
            ele = element.find('div').find('.cur');
            // 有图标
            for(i=0; i<ele.length; i++) {
                angularEle = angular.element(ele[i].children[1]).find('i');
                if(angular.isDefined(angularEle.scope().node.children)){
                    expect(angularEle).toHaveClass('glyphicon-folder-close');  // 默认展开
                }
            }
        });

        it('should toggle collapse when tree node icon be clicked', function() {
            var ele = null,
                i = 0,
                angularEle = null;
            element = compile('<fugu-tree ng-model="nodes"></fugu-tree>')(scope);
            scope.nodes =  rootScope.nodes;
            scope.$apply();
            ele = element.find('div').find('.cur');

            for(i=0; i<ele.length; i++) {
                angularEle = angular.element(ele[i].children[1]).find('i');
                if(angular.isDefined(angularEle.scope().node.children)){
                    expect(angularEle).toHaveClass('glyphicon-folder-open');  // 默认展开
                    angularEle.click();  //单击事件:open-close
                    expect(angularEle).toHaveClass('glyphicon-folder-close');
                    angularEle.click();  //单击事件:close-open
                    expect(angularEle).toHaveClass('glyphicon-folder-open');
                }
            }
        });

        //it('should fire  onCheckChange event when check an tree node', function() {
        //    var element = null,
        //        i = 0,
        //        angularEle = null;
        //    element = compile('<fugu-tree ng-model="nodes"></fugu-tree>')(scope);
        //    scope.nodes =  rootScope.nodes;
        //    scope.$apply();
        //});
    });
});