angular.module('myApp')

.directive('varsTestDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-vars.html'
  }
}) // end varsTestDirective
