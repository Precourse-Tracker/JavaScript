angular.module('myApp')

.controller('navigationController', function($scope, loginService) {

  $scope.logoutUser = function() {
  console.log('sucessful logout');
  loginService.logoutUser();
  };

})
