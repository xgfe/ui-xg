export default class {
    static $inject = ['$scope', '$sce'];
    constructor($scope, $sce) {
        $scope.dynamicTooltip = 'Hello, World!';
        $scope.dynamicTooltipText = '动态的tooltip';
        $scope.delayTime = 1000;
        $scope.htmlTooltip = $sce.trustAsHtml('I\'ve been <i>made</i> <b>bold</b>!');
        $scope.placement = {
            options: [
                'top',
                'top-left',
                'top-right',
                'bottom',
                'bottom-left',
                'bottom-right',
                'left',
                'left-top',
                'left-bottom',
                'right',
                'right-top',
                'right-bottom'
            ],
            selected: 'top'
        };
    }
}
