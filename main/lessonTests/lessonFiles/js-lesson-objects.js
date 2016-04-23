angular.module('myApp')

.directive('jsObjectsDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-objects.html'
  }
}) // end varsTestDirective
