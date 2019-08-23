export default class {
    static $inject = ['$scope', '$http'];
    constructor($scope, $http) {
        $scope.selected = 'test';
        $scope.asyncSelected = 'bla';
        $scope.locationList = [];
        $scope.isLoading = false;
        $scope.noResults = false;
        $scope.getLocation = function (val) {
            return $http.get('//maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: val,
                    sensor: false
                }
            }).then(function (response) {
                return response.data.results.map(function (item) {
                    return item.formatted_address;
                });
            });
        };
        $scope.states = ['Alabama', 'asfoiuiaoonvonxofghoishjdoifjsfdsf', 'Alaska', 'Arizona', 'Arkansas',
            'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
            'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
            'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
            'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina',
            'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
            'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin',
            'Wyoming'];
    }
}
