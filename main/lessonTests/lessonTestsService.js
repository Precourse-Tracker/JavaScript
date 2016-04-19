angular.module('myApp')

.service('lessonTestsService', function($http) {

  this.lessonTest = '';

  this.setLessonTest = function(lesson) {
    lessonTest = lesson;
  }

  this.getLessonTest = function() {
    // return lessonTest;
    // console.log(lessonTest);
    return $http({
      method: 'GET',
      url: './html/lessonTests/lessonFiles/' + lessonTest + '.html',
      type: 'html'
    })
  }


}) // end lessonTestsService
