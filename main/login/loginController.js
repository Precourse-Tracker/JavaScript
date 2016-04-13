angular.module('myApp')
.controller('loginController', function($scope, loginService){
  $scope.createUser = function(newUser) {
      loginService.newUser(newUser);
  };
  $scope.userLogin = function(user) {
    console.log('userLogin', user);
    loginService.userLogin(user);
  };
// jquery animations
  $(document).ready(function(){
  $('#goRight').on('click', function(){
    $('#slideBox').animate({
      'marginLeft' : '0'
    })
    $('.topLayer').animate({
      'marginLeft' : '100%'
    })
  })
  $('#goLeft').on('click', function(){
    $('#slideBox').animate({
      'marginLeft' : '50%'
    })
    $('.topLayer').animate({
      'marginLeft': '0'
    })
  })
})
})
