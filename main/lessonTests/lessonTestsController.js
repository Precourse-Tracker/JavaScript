angular.module('myApp')

.controller('lessonTestsController', function($scope, $state, lessonTestsService) {

  $scope.test = 'test on ctrl';
  $scope.blob = 'blob on ctrl';

  // $scope.selectLesson = function(lesson) {
  //   // console.log(lesson);
  //   lessonTestsService.setLessonTest(lesson);
  //   // console.log(lessonTestsService.getLessonTest())
  //
  //   $scope.test = lessonTestsService.getLessonTest()
  //   .then(function(response) {
  //     console.log(response.data);
  //     // console.log($state.current.name);
  //     if ($state.current.name !== 'lessonTests') {
  //       $state.go('lessonTests');
  //       return response.value;
  //       // setTimeout(function() {
  //       //   $scope.test = response.data;
  //       // }, 100);
  //     } else {
  //       return response.value;
  //     }
  //   })
  //
  // }


})
