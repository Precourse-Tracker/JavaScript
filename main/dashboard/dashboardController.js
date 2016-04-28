angular.module('myApp').controller('dashboardController', function($scope, dashboardService) {

  getUserData = () => {
    dashboardService.getUserData().then(function(response) {
      console.log("controller", response.data.progress.lessons[0].score);
      var total = response.data.progress.lessons[0].score;
      $scope.radarChartData = total / 100;

    })
  }
  getUserData();

})
