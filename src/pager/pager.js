angular.module('ui.fugu.pager',[])
.constant('fuguPagerConfig', {
    itemsPerPage: 20, //默认每页数目为20
    maxSize:5, //默认分页最大显示数目为5
    firstText:'首页',
    lastText:'尾页',
    previousText:'上一页',
    nextText:'下一页'
})
.controller('fuguPagerCtrl',['$scope', function ($scope) {

    var pageOffset = 0,
        initialized = false;

    this.init = function (fuguPagerConfig) {
        $scope.itemsPerPage = $scope.itemsPerPage || fuguPagerConfig.itemsPerPage;
        $scope.maxSize = $scope.maxSize || fuguPagerConfig.maxSize;
        $scope.getText = function (key){
            return $scope[key + 'Text'] || fuguPagerConfig[key + 'Text'];
        };
    };

    $scope.pages = [];
    $scope.currentPage = 0;
    $scope.totalPages = 1;

    $scope.$watch('pageNo', function (val) {
        $scope.selectPage(val-1 || 0)
    });
    $scope.$watch("totalItems", function (val) {
        if($scope.currentPage === -1){
            return;
        }
        $scope.totalPages = Math.ceil(val / $scope.itemsPerPage);
        if ($scope.totalPages <= 0 || isNaN($scope.totalPages)) {
            $scope.totalPages = 1;
        }
        if (initialized) {
            if (pageOffset > $scope.totalPages) {
                pageOffset = 0;
                if ($scope.currentPage < pageOffset
                    || $scope.currentPage >= pageOffset + $scope.pages.length) {
                    $scope.currentPage = 0;
                }
            }
        }
        resetPageList();
        initialized = true;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
        }
        $scope.selectPage($scope.currentPage);
    });

    function getOffset(page) {
        var offset = Math.min(page - Math.floor($scope.maxSize / 2), $scope.totalPages - $scope.maxSize);
        if (offset < 0 || isNaN(offset)) {
            offset = 0;
        }
        return offset;
    }

    function resetPageList() {
        $scope.pages = [];
        var last = Math.min(pageOffset + $scope.maxSize, $scope.totalPages),i;
        for (i = pageOffset; i < last; i++) {
            $scope.pages.push({
                text: i,
                pageIndex: i,
                active: false
            });
        }
    }

    $scope.isFirst = function () {
        return $scope.currentPage <= 0;
    };

    $scope.isLast = function () {
        return $scope.currentPage >= $scope.totalPages - 1;
    };

    $scope.selectPage = function (value) {
        if (value >= $scope.totalPages || value < 0) {
            return;
        }
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = false;
        }
        var offset = getOffset(value),oldPage = $scope.currentPage;
        if (offset != pageOffset) {
            pageOffset = offset;
            resetPageList();
        }
        $scope.currentPage = value;
        $scope.pageNo = value+1;
        if ($scope.pages[$scope.currentPage - pageOffset]) {
            $scope.pages[$scope.currentPage - pageOffset].active = true;
            $scope.$emit("pager:pageIndexChanged", $scope.pages[$scope.currentPage - pageOffset]);
        }
        var fn;
        if(angular.isDefined($scope.pageChanged) && oldPage !== $scope.currentPage){
            fn = $scope.pageChanged();
            if(fn && typeof fn === 'function'){
                fn($scope.currentPage+1);
            }
        }
    };

    $scope.first = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage(0);
    };

    $scope.last = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.totalPages - 1);
    };

    $scope.previous = function () {
        if ($scope.isFirst()) {
            return;
        }
        this.selectPage($scope.currentPage - 1);
    };

    $scope.next = function () {
        if ($scope.isLast()) {
            return;
        }
        this.selectPage($scope.currentPage + 1);
    };
}])
.directive('fuguPager', ['fuguPagerConfig', function (fuguPagerConfig) {
    return {
        restrict: 'E',
        templateUrl:'templates/pager.html',
        replace:true,
        require:'fuguPager',
        scope:{
            itemsPerPage:'=?',
            totalItems:'=',
            pageNo:'=',
            maxSize:'=?',
            firstText:'@?',
            lastText:'@?',
            previousText:'@?',
            nextText:'@?',
            pageChanged:'&?'
        },
        controller:'fuguPagerCtrl',
        link: function (scope,el,attrs,fuguPagerCtrl) {
            fuguPagerCtrl.init(fuguPagerConfig);
        }
    }
}]);