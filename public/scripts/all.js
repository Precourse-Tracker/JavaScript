angular.module('myApp', ['ui.router'])

.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('login');

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: './html/login/loginTemplate.html'
  })
  .state('home', {
    url: '/home',
    templateUrl: './html/home/homeTemplate.html'
  })
  .state('lessons', {
    url: '/lessons',
    templateUrl: './html/lessons/lessonsTemplate.html'
  })
  .state('lessonTests', {
    url: '/lessonTests',
    templateUrl: './html/lessonTests/lessonTestsTemplate.html'
  })
  .state('/assessment', {
    url: '/assessment',
    templateUrl: './html/assessment/assessmentTemplate.html'
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: './html/dashboard/dashboardTemplate.html'
  })

}]) // end config

angular.module('myApp')

.controller('lessonTestsController', ["$scope", function($scope) {

var editor = ace.edit("editor");
editor.setTheme("ace/theme/default");
editor.getSession().setMode("ace/mode/javascript");

}])

angular.module('myApp')
.controller('loginController', ["$scope", "loginService", function($scope, loginService){

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
}])

angular.module('myApp')

.directive('loginDirective', function() {

  return {
    restrict: 'E',
    templateUrl: './html/login/loginTemplate.html',
    link: function(scope, ele, attr) {

  

    }
  }

}) // end loginDirective

angular.module("myApp")
.service('loginService', ["$q", "$http", "$state", function($q, $http, $state) {

  this.userLogin = function(user) {
    return $http({
      method: 'POST',
      data: user,
      url: '/api/login'
    }).success(function() {
      $state.go('home');
    });
  };

  this.logoutUser = function() {
    return $http({
      method: 'GET',
      url: '/logout'
    }).success(function() {
       $state.go('login');
    });
  };

  this.newUser = function(newUser) {
    return $http({
      method: 'POST',
      data: newUser,
      url: '/api/signup'
    }).success(function() {
    });
  };

  this.getProfile = function() {
    return $http({
      method: 'GET',
      url: '/user/current'
    });
  };
}]);

angular.module('myApp')

.directive('navigationDirective', function() {

  return {
    restrict: 'E',
    templateUrl: './html/navigation/navigationTemplate.html',
    link: function(scope, ele, attr) {
      let profileMenu = $('#menu-navigation');

      $('#profile-wrapper').click(function() {
        profileMenu.toggle('expand')
      })

      profileMenu.click(function() {
        profileMenu.toggle('expand');
      })
    }
  }

}) // end navigationDirective
