angular.module('myApp')

.directive('jsIteratorsDirective', function() {
  return {
    restrict: 'A',
    controller: 'lessonTestsController',
    templateUrl: './html/lessonTests/lessonFiles/js-lesson-iterators.html'
  }
}) // end varsTestDirective
