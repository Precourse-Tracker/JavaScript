angular.module('myApp')

.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('login');

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: './html/loginTemplate.html'
  })
  .state('home', {
    url: '/home',
    templateUrl: './html/homeTemplate.html'
  })
  .state('lessons', {
    url: '/lessons',
    templateUrl: '/html/lessonsTemplate.html'
  })
  .state('lessonTests', {
    url: '/lessonTests',
    templateUrl: '/html/lessonTestsTemplate.html'
  })
  .state('/assessment', {
    url: '/assessment',
    templateUrl: '/html/assessmentTemplate.html'
  })
  .state('dashboard', {
    url: '/dashboard',
    templateUrl: '/html/dashboardTemplate.html'
  })

}) // end config
