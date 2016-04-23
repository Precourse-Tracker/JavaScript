angular.module('myApp')

.directive('jsStringsContDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-strings-cont.html'
  }
}) // end varsTestDirective
