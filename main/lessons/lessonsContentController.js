angular.module('myApp')

.controller('lessonsContentController', function($scope, lessonsContentService) {

  $scope.lessonInfo = (input) => {
    // lessonConten to return object?
    let lessonContent = lessonsContentService.getLessonInfo(input);
    $scope.theTitle = lessonContent;
  }

}) // end lessonsContentController
