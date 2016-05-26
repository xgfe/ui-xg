angular.module('fuguDemo').controller('dropdownDemoCtrl',['$scope','$window','$fuguPosition', function ($scope,$window,$fuguPosition) {
    $scope.elemVals = {};
    $scope.parentScrollable = true;
    $scope.parentRelative = true;

    $scope.getValues = function() {
        var divEl = $window.document.querySelector('#posdemodiv');
        var btnEl = $window.document.querySelector('#posdemobtn');

        var offsetParent = $fuguPosition.offsetParent(divEl);
        $scope.elemVals.offsetParent = 'type: ' + offsetParent.tagName + ', id: ' + offsetParent.id;

        var scrollParent = $fuguPosition.scrollParent(divEl);
        $scope.elemVals.scrollParent = 'type: ' + scrollParent.tagName + ', id: ' + scrollParent.id;

        $scope.scrollbarWidth = $fuguPosition.scrollbarWidth();

        $scope.elemVals.position = $fuguPosition.position(divEl);

        $scope.elemVals.offset = $fuguPosition.offset(divEl);

        $scope.elemVals.viewportOffset = $fuguPosition.viewportOffset(divEl);

        $scope.elemVals.positionElements = $fuguPosition.positionElements(btnEl, divEl, 'auto bottom-left');
    };
}]);