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



  $scope.gradeTest = function() {
    let incorrect = null;
    let counter = -1;
    $scope.functionsChoices.forEach(function(answer) {
      if (answer == $scope.functionsCorrect[counter + 1]) {
        counter++;
      }
    })
    console.log(counter);
  }


})  // end lessonTestsController
