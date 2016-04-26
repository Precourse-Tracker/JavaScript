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

  console.log('q', q);
  let qId = q._id;
  let answer = q.answer;
  let setup = q.setup;
  console.log("setup", setup);

  workerService.worker(qId, answer, userCode, setup).then(function(result) {
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
