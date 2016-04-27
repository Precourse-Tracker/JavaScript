angular.module('myApp')

.directive('lessonsContentDirective', function() {
  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsContentTemplate.html',
    scope: {
      title: '=',
      testObject: '=',
      testScore: '='
    }
  }
}) // end lessonsContentDirective
