angular.module('myApp')

.controller('lessonsContentController', function($scope, lessonsContentService) {

  $scope.lessonInfo = (input) => {
    // lessonConten to return object?
    let lessonContent = lessonsContentService.getLessonInfo(input).then(function(lesson) {
      console.log(lesson.data[0]);
    })
    $scope.theTitle = lessonContent;
  }

}) // end lessonsContentController
