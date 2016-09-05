describe('ui.xg.cityselect', function () {
    var compile,
        element,
        vm,
        controllerVar,
        scope;

    beforeEach(function () {
        module('ui.xg.position');
        module('ui.xg.popover');
        module('ui.xg.dropdown');
        module('ui.xg.tooltip');
        module('ui.xg.stackedMap');
        module('cityselect/templates/citypanel.html');
        module('ui.xg.cityselect');
        module('popover/templates/popover-template-popup.html');
        module('tooltip/templates/tooltip-template-popup.html');
        inject(function ($compile, $rootScope, $controller) {
            compile = $compile;
            scope = $rootScope.$new();
            vm = $controller('uixCityselectCtrl', {$scope: scope});
        });
        scope.config = {
            size: 'md',
            initPage: 1,
            supportChoseReverse: false,
            placement: 'bottom',
            animation: false,
            hotCity: [
                    {cityId: 7, cityName: '广州'},
                    {cityId: 15, cityName: '北京'},
                    {cityId: 24, cityName: '上海'}
            ],
            initChosedCity: [
                        {cityId: 1, cityName: '安阳'},
                        {cityId: 8, cityName: '安阳1'},
                        {cityId: 9, cityName: '鞍山1'},
                        {cityId: 22, cityName: '安阳3'}],
            allCity: {
                'A-D':
                    [{
                        name: 'A',
                        data: [
                              {cityId: 1, cityName: '安阳'},
                              {cityId: 2, cityName: '鞍山'},
                              {cityId: 3, cityName: '阿里山'},
                              {cityId: 4, cityName: '安康'},
                              {cityId: 5, cityName: '安泰平和'},
                              {cityId: 6, cityName: '澳门'},
                              {cityId: 7, cityName: '广州'}
                        ]
                    }, {
                        name: 'B',
                        data: [
                              {cityId: 8, cityName: '安阳1'},
                              {cityId: 9, cityName: '鞍山1'},
                              {cityId: 10, cityName: '阿里山1'},
                              {cityId: 11, cityName: '安康1'},
                              {cityId: 12, cityName: '安全'},
                              {cityId: 13, cityName: '澳门1'},
                              {cityId: 14, cityName: '安化县1'}
                        ]
                    }, {
                        name: 'C',
                        data: [
                              {cityId: 15, cityName: '北京'},
                              {cityId: 16, cityName: '鞍山2'},
                              {cityId: 17, cityName: '阿里山2'},
                              {cityId: 18, cityName: '安康2'},
                              {cityId: 19, cityName: '按风霜2'},
                              {cityId: 20, cityName: '澳门2'},
                              {cityId: 21, cityName: '安化县2'}
                        ]
                    }, {
                        name: 'D',
                        data: [
                              {cityId: 22, cityName: '安阳3'},
                              {cityId: 23, cityName: '鞍山3'},
                              {cityId: 24, cityName: '上海'},
                              {cityId: 25, cityName: '安康3'},
                              {cityId: 26, cityName: '按钮月3'},
                              {cityId: 27, cityName: '澳门3'},
                              {cityId: 28, cityName: '安化县3'}
                        ]
                    }],
                'E-H':
                    [{
                        name: 'E',
                        data: [
                              {cityId: 29, cityName: '安阳4'},
                              {cityId: 30, cityName: '鞍山4'},
                              {cityId: 31, cityName: '阿里山4'},
                              {cityId: 32, cityName: '安康4'},
                              {cityId: 33, cityName: '阿克苏常擦好难吃噶好难过地区4'},
                              {cityId: 34, cityName: '澳门4'},
                              {cityId: 35, cityName: '安化县4'}
                        ]
                    }, {
                        name: 'F',
                        data: [
                              {cityId: 36, cityName: '安阳5'},
                              {cityId: 37, cityName: '鞍山5'},
                              {cityId: 38, cityName: '阿里山5'},
                              {cityId: 39, cityName: '安康5'},
                              {cityId: 40, cityName: '阿克苏常擦好难吃噶好难过地区5'},
                              {cityId: 42, cityName: '澳门5'},
                              {cityId: 43, cityName: '安化县5'}
                        ]
                    }, {
                        name: 'G',
                        data: [
                              {cityId: 44, cityName: '安阳6'},
                              {cityId: 45, cityName: '鞍山6'},
                              {cityId: 46, cityName: '阿里山6'},
                              {cityId: 47, cityName: '安康6'},
                              {cityId: 48, cityName: '阿克苏常擦好难吃噶好难过地区6'},
                              {cityId: 49, cityName: '澳门6'},
                              {cityId: 50, cityName: '安化县6'}
                        ]
                    }, {
                        name: 'H',
                        data: [
                              {cityId: 51, cityName: '安阳7'},
                              {cityId: 52, cityName: '鞍山7'},
                              {cityId: 53, cityName: '阿里山7'},
                              {cityId: 54, cityName: '安康7'},
                              {cityId: 55, cityName: '阿克苏常擦好难吃噶好难过地区7'},
                              {cityId: 56, cityName: '澳门7'},
                              {cityId: 57, cityName: '安化县7'}
                        ]
                    }]
            }
        };
        var el = '<div><div class="btn btn-default cityselect-test" uix-cityselect ng-model="config"  style="margin-left:300px;display:inline-block" >城市选择</div></div>';
        createCitySelect(el);
        controllerVar = element.find('.cityselect-test').scope().vm;
    });
    afterEach(function () {
        element.remove();
    });

    function createCitySelect(el) {
        element = compile(el)(scope);
        scope.$digest();
    }


    it('Before open', function  ()  {
        expect(vm).toBeDefined();
        expect(vm.ngModelController).toBe(null);
        var beforeOpen = element.find('.cityselect-test').scope().vm.initFlag;
        expect(beforeOpen).toBe(false);
    });

    it('After open', function () {
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        var afterOpen = controllerVar.initFlag;
        var initPageOverwrite = controllerVar.cityInfo.initPage;
        var supportChoseReverseOverwrite = controllerVar.cityInfo.supportChoseReverse;
        expect(afterOpen).toBe(true);
        expect(initPageOverwrite).toBe(1);
        expect(supportChoseReverseOverwrite).toBe(false);
        expect(element.find('.chose-all').length).toBe(1);
        expect(element.find('.chose-reverse').length).toBe(0);
    });

    it('To see select', function () {
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        var temp = controllerVar.cityInfo.isShowSelected;
        element.find('.seeChosedCity').click();
        scope.$digest();
        var newTemp = controllerVar.cityInfo.isShowSelected;
        expect(newTemp).toBe(!temp);
        element.find('.seeChosedCity').click();
        scope.$digest();
        expect(controllerVar.searchedCity).toBe('');
    });

    it('To test toggleChose', function () {
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        var tempCount = controllerVar.cityInfo.chosedCity.length;
        element.find('.hot-city')[0].click();
        scope.$digest();
        var newTempCount = controllerVar.cityInfo.chosedCity.length;
        expect(newTempCount).toBe(tempCount + 1);
    });

    it('To test choseAll', function () {
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        element.find('.chose-all').click();
        scope.$digest();
        var tempAll = controllerVar.cityInfo.chosedCity.length;
        var initAll = controllerVar.cityMap.length;
        expect(tempAll).toBe(initAll);
    });

    it('To test resetAll', function () {
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        element.find('.chose-clean').click();
        scope.$digest();
        var tempReset = controllerVar.cityInfo.chosedCity.length;
        expect(tempReset).toBe(0);
    });

    it('To test reverseAll', function () {
        scope.config.supportChoseReverse = true;
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        expect(element.find('.chose-reverse').length).toBe(1);
        var allCity = controllerVar.cityMap.length;
        var tempChose = controllerVar.cityInfo.chosedCity.length;
        element.find('.chose-reverse').click();
        scope.$digest();
        var newTempChose = controllerVar.cityInfo.chosedCity.length;
        expect(newTempChose).toBe(allCity - tempChose);
    });

    it('To test changeTab', function () {
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        element.find('.city-tab')[1].click();
        var tempTab = controllerVar.cityInfo.initPage;
        expect(tempTab).toBe(1);
    });

    it('To test search', function () {
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        var temp = controllerVar.cityInfo.isShowSelected;
        if (!temp) {
            element.find('.seeChosedCity').click();
            scope.$digest();
        }
        element.find('.city-search').click();
        expect(element.find('.city-search').attr('aria-expanded')).toBe('true');
        var tempChose = controllerVar.cityInfo.chosedCity.length;
        element.find('.city-search').parent().find('ul li')[1].click();
        scope.$digest();
        var newTempChose = controllerVar.cityInfo.chosedCity.length;
        expect(newTempChose).toBe(tempChose + 1);
        controllerVar.searchedCity = '广州';
        controllerVar.changeSearchCity();
        var tempList = controllerVar.searchList.length;
        expect(tempList).toBe(1);
    });

    it('To test initDisable', function () {
        scope.config.chosedCityDisable = true;
        scope.config.supportChoseReverse = true;
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        var tempChose = controllerVar.cityInfo.chosedCity.length;
        element.find('.chose-all').click();
        scope.$digest();
        var tempAll = controllerVar.cityInfo.chosedCity.length;
        var initAll = controllerVar.cityMap.length;
        expect(tempAll).toBe(initAll);
        element.find('.chose-clean').click();
        scope.$digest();
        var newTempChose = controllerVar.cityInfo.chosedCity.length;
        expect(newTempChose).toBe(tempChose);
        element.find('.chose-reverse').click();
        scope.$digest();
        var newTempReverse = controllerVar.cityInfo.chosedCity.length;
        expect(newTempReverse).toBe(initAll);
        element.find('.cityButton')[0].click();
        var realNewTemp = controllerVar.cityInfo.chosedCity.length;
        expect(realNewTemp).toBe(newTempReverse);
    });

    it('To test initPage', function () {
        scope.config.initPage = 4;
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        expect(controllerVar.cityInfo.initPage).toBe(0);
    });

    it('To test no cityGroup', function () {
        scope.config.supportGroup = false;
        scope.config.allCity = [
              {cityId: 1, cityName: '安阳'},
              {cityId: 8, cityName: '安阳1'},
              {cityId: 9, cityName: '鞍山1'},
              {cityId: 22, cityName: '安阳3'},
              {cityId: 123, cityName: '太阳'},
              {cityId: 111, cityName: '广安'},
              {cityId: 11, cityName: '天津'},
              {cityId: 132, cityName: '崇顺'},
              {cityId: 112, cityName: '俺的'},
              {cityId: 7, cityName: '广州'},
              {cityId: 15, cityName: '北京'},
              {cityId: 24, cityName: '上海'}
        ];
        element.find('.cityselect-test').trigger('click');
        scope.$digest();
        expect(controllerVar.tabName.length).toBe(0);
    });



});
