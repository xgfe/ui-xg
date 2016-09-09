/**
 * cityselect
 * cityselect directive
 * Author: your_email@gmail.com
 * Date:2016-08-02
 */
var cityselectModule = angular.module('ui.xg.cityselect', ['ui.xg.popover', 'ui.xg.dropdown']);

/**
 * 组件默认值
 * @param {string} placement [城市选择浮层出现位置]
 * @param {string} class [css修改]
 * @param {initPage} number [tab页的初始状态]
 * @param {isShowHot} bool [是否现实热门城市]
 * @param {isShowSelected} bool [是否显示已选城市]
 * @param {supportChoseAll} bool [是否支持全选]
 * @param {supportChoseReverse} bool [是否支持反选]
 * @param {supportSearch} bool [是否支持搜索]
 * @param {animation} bool [城市选择浮层出现动画]
 * @param {requestGetData} bool [是否通过后台请求获得数据]
 * @param {requestUrl} string [后台请求路径]
 * @param {requestData} string [后台请求参数]
 * @param {chosedCityDisable} bool [是否支持初始选择值不被修改]
 * @param {[supportGroup} bool [是否支持城市分组，此值不同则传进来的allCity的数据结构不同]
 *
 * 除上面外允许传入的参数
 * @param {hotCity} [{cityId: xx, cityName: xx}}] [当isShowHot为true时需传入此参数]
 * @param {chosedCity} [{cityId: xx, cityName: xx}}] [初始选中的城市]
 * @param {allCity} [{cityId: xx, cityName: xx}}] [所有的城市，当supportGroup为false时]
 *                  {'AA': [{name: xx, data: [{cityId: xx, cityName: xx}}]}]} [所有的城市，当supportGroup为true时]
 * @type {String}
 */
cityselectModule.constant('uixCityselectConfig', {
    placement: 'bottom',
    class: '',
    initPage: 0,
    isShowHot: true,
    isShowSelected: false,
    supportChoseAll: true,
    supportChoseReverse: true,
    supportChoseClear: true,
    supportSearch: true,
    animation: true,
    requestGetData: false,
    requestUrl: '',
    requestData: '',
    chosedCityDisable: false,
    supportGroup: true
});

cityselectModule.controller('uixCityselectCtrl', uixCityselectCtrl);

uixCityselectCtrl.$inject = ['$scope', '$http', 'uixCityselectConfig'];

/**
 * 组件本身
 * @param  {[type]} $parse        [description]
 * @param  {[type]} transclude:   true                [description]
 * @param  {[type]} controller:   'uixCityselectCtrl' [description]
 * @param  {[type]} controllerAs: 'vm'                [description]
 * @param  {[type]} link:         function            (scope,       el, attrs, ctrls, transclude) {                                 var   controller [description]
 * @param  {[type]} true          [description]
 * @return {[type]}               [description]
 */
cityselectModule.directive('uixCityselect', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        require: ['uixCityselect', 'ngModel'],
        scope: {
        },
        transclude: true,
        controller: 'uixCityselectCtrl',
        controllerAs: 'vm',
        link: function (scope, el, attrs, ctrls, transclude) {
            var controller = ctrls[0];
            var ngModelController = ctrls[1];
            var initialValue;
            controller.setNgModelController(ngModelController);
            ngModelController.$render = function () {
                initialValue = ngModelController.$modelValue;
                if (initialValue) {
                    controller.dom = angular.element(el[0].outerHTML);
                    var temp = controller.valueInit(initialValue);
                    transclude(scope, function (clone) {
                        temp.append(clone);
                    });
                    el.replaceWith($compile(temp)(scope));
                }
            };
            scope.$watch('vm.cityInfo.allCity', function () {
                if (scope.vm.initFlag) {
                    controller.init();
                }
            }, true);
            scope.$watch('vm.cityInfo.initPage', function () {
                if (scope.vm.initFlag) {
                    controller.init();
                }
            }, true);
            scope.$watch('vm.cityInfo.initChosedCity', function () {
                if (scope.vm.initFlag) {
                    controller.init();
                }
            }, true);
        }
    };
}]);

/**
 * 组件controller
 * @param  {[type]} $scope              [description]
 * @param  {[type]} uixCityselectConfig [description]
 * @return {[type]}                     [description]
 */
function uixCityselectCtrl($scope, $http, uixCityselectConfig) {
    var vm = this;
    vm.$http = $http;
    vm.$scope = $scope;
    vm.uixCityselectConfig = uixCityselectConfig;
    vm.ngModelController = null;
}

/**
 * dom值初始化
 * @param  {[type]} initialValue [description]
 * @return {[type]}              [description]
 */
uixCityselectCtrl.prototype.valueInit = function (initialValue) {
    var vm = this;
    vm.initFlag = false;
    vm.cityInfo = angular.extend({}, vm.uixCityselectConfig, initialValue);
    if (!vm.cityInfo.chosedCity) {vm.cityInfo.chosedCity = [];}
    vm.ngModelController.$setViewValue(vm.cityInfo);
    vm.dom.removeAttr('uix-cityselect');
    vm.dom.attr({'uix-popover-template': '"templates/citypanel.html"',
              'popover-placement': vm.cityInfo.placement,
              'popover-class': 'uix-cityselect-popoverwidth' + vm.cityInfo.class,
              'popover-trigger': 'click',
              'popover-animation': vm.cityInfo.animation,
              'ng-click': 'vm.exportCallback()'});
    return vm.dom;
};

/**
 * 暴露的方法
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.exportCallback = function () {
    var vm = this;
    if (!vm.initFlag) {
        vm.init();
        return;
    }
    vm.initFlag = !vm.initFlag;
    if (angular.isFunction(vm.cityInfo.callBack)) {
        vm.cityInfo.callBack(vm.cityInfo.chosedCity);
    } else {
        vm.cityInfo.initChosedCity = angular.copy(vm.cityInfo.chosedCity);
        vm.init();
    }
};

/**
 * 如果启用内部url获取数据
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.getUrlData = function () {
    var vm = this;
    return vm.$http({
        method: 'GET',
        url: vm.cityInfo.requestUrl,
        params: vm.cityInfo.requestData
    });
};

/**
 * cityPanel值初始化
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.init = function () {
    var vm = this;
    vm.cityInfo.chosedCity = angular.copy(vm.cityInfo.initChosedCity) || [];
    vm.initSee = vm.cityInfo.isShowSelected;
    if (vm.cityInfo.requestGetData) {
        vm.cityInfo.allCity = vm.getUrlData();
    }
    for (var i = 0; i < vm.cityInfo.chosedCity.length; i++) {
        vm.cityInfo.chosedCity[i].initChose = vm.cityInfo.chosedCityDisable;
    }
    vm.initChosedCity = angular.copy(vm.cityInfo.chosedCity);
    vm.checkAllCityType();
    vm.searchList = angular.copy(vm.cityMap);
    vm.initFlag = true;
};

/**
 * 初始化判断支不支持城市分组
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.checkAllCityType = function () {
    var vm = this;
    var allCity = vm.cityInfo.allCity;
    vm.cityMap = [];
    vm.tabName = [];
    if (vm.cityInfo.supportGroup) {
        // for (var category in allCity) {
        //     for (var city of allCity[category]){
        //       for (var cityInfo of city.data) {
        //         vm.cityMap.push(cityInfo);
        //       }
        //     }
        // };
        for (var category in allCity) {
            for (var i = 0; i < allCity[category].length; i++) {
                for (var j = 0; j < allCity[category][i].data.length; j++) {
                    vm.cityMap.push(allCity[category][i].data[j]);
                }
            }
        }
        vm.tabName = Object.keys(vm.cityInfo.allCity);
        if (vm.tabName.length <= vm.cityInfo.initPage) {
            vm.cityInfo.initPage = 0;
        }
        vm.cityInfo.innerTab = vm.cityInfo.initPage;
    } else {
        vm.cityMap = allCity;
    }
};

/**
 * 看已选城市
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.showSelected = function () {
    var vm = this;
    vm.initSee = true;
    vm.cityInfo.isShowSelected = !vm.cityInfo.isShowSelected;
    if (!vm.cityInfo.isShowSelected) {
        vm.searchedCity = '';
    }
    vm.ngModelController.$setViewValue(vm.cityInfo);
};

/**
 * 设定ngModel的controller
 * @param {[type]} newNgmodelController [description]
 */
uixCityselectCtrl.prototype.setNgModelController = function (newNgmodelController) {
    var vm = this;
    vm.ngModelController = newNgmodelController;
};

/**
 * 看是非已选
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */
uixCityselectCtrl.prototype.checkChosed = function (city) {
    var vm = this;
    var chosedCity = vm.cityInfo.chosedCity;
    var chosedCityId = [];
    chosedCity.map(function (item) {
        chosedCityId.push(item.cityId);
    });
    return chosedCityId.indexOf(city.cityId) > -1;
};

/**
 * 选择城市
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */
uixCityselectCtrl.prototype.toggleChose = function (city) {
    var vm = this;
    // for (var [index, item] of vm.cityInfo.chosedCity.entries()) {
    //     if (city.cityId === item.cityId) {
    //         if (vm.cityInfo.chosedCityDisable) {
    //             if (item.initChose) {
    //                 return;
    //             }
    //         }
    //         vm.cityInfo.chosedCity.splice(index, 1);
    //         return;
    //     }
    // }
    for (var i = 0; i < vm.cityInfo.chosedCity.length; i++) {
        if (city.cityId === vm.cityInfo.chosedCity[i].cityId) {
            if (vm.cityInfo.chosedCityDisable) {
                if (vm.cityInfo.chosedCity[i].initChose) {
                    return;
                }
            }
            vm.cityInfo.chosedCity.splice(i, 1);
            return;
        }
    }
    vm.cityInfo.chosedCity.push(city);
    vm.ngModelController.$setViewValue(vm.cityInfo);
};

/**
 * 全选功能
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.choseAll = function () {
    var vm = this;
    if (vm.cityInfo.chosedCityDisable) {
        var temp = [];
        var cityMap = angular.copy(vm.cityMap);
        for (var i = 0; i < cityMap.length; i++) {
            for (var j = 0; j < vm.initChosedCity.length; j++) {
                if (cityMap[i].cityId === vm.initChosedCity[j].cityId) {
                    temp.push(i);
                }
            }
        }
        temp.sort(vm.sortNumber).reverse();
        for (var x = 0; x < temp.length; x++) {
            cityMap.splice(temp[x], 1);
        }
        cityMap = vm.initChosedCity.concat(cityMap);
        vm.cityInfo.chosedCity = cityMap;
    } else {
        vm.cityInfo.chosedCity = angular.copy(vm.cityMap);
    }
    vm.ngModelController.$setViewValue(vm.cityInfo);
};

/**
 * 清空功能
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.resetAll = function () {
    var vm = this;
    if (vm.cityInfo.chosedCityDisable) {
        vm.cityInfo.chosedCity = angular.copy(vm.initChosedCity);
    } else {
        vm.cityInfo.chosedCity = [];
    }
    vm.ngModelController.$setViewValue(vm.cityInfo);
};

/**
 * 排序
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
uixCityselectCtrl.prototype.sortNumber = function (aa, bb) {
    return aa - bb;
};

/**
 * 反选操作
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.reverseAll = function () {
    var vm = this;
    var deleteIndex = [];
    // for (var [index, item] of vm.cityMap.entries()) {
    //     for (var [index1, item1] of vm.cityInfo.chosedCity.entries()) {
    //         if (item.cityId === item1.cityId) {
    //             deleteIndex.push(index);
    //             break;
    //         }
    //     }
    // }
    for (var i = 0; i < vm.cityMap.length; i++) {
        for (var j = 0; j < vm.cityInfo.chosedCity.length; j++) {
            if (vm.cityMap[i].cityId === vm.cityInfo.chosedCity[j].cityId) {
                deleteIndex.push(i);
                break;
            }
        }
    }
    deleteIndex.sort(vm.sortNumber).reverse();
    var newChosedCity = angular.copy(vm.cityMap);
    // for (var delectCity of deleteIndex) {
    //     newChosedCity.splice(delectCity, 1);
    // }
    for (var x = 0; x < deleteIndex.length; x++) {
        newChosedCity.splice(deleteIndex[x], 1);
    }
    if (vm.cityInfo.chosedCityDisable) {
        newChosedCity = vm.initChosedCity.concat(newChosedCity);
    }
    vm.cityInfo.chosedCity = newChosedCity;
    vm.ngModelController.$setViewValue(vm.cityInfo);
};

/**
 * tab页切换
 * @param  {[type]} index [description]
 * @return {[type]}       [description]
 */
uixCityselectCtrl.prototype.changeTab = function (index) {
    var vm = this;
    vm.cityInfo.innerTab = index;
    // if (vm.cityInfo.isShowSelected) {
    //     vm.cityInfo.isShowSelected = !vm.cityInfo.isShowSelected;
    // }
    vm.ngModelController.$setViewValue(vm.cityInfo);
};

/**
 * 看初始值的hotCity和chosedCity是否属于allCity
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */
uixCityselectCtrl.prototype.checkCityBelong = function (city) {
    var vm = this;
    for(var i = 0; i < vm.cityMap.length; i++) {
        if (vm.cityMap[i].cityId === city.cityId) {
            return true;
        }
    }
    for(var j = 0; j < vm.cityInfo.chosedCity.length; j++) {
        if (vm.cityInfo.chosedCity[j].cityId === city.cityId) {
            vm.cityInfo.chosedCity.splice(j, 1);
            vm.ngModelController.$setViewValue(vm.cityInfo);
            break;
        }
    }
    return false;
};

/**
 * 城市搜索的搜索功能
 * @return {[type]} [description]
 */
uixCityselectCtrl.prototype.changeSearchCity = function () {
    var vm = this;
    var tempCity = vm.searchedCity;
    var newSearchList = [];
    for (var i = 0; i < vm.cityMap.length; i++) {
        var tempSearchWords = vm.cityMap[i].cityName;
        if (tempSearchWords.indexOf(tempCity) > -1) {
            newSearchList.push(vm.cityMap[i]);
        }
    }
    vm.searchList = newSearchList;
};

/**
 * 城市搜索功能的列表重置
 * @param {[type]} open [description]
 */
uixCityselectCtrl.prototype.setCityList = function (open) {
    var vm = this;
    if (open && !vm.searchedCity) {
        vm.searchList = angular.copy(vm.cityMap);
        return;
    }
    if (open && vm.searchedCity) {
        this.changeSearchCity();
    }
};

/**
 * 城市搜索列表点击具体搜索结果
 * @param  {[type]} city [description]
 * @return {[type]}      [description]
 */
uixCityselectCtrl.prototype.searchCityChose = function (city) {
    var vm = this;
    vm.searchedCity = city.cityName;
    if (!vm.checkChosed(city)) {
        vm.cityInfo.chosedCity.push(city);
        vm.ngModelController.$setViewValue(vm.cityInfo);
    }
};





