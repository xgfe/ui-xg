angular.module("templates/dropdown.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("templates/dropdown.html",'<div class="btn-group dropdown" ng-class="[{true:multiColClass}[count>colsNum],{true:openClass}[isOpen]]">'+
        '<button type="button" ng-click="toggleDropdown($event)" ng-disabled="isDisabled" class="btn btn-sm btn-primary dropdown-toggle">'+
        '{{btnValue}}&nbsp;<span class="caret"></span>'+
        '</button>'+
        '<ul class="dropdown-menu" ng-transclude></ul>'+
        '</div>');
}]);
