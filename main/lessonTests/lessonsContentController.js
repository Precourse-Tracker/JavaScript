angular.module('myApp')

.controller('lessonsContentController', function($scope, lessonsContentService) {
  $scope.userAnswerArray = [];
  $scope.lessonInfo = (input) => {
    lessonsContentService.setTempId(input);
    lessonsContentService.resetArray();
    $scope.lessonContent = lessonsContentService.getLessonInfo(input).then(function(lesson) {
      $scope.testObject = lesson.data[0];
      // $scope.theTitle = $scope.testObject.name;
      // lessonsContentService.setLessonName($scope.theTitle);
      lessonsContentService.setLessonName($scope.testObject.name);
      $scope.title = lessonsContentService.getLessonName();
      $scope.testIndex = $scope.testObject.questions.forEach(function(entry, index){
          entry.index = index;
          lessonsContentService.setCorrectAnswer(entry.correctAnswer, index);
      })
    })
  }
  $scope.addAnswer = (userAnswer) => {
    $scope.userAnswerArray[userAnswer[1]]=userAnswer[0];
  }
  $scope.gradeTest = () => {
    let rightAnswer = 0;
    let user = $scope.userAnswerArray;
    let correct = lessonsContentService.getCorrectAnswerArray();
    if (user.length === correct.length) {
      user.forEach(function(entry, index){
        if (entry === correct[index]) {
          rightAnswer++;
        }
      })
      let score = (rightAnswer / correct.length) * 100;
      if (score === 100) {
        $scope.testScore = score.toFixed(0);
      }
      else {
        $scope.testScore = score.toFixed(2);
      }
      if (score <= 60) {
        $scope.message = 'Good attempt! Please review the content and try again.';
      } else if (score <= 80) {
        $scope.message = 'Nice job!  You\'re getting there!'
      } else if (score <= 90) {
        $scope.message = 'Great work All-Star! ';
      } else if (score < 100) {
        $scope.message = 'Great job! Almost perfect!';
      } else if (score == 100) {
        $scope.message = 'Awesome!!  You got a perfect score!!';
      }
      lessonsContentService.updateProgress(score);
      $scope.userAnswerArray = [];
      $('.final-score').css({
        'display': 'flex',
        'flex-direction': 'column'
      });
    }
    else {
      alert('Please answer all questions before submitting');
    }
    $('html, body').animate({ scrollTop: 0 }, 300);
  }
  $scope.resetTest = () => {
    $scope.userAnswerArray = [];
    $('html, body').animate({ scrollTop: 0 }, 300);
    $('.quiz-button').css({
      "background-color": "#ebebeb",
      "color": "#406BB2"
    })
  }
  //////testing buttton click////
  $scope.answerClicked = ($event) => {
    let temp = $event.currentTarget.parentNode;
    $(temp).children('button').css({
      "background-color": "#ebebeb",
      "color": "#406BB2"
    })
    $($event.currentTarget).css({
      "background-color": "#8FB9FF",
      "color": "#fff",
      "outline": 0
    });
  }
}) // end lessonsContentController
