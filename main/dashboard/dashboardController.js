angular.module('myApp').controller('dashboardController', function($scope, dashboardService) {

  getUserData = () => {
    dashboardService.getUserData().then(function(response) {
      console.log("controller", response.data);
      $scope.radarChartData = response.data;
    })
  }
  getUserData();

})
