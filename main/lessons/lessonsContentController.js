angular.module('myApp')

.controller('lessonsContentController', function($scope, lessonsContentService) {

  $scope.lessonInfo = (input) => {
    // lessonConten to return object?
    let lessonContent = lessonsContentService.getLessonInfo(input);
    console.log(lessonContent.questions);
    $scope.testObject = lessonContent;
    // $scope.theTitle = lessonContent.name;
    // $scope.questions = lessonContent.questions;
    // $scope.score = lessonContent.score;

    let testLength = lessonContent.questions.length,
        correctAnswers = [],
        userAnswers = [];

    {
      lessonContent.questions.forEach(function(entry) {
        correctAnswers.push(entry.correctAnswer);
      })
    }
    // console.log(correctAnswers);

    // testing button thingy
    $('button').click(function() {
      let selected = this;
      $(selected).addClass('.selected');
      $(selected).siblings().removeClass('.selected');

      // console.log(selected);
      // console.log($(selected).siblings('button'));
      // console.log(selected.value);
      // console.log(selected.name);


    })
  }

/*
q in questions
  q.correctAnswer
  q.multipleChoice
    q in q.multipleChoice
  q.question
lessoncontent.score
*/

}) // end lessonsContentController
