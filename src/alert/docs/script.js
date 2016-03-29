angular.module('fuguDemo').controller('alertDemoCtrl',['$scope', function ($scope) {
    $scope.isIcon = false;
    $scope.boolean = true;
    $scope.alerts = [
        { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
        { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
        { type: 'warning', msg: 'FBI Warning! Manong would ignore anything about warning.' },
        { type: 'info', msg: 'I know that you wouldn\'t see this line.' }
    ];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.addAlert = function(){
        $scope.alerts.push({msg:"this is a new alert."});
    }
}]);