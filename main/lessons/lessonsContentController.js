angular.module('myApp')

.controller('lessonsContentController', function($scope, lessonsContentService) {

  $scope.lessonInfo = (input) => {
    $scope.theTitle = lessonsContentService.getLessonInfo(input);
  }

}) // end lessonsContentController
