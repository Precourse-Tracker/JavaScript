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
  console.log(qId, answer, userCode);
  workerService.worker(qId, answer, userCode);

  // let userCode = userCode;

  // jsTesting.workerTest(qId, answer, userCode);
  // function isSame(userCode, answer) {
  //   if (userCode === answer) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //
  // var myWorker = Webworker.create(isSame);
  //
  // myWorker.run(userCode, answer).then((result) => {
  //   alert(`This is ${result}`);
  // })

}
// var editor = ace.edit("editor");
// editor.setTheme("ace/theme/chrome");
// editor.getSession().setMode("ace/mode/javascript");
//
// var editor_1 = ace.edit("editor_1");
// editor_1.setTheme("ace/theme/chrome");
// editor_1.getSession().setMode("ace/mode/javascript");

});
