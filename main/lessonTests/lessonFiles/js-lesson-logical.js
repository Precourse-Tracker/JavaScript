angular.module('myApp')

.directive('jsLogicalDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-logical.html'
  }
}) // end varsTestDirective
