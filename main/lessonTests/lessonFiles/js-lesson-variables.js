angular.module('myApp')

.directive('jsVariablesDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-variables.html'
  }
}) // end varsTestDirective
