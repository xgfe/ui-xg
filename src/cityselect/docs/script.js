angular.module('uixDemo').controller('cityselectDemoCtrl', ['$scope', function ($scope) {
    $scope.test = function (chosedCity) {
        var tt = '';
        chosedCity.map(function (item) {
            tt = tt + ' ' + item.cityName;
        });
        alert(tt);
    };
    $scope.config = {
        size: 'md',
        initPage: 4,
        supportChoseReverse: true,
        placement: 'bottom',
        animation: false,
        chosedCityDisable: true,
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
    $scope.config1 = {
        size: 'md',
        initPage: 4,
        supportChoseReverse: true,
        placement: 'bottom',
        animation: false,
        chosedCityDisable: true,
        supportGroup: false,
        hotCity: [
            {cityId: 7, cityName: '广州'},
            {cityId: 15, cityName: '北京'},
            {cityId: 24, cityName: '上海'}
        ],
        initChosedCity: [
            {cityId: 1, cityName: '安阳'},
            {cityId: 8, cityName: '安阳1'},
            {cityId: 9, cityName: '鞍山1'},
            {cityId: 22, cityName: '安阳3'}
        ],
        allCity: [
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
        ]
    };
    $scope.config2 = {
        size: 'md',
        initPage: 4,
        supportChoseReverse: true,
        placement: 'bottom',
        animation: false,
        supportGroup: false,
        hotCity: [
            {cityId: 7, cityName: '广州'},
            {cityId: 15, cityName: '北京'},
            {cityId: 24, cityName: '上海'}
        ],
        initChosedCity: [
            {cityId: 1, cityName: '安阳'},
            {cityId: 8, cityName: '安阳1'},
            {cityId: 9, cityName: '鞍山1'},
            {cityId: 22, cityName: '安阳3'}
        ],
        allCity: [
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
        ]
    };
    $scope.config3 = {
        size: 'md',
        initPage: 4,
        supportChoseReverse: false,
        placement: 'bottom',
        animation: false,
        supportGroup: false,
        supportChoseAll: false,
        supportSearch: false,
        supportChoseClear: false,
        hotCity: [
            {cityId: 7, cityName: '广州'},
            {cityId: 15, cityName: '北京'},
            {cityId: 24, cityName: '上海'}
        ],
        initChosedCity: [
            {cityId: 1, cityName: '安阳'},
            {cityId: 8, cityName: '安阳1'},
            {cityId: 9, cityName: '鞍山1'},
            {cityId: 22, cityName: '安阳3'}
        ],
        allCity: [
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
        ]
    };
    $scope.config4 = {
        size: 'md',
        initPage: 4,
        supportChoseReverse: false,
        placement: 'bottom',
        animation: false,
        supportGroup: false,
        supportChoseAll: false,
        supportSearch: false,
        supportChoseClear: false,
        hotCity: [
            {cityId: 7, cityName: '广州'},
            {cityId: 15, cityName: '北京'},
            {cityId: 24, cityName: '上海'}
        ],
        isShowHot: false,
        allCity: [
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
        ]
    };
    $scope.config5 = {
        size: 'md',
        initPage: 4,
        supportChoseReverse: false,
        placement: 'bottom',
        animation: false,
        supportGroup: false,
        supportChoseAll: false,
        supportSearch: false,
        supportChoseClear: false,
        callBack: $scope.test,
        hotCity: [
            {cityId: 7, cityName: '广州'},
            {cityId: 15, cityName: '北京'},
            {cityId: 24, cityName: '上海'}
        ],
        isShowHot: false,
        allCity: [
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
        ]
    };
}]);
