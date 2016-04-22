angular.module('myApp')

.controller('lessonsContentController', function($scope, lessonsContentService) {
  let correctAnswerArray = [];
  $scope.userAnswerArray = [];
  $scope.lessonInfo = (input) => {
      $scope.lessonContent = lessonsContentService.getLessonInfo(input).then(function(lesson) {
        $scope.testObject = lesson.data[0];
        $scope.theTitle = $scope.testObject.name;
        $scope.testIndex = $scope.testObject.questions.forEach(function(entry, index){
            entry.index = index;
            correctAnswerArray[index]= entry.correctAnswer;
        })
        console.log(correctAnswerArray);
        console.log(correctAnswerArray.length)
    })
  }
  $scope.addAnswer = (userAnswer) => {
    $scope.userAnswerArray[userAnswer[1]]=userAnswer[0];
  }
  $scope.gradeTest = () => {
    let rightAnswer = 0;
    let user = $scope.userAnswerArray;
    let correct = correctAnswerArray;
    console.log(user.length, correct.length);
    if (user.length === correct.length) {
      alert('wahoo!');
    }
    else {
      alert('Please answer all questions before submitting');
    }
  }

}) // end lessonsContentController
