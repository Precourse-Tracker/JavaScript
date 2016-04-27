angular.module('myApp')

.service('lessonsContentService', function($http, loginService) {
  let correctAnswerArray = [];
  let lessonName = '';
  let currentUserId = '';
  this.setCurrentUserId = (userId) => {
    currentUserId = userId;
  }
  this.setLessonName = (input) => {
    lessonName = input;
  }
  this.setCorrectAnswer = (input, index) => {
    correctAnswerArray[index] = input;
  }
  this.getCorrectAnswerArray = () => {
    return correctAnswerArray;
  }
  this.resetArray = () => {
    correctAnswerArray = [];
  }
  this.getLessonInfo = (input) => {
    return $http ({
      method: 'GET',
      url: '/api/lessons/js/' + input
    })
  }
  this.updateProgress = (score) => {
    return $http ({
      method: 'PUT',
      url: '/api/lessons/progress',
      data: {score, lessonName, currentUserId}
    })
  }
})  // end lessonsContentService
