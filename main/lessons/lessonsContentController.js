angular.module('myApp')

.controller('lessonsContentController', function($scope, lessonsContentService) {

  $scope.lessonInfo = (input) => {
    let lessonContent = lessonsContentService.getLessonInfo(input).then(function(lesson) {
      console.log(lesson.data[0]);
    })
    // $scope.theTitle = lessonContent;
    $scope.testObject = lessonContent;

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
