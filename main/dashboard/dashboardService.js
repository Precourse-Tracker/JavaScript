angular.module('myApp').service('dashboardService', function($q, $http) {

  this.getUserData = () => {
    return $http({
      method: 'GET',
      url: '/api/users/progress'
    }).then(function(response) {
      // console.log("service", response);
      return response;
    })
  }

})
