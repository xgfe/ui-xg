angular.module("templates/dropdown-choices.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("templates/dropdown-choices.html",'<li>'+
        '<a href="javascript:;" ng-transclude></a>'+
        '</li>');
}]);