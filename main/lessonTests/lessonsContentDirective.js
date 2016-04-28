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
    }
  }
}) // end lessonsContentDirective
