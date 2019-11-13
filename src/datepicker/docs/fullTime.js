function getLaterDate(day, date) {
  let dt = date ? new Date(date) : new Date();
  dt.setHours(0);
  dt.setMinutes(0);
  dt.setSeconds(0);
  dt.setMilliseconds(0);
  dt.setDate(dt.getDate() + day);
  return dt;
}
export default class {
  static $inject = ['$scope'];
  startDate = getLaterDate(1);
  endDate = getLaterDate(7);
  minDate = getLaterDate(1);
  maxDate = getLaterDate(30);
  constructor($scope) {
    $scope.$watch('vm.startDate', (val) => {
      this.maxDate = getLaterDate(30, val);
    });
  }
}
