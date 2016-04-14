angular.module('myApp')

.controller('navigationController', function($scope, loginService) {

  $scope.logoutUser = function() {
    loginService.logoutUser();
  };

})
