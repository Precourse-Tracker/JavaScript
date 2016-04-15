angular.module('myApp').controller('assessmentController', function($scope, assessmentService) {

  $scope.getAssessment = () => {
    assessmentService.getLesson().then((assessment) => {
      console.log(assessment);
      $scope.assessment = assessment;
    })
  }
})
