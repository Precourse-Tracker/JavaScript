angular.module('myApp')

.directive('jsConditionalDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-conditional.html'
  }
}) // end jsConditionalDirective
