angular.module('myApp')

.directive('stringsTestDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-strings.html'
  }
}) // end varsTestDirective
