angular.module('myApp')

.controller('lessonTestsController', function($scope) {

  // $scope.test = 'test on ctrl';
  // $scope.blob = 'blob on ctrl';

  $scope.functionsChoices = [null];
  $scope.functionsCorrect = [
    null, // initial null val
    'a',  // q1
    'b',  // q2
    'a',  // q3
    'c'   //q4
  ]

  $scope.q1 = (input) => {
    $scope.functionsChoices[1] = input;
    // console.log('q1 choice is ' + input);
    console.log($scope.functionsChoices);
  }

  $scope.q2 = (input) => {
    $scope.functionsChoices[2] = input;
    // console.log('q2 choice is ' + input);
    console.log($scope.functionsChoices);
  }

  $scope.q3 = (input) => {
    $scope.functionsChoices[3] = input;
    console.log($scope.functionsChoices);
  }

  $scope.q4 = (input) => {
    $scope.functionsChoices[4] = input;
    console.log($scope.functionsChoices);
  }

  $scope.gradeTest = () => {
    let incorrect = null;
    let correct = -1;
    let finalScore = '';
    let numQuestions = $scope.functionsCorrect.length - 1;
    for (var i = 0; i < numQuestions + 1; i++) {
      if ($scope.functionsChoices[i] == $scope.functionsCorrect[i]) {
        correct++;
      }
    }
    finalScore = correct / numQuestions * 100;
    $scope.testScore = finalScore + '%';
    if (finalScore <= 60) {
      $scope.message = 'Good attempt! Please review the content and try again.';
    } else if (finalScore <= 85) {
      $scope.message = 'Nice job!  You\'re getter there!'
    } else if (finalScore <= 99) {
      $scope.message = 'Great job! You\'re close to 100%!';
    } else if (finalScore == 100) {
      $scope.message = 'Awesome!!  You got a perfect score!!';
    }
    $('html, body').animate({ scrollTop: 0 }, 300);
  }

  $scope.resetTest = () => {
    $scope.functionsChoices = [];
    $('html, body').animate({ scrollTop: 0 }, 300);
  }


})  // end lessonTestsController
