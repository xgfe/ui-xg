angular.module('uixDemo').controller('dropdownDemoCtrl',['$scope','$window','$uixPosition', function ($scope,$window,$uixPosition) {
    $scope.elemVals = {};
    $scope.parentScrollable = true;
    $scope.parentRelative = true;

    $scope.getValues = function() {
        var divEl = $window.document.querySelector('#posdemodiv');
        var btnEl = $window.document.querySelector('#posdemobtn');

        var offsetParent = $uixPosition.offsetParent(divEl);
        $scope.elemVals.offsetParent = 'type: ' + offsetParent.tagName + ', id: ' + offsetParent.id;

        var scrollParent = $uixPosition.scrollParent(divEl);
        $scope.elemVals.scrollParent = 'type: ' + scrollParent.tagName + ', id: ' + scrollParent.id;

        $scope.scrollbarWidth = $uixPosition.scrollbarWidth();

        $scope.elemVals.position = $uixPosition.position(divEl);

        $scope.elemVals.offset = $uixPosition.offset(divEl);

        $scope.elemVals.viewportOffset = $uixPosition.viewportOffset(divEl);

        $scope.elemVals.positionElements = $uixPosition.positionElements(btnEl, divEl, 'auto bottom-left');
    };
}]);