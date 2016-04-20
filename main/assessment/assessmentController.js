angular.module('myApp')

.controller('assessmentController', function($scope, assessmentService, workerService) {

  assessmentService.getAssessment().then(function(response) {
    var list = [];
    _.each(response, function(item) {
      for (var i = 0; i < item.questions.length; i++) {
        list.push(item.questions[i]);
      }
    })
    // console.log(list);
    $scope.questions = list;
  });

$scope.eval = function(q, userCode) {


  let qId = q._id;
  let answer = q.answer;

  workerService.worker(qId, answer, userCode).then(function(result) {
    assessmentService.ticker(result);
  })

}

$scope.submitAssessment = (length) => {
  assessmentService.submitAssessment(length);
}

$scope.doSomeStuff = function(q) {
    q.disabled = true;
}


});
