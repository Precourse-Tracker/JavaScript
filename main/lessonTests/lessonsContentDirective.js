angular.module('myApp')

.directive('lessonsContentDirective', function(lessonsContentService) {
  return {
    restrict: 'E',
    controller: 'lessonsContentController',
    templateUrl: './html/lessons/lessonsContentTemplate.html',
    scope: {
      title: '=',
      testObject: '=',
      testScore: '='
    },
    link: function(scope, ele, attr) {
      let lessonId = lessonsContentService.getTempId();
      scope.lessonContent = lessonsContentService.getLessonInfo(lessonId).then(function(lesson) {
        // scope.testObject = lesson.data[0];
        scope.testObject = lesson.data;
        scope.title = scope.testObject.name;
        // scope.theTitle = scope.testObject.name;
        lessonsContentService.setLessonName(scope.theTitle);
        scope.testIndex = scope.testObject.questions.forEach(function(entry, index){
            entry.index = index;
            lessonsContentService.setCorrectAnswer(entry.correctAnswer, index);
        })
      })

      //////testing buttton click////
      scope.answerClicked = ($event) => {
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
    }
  }
}) // end lessonsContentDirective
